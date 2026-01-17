import express from "express";
import requireAdmin from "../middleware/requireAdmin.js";
import Controller from "../models/Controller.js";

const router = express.Router();

/* ----------------------------------------------------
   GET /api/admin/controllers
   Returns ACTIVE controllers
---------------------------------------------------- */
router.get("/", requireAdmin, async (req, res) => {
  try {
    const controllers = await Controller.find({ active: true })
      .populate("approvedEvents", "name date slug");
    res.json(controllers);
  } catch (e) { res.status(500).json({ message: "Error fetching active controllers" }); }
});

/* ----------------------------------------------------
   GET /api/admin/controllers/pending
   Returns INACTIVE controllers
---------------------------------------------------- */
router.get("/pending", requireAdmin, async (req, res) => {
  try {
    const controllers = await Controller.find({ active: false })
      .populate("requestedEvents", "name date")
      .sort({ createdAt: -1 });
    res.json(controllers);
  } catch (e) { res.status(500).json({ message: "Error fetching pending controllers" }); }
});

/* ----------------------------------------------------
   POST /api/admin/controllers/:id/approve
   Body: { events: [eventId1, eventId2] }
---------------------------------------------------- */
router.post("/:id/approve", requireAdmin, async (req, res) => {
  const { events } = req.body; // Array of event IDs

  const ctrl = await Controller.findById(req.params.id);
  if (!ctrl) return res.status(404).json({ message: "Controller not found" });

  // Update Approved Events
  // Merge existing? Or overwrite? Frontend implies "Assign". 
  // Let's overwrite active list with new selection or merge unique.
  // Ideally, if approving for first time, overwrite.

  if (events && Array.isArray(events)) {
    if (req.body.replace) {
      // REPLACEMENT MODE (For editing active controllers)
      ctrl.approvedEvents = events;
    } else {
      // MERGE MODE (For initial approval)
      const newSet = new Set([
        ...ctrl.approvedEvents.map(e => e.toString()),
        ...events
      ]);
      ctrl.approvedEvents = Array.from(newSet);
    }
  }

  ctrl.active = true; // Activate account
  ctrl.approvedByAdmin = req.admin ? req.admin._id : null;

  await ctrl.save();
  res.json(ctrl);
});

/* ----------------------------------------------------
   POST /api/admin/controllers/:id/revoke
   Deactivate or remove events
---------------------------------------------------- */
router.post("/:id/revoke", requireAdmin, async (req, res) => {
  const ctrl = await Controller.findById(req.params.id);
  if (!ctrl) return res.status(404).json({ message: "Controller not found" });

  ctrl.active = false;
  ctrl.approvedEvents = [];
  await ctrl.save();
  res.json({ message: "Revoked access" });
});

export default router;
