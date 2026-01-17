import Registration from "../../models/Registration.js";
import Event from "../../models/Event.js";
import cloudinary from "../../config/cloudinary.js";
import stream from "stream";

/**
 * Handle new event registration
 * - Verifies user hasn't already registered for this event
 * - Stores user details and receipt metadata
 */
export const registerEvent = async (req, res) => {
  try {
    const { event } = req; // Provided by eventLock middleware
    // 1. Extract Authenticated User Info (Fixed: Use req.user)
    const { sub: oauthUid, email: oauthEmail } = req.user;

    const { name, batch, mobile, amount } = req.body;

    // 2. Parse familyMembers (Fixed: Handle JSON string from FormData)
    let familyMembers = [];
    if (req.body.familyMembers) {
      try {
        familyMembers = typeof req.body.familyMembers === "string"
          ? JSON.parse(req.body.familyMembers)
          : req.body.familyMembers;
      } catch (e) {
        console.warn("Failed to parse familyMembers", e);
        familyMembers = [];
      }
    }

    // 3. Zero-Duplication Check
    const existing = await Registration.findOne({
      event: event._id,
      oauthUid: oauthUid
    });

    if (existing) {
      return res.status(409).json({ message: "You are already registered for this event." });
    }

    // 4. Handle Receipt Upload (Fixed: Upload buffer to Cloudinary)
    let receiptUrl = null;
    if (req.file) {
      receiptUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "event_receipts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.Readable.from(req.file.buffer).pipe(uploadStream);
      });
    }

    // 5. Create Registration Record
    const newRegistration = new Registration({
      event: event._id,
      oauthUid,
      oauthEmail,
      name,
      batch,
      contact: mobile,
      familyMembers, // Now definitely an array/object
      amount,
      receiptUrl,    // Now a proper string URL
      status: "PENDING"
    });

    await newRegistration.save();
    res.status(201).json({ message: "Registration submitted for approval", id: newRegistration._id });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal server error during registration", error: error.message });
  }
};

/**
 * Fetch a specific user's registration status for an event
 */
export const getMyRegistration = async (req, res) => {
  try {
    const { event } = req;
    // user is guaranteed by requireUser middleware
    const { sub: oauthUid } = req.user;

    const reg = await Registration.findOne({ event: event._id, oauthUid })
      .select("-receipt.data"); // Exclude heavy image data for status checks

    if (!reg) return res.status(404).json({ message: "Registration not found" });

    res.status(200).json(reg);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch registration status" });
  }
};

/* ----------------------------------------------------
   GET ALL MY REGISTRATIONS
   Route: GET /api/events/registrations/mine
---------------------------------------------------- */
export async function getMyAllRegistrations(req, res) {
  try {
    // req.user is set by your 'requireUser' middleware
    const { email, sub: oauthUid } = req.user;

    // Find registrations matching EITHER the oauthUid OR the email
    // Populate 'event' to get the event name and slug
    const registrations = await Registration.find({
      $or: [
        { oauthUid: oauthUid },
        { email: email }
      ]
    })
      .populate("event", "name slug") // Only get name and slug of the event
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    console.error("Fetch User Registrations Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}