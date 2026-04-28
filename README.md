# 🗝️ Rentify: The All-in-One Rental Ecosystem

**Rentify** is a premium, full-stack property management platform designed with a **"Trust First"** philosophy. It bridges the gap between Owners, Tenants, Service Providers, and Inspectors through a seamless, automated, and highly secure digital environment.

![Main Hero Banner](./screenshots/hero.png)

---

## 🚀 Core Pillars

### 1. Multi-Auth Secure Gateway
Rentify provides four distinct ways to access the platform, ensuring maximum flexibility and security:
*   **Traditional**: Email & Password with Bcrypt encryption.
*   **Social**: One-click Google Authentication.
*   **Seamless**: Email OTP (One-Time Password) powered by Nodemailer.
*   **Mobile-First**: **Firebase Phone OTP** with a custom backend-driven global limit of **330 SMS per day** to manage API costs effectively.

### 2. The Multi-Role Persona Engine
The platform automatically detects and routes users to specialized dashboards based on their role:
*   **🏠 Owner**: Portfolio management, financial analytics, and lease tracking.
*   **🔑 Tenant**: Property discovery, instant rent payments, and maintenance requests.
*   **🛠️ Service Provider**: Maintenance dispatch hub with real-time job notifications.
*   **🔍 Inspector**: Digital audit vault for professional property walkthroughs and PDF reporting.
*   **🛡️ Admin**: Global oversight, security monitoring, and ecosystem governance.

### 3. Automated WhatsApp Concierge
Built with `whatsapp-web.js`, Rentify features a server-side bot that triggers **Role-Specific Welcome Messages** the moment a user joins. 
*   Uses your own phone number (via QR scan).
*   No Facebook/Meta account required.
*   Automated outreach for onboarding and support.

---

## 🎨 Design Aesthetic
*   **Premium Dark Mode**: A sleek `slate-900` and `blue-600` palette designed for high-end professional use.
*   **Dynamic Animations**: Powered by **Framer Motion** for smooth, fluid transitions.
*   **Responsive**: Pixel-perfect experience across Desktop, Tablet, and Mobile.

---

## 🛠️ Tech Stack

**Frontend:**
*   React.js (Vite)
*   Redux Toolkit (State Management)
*   Tailwind CSS (Styling)
*   Socket.io-client (Real-time events)
*   Firebase SDK (Phone Auth)

**Backend:**
*   Node.js & Express
*   MongoDB (Mongoose)
*   Socket.io (Real-time notification engine)
*   Nodemailer (Email OTP)
*   WhatsApp-Web.js (Automation Bot)

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/rentify.git
cd rentify
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
CLIENT_URL=http://localhost:5173
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```
Create a `.env` file in the `Frontend` folder:
```env
VITE_API_URL=http://localhost:5001/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... (other firebase keys)
```
Run the app:
```bash
npm run dev
```

---

## 📸 UI Gallery
*(Add your screenshots here)*

#### Master Landing Page
![Landing Page](./screenshots/landing.png)

#### Multi-Auth Login
![Login Screen](./screenshots/login.png)

#### Owner Dashboard
![Owner Dashboard](./screenshots/owner.png)

#### Tenant Experience
![Tenant Dashboard](./screenshots/tenant.png)

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for the future of Real Estate.**
