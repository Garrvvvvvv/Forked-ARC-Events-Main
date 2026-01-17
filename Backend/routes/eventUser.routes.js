import { Router } from "express";
import multer from "multer";
import Event from "../models/Event.js";
import { registerEvent, getMyRegistration } from "../controllers/registration/eventController.js";
import requireUser from "../middleware/requireUser.js";
import eventLock from "../middleware/eventLock.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/* =========================
   PUBLIC: Ongoing events
========================= */
router.get("/ongoing", async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
      .select("name slug startDate endDate isPaid roomAllocationEnabled")
      .sort({ startDate: 1 });

    res.json(events);
  } catch (err) {
    console.error("fetch ongoing events error:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

/* =========================
   LOCKED EVENT ROUTES
========================= */
router.post(
  "/:eventSlug/register",
  requireUser,
  eventLock,
  upload.single("receipt"),
  registerEvent
);

router.get(
  "/:eventSlug/me",
  requireUser,
  eventLock,
  getMyRegistration
);

export default router;
