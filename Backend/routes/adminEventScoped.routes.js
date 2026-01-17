import express from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import Controller from "../models/Controller.js";
import Image from "../models/Image.js";
import requireAdmin from "../middleware/requireAdmin.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });


const router = express.Router();

/* ----------------------------------------------------
   🔐 Event Ownership Guard
---------------------------------------------------- */
async function verifyEventAccess(req, res, next) {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId))
    return res.status(400).json({ message: "Invalid event id" });

  const event = await Event.findById(eventId);
  if (!event || event.isDeleted)
    return res.status(404).json({ message: "Event not found" });

  // Only super admin or event creator can access
  if (
    req.admin.role !== "SUPER_ADMIN" &&
    String(event.createdBy) !== String(req.admin._id)
  ) {
    return res.status(403).json({ message: "Access denied" });
  }

  req.event = event;
  next();
}

/* ----------------------------------------------------
   📊 Event Dashboard
---------------------------------------------------- */
router.get("/events/:eventId/stats", requireAdmin, verifyEventAccess, async (req, res) => {
  const eventId = req.params.eventId;

  const [total, approved, pending, controllers] = await Promise.all([
    Registration.countDocuments({ event: eventId }),
    Registration.countDocuments({ event: eventId, status: "APPROVED" }),
    Registration.countDocuments({ event: eventId, status: "PENDING" }),
    Controller.countDocuments({ approvedEvents: eventId })
  ]);

  res.json({ total, approved, pending, controllers });
});

/* ----------------------------------------------------
   🧾 Registrations
---------------------------------------------------- */
router.get("/events/:eventId/registrations", requireAdmin, verifyEventAccess, async (req, res) => {
  const list = await Registration.find({ event: req.params.eventId })
    .populate('approvedBy', 'username')  // Admin model uses 'username' not 'name'
    .sort({ createdAt: -1 });

  res.json(list);
});

router.put(
  "/events/:eventId/registrations/:id/status",
  requireAdmin,
  verifyEventAccess,
  async (req, res) => {
    const { status } = req.body;

    const reg = await Registration.findOne({
      _id: req.params.id,
      event: req.params.eventId,
    });

    if (!reg) return res.status(404).json({ message: "Registration not found" });

    reg.status = status;

    // Set approvedBy when approving
    if (status === "APPROVED") {
      reg.approvedAt = new Date();
      reg.approvedBy = req.admin.id;  // JWT contains .id not ._id
    }
    // Clear approvedBy when disapproving (changing from APPROVED to PENDING)
    else if (status === "PENDING") {
      reg.approvedAt = null;
      reg.approvedBy = null;
    }
    // Record who rejected
    else if (status === "REJECTED") {
      reg.approvedBy = req.admin.id;  // JWT contains .id not ._id
    }

    await reg.save();
    res.json({ ok: true });
  }
);

/* Rooms removed (room allocation not required) */

/* ----------------------------------------------------
   🖼️ Event Memories
---------------------------------------------------- */
router.get("/events/:eventId/photos", requireAdmin, verifyEventAccess, async (req, res) => {
  const photos = await Image.find({
    event: req.params.eventId,
    category: "event_memories",
  }).sort({ createdAt: -1 });

  res.json(photos);
});

router.post(
  "/events/:eventId/photos",
  requireAdmin,
  verifyEventAccess,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const img = await Image.create({
      event: req.params.eventId,
      url: req.file.path || req.file.secure_url,
      public_id: req.file.filename || req.file.public_id,
      category: "event_memories",
    });

    res.json(img);
  }
);

router.delete(
  "/events/:eventId/photos/:id",
  requireAdmin,
  verifyEventAccess,
  async (req, res) => {
    await Image.deleteOne({
      _id: req.params.id,
      event: req.params.eventId,
    });

    res.json({ ok: true });
  }
);

export default router;
