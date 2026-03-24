import express from "express";
import { 
  getAllBookings, 
  createBooking, 
  cancelBooking, 
  deleteBooking 
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", getAllBookings);
router.post("/", createBooking);
router.patch("/:id", cancelBooking);
router.delete("/:id", deleteBooking);

export default router;