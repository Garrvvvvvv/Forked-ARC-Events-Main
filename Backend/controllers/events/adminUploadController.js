import Event from "../../models/Event.js";
import cloudinary from "../../config/cloudinary.js";

/* ==========================================
   Helper: Buffer to Data URI
   ========================================== */
const uploadToCloudinary = async (file, folderPath) => {
  if (!file || !file.buffer) throw new Error("File buffer is missing");
  
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = "data:" + file.mimetype + ";base64," + b64;

  return await cloudinary.uploader.upload(dataURI, {
    folder: folderPath,
    resource_type: "auto"
  });
};

/* ==========================================
   UPLOAD POSTER
   ========================================== */
export const uploadPoster = async (req, res) => {
  try {
    console.log(`[Upload] Poster Request for ID: ${req.params.id}`);

    if (!req.file) {
      console.error("[Upload] No file received in req.file");
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Fetch Event
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.error("[Upload] Event not found in DB");
      return res.status(404).json({ message: "Event not found" });
    }

    // 2. Upload to Cloudinary
    console.log(`[Upload] Sending to Cloudinary: arc_events/${event.slug}`);
    const result = await uploadToCloudinary(req.file, `arc_events/${event.slug}`);
    console.log("[Upload] Cloudinary Success:", result.secure_url);

    // 3. Save to DB (Using save() to ensure field exists)
    event.posterUrl = result.secure_url;
    const savedEvent = await event.save();
    
    console.log("[Upload] DB Saved. PosterURL:", savedEvent.posterUrl);

    res.json({ posterUrl: savedEvent.posterUrl });
  } catch (err) {
    console.error("[Upload] CRITICAL ERROR:", err);
    res.status(500).json({ message: "Upload failed: " + err.message });
  }
};

/* ==========================================
   UPLOAD QR CODE
   ========================================== */
export const uploadQR = async (req, res) => {
  try {
    console.log(`[Upload] QR Request for ID: ${req.params.id}`);

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Upload
    const result = await uploadToCloudinary(req.file, `arc_events/${event.slug}/qr`);
    console.log("[Upload] Cloudinary Success:", result.secure_url);

    // Save
    event.paymentQRUrl = result.secure_url;
    const savedEvent = await event.save();

    console.log("[Upload] DB Saved. QR URL:", savedEvent.paymentQRUrl);

    res.json({ paymentQRUrl: savedEvent.paymentQRUrl });
  } catch (err) {
    console.error("[Upload] QR Error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};