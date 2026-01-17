import mongoose from "mongoose";

const MemorySchema = new mongoose.Schema({
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event", 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  publicId: {
    type: String, // Cloudinary public_id for easier deletion
  },
  caption: { 
    type: String 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Admin" 
  },
  isApproved: {
    type: Boolean,
    default: true // Admin uploads are auto-approved
  }
}, { timestamps: true });

export default mongoose.model("Memory", MemorySchema);