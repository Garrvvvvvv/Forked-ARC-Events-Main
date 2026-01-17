import { Router } from "express";
import Image from "../models/Image.js";

const router = Router();

// PUBLIC route to get home page images (no auth required)
router.get("/public/home-images", async (req, res) => {
    try {
        const { category } = req.query;

        console.log("📸 Public images request - Category:", category);

        if (!category) {
            console.log("❌ No category provided");
            return res.status(400).json({ message: "Category is required" });
        }

        const images = await Image.find({ category }).sort({ createdAt: -1 });
        console.log(`✅ Found ${images.length} images for category: ${category}`);

        res.json(images);
    } catch (err) {
        console.error("❌ Error fetching public home images:", err);
        res.status(500).json({ message: "Failed to load images", error: err.message });
    }
});

export default router;
