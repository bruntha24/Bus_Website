import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  bus: {
    name: String,
    from: String,
    to: String,
    departureTime: String,
  },
  date: String,
  seats: [String],
  totalPrice: Number,
  status: { 
    type: String, 
    enum: ["confirmed", "cancelled"], 
    default: "confirmed" 
  },
  passengers: [{
    name: String,
    gender: String,
  }],
  bookedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", BookingSchema);