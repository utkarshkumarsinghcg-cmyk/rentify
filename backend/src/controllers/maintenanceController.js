const MaintenanceTicket = require('../models/MaintenanceTicket');

/**
 * Maintenance Controller
 * Handles maintenance requests from tenants and approvals from owners.
 */
const maintenanceController = {
  /**
   * Get all tickets (filtered by role)
   */
  getTickets: async (req, res) => {
    try {
      let query = {};
      
      // Filter based on user role
      if (req.user.role === 'RENTER') {
        query.renter = req.user.id;
      } else if (req.user.role === 'OWNER') {
        // Find properties owned by this user first, then tickets for those properties
        // For simplicity, we'll assume the ticket has a propertyId and we can filter
        // In a real app, you'd populate or use a more complex query
        query.owner = req.user.id; 
      } else if (req.user.role === 'SERVICE' || req.user.role === 'SERVICE_PROVIDER') {
        query.assignedTo = req.user.id;
      } else if (req.user.role === 'ADMIN') {
        // Admin sees all tickets
        query = {};
      }

      const tickets = await MaintenanceTicket.find(query)
        .populate('property', 'title address')
        .populate('tenant', 'name email')
        .populate('assignedTo', 'name phone');
        
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Create a new maintenance ticket
   */
  createTicket: async (req, res) => {
    try {
      const User = require('../models/User');
      let userId = req.user?.id;
      
      if (!userId) {
        const defaultUser = await User.findOne();
        userId = defaultUser ? defaultUser._id : null;
      }

      const newTicket = new MaintenanceTicket({
        ...req.body,
        renter: userId,
        status: (req.body.status || 'OPEN').toUpperCase(),
        priority: (req.body.priority || 'MEDIUM').toUpperCase()
      });
      const savedTicket = await newTicket.save();

      // ── Real-time notification via Socket.io ────────────────
      try {
        const io = req.app.get('io');
        if (io) {
          const payload = {
            ticketId: savedTicket._id,
            title: req.body.title || `${req.body.category}: ${req.body.type}`,
            category: req.body.category || 'Maintenance',
            priority: savedTicket.priority,
            property: req.body.propertyName || 'Property',
            location: req.body.address || 'Various',
            message: `New maintenance task reported.`,
            createdAt: savedTicket.createdAt,
          };

          // Notify Admins
          io.emit('admin_notification', { ...payload, type: 'MAINTENANCE_ALERT' });

          // Notify specific assigned provider (if set)
          if (savedTicket.assignedTo) {
            io.to(String(savedTicket.assignedTo)).emit('new_ticket', payload);
          }

          // Broadcast to all connected service providers
          io.emit('new_ticket_broadcast', payload);
        }
      } catch (socketErr) {
        console.error('[Socket] Emit error:', socketErr.message);
      }
      // ────────────────────────────────────────────────────────

      res.status(201).json(savedTicket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Update ticket status
   */
  updateTicketStatus: async (req, res) => {
    try {
      const { status, assignedTo } = req.body;
      const ticket = await MaintenanceTicket.findById(req.params.id);
      
      if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

      // Logic for who can update what
      if (status) ticket.status = status;
      if (assignedTo) ticket.assignedTo = assignedTo;

      const updatedTicket = await ticket.save();

      // ── Notify Provider if assigned ──────────────────────
      try {
        if (assignedTo) {
          const io = req.app.get('io');
          if (io) {
            io.to(String(assignedTo)).emit('new_task', {
              type: 'MAINTENANCE',
              title: 'New Maintenance Assigned',
              message: `Admin assigned you to a ticket.`,
              ticketId: updatedTicket._id
            });
          }
        }
      } catch (err) {}
      // ────────────────────────────────────────────────────────

      res.status(200).json(updatedTicket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = maintenanceController;
