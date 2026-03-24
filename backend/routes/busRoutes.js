import express from "express";
import Bus from "../models/Bus.js";

const router = express.Router();

/**
 * ✅ GET all buses with optional filters
 * Supports:
 * - /api/buses
 * - /api/buses?from=Chennai
 * - /api/buses?from=Chennai&to=Bangalore
 */
router.get("/", async (req, res) => {
  try {
    let { from, to } = req.query;

    let query = {};

    // ✅ Clean input (remove spaces)
    if (from && from.trim()) {
      query.from = {
        $regex: new RegExp(from.trim(), "i"),
      };
    }

    if (to && to.trim()) {
      query.to = {
        $regex: new RegExp(to.trim(), "i"),
      };
    }

    const buses = await Bus.find(query);

    res.status(200).json(buses);

  } catch (err) {
    console.error("❌ Error fetching buses:", err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * ✅ CREATE bus
 */
router.post("/", async (req, res) => {
  try {
    const newBus = new Bus(req.body);
    await newBus.save();

    res.status(201).json({
      message: "Bus created successfully",
      bus: newBus,
    });

  } catch (err) {
    console.error("❌ Error creating bus:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;