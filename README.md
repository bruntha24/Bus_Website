# 🚌 Bus Booking System

A full-stack Bus Booking Web Application built using **React (Frontend)** and **Node.js, Express, MongoDB (Backend)**.  
Users can search routes, select travel dates, view buses, and book seats seamlessly.

---

## 🚀 Features

### 🎯 User Features
- Search buses by **From**, **To**, and **Date**
- View **popular routes** for quick booking
- Select and copy **discount offers**
- Interactive **date picker**
- Clean and responsive UI with modern design
- Smooth navigation using React Router

### 🛠️ Backend Features
- RESTful APIs using **Express.js**
- **MongoDB** database with Mongoose
- Secure **CORS configuration**
- Routes for:
  - Bus management
  - Booking system
- Environment-based configuration using `.env`

---

## 🧱 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- shadcn/ui components
- React Router
- Lucide Icons
- date-fns

### Backend
- Node.js
- Express.js
- MongoDB atlas  + Mongoose
- CORS
- dotenv

---

## 📁 Project Structure


project-root/
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── assets/
│ │ └── lib/
│ │
│ └── package.json
│
├── backend/
│ ├── routes/
│ │ ├── busRoutes.js
│ │ └── bookingRoutes.js
│ │
│ ├── models/
│ ├── server.js
│ └── .env
│
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/bus-booking-system.git
cd bus-booking-system
2️⃣ Backend Setup
cd backend
npm install
Create .env file:
MONGO_URI=your_mongodb_connection_string
PORT=5000
Run backend:
npm run dev

Server runs on:

http://localhost:5000
3️⃣ Frontend Setup
cd frontend
npm install
Run frontend:
npm run dev

App runs on:

http://localhost:5173
🔗 API Endpoints
🚌 Bus Routes
GET /api/buses → Get available buses
🎫 Booking Routes
POST /api/bookings → Create a booking
GET /api/bookings → Get all bookings
🌍 Deployment
Frontend deployed on: Netlify
Backend deployed on: Render / Railway / AWS
MongoDB hosted on: MongoDB Atlas
🔒 CORS Configuration

Allowed origins:

http://localhost:5173
http://localhost:3000
https://jovial-zuccutto-64310f.netlify.app
📸 UI Highlights
Hero section with background image
Search card with:
From / To city dropdown
Date picker
Search button
Popular routes section
Offers & discount section
Responsive design for all devices
✨ Future Enhancements
Seat selection UI
Payment gateway integration
User authentication (Login/Signup)
Booking history
Admin dashboard
