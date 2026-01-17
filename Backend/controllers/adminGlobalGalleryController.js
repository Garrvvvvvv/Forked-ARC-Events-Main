import Image from "../models/Image.js";
import cloudinary from "../config/cloudinary.js";
import stream from "stream";

/* ----------------------------------------------------
   GET IMAGES (Filtered by Category)
   Route: GET /api/admin/images?category=...
---------------------------------------------------- */
export const getImages = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = {};

        if (category) filter.category = category;

        // Explicitly exclude event-specific images unless requested (or just filter by null event?)
        // The model has default event: null for home images.
        // If category is provided, trust it.

        const images = await Image.find(filter).sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        console.error("Get Images Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ----------------------------------------------------
   UPLOAD IMAGE
   Route: POST /api/admin/images/upload
---------------------------------------------------- */
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No image provided" });
        const { category } = req.body;

        if (!category) return res.status(400).json({ message: "Category is required" });

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "home_gallery" }, // Different folder for home images
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result); // Return full result for public_id
                }
            );
            stream.Readable.from(req.file.buffer).pipe(uploadStream);
        });

        // Create Image Record
        const newImage = await Image.create({
            url: result.secure_url,
            public_id: result.public_id,
            category,
            event: null // strictly global
        });

        res.status(201).json(newImage);
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Upload failed" });
    }
};

/* ----------------------------------------------------
   DELETE IMAGE
   Route: DELETE /api/admin/images/:id
---------------------------------------------------- */
export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findById(id);

        if (!image) return res.status(404).json({ message: "Image not found" });

        // Delete from Cloudinary (Best practice)
        if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
        }

        await image.deleteOne();
        res.json({ message: "Image deleted" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Delete failed" });
    }
};
