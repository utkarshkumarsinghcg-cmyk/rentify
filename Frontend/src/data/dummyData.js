// ────────────────────────────────────────────────────────────
//  Rentify — Comprehensive Dummy Data (Indian-localized)
// ────────────────────────────────────────────────────────────

export const DUMMY_PROPERTIES = [
  {
    id: 'p1',
    title: 'Skyline Lofts #402',
    description: 'Premium 3BHK apartment with stunning city views, fully furnished with modern amenities.',
    type: 'Apartment',
    city: 'Mumbai',
    address: 'Jogeshwari-Vikhroli Link Rd, Andheri East, Mumbai - 400069',
    rent: 28000,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['WiFi', 'Parking', 'Gym', 'Security', 'Lift', 'AC'],
    available: false,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1502672260266-1c1e54823861?w=800&auto=format&fit=crop&q=60',
    ],
    tenant: { name: 'Priya Sharma', email: 'priya@email.com', leaseStart: '2025-01-01', leaseEnd: '2026-01-01', monthlyRent: 28000 },
    maintenanceHistory: ['m1', 'm3'],
    status: 'Occupied',
  },
  {
    id: 'p2',
    title: 'Riverside Court 2BHK',
    description: 'Spacious 2BHK near metro station, ideal for working professionals.',
    type: 'Apartment',
    city: 'Bengaluru',
    address: 'EPIP Zone, Whitefield, Bengaluru - 560066',
    rent: 72000,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['WiFi', 'Parking', 'Pool', 'Security', 'Power Backup'],
    available: true,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=800&auto=format&fit=crop&q=60',
    ],
    tenant: null,
    maintenanceHistory: [],
    status: 'Vacant',
  },
  {
    id: 'p3',
    title: 'Green Valley 3BHK',
    description: 'Beautiful villa-style apartment in a gated community with garden access.',
    type: 'House',
    city: 'New Delhi',
    address: 'Shivaji Marg, Moti Nagar, New Delhi - 110015',
    rent: 42000,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ['WiFi', 'Parking', 'Garden', 'Security', 'Power Backup', 'AC'],
    available: false,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1536376074432-bf12177d4f4f?w=800&auto=format&fit=crop&q=60',
    ],
    tenant: { name: 'Rahul Verma', email: 'rahul@email.com', leaseStart: '2025-03-01', leaseEnd: '2026-03-01', monthlyRent: 42000 },
    maintenanceHistory: ['m2'],
    status: 'Occupied',
  },
];

export const DUMMY_TICKETS = [
  {
    id: 'm1',
    propertyId: 'p1',
    property: 'Skyline Lofts #402',
    type: 'Maintenance',
    title: 'Kitchen Sink Leak',
    description: 'The kitchen sink has a persistent leak near the drainage pipe. Water damage visible on cabinet below.',
    status: 'Pending',
    priority: 'High',
    date: '2026-04-20',
    assignedTo: 'Suresh Plumber',
  },
  {
    id: 'm2',
    propertyId: 'p3',
    property: 'Green Valley 3BHK',
    type: 'Inspection',
    title: 'Annual Safety Inspection',
    description: 'Scheduled annual safety inspection for fire extinguishers, electrical boards and gas lines.',
    status: 'In Progress',
    priority: 'Medium',
    date: '2026-04-21',
    assignedTo: 'Ravi Electrician',
  },
  {
    id: 'm3',
    propertyId: 'p1',
    property: 'Skyline Lofts #402',
    type: 'Maintenance',
    title: 'AC Servicing',
    description: 'Regular AC maintenance and filter cleaning for all 3 units in the apartment.',
    status: 'Completed',
    priority: 'Low',
    date: '2026-04-15',
    assignedTo: 'Ravi Electrician',
  },
];

export const SERVICE_PROVIDERS = [
  { id: 'sp1', name: 'Suresh Plumber', specialty: 'Plumbing', rating: 4.8, phone: '+91 98765 43210' },
  { id: 'sp2', name: 'Ravi Electrician', specialty: 'Electrical', rating: 4.9, phone: '+91 91234 56789' },
  { id: 'sp3', name: 'Unassigned', specialty: 'General', rating: null, phone: null },
];

export const MANAGERS = [
  { id: 'mg1', name: 'Alex Johnson', role: 'Regional Manager', status: 'Online', avatar: '11',
    messages: [
      { id: 'msg1', sender: 'manager', text: 'Good morning! All properties checked. No major issues.', time: '09:00 AM' },
      { id: 'msg2', sender: 'owner', text: 'Thanks Alex. Any update on Skyline Lofts maintenance?', time: '09:05 AM' },
      { id: 'msg3', sender: 'manager', text: 'Suresh has been dispatched. Will be there by 11 AM.', time: '09:07 AM' },
    ]
  },
  { id: 'mg2', name: 'Sarah Lee', role: 'Site Manager', status: 'Away', avatar: '12',
    messages: [
      { id: 'msg4', sender: 'manager', text: 'Hi! Riverside Court vacancy has 3 inquiries this week.', time: 'Yesterday' },
    ]
  },
  { id: 'mg3', name: 'Mike Davis', role: 'Maintenance Lead', status: 'Offline', avatar: '13',
    messages: []
  },
  { id: 'mg4', name: 'Priti Nair', role: 'Leasing Agent', status: 'Online', avatar: '14',
    messages: [
      { id: 'msg5', sender: 'manager', text: 'Lease renewal reminder sent to all tenants for Q2.', time: '2d ago' },
    ]
  },
];

export const FINANCIAL_DATA = {
  '6M': [
    { month: 'JAN', revenue: 140000, expenses: 45000 },
    { month: 'FEB', revenue: 152000, expenses: 48000 },
    { month: 'MAR', revenue: 148000, expenses: 52000 },
    { month: 'APR', revenue: 161000, expenses: 43000 },
    { month: 'MAY', revenue: 155000, expenses: 49000 },
    { month: 'JUN', revenue: 170000, expenses: 51000 },
  ],
  '1Y': [
    { month: 'JUL', revenue: 130000, expenses: 42000 },
    { month: 'AUG', revenue: 135000, expenses: 44000 },
    { month: 'SEP', revenue: 128000, expenses: 48000 },
    { month: 'OCT', revenue: 142000, expenses: 46000 },
    { month: 'NOV', revenue: 150000, expenses: 50000 },
    { month: 'DEC', revenue: 158000, expenses: 55000 },
    { month: 'JAN', revenue: 140000, expenses: 45000 },
    { month: 'FEB', revenue: 152000, expenses: 48000 },
    { month: 'MAR', revenue: 148000, expenses: 52000 },
    { month: 'APR', revenue: 161000, expenses: 43000 },
    { month: 'MAY', revenue: 155000, expenses: 49000 },
    { month: 'JUN', revenue: 170000, expenses: 51000 },
  ],
  'ALL': [
    { month: 'Q1 24', revenue: 380000, expenses: 130000 },
    { month: 'Q2 24', revenue: 410000, expenses: 142000 },
    { month: 'Q3 24', revenue: 395000, expenses: 138000 },
    { month: 'Q4 24', revenue: 430000, expenses: 151000 },
    { month: 'Q1 25', revenue: 440000, expenses: 145000 },
    { month: 'Q2 25', revenue: 470000, expenses: 148000 },
    { month: 'Q3 25', revenue: 455000, expenses: 155000 },
    { month: 'Q4 25', revenue: 490000, expenses: 160000 },
    { month: 'Q1 26', revenue: 486000, expenses: 148000 },
  ],
};

export const PORTFOLIO_DIST_DATA = [
  { name: 'APT', label: 'Apartment', count: 2, value: 1200000, fill: '#3b82f6' },
  { name: 'VILLA', label: 'Villa', count: 0, value: 0, fill: '#10b981' },
  { name: 'HOUSE', label: 'House', count: 1, value: 850000, fill: '#3b82f6' },
  { name: 'STUDIO', label: 'Studio', count: 0, value: 0, fill: '#10b981' },
];

export const ACTIVITIES = [
  { id: 'a1', type: 'Maintenance', title: 'Kitchen Sink Leak reported', desc: 'Skyline Lofts #402 — New ticket opened by tenant.', time: '2h ago', icon: 'wrench', color: 'rose', property: 'Skyline Lofts' },
  { id: 'a2', type: 'Payments', title: 'Rent received from Priya Sharma', desc: 'Skyline Lofts #402 — ₹28,000 received for April 2026.', time: '1d ago', icon: 'dollar', color: 'emerald', property: 'Skyline Lofts' },
  { id: 'a3', type: 'Lease', title: 'Lease renewal due in 30 days', desc: 'Skyline Lofts #402 — Contract expires Jan 2026.', time: '1d ago', icon: 'file', color: 'amber', property: 'Skyline Lofts' },
  { id: 'a4', type: 'Payments', title: 'Rent received from Rahul Verma', desc: 'Green Valley 3BHK — ₹42,000 received for April 2026.', time: '2d ago', icon: 'dollar', color: 'emerald', property: 'Green Valley' },
  { id: 'a5', type: 'Maintenance', title: 'AC Servicing completed', desc: 'Skyline Lofts #402 — All 3 units serviced.', time: '4d ago', icon: 'check', color: 'blue', property: 'Skyline Lofts' },
  { id: 'a6', type: 'Lease', title: 'New tenant inquiry', desc: 'Riverside Court 2BHK — Prospect from NoBroker.', time: '5d ago', icon: 'user', color: 'slate', property: 'Riverside Court' },
];
