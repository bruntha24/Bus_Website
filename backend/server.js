import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Routes Imports
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

// ✅ CORS Configuration (IMPORTANT)
const allowedOrigins = [
  "http://localhost:5173",   // Vite (local)
  "http://localhost:3000",   // CRA (local)
  process.env.FRONTEND_URL   // Deployed frontend (Netlify)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed ❌"));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.error("MongoDB Connection Error ❌:", err));

// Routes
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ Test Route (for checking deployment)
app.get("/", (req, res) => {
  res.send("Bus Booking API is running 🚀");
});

// ✅ Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});