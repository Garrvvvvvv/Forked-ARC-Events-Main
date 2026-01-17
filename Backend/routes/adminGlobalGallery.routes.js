import { Router } from "express";
import multer from "multer";
import requireAdmin from "../middleware/requireAdmin.js";
import {
    getImages,
    uploadImage,
    deleteImage
} from "../controllers/adminGlobalGalleryController.js";

const router = Router();

// Configure Multer for RAM storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/* ----------------------------------------------------
   GLOBAL GALLERY ROUTES
   Matched at /api/admin/images
---------------------------------------------------- */
router.get("/", requireAdmin, getImages);
router.post("/upload", requireAdmin, upload.single("image"), uploadImage);
router.delete("/:id", requireAdmin, deleteImage);

export default router;
