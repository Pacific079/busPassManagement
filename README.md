#  Online Bus Pass Management System (MERN Stack)

A full-stack web application for managing bus passes digitally — built with MongoDB, Express.js, React, and Node.js.

---

##  Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Setup Backend

```bash
cd server
cp .env.example .env        # Fill in your MongoDB URI and secrets
npm install
npm run seed                # Create admin/user + categories/routes
npm run dev                 # Starts on http://localhost:5000
```

### 2. Setup Frontend

```bash
cd client
npm install
npm start                   # Starts on http://localhost:3000
```

---

##  Demo Login

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@safarpass.com    | Admin@123  |
| User  | user@safarpass.com     | User@123   |

---

##  Project Structure

```
bus-pass-system/
├── server/                     # Node.js + Express backend
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Auth, upload, errors
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── services/               # QR, email, payment
│   ├── utils/                  # Helpers & seed script
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
│
└── client/                     # React frontend
    └── src/
        ├── api/                # Axios API calls
        ├── components/         # Reusable UI components
        ├── context/            # AuthContext
        ├── pages/
        │   ├── public/         # Login, Register
        │   ├── user/           # Dashboard, Apply, My Passes, Profile
        │   └── admin/          # Dashboard, Applications, Routes, Categories
        └── index.css           # Global styles
```

---

##  Features

### User Module
-  Register & Login (JWT auth)
-  Apply for bus pass (multi-step form)
-  Upload required documents
-  Track application status (Pending / Approved / Rejected)
-  View digital pass with QR code
-  Renew existing pass
-  Online payment (mock)
-  Profile management

### Admin Module
-  Admin dashboard with stats & charts
-  Review, approve, reject applications
-  Email notifications on approval/rejection
-  Manage routes (CRUD)
-  Manage pass categories (CRUD)
-  Payment records
-  User management

### Verification
-  QR code auto-generated on approval
-  Public API: `GET /api/pass/verify/:passNumber`

---

##  Security
- JWT authentication + role-based authorization
- bcrypt password hashing (rounds: 12)
- Helmet.js HTTP security headers
- Rate limiting (express-rate-limit)
- Multer file type & size validation
- Environment variables for all secrets

---

##  API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET  | /api/auth/me | Auth |
| POST | /api/pass/apply | User |
| GET  | /api/pass/my-passes | User |
| POST | /api/pass/:id/renew | User |
| GET  | /api/pass/verify/:passNumber | Public |
| GET  | /api/admin/dashboard | Admin |
| GET  | /api/admin/applications | Admin |
| PUT  | /api/admin/applications/:id/approve | Admin |
| PUT  | /api/admin/applications/:id/reject | Admin |
| CRUD | /api/admin/routes/* | Admin |
| CRUD | /api/admin/categories/* | Admin |
| GET  | /api/admin/payments | Admin |

---

##  Tech Stack

**Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Multer, QRCode, Nodemailer  
**Frontend**: React 18, React Router v6, Axios, React Toastify, React QR Code, Recharts  
**Security**: Helmet, CORS, Rate Limiting, dotenv
