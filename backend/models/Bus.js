// models/Bus.js
import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  name: String,
  departureTime: String,
  arrivalTime: String,
  duration: String,
  from: String,
  to: String,
  price: Number,
  availableSeats: Number,
  totalSeats: Number,
  seatType: {
    type: String,
    enum: ["Normal", "Semi-Sleeper", "Sleeper"],
  },
  busType: {
    type: String,
    enum: ["AC", "NON-AC"],
  },
  rating: Number,
  amenities: [String],
});

// ✅ THIS LINE IS THE FIX
const Bus = mongoose.model("Bus", busSchema);

export default Bus;