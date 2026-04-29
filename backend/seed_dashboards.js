const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');
const Property = require('./src/models/Property');
const MaintenanceTicket = require('./src/models/MaintenanceTicket');
const WorkflowRequest = require('./src/models/WorkflowRequest');

async function seedDashboards() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB for dashboard seeding...');

    // Find our key players
    const inspector = await User.findOne({ username: 'deepak.rao' });
    const service = await User.findOne({ username: 'suresh.mistry' });
    const renter = await User.findOne({ username: 'amit.kumar' });
    const owner = await User.findOne({ username: 'priya.mehta' });
    const properties = await Property.find().limit(5);

    if (!inspector || !service || !renter || !owner || properties.length < 1) {
      console.error('Required users or properties not found. Please run main seed first.');
      process.exit(1);
    }

    // --- 1. Seed Maintenance Tickets (for Suresh) ---
    console.log('Seeding Maintenance Tickets for Service Provider...');
    await MaintenanceTicket.deleteMany({ assignedTo: service._id });
    
    const tickets = [
      {
        property: properties[0]._id,
        renter: renter._id,
        assignedTo: service._id,
        title: 'Leaking Kitchen Faucet',
        description: 'The faucet in the main kitchen area is dripping constantly. Needs washer replacement.',
        status: 'IN_PROGRESS',
        category: 'Maintenance',
        priority: 'MEDIUM'
      },
      {
        property: properties[1]._id,
        renter: renter._id,
        assignedTo: service._id,
        title: 'Electrical Spark in Living Room',
        description: 'Visible sparks when plugging in devices to the south wall outlet.',
        status: 'OPEN',
        category: 'Maintenance',
        priority: 'HIGH'
      },
      {
        property: properties[0]._id,
        renter: renter._id,
        assignedTo: service._id,
        title: 'AC Filter Cleaning',
        description: 'Routine AC maintenance and filter cleaning for the main bedroom unit.',
        status: 'RESOLVED',
        category: 'Maintenance',
        priority: 'LOW'
      },
      {
        property: properties[2]._id || properties[0]._id,
        renter: renter._id,
        assignedTo: service._id,
        title: 'Broken Window Latch',
        description: 'The latch on the guest bedroom window is snapped off.',
        status: 'RESOLVED',
        category: 'Maintenance',
        priority: 'MEDIUM'
      }
    ];

    await MaintenanceTicket.insertMany(tickets);

    // --- 2. Seed Workflow Requests (for Deepak) ---
    console.log('Seeding Workflow Requests for Inspector...');
    await WorkflowRequest.deleteMany({ assignedInspector: inspector._id });

    const inspections = [
      {
        type: 'LEASE_APPROVAL',
        status: 'ASSIGNED',
        property: properties[0]._id,
        requester: owner._id,
        assignedInspector: inspector._id,
        notes: 'Monthly routine check for Riverside Towers Unit 402.'
      },
      {
        type: 'LEASE_APPROVAL',
        status: 'ASSIGNED',
        property: properties[1]._id,
        requester: owner._id,
        assignedInspector: inspector._id,
        notes: 'Pre-occupancy audit for Skyline Lofts Penthouse.'
      },
      {
        type: 'LEASE_APPROVAL',
        status: 'COMPLETED',
        property: properties[2]._id || properties[0]._id,
        requester: owner._id,
        assignedInspector: inspector._id,
        notes: 'Exterior facade inspection completed successfully.'
      }
    ];

    await WorkflowRequest.insertMany(inspections);

    console.log('✅ Dashboard dummy data (Service & Inspector) seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding dashboards:', error);
    process.exit(1);
  }
}

seedDashboards();
