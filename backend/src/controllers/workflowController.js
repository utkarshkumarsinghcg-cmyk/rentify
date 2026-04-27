const WorkflowRequest = require('../models/WorkflowRequest');
const Property = require('../models/Property');
const Lease = require('../models/Lease');
const User = require('../models/User');

exports.createRequest = async (req, res) => {
  try {
    const { type, propertyId, notes } = req.body;
    const request = await WorkflowRequest.create({
      type,
      property: propertyId,
      requester: req.user.id,
      notes
    });

    // Notify Admin via socket (if integrated)
    const io = req.app.get('io');
    if (io) {
      io.emit('new_workflow_request', request);
    }

    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAdminRequests = async (req, res) => {
  try {
    const requests = await WorkflowRequest.find()
      .populate('property')
      .populate('requester', 'name email role')
      .populate('assignedInspector', 'name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, assignedInspector, notes } = req.body;
    const request = await WorkflowRequest.findById(req.params.id).populate('property');
    
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = status || request.status;
    if (assignedInspector) request.assignedInspector = assignedInspector;
    if (notes) request.notes = notes;

    const savedRequest = await request.save();

    // ── Side Effects based on status ───────────────────────
    if (status === 'ASSIGNED' && request.type === 'TOUR_REQUEST') {
      await Lease.create({
        property: request.property._id,
        renter: request.requester,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        rentAmount: request.property.rent,
        status: 'ACTIVE'
      });
      await Property.findByIdAndUpdate(request.property._id, { status: 'BOOKED', isAvailable: false });
    }

    if (status === 'COMPLETED' && request.type === 'LEASE_APPROVAL') {
      await Property.findByIdAndUpdate(request.property._id, { status: 'AVAILABLE', isAvailable: true });
    }
    // ────────────────────────────────────────────────────────

    // ── Notify Users via Socket ────────────────────────────
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(String(request.requester)).emit('request_update', {
          status: savedRequest.status,
          type: savedRequest.type,
          property: request.property?.title
        });
        if (assignedInspector) {
          io.to(String(assignedInspector)).emit('new_task', {
            type: 'INSPECTION',
            property: request.property?.title,
            requestId: savedRequest._id
          });
        }
      }
    } catch (err) {}
    // ────────────────────────────────────────────────────────

    res.json(savedRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
