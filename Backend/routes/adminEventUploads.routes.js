import { Router } from "express";
import multer from "multer";
import { uploadPoster, uploadQR } from "../controllers/events/adminUploadController.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

// Store file in RAM (MemoryStorage) so we can convert it to Data URI
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Matches: /api/admin/events/:id/poster
router.post("/:id/poster", requireAdmin, upload.single("image"), uploadPoster);

// Matches: /api/admin/events/:id/qr
router.post("/:id/qr", requireAdmin, upload.single("image"), uploadQR);

export default router;