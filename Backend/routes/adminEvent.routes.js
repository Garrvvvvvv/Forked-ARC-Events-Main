import { Router } from "express";
import multer from "multer";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} from "../controllers/events/adminEventController.js";
import { uploadPoster, uploadQR } from "../controllers/events/adminUploadController.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

// Configure Multer for RAM storage (Critical for Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/* --- CRUD Routes --- */
router.get("/", requireAdmin, getEvents);
router.post("/", requireAdmin, createEvent);
router.patch("/:id", requireAdmin, updateEvent);
router.delete("/:id", requireAdmin, deleteEvent);

import {
  getPhotos,
  uploadPhoto,
  deletePhoto
} from "../controllers/events/adminGalleryController.js";

/* --- Upload Routes --- */
router.post("/:id/poster", requireAdmin, upload.single("image"), uploadPoster);
router.post("/:id/qr", requireAdmin, upload.single("image"), uploadQR);

/* --- Gallery Routes --- */
router.get("/:id/photos", requireAdmin, getPhotos);
router.post("/:id/photos", requireAdmin, upload.single("image"), uploadPhoto);
router.delete("/:id/photos/:photoId", requireAdmin, deletePhoto);

export default router;