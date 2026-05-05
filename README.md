# 🗝️ Rentify: The All-in-One Rental Ecosystem

**Rentify** is a premium, full-stack property management platform designed with a **"Trust First"** philosophy. It bridges the gap between Owners, Tenants, Service Providers, and Inspectors through a seamless, automated, and highly secure digital environment.

---

## 🔗 Important Links

* 🌐 [**Backend Deployed LINK**](https://rentify-a40l.onrender.com)
* 🎨 [**Figma Design**](https://www.figma.com/design/yk9uxFudLynjz4L0Q4ulkK/Untitled?node-id=0-1&t=rkQqWQLlO4P2CEll-1)
* 🎬 [**YouTube Demo**](https://youtu.be/QrUMbulqOYY?si=skAYtKHIUBadPcpN)
* 📕 [**Postman API Docs**](https://utkarshkumarsingh491-4142312.postman.co/workspace/Utkarsh-kumar-singh's-Workspace~b4d458b6-c2cd-4910-812d-aa90b1aab5fb/collection/50840985-90d4e4e5-ce3f-4c33-b1a8-01aac960df46?action=share&creator=50840985)

---

## 📸 UI Screenshots

<!-- Add your image URLs in the src="" attributes below -->
<div align="center">
  <img src="" alt="Dashboard" width="48%" />
  <img src="" alt="Listings" width="48%" />
  <br />
  <img src="" alt="Features" width="48%" />
  <img src="" alt="Roles" width="48%" />
</div>

---

## 📌 Project Description
Rentify is a smart full-stack rental management platform inspired by real-world problem statements from Razorpay use cases. It connects Owners, Tenants, Inspectors, Service Providers, and Admins into a single unified system to manage property listings, payments, inspections, and maintenance efficiently.

---

## ❗ Problem Statement
Traditional rental systems are fragmented and inefficient:

- Property owners struggle to manage listings and rent tracking  
- Renters face issues with secure payments and maintenance delays  
- Inspection processes are manual and unorganized  
- Service providers lack structured workflows  
- No centralized system connects all stakeholders  

This leads to delays, poor communication, and lack of transparency.

---

## ✅ Solution
Rentify provides a centralized and role-based platform that:

- Connects all stakeholders in one system  
- Automates workflows between users  
- Enables real-time notifications  
- Provides secure and scalable architecture  
- Improves transparency and efficiency in rental management  

---

## ✨ Features

### 🔐 Authentication
- Email/Password Login  
- Google OAuth  
- Email OTP  
- Firebase Phone Authentication  
- Rate Limiting System  

### 🏠 Owner Dashboard
- Property listing and management  
- Lease tracking  
- Financial insights  

### 🏘️ Tenant Dashboard
- Property search  
- Rent payments  
- Maintenance requests  

### 🔍 Inspector Module
- Property audits  
- Inspection reports  
- Compliance tracking  

### 🛠️ Service Provider
- Work order management  
- Task tracking  
- Status updates  

### 🛡️ Admin Panel
- User management  
- Inspector assignment  
- System monitoring  

### 📡 Real-Time System
- Socket.io notifications  
- Live updates  

### 🤖 Automation
- WhatsApp Bot integration  
- Role-based automated messaging  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- Redux Toolkit  
- Tailwind CSS  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB  

### Tools & Services
- Socket.io  
- Firebase Auth  
- Nodemailer  
- WhatsApp-web.js  

---

## 🚀 Installation & Developer Guide

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas Account
*   Firebase Project (for Phone Auth)
*   Gmail Account (for Email OTP)

### Backend Configuration (`backend/.env`)
```env
PORT=5001
MONGODB_URI=your_uri
JWT_SECRET=your_secret
GMAIL_USER=your_email
GMAIL_APP_PASSWORD=your_app_password
FIREBASE_PROJECT_ID=...
```

### Frontend Configuration (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api

```

---

### 🧪 Database Seeding
To populate the database with the test accounts and sample properties, run the following command in the `backend` directory:
```bash
npm run seed
```

---

## 🧪 Testing the WhatsApp Bot
1.  Start the backend: `npm run dev`.
2.  Look for the **QR Code** in your terminal.
3.  Scan it with your phone (**WhatsApp > Linked Devices**).
4.  The terminal will log `✅ Rentify Bot Ready`.
5.  Sign up as a new user to receive your first automated message!

---

**Built with ❤️ by Utkarsh Kumar Singh for the future of Real Estate.**
