const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Property = require('../models/Property');
const Lease = require('../models/Lease');
const MaintenanceTicket = require('../models/MaintenanceTicket');
const Message = require('../models/Message');
const InspectionTask = require('../models/InspectionTask');

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
      InspectionTask.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    const hash = await bcrypt.hash('password123', 10);
    const adminHash = await bcrypt.hash('adminpassword', 10);

    // ── CREATE USERS ──────────────────────────────────────
    const [admin, priya, rajesh, sunita,
           amit, sneha, rohan, kavita, vikram,
           deepak, meena, suresh, ravi] = await User.insertMany([
      { name: "Arjun Sharma",    email: "admin@rentify.com",         passwordHash: adminHash, role: "ADMIN"  },
      { name: "Priya Mehta",     email: "owner@example.com",           passwordHash: hash,      role: "OWNER"  },
      { name: "Rajesh Patel",    email: "rajesh.patel@example.com",    passwordHash: hash,      role: "OWNER"  },
      { name: "Sunita Verma",    email: "sunita.verma@example.com",    passwordHash: hash,      role: "OWNER"  },
      { name: "Amit Kumar",      email: "tenant@example.com",          passwordHash: hash,      role: "RENTER"   },
      { name: "Sneha Joshi",     email: "sneha.joshi@example.com",     passwordHash: hash,      role: "RENTER"  },
      { name: "Rohan Desai",     email: "rohan.desai@example.com",     passwordHash: hash,      role: "RENTER"  },
      { name: "Kavita Nair",     email: "kavita.nair@example.com",     passwordHash: hash,      role: "RENTER" },
      { name: "Vikram Singh",    email: "vikram.singh@example.com",    passwordHash: hash,      role: "RENTER" },
      { name: "Deepak Rao",      email: "deepak.inspector@example.com",passwordHash: hash,      role: "INSPECTOR" },
      { name: "Meena Iyer",      email: "meena.inspector@example.com", passwordHash: hash,      role: "INSPECTOR"  },
      { name: "Suresh Plumber",  email: "suresh.service@example.com",  passwordHash: hash,      role: "SERVICE" },
      { name: "Ravi Electrician",email: "ravi.service@example.com",    passwordHash: hash,      role: "SERVICE"   },
    ]);
    console.log('👥 Users created');

    // ── CREATE PROPERTIES ─────────────────────────────────
    const [skyline, grandview, pearl, riverside,
           maple, urban, greenvalley, royalpalms] = await Property.insertMany([
      {
        title: "Skyline Lofts #402",
        description: "Modern 2BHK apartment with stunning city views, fully furnished with premium appliances. Located in the heart of Ahmedabad near SG Highway.",
        address: "1248, SG Highway, Prahlad Nagar", city: "Ahmedabad",
        rent: 28000, bedrooms: 2, bathrooms: 2, type: "APARTMENT", isAvailable: false,
        amenities: ["WiFi","Parking","Gym","Swimming Pool","Security","Power Backup","Lift"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        owner: priya._id
      },
      {
        title: "The Grandview Residency",
        description: "Spacious 3BHK villa with private garden, modular kitchen, and 24/7 security in a gated community in Bangalore.",
        address: "45, Whitefield Main Road, ITPL Back Gate", city: "Bangalore",
        rent: 55000, bedrooms: 3, bathrooms: 3, type: "VILLA", isAvailable: false,
        amenities: ["Garden","Parking","Security","Club House","Power Backup","CCTV","Water Purifier"],
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
        owner: rajesh._id
      },
      {
        title: "Pearl Studio Nest",
        description: "Cozy studio apartment perfect for working professionals. Walking distance from Pune IT Park and metro station.",
        address: "Plot 7, Hinjewadi Phase 1, Near Wipro Circle", city: "Pune",
        rent: 14000, bedrooms: 1, bathrooms: 1, type: "STUDIO", isAvailable: false,
        amenities: ["WiFi","AC","Security","Laundry","Power Backup"],
        images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
        owner: sunita._id
      },
      {
        title: "Riverside Court 2BHK",
        description: "Beautiful 2BHK flat with river-facing balcony, premium interiors, and all modern amenities in Mumbai's prime location.",
        address: "302, Riverside Towers, Andheri West", city: "Mumbai",
        rent: 72000, bedrooms: 2, bathrooms: 2, type: "APARTMENT", isAvailable: true,
        amenities: ["Parking","Gym","Swimming Pool","Concierge","Power Backup","Lift","Security"],
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
        owner: priya._id
      },
      {
        title: "Maple Heights 1BHK",
        description: "Well-maintained 1BHK in a prime locality of Hyderabad near HITEC City with excellent public transport connectivity.",
        address: "Flat 101, Maple Complex, Kondapur", city: "Hyderabad",
        rent: 18000, bedrooms: 1, bathrooms: 1, type: "APARTMENT", isAvailable: true,
        amenities: ["WiFi","Parking","Security","Power Backup"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        owner: rajesh._id
      },
      {
        title: "Urban Nest Studio",
        description: "Fully furnished studio apartment with modern decor, ideal for IT professionals near Electronic City, Bangalore.",
        address: "12B, Tech Park Lane, Electronic City Phase 2", city: "Bangalore",
        rent: 16500, bedrooms: 1, bathrooms: 1, type: "STUDIO", isAvailable: true,
        amenities: ["WiFi","AC","Furnished","Security","Power Backup","Lift"],
        images: ["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800"],
        owner: sunita._id
      },
      {
        title: "Green Valley 3BHK House",
        description: "Spacious independent house with terrace garden, 2 car parking, modular kitchen in a peaceful residential area of Chennai.",
        address: "22, 4th Cross Street, Adyar", city: "Chennai",
        rent: 42000, bedrooms: 3, bathrooms: 2, type: "HOUSE", isAvailable: true,
        amenities: ["Garden","Parking","Security","Water Purifier","Solar Panel","CCTV"],
        images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"],
        owner: priya._id
      },
      {
        title: "Royal Palms Villa",
        description: "Luxurious 4BHK villa in gated community with private pool, home theatre, and smart home automation in Jaipur.",
        address: "Block C-12, Royal Palms Society, Vaishali Nagar", city: "Jaipur",
        rent: 95000, bedrooms: 4, bathrooms: 4, type: "VILLA", isAvailable: true,
        amenities: ["Private Pool","Home Theatre","Smart Home","Parking","Security","Garden","Club House"],
        images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"],
        owner: rajesh._id
      },
    ]);
    console.log('🏠 Properties created');

    // ── CREATE LEASES ─────────────────────────────────────
    await Lease.insertMany([
      { renter: amit._id,   property: skyline._id,    startDate: new Date("2024-01-01"), endDate: new Date("2024-12-31"), rentAmount: 28000, status: "ACTIVE"     },
      { renter: sneha._id,  property: grandview._id,  startDate: new Date("2024-03-01"), endDate: new Date("2025-02-28"), rentAmount: 55000, status: "ACTIVE"     },
      { renter: rohan._id,  property: pearl._id,      startDate: new Date("2024-02-01"), endDate: new Date("2024-07-31"), rentAmount: 14000, status: "EXPIRED"    },
      { renter: kavita._id, property: pearl._id,      startDate: new Date("2024-08-01"), endDate: new Date("2025-07-31"), rentAmount: 14500, status: "ACTIVE"     },
      { renter: vikram._id, property: maple._id,      startDate: new Date("2023-06-01"), endDate: new Date("2024-05-31"), rentAmount: 17000, status: "TERMINATED" },
    ]);
    console.log('📋 Leases created');

    // ── CREATE MAINTENANCE TICKETS ────────────────────────
    await MaintenanceTicket.insertMany([
      { property: skyline._id,   renter: amit._id,   title: "Kitchen Sink Leak",            description: "The kitchen sink pipe is leaking water underneath. Cabinet below getting damaged.", status: "IN_PROGRESS", priority: "HIGH",   assignedTo: suresh._id },
      { property: skyline._id,   renter: amit._id,   title: "HVAC Filter Replacement",       description: "AC unit not cooling properly. Filter needs replacement. Making unusual noise.",      status: "RESOLVED",   priority: "MEDIUM", assignedTo: ravi._id   },
      { property: grandview._id, renter: sneha._id,  title: "Bathroom Geyser Not Working",   description: "Electric geyser in master bathroom stopped working. No hot water available.",       status: "OPEN",     priority: "HIGH",   assignedTo: null       },
      { property: grandview._id, renter: sneha._id,  title: "Main Door Lock Jammed",         description: "Main door lock jammed, difficult to open/close. Security concern at night.",        status: "IN_PROGRESS", priority: "HIGH",   assignedTo: suresh._id },
      { property: pearl._id,     renter: kavita._id, title: "Ceiling Fan Wobbling",          description: "Bedroom ceiling fan wobbles dangerously at all speeds. Fear it might fall.",        status: "OPEN",     priority: "HIGH",   assignedTo: null       },
      { property: pearl._id,     renter: kavita._id, title: "Window Glass Cracked",          description: "Living room window glass has a crack. Causes cold air draft and safety hazard.",    status: "OPEN",     priority: "MEDIUM", assignedTo: null       },
      { property: skyline._id,   renter: amit._id,   title: "Lift Not Working on 4th Floor", description: "Lift stops at 3rd floor, doors don't open on 4th. Have to take stairs.",          status: "IN_PROGRESS", priority: "HIGH",   assignedTo: ravi._id   },
      { property: grandview._id, renter: sneha._id,  title: "Garden Sprinkler Broken",       description: "Automatic sprinkler not working. Plants drying up. Manual watering needed.",       status: "RESOLVED",   priority: "LOW",    assignedTo: suresh._id },
    ]);
    console.log('🔧 Maintenance tickets created');

    // ── CREATE MESSAGES ───────────────────────────────────
    await Message.insertMany([
      { sender: amit._id,   receiver: priya._id,  text: "Namaste Priya Ji, the kitchen sink leak is getting worse. Has the plumber been scheduled?",                            isRead: true,  timestamp: new Date("2024-10-22T09:30:00Z") },
      { sender: priya._id,  receiver: amit._id,   text: "Namaste Amit Ji, yes Suresh will come tomorrow between 10am-12pm. Please be available.",                                isRead: true,  timestamp: new Date("2024-10-22T10:15:00Z") },
      { sender: amit._id,   receiver: priya._id,  text: "Thank you! I'll be home. Also wanted to ask about renewing my lease for another year.",                                 isRead: true,  timestamp: new Date("2024-10-22T10:20:00Z") },
      { sender: priya._id,  receiver: amit._id,   text: "Sure! Rent will increase by 5% as per market rate. Let me know if that works.",                                         isRead: false, timestamp: new Date("2024-10-22T11:00:00Z") },
      { sender: sneha._id,  receiver: rajesh._id, text: "Hello Rajesh Sir, the geyser in master bathroom is dead. No hot water since 2 days. Please arrange repair urgently.",  isRead: true,  timestamp: new Date("2024-10-21T08:00:00Z") },
      { sender: rajesh._id, receiver: sneha._id,  text: "Sorry for the inconvenience Sneha. Technician will visit by tomorrow morning.",                                         isRead: true,  timestamp: new Date("2024-10-21T09:30:00Z") },
      { sender: sneha._id,  receiver: rajesh._id, text: "Thank you! Also the society parking lot lights are not working at night. Can you check?",                               isRead: false, timestamp: new Date("2024-10-21T10:00:00Z") },
      { sender: admin._id,  receiver: priya._id,  text: "Dear Priya Ji, property tax documents for Riverside Court need to be uploaded to the portal by month end.",            isRead: false, timestamp: new Date("2024-10-20T14:00:00Z") },
      { sender: kavita._id, receiver: sunita._id, text: "Hi Sunita Ma'am, the ceiling fan in bedroom is wobbling a lot. I'm scared to use it. Can you please send someone?",   isRead: true,  timestamp: new Date("2024-10-23T07:30:00Z") },
      { sender: sunita._id, receiver: kavita._id, text: "Please don't use it till it's fixed! I'll send electrician Ravi today evening itself. Stay safe!",                    isRead: true,  timestamp: new Date("2024-10-23T08:00:00Z") },
      { sender: kavita._id, receiver: sunita._id, text: "Thank you Ma'am! For November rent — can I pay via UPI? My net banking is having issues.",                             isRead: false, timestamp: new Date("2024-10-23T08:15:00Z") },
    ]);
    console.log('💬 Messages created');

    // ── CREATE INSPECTION TASKS ──────────────────────────
    await InspectionTask.insertMany([
      { property: skyline._id,    inspector: deepak._id, type: 'ROUTINE',  status: 'ASSIGNED',    scheduledDate: new Date("2024-11-05"), notes: "Check smoke detectors and balcony railing." },
      { property: grandview._id,  inspector: null,       type: 'MOVE_IN',  status: 'PENDING',     scheduledDate: new Date("2024-11-10"), notes: "Pre-occupancy walkthrough for new tenant." },
      { property: pearl._id,      inspector: meena._id,  type: 'MOVE_OUT', status: 'IN_PROGRESS', scheduledDate: new Date("2024-11-02"), notes: "Check for damages after lease termination." },
      { property: riverside._id,  inspector: null,       type: 'ROUTINE',  status: 'PENDING',     scheduledDate: new Date("2024-11-15"), notes: "Annual structural checkup." },
    ]);
    console.log('🔍 Inspection tasks created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('══════════════════════════════════════════════════');
    console.log('🔑 TEST ACCOUNTS (one per role):');
    console.log('──────────────────────────────────────────────────');
    console.log('   ADMIN           → admin@rentify.com            / adminpassword');
    console.log('   OWNER           → owner@example.com            / password123');
    console.log('   RENTER          → tenant@example.com           / password123');
    console.log('   INSPECTOR       → deepak.inspector@example.com / password123');
    console.log('   SERVICE PROVIDER→ suresh.service@example.com   / password123');
    console.log('══════════════════════════════════════════════════');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
