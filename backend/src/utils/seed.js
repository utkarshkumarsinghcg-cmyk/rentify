const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Property = require('../models/Property');
const Lease = require('../models/Lease');
const MaintenanceTicket = require('../models/MaintenanceTicket');
const Message = require('../models/Message');
const InspectionTask = require('../models/InspectionTask');
const WorkflowRequest = require('../models/WorkflowRequest');

async function seed() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Lease.deleteMany({}),
      MaintenanceTicket.deleteMany({}),
      Message.deleteMany({}),
      InspectionTask.deleteMany({}),
      WorkflowRequest.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    const hash = await bcrypt.hash('password123', 10);
    const adminHash = await bcrypt.hash('adminpassword', 10);

    // ── CREATE USERS ──────────────────────────────────────
    const [admin, priya, rajesh, sunita,
           amit, sneha, rohan, kavita, vikram,
           deepak, meena, suresh, ravi] = await User.insertMany([
      { firstName: "Arjun", lastName: "Sharma", username: "arjun.admin", email: "admin@rentify.com", passwordHash: adminHash, role: "ADMIN" },
      { firstName: "Priya", lastName: "Mehta", username: "priya.mehta", email: "owner@example.com", passwordHash: hash, role: "OWNER" },
      { firstName: "Rajesh", lastName: "Patel", username: "rajesh.patel", email: "rajesh.patel@example.com", passwordHash: hash, role: "OWNER" },
      { firstName: "Sunita", lastName: "Verma", username: "sunita.verma", email: "sunita.verma@example.com", passwordHash: hash, role: "OWNER" },
      { firstName: "Amit", lastName: "Kumar", username: "amit.kumar", email: "tenant@example.com", passwordHash: hash, role: "RENTER" },
      { firstName: "Sneha", lastName: "Joshi", username: "sneha.joshi", email: "sneha.joshi@example.com", passwordHash: hash, role: "RENTER" },
      { firstName: "Rohan", lastName: "Desai", username: "rohan.desai", email: "rohan.desai@example.com", passwordHash: hash, role: "RENTER" },
      { firstName: "Kavita", lastName: "Nair", username: "kavita.nair", email: "kavita.nair@example.com", passwordHash: hash, role: "RENTER" },
      { firstName: "Vikram", lastName: "Singh", username: "vikram.singh", email: "vikram.singh@example.com", passwordHash: hash, role: "RENTER" },
      { firstName: "Deepak", lastName: "Rao", username: "deepak.rao", email: "deepak.inspector@example.com", passwordHash: hash, role: "INSPECTOR" },
      { firstName: "Meena", lastName: "Iyer", username: "meena.iyer", email: "meena.inspector@example.com", passwordHash: hash, role: "INSPECTOR" },
      { firstName: "Suresh", lastName: "Plumber", username: "suresh.mistry", email: "suresh.service@example.com", passwordHash: hash, role: "SERVICE" },
      { firstName: "Ravi", lastName: "Electrician", username: "ravi.electrician", email: "ravi.service@example.com", passwordHash: hash, role: "SERVICE" },
    ]);
    console.log('👥 Users created');

    // ── CREATE PROPERTIES ─────────────────────────────────
    const [skyline, grandview, pearl, riverside] = await Property.insertMany([
      {
        title: "Skyline Lofts #402",
        description: "Modern 2BHK apartment with stunning city views, fully furnished with premium appliances.",
        address: "1248, SG Highway, Prahlad Nagar", city: "Ahmedabad",
        rent: 28000, bedrooms: 2, bathrooms: 2, type: "APARTMENT", isAvailable: false,
        amenities: ["WiFi","Parking","Gym","Swimming Pool"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
        owner: priya._id
      },
      {
        title: "The Grandview Residency",
        description: "Spacious 3BHK villa with private garden, modular kitchen.",
        address: "45, Whitefield Main Road, ITPL Back Gate", city: "Bangalore",
        rent: 55000, bedrooms: 3, bathrooms: 3, type: "VILLA", isAvailable: false,
        amenities: ["Garden","Parking","Security"],
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
        owner: rajesh._id
      },
      {
        title: "Pearl Studio Nest",
        description: "Cozy studio apartment perfect for working professionals.",
        address: "Plot 7, Hinjewadi Phase 1", city: "Pune",
        rent: 14000, bedrooms: 1, bathrooms: 1, type: "STUDIO", isAvailable: false,
        amenities: ["WiFi","AC"],
        images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
        owner: sunita._id
      },
      {
        title: "Riverside Court 2BHK",
        description: "Beautiful 2BHK flat with river-facing balcony.",
        address: "302, Riverside Towers, Andheri West", city: "Mumbai",
        rent: 72000, bedrooms: 2, bathrooms: 2, type: "APARTMENT", isAvailable: true,
        amenities: ["Parking","Gym"],
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
        owner: priya._id
      }
    ]);
    console.log('🏠 Properties created');

    // ── CREATE LEASES ─────────────────────────────────────
    await Lease.insertMany([
      { renter: amit._id,   property: skyline._id,    startDate: new Date("2024-01-01"), endDate: new Date("2024-12-31"), rentAmount: 28000, status: "ACTIVE" },
      { renter: sneha._id,  property: grandview._id,  startDate: new Date("2024-03-01"), endDate: new Date("2025-02-28"), rentAmount: 55000, status: "ACTIVE" },
    ]);
    console.log('📋 Leases created');

    // ── CREATE MAINTENANCE TICKETS ────────────────────────
    await MaintenanceTicket.insertMany([
      { property: skyline._id,   renter: amit._id,   title: "Kitchen Sink Leak",            description: "Leaking water underneath the sink.", status: "OPEN", priority: "HIGH",   assignedTo: null },
      { property: grandview._id, renter: sneha._id,  title: "AC Not Cooling",               description: "Master bedroom AC unit failing.", status: "OPEN", priority: "HIGH",   assignedTo: null },
      { property: pearl._id,     renter: kavita._id, title: "Lights Flickering",            description: "Living room lights flickering.", status: "IN_PROGRESS", priority: "MEDIUM", assignedTo: ravi._id },
    ]);
    console.log('🔧 Maintenance tickets created');

    // ── CREATE WORKFLOW REQUESTS ──────────────────────────
    await WorkflowRequest.insertMany([
      { type: 'LEASE_APPROVAL', status: 'PENDING', property: riverside._id, requester: priya._id, notes: "New lease request for unit 302." },
      { type: 'LEASE_APPROVAL', status: 'ADMIN_REVIEWED', property: grandview._id, requester: rajesh._id, notes: "Please assign an inspector for move-in check." },
      { type: 'TOUR_REQUEST', status: 'PENDING', property: pearl._id, requester: rohan._id, notes: "Interested in weekend viewing." },
    ]);
    console.log('🔄 Workflow requests created');

    // ── CREATE MESSAGES ───────────────────────────────────
    await Message.insertMany([
      { sender: amit._id,   receiver: priya._id,  text: "Hello, I reported a leak.", isRead: true,  timestamp: new Date() },
      { sender: priya._id,  receiver: amit._id,   text: "Got it, technician is being assigned.", isRead: false, timestamp: new Date() },
    ]);
    console.log('💬 Messages created');

    // ── CREATE INSPECTION TASKS ──────────────────────────
    await InspectionTask.insertMany([
      { property: skyline._id,    inspector: deepak._id, type: 'ROUTINE',  status: 'ASSIGNED',    scheduledDate: new Date("2024-11-05"), notes: "Check smoke detectors." },
      { property: grandview._id,  inspector: null,       type: 'MOVE_IN',  status: 'PENDING',     scheduledDate: new Date("2024-11-10"), notes: "Pre-occupancy walkthrough." },
    ]);
    console.log('🔍 Inspection tasks created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('══════════════════════════════════════════════════');
    console.log('🔑 TEST ACCOUNTS (Login via Username):');
    console.log('──────────────────────────────────────────────────');
    console.log('   ADMIN           → arjun.admin       / adminpassword');
    console.log('   OWNER           → priya.mehta       / password123');
    console.log('   RENTER          → amit.kumar        / password123');
    console.log('   INSPECTOR       → deepak.rao        / password123');
    console.log('   SERVICE PROVIDER→ suresh.mistry     / password123');
    console.log('══════════════════════════════════════════════════');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
