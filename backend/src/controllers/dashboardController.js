const Property = require('../models/Property');
const MaintenanceTicket = require('../models/MaintenanceTicket');
const Lease = require('../models/Lease');

/**
 * Dashboard Controller
 * Aggregates data for user-specific dashboards.
 */
const dashboardController = {
  /**
   * Get Owner Dashboard Data
   */
  getOwnerStats: async (req, res) => {
    try {
      // For testing, if user is not authenticated, pick the first OWNER from DB
      let ownerId;
      if (req.user && req.user.id) {
        ownerId = req.user.id;
      } else {
        const User = require('../models/User');
        const firstOwner = await User.findOne({ role: 'OWNER' });
        ownerId = firstOwner ? firstOwner._id : null;
      }

      if (!ownerId) {
        return res.status(200).json({ analytics: {}, properties: [], maintenanceTickets: [], messages: [] });
      }

      // 1. Get properties
      const properties = await Property.find({ owner: ownerId });
      const activePropertiesCount = properties.length;
      const propertyIds = properties.map(p => p._id);

      // 2. Calculate Revenue
      const totalRevenue = properties.reduce((acc, curr) => acc + (curr.isAvailable ? 0 : curr.rent), 0);

      // 3. Maintenance Requests
      const maintenanceTickets = await MaintenanceTicket.find({ 
        property: { $in: propertyIds }
      }).populate('property').populate('assignedTo').limit(10);

      const pendingMaintenance = maintenanceTickets.filter(t => t.status === 'OPEN').length;

      // 4. Occupancy Rate
      const occupiedCount = properties.filter(p => !p.isAvailable).length;
      const occupancyRate = activePropertiesCount > 0 
        ? Math.round((occupiedCount / activePropertiesCount) * 100) 
        : 0;

      // 5. Messages
      const Message = require('../models/Message');
      const messages = await Message.find({
        $or: [{ sender: ownerId }, { receiver: ownerId }]
      }).populate('sender receiver').sort({ timestamp: -1 }).limit(20);

      // 6. Workflow Requests
      const WorkflowRequest = require('../models/WorkflowRequest');
      const workflowRequests = await WorkflowRequest.find({ requester: ownerId }).populate('property').sort({ createdAt: -1 });

      res.status(200).json({
        analytics: {
          totalRevenue,
          occupancyRate,
          activeProperties: activePropertiesCount,
          pendingMaintenance,
        },
        properties: properties.slice(0, 5),
        maintenanceTickets,
        workflowRequests,
        messages,
        userId: ownerId
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get Renter Dashboard Data
   */
  getRenterStats: async (req, res) => {
    try {
      // Pick first RENTER if not authenticated
      let renterId;
      if (req.user && req.user.id) {
        renterId = req.user.id;
      } else {
        const User = require('../models/User');
        const firstRenter = await User.findOne({ role: 'RENTER' });
        renterId = firstRenter ? firstRenter._id : null;
      }

      if (!renterId) {
        return res.status(200).json({ lease: null, maintenanceTickets: [], properties: [] });
      }

      // 1. Get Active Lease
      const lease = await Lease.findOne({ renter: renterId }).populate('property');

      // 2. Get Maintenance Tickets
      const maintenanceTickets = await MaintenanceTicket.find({
        property: lease ? lease.property?._id : null
      }).populate('property').populate('assignedTo').limit(10);

      // 3. Suggested Properties
      const properties = await Property.find({ isAvailable: true }).limit(2);

      // 4. Workflow Requests (Tour Requests)
      const WorkflowRequest = require('../models/WorkflowRequest');
      const workflowRequests = await WorkflowRequest.find({ requester: renterId }).populate('property').sort({ createdAt: -1 });

      res.status(200).json({
        lease,
        maintenanceTickets,
        workflowRequests,
        properties,
        userId: renterId
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get Service Provider Dashboard Data
   */
  getServiceStats: async (req, res) => {
    try {
      let serviceId;
      if (req.user && req.user.id) {
        serviceId = req.user.id;
      } else {
        const User = require('../models/User');
        const firstService = await User.findOne({ role: 'SERVICE_PROVIDER' });
        serviceId = firstService ? firstService._id : null;
      }

      if (!serviceId) {
        return res.status(200).json({ availableRequests: [], activeSchedule: [], history: [] });
      }

      // 1. Available Requests (Unassigned or Open)
      const availableRequests = await MaintenanceTicket.find({ status: 'OPEN' }).populate('property').limit(10);

      // 2. My Schedule (Assigned to me)
      const activeSchedule = await MaintenanceTicket.find({ 
        assignedTo: serviceId,
        status: { $in: ['OPEN', 'IN_PROGRESS'] }
      }).populate('property').limit(10);

      // 3. Completed History
      const history = await MaintenanceTicket.find({
        assignedTo: serviceId,
        status: 'RESOLVED'
      }).populate('property').populate('assignedTo').limit(10);

      res.status(200).json({
        availableRequests,
        activeSchedule,
        history,
        userId: serviceId
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get Inspector Dashboard Data
   */
  getInspectorStats: async (req, res) => {
    try {
      let inspectorId;
      if (req.user && req.user.id) {
        inspectorId = req.user.id;
      } else {
        const User = require('../models/User');
        const firstInspector = await User.findOne({ role: 'INSPECTOR' });
        inspectorId = firstInspector ? firstInspector._id : null;
      }

      if (!inspectorId) {
        return res.status(200).json({ pendingInspections: [], schedule: [], history: [] });
      }

      const WorkflowRequest = require('../models/WorkflowRequest');

      // 1. Pending Inspections (Assigned to me but not completed)
      const schedule = await WorkflowRequest.find({ 
        assignedInspector: inspectorId,
        type: 'LEASE_APPROVAL',
        status: 'ASSIGNED'
      }).populate('property').limit(10);

      // 2. Completed History
      const history = await WorkflowRequest.find({
        assignedInspector: inspectorId,
        type: 'LEASE_APPROVAL',
        status: 'COMPLETED'
      }).populate('property').limit(10);

      res.status(200).json({
        pendingInspections: [], // Unassigned flow is handled by Admin Dashboard
        schedule,
        history,
        userId: inspectorId
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get Admin Dashboard Data
   */
  getAdminStats: async (req, res) => {
    try {
      const User = require('../models/User');
      const Property = require('../models/Property');
      const Lease = require('../models/Lease');

      const userCount = await User.countDocuments();
      const propertyCount = await Property.countDocuments();
      const activeLeases = await Lease.find().limit(5).populate('renter property');
      const recentTickets = await MaintenanceTicket.find().sort({ createdAt: -1 }).limit(10).populate('property').populate('assignedTo');
      const allUsers = await User.find().sort({ createdAt: -1 }).limit(10);

      // Simple revenue sum
      const leases = await Lease.find();
      const totalRevenue = leases.reduce((sum, l) => sum + (l.rentAmount || 0), 0);

      const WorkflowRequest = require('../models/WorkflowRequest');
      const workflowRequests = await WorkflowRequest.find().populate('property requester assignedInspector').sort({ createdAt: -1 });
      const pendingWorkflow = workflowRequests.filter(r => r.status === 'PENDING').length;

      res.status(200).json({
        stats: {
          users: userCount,
          properties: propertyCount,
          revenue: totalRevenue,
          alerts: recentTickets.length + pendingWorkflow
        },
        recentTickets,
        workflowRequests,
        users: allUsers,
        activeLeases
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = dashboardController;
