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
        .populate('renter', 'name email firstName lastName')
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
      const populatedTicket = await MaintenanceTicket.findById(savedTicket._id)
        .populate('property', 'title')
        .populate('renter', 'firstName lastName name');

      // ── Real-time notification via Socket.io ────────────────
      try {
        const io = req.app.get('io');
        if (io) {
          const userName = populatedTicket.renter?.name || 
                          (populatedTicket.renter?.firstName ? `${populatedTicket.renter.firstName} ${populatedTicket.renter.lastName}` : 'A User');
          
          const payload = {
            ticketId: savedTicket._id,
            title: req.body.title || `${req.body.category}: ${req.body.type}`,
            userName: userName,
            category: req.body.category || 'Maintenance',
            priority: savedTicket.priority,
            property: populatedTicket.property?.title || 'Property',
            location: req.body.address || 'Various',
            message: `${userName} requested maintenance for ${populatedTicket.property?.title || 'their property'}.`,
            createdAt: savedTicket.createdAt,
          };

          // Notify Admins specifically (via admin room)
          io.to('admin').emit('admin_notification', { ...payload, type: 'MAINTENANCE_ALERT' });
          io.emit('new_ticket', populatedTicket);
          io.emit('new_workflow_request', populatedTicket); // So admin workflow section also refreshes if it shows these

          // Notify specific assigned provider (if set)
          if (savedTicket.assignedTo) {
            io.to(String(savedTicket.assignedTo)).emit('new_ticket', populatedTicket);
          }

          // Broadcast to all connected service providers
          io.emit('new_ticket_broadcast', populatedTicket);
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
      const populatedTicket = await MaintenanceTicket.findById(updatedTicket._id)
        .populate('property')
        .populate('renter')
        .populate('assignedTo');

      // ── Notify Involved Parties ────────────────────────────
      try {
        const io = req.app.get('io');
        if (io) {
          const message = updatedTicket.status === 'IN_PROGRESS' 
            ? `Your maintenance request for ${populatedTicket.property?.title} is now in progress.`
            : updatedTicket.status === 'RESOLVED'
            ? `Your maintenance request for ${populatedTicket.property?.title} has been resolved.`
            : updatedTicket.status === 'OPEN' && assignedTo
            ? `A technician has been assigned to your request for ${populatedTicket.property?.title}.`
            : `Status updated for ${populatedTicket.property?.title}: ${updatedTicket.status}`;

          const notificationData = {
            ticketId: updatedTicket._id,
            status: updatedTicket.status,
            message,
            property: populatedTicket.property?.title
          };

          // Notify Renter
          if (populatedTicket.renter) {
            io.to(String(populatedTicket.renter._id || populatedTicket.renter)).emit('request_update', notificationData);
          }

          // Notify Owner
          if (populatedTicket.property?.owner) {
            io.to(String(populatedTicket.property.owner)).emit('request_update', notificationData);
          }

          // Notify Provider if assigned
          if (assignedTo) {
            io.to(String(assignedTo)).emit('new_task', {
              type: 'MAINTENANCE',
              title: 'New Maintenance Assigned',
              message: `Admin assigned you to a ticket: ${populatedTicket.property?.title}`,
              ticketId: updatedTicket._id
            });
          }

          // Notify Admins
          io.to('admin').emit('request_update', notificationData);
        }
      } catch (err) {
        console.error('[Socket] Update notification error:', err);
      }
      // ────────────────────────────────────────────────────────

      res.status(200).json(populatedTicket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = maintenanceController;
