import { Router } from "express";
import requireController from "../middleware/requireController.js";
import Registration from "../models/Registration.js";

const router = Router();

// Helper to get event stats
async function getEventStats(eventId) {
  const [registrations, approved, rejected] = await Promise.all([
    Registration.countDocuments({ event: eventId }),
    Registration.countDocuments({ event: eventId, status: "APPROVED" }),
    Registration.countDocuments({ event: eventId, status: "REJECTED" })
  ]);
  return { registrations, approved, rejected, roomsUsed: 0 }; // rooms removed
}

// Get all events for this controller with stats
router.get("/events", requireController, async (req, res) => {
  try {
    const events = req.controller.approvedEvents;
    // Let's fetch full event details
    // Note: If connection is flaky, populate might fail
    const populatedController = await req.controller.populate("approvedEvents");
    const eventList = populatedController.approvedEvents;

    const results = await Promise.all(eventList.map(async (e) => {
      const stats = await getEventStats(e._id);
      return {
        _id: e._id,
        name: e.name,
        ...stats
      };
    }));

    res.json(results);
  } catch (err) {
    console.error("Controller Dashboard Error:", err);
    res.status(500).json({ message: "Server error loading dashboard" });
  }
});

// Staff only sees registrations for events they are approved for
router.get("/registrations/:eventId", requireController, async (req, res) => {
  try {
    // Note: requireController doesn't set req.approvedEvents explicitly, 
    // it populates req.controller. We must check req.controller.approvedEvents.
    // The previous code used req.approvedEvents which MIGHT be undefined if middleware didn't set it.
    // Middleware in 'requireController.js' usually sets req.controller.

    // Let's verify compatibility. Using req.controller.approvedEvents is safer.
    // assuming we verify if eventId is in the list.

    const isApproved = req.controller.approvedEvents.some(e => e.toString() === req.params.eventId);
    if (!isApproved) {
      return res.status(403).json({ message: "Not authorized for this event" });
    }

    const list = await Registration.find({ event: req.params.eventId });
    res.json({ count: list.length, candidates: list });
  } catch (err) {
    console.error("Registration Load Error:", err);
    res.status(500).json({ message: "Server error loading registrations" });
  }
});

export default router;