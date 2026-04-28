# 🏠 Rentify — Smart Property Management Platform

A full-stack, role-based property management platform built with **React + Vite** (Frontend) and **Express + MongoDB** (Backend), featuring real-time notifications via **Socket.io**.

> **Live Demo:**  
> Frontend: [Vercel Deployment URL]  
> Backend: [Render Deployment URL]

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Role-Based Dashboards](#-role-based-dashboards)
- [Real-Time Workflow](#-real-time-workflow)
- [Test Accounts](#-test-accounts)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [Deployment](#-deployment)
- [OTP Login (Roadmap)](#-otp-login-roadmap)
- [Project Structure](#-project-structure)

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with 7-day token expiry
- Role-based access control (5 roles)
- Email case-insensitive login (auto-normalized to lowercase)
- **Admin account creation blocked** via self-signup — admins can only be seeded
- Password hashing with bcrypt (10 salt rounds)
- Auto-logout on token expiry with session cleanup
- Strong password enforcement (8+ chars, uppercase, number, special char)
- Auto-generate password feature on signup

### 🏘️ Property Management
- Full CRUD for property listings (create, view, edit, delete)
- Multi-image property gallery with Unsplash integration
- Property search & filtering by city, type, rent range
- Property types: Apartment, Villa, Studio, House
- Amenities tagging (WiFi, Parking, Gym, Pool, etc.)
- Property availability toggle

### 📋 Listing Approval Workflow
- Owner submits property → Admin gets real-time notification
- Admin assigns Inspector → Inspector gets task notification
- Inspector surveys property → Clicks "List Property" to make it live
- Owner receives live status updates at every stage:
  - `Awaiting Review` → `In Inspection` → `Live`

### 🔧 Maintenance & Service Workflow
- Owner/Renter submits service request with priority auto-assignment
- Admin sees request in "Maintenance Dispatch" with live badge
- Admin assigns Service Provider from dropdown
- Service Provider receives real-time task notification
- Provider can: Accept → Start Job → Mark Complete
- Owner/Renter sees live status updates without page refresh
- Categories: Plumbing, Electrical, HVAC, Painting, Pest Control, etc.

### 🏡 Lease Management
- Active lease tracking with start/end dates
- Lease PDF download (auto-generated)
- Rent amount tracking
- Lease status: Active, Expired, Terminated

### 💬 Real-Time Communication
- Socket.io powered notifications across all roles
- In-dashboard toast notifications for:
  - New property submissions
  - Inspector/Provider assignments
  - Status updates on requests
- Live chat support widget (Service Provider dashboard)
- Message history between owners and tenants

### 📊 Analytics & Reporting
- Admin analytics dashboard with platform-wide stats
- Owner revenue tracking and occupancy rates
- Service Provider earnings analytics (Weekly/Monthly/Yearly)
- Interactive charts with Recharts
- PDF report export (jsPDF)

### 🗺️ Maps & Location
- Interactive Leaflet maps on dashboards
- Service Provider job map with color-coded markers
- Google Maps integration for navigation/directions
- Property location display for inspectors

### 🎯 Additional Features
- Dark mode support across all pages
- Responsive design (mobile-first)
- Points/Rewards breakdown system
- Google Fonts (Inter typography)
- Glassmorphism & micro-animation UI effects
- Premium landing page with feature showcase & testimonials

---

## 🏗️ Architecture

```
┌─────────────┐     Socket.io      ┌─────────────┐
│   Frontend   │◄──────────────────►│   Backend    │
│  (React/Vite)│    REST API        │  (Express)   │
│   Vercel     │───────────────────►│   Render     │
└─────────────┘                     └──────┬──────┘
                                           │
                                    ┌──────▼──────┐
                                    │  MongoDB     │
                                    │  Atlas       │
                                    └─────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Lucide Icons |
| State | Redux Toolkit |
| Routing | React Router v6 |
| HTTP | Axios |
| Real-time | Socket.io Client |
| Charts | Recharts |
| Maps | React-Leaflet |
| PDF | jsPDF |
| Toasts | React Hot Toast |
| Backend | Express.js, Node.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT, bcryptjs |
| Real-time | Socket.io |
| Security | Helmet, CORS |

---

## 👥 Role-Based Dashboards

### 🛡️ Admin Dashboard
- Platform overview with key metrics
- **Workflow Control**: Approve/assign inspectors to new property listings
- **Maintenance Dispatch**: Assign service providers to tickets
- User management (all roles)
- Real-time notification bell

### 🏠 Owner Dashboard
- Property portfolio with revenue analytics
- Submit new property listings (triggers admin workflow)
- Create maintenance/service requests
- Track listing status: Awaiting Review → In Inspection → Live
- Track maintenance status with live updates
- Message tenants
- PDF report export

### 🏘️ Renter/Tenant Dashboard
- Active lease details with PDF download
- Submit maintenance requests
- Request property tours
- View suggested available properties
- Interactive neighborhood map
- Real-time ticket status updates

### 🔍 Inspector Dashboard
- Assigned inspection tasks (filtered by logged-in inspector)
- "Survey Property" and "List Property" actions
- Property details with location info
- Task status management

### 🔧 Service Provider Dashboard
- Real-time new task alert banners
- Available requests table with Accept action
- Active schedule with Start Job / Mark Complete
- Job map with color-coded markers (Emergency/Standard/Completed)
- Earnings analytics with charts
- Job history with receipt download
- Live chat support widget

---

## 🔄 Real-Time Workflow

### Property Listing Flow
```
Owner adds property
       │
       ▼
Admin gets notification ──► Assigns Inspector
       │                          │
       ▼                          ▼
Owner sees "In Inspection"   Inspector gets task
                                   │
                                   ▼
                            Inspector clicks "List Property"
                                   │
                                   ▼
                            Owner sees "Live" ✅
```

### Service Request Flow
```
Owner/Renter submits request
       │
       ▼
Admin gets notification ──► Assigns Service Provider
       │                          │
       ▼                          ▼
Requester sees "Assigned"    Provider gets task alert
                                   │
                              Accept → Start → Complete
                                   │
                                   ▼
                            Requester sees "Resolved" ✅
```

---

## 🔑 Test Accounts

Run `npm run seed` in the backend directory to create these accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@rentify.com` | `adminpassword` |
| **Owner** | `owner@example.com` | `password123` |
| **Renter** | `tenant@example.com` | `password123` |
| **Inspector** | `deepak.inspector@example.com` | `password123` |
| **Service Provider** | `suresh.service@example.com` | `password123` |

> ⚠️ **Admin accounts cannot be created via signup.** They can only be created through the database seed script.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/utkarshkumarsinghcg-cmyk/rentify.git
cd rentify

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### Running Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev          # Starts on port 5001

# Terminal 2 — Frontend
cd Frontend
npm run dev          # Starts on port 5173
```

Open `http://localhost:5173` in your browser.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/Rentify"
PORT=5001
JWT_SECRET="your_jwt_secret_here"
CLIENT_URL="http://localhost:5173"
```

### Frontend (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

### Production (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Production (Render)
```
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_production_secret
CLIENT_URL=https://your-app.vercel.app
PORT=5001
```

---

## 🌱 Database Seeding

```bash
cd backend
npm run seed
```

This creates:
- 1 Admin, 3 Owners, 5 Renters, 2 Inspectors, 2 Service Providers
- 8 Properties across Indian cities (Mumbai, Bangalore, Pune, Ahmedabad, etc.)
- 5 Lease agreements
- 8 Maintenance tickets with various statuses
- 11 Messages between users
- 4 Inspection tasks

---

## 🚢 Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set root directory to `Frontend`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
6. Deploy

### Backend → Render
1. Create new Web Service on Render
2. Connect GitHub repo
3. Set root directory: `backend`
4. Set build command: `npm install`
5. Set start command: `node src/server.js`
6. Add environment variables (DATABASE_URL, JWT_SECRET, CLIENT_URL)
7. Deploy

### Health Check
After deployment, verify: `https://your-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "ok",
  "dbState": "connected",
  "dbHost": "cluster0-shard-...",
  "env": "development"
}
```

---

## 📱 OTP Login (Roadmap)

See the [OTP Implementation Plan](#otp-implementation-steps) section below for detailed steps.

---

## 📁 Project Structure

```
rentify/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # AdminDashboard.jsx
│   │   │   ├── owner/          # OwnerDashboard.jsx
│   │   │   ├── renter/         # RenterDashboard.jsx
│   │   │   ├── inspection/     # InspectorDashboard.jsx
│   │   │   ├── service/        # ServiceDashboard.jsx
│   │   │   ├── common/         # Card, Button, NotificationListener
│   │   │   ├── property/       # AddPropertyModal, LeaseAgreement
│   │   │   └── layout/         # Navbar, Footer, Layout
│   │   ├── pages/              # Login, Signup, Dashboard, Home, etc.
│   │   ├── services/           # api.js, authService, maintenanceService, etc.
│   │   ├── store/              # Redux slices
│   │   ├── hooks/              # useAuth, custom hooks
│   │   ├── routes/             # AppRoutes.jsx
│   │   └── utils/              # storage helpers
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/        # authController, propertyController, etc.
│   │   ├── models/             # User, Property, Lease, MaintenanceTicket, etc.
│   │   ├── routes/             # auth, properties, dashboard, etc.
│   │   ├── middleware/         # auth, errorHandler
│   │   ├── utils/              # jwt, seed.js
│   │   ├── config/             # db.js
│   │   └── server.js           # Express + Socket.io entry point
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 📲 OTP Implementation Steps

> This is a **future feature roadmap** for adding OTP-based login.

### Step-by-step plan:

#### 1. Choose an OTP Provider
- **Twilio** (SMS) — Most popular, ~$0.01/SMS
- **Firebase Phone Auth** — Free tier available
- **MSG91** — India-focused, affordable

#### 2. Backend Changes

**Install packages:**
```bash
cd backend
npm install twilio   # or firebase-admin
```

**Create `backend/src/controllers/otpController.js`:**
```js
// POST /api/auth/send-otp
// - Accepts { phone } or { email }
// - Generates 6-digit OTP
// - Stores OTP + expiry (5 min) in a new OTP model or Redis
// - Sends OTP via Twilio SMS or email service

// POST /api/auth/verify-otp
// - Accepts { phone/email, otp }
// - Verifies OTP against stored value
// - If valid → find/create user → return JWT token
// - If invalid → return 401
```

**Create `backend/src/models/OTP.js`:**
```js
const otpSchema = new mongoose.Schema({
  phone: String,
  email: String,
  otp: String,
  expiresAt: { type: Date, index: { expires: 0 } }, // Auto-delete
  createdAt: { type: Date, default: Date.now }
});
```

**Add routes in `backend/src/routes/auth.js`:**
```js
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
```

#### 3. Frontend Changes

**Create `Frontend/src/pages/OTPLogin.jsx`:**
- Step 1: Phone number input → "Send OTP" button
- Step 2: 6-digit OTP input with auto-focus between digits
- Step 3: On verify → store token → redirect to dashboard

**Update `Frontend/src/services/authService.js`:**
```js
sendOTP: async (phone) => api.post('/auth/send-otp', { phone }),
verifyOTP: async (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
```

**Update `Frontend/src/routes/AppRoutes.jsx`:**
```jsx
<Route path="/otp-login" element={<OTPLogin />} />
```

#### 4. Add "Login with OTP" Button
In `Login.jsx`, add a link below the login form:
```jsx
<Link to="/otp-login">Login with OTP instead</Link>
```

#### 5. Environment Variables
```env
# backend/.env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### 6. Security Considerations
- Rate limit OTP requests (max 3 per 10 minutes per phone)
- OTP expires after 5 minutes
- Hash OTP before storing (like passwords)
- Block after 5 failed verification attempts

---

## 📄 License

MIT License — feel free to use this project for learning and development.

---

**Built with ❤️ by Utkarsh Kumar Singh**
