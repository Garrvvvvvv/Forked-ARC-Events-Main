import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  oauthUid: { type: String, required: true },
  oauthEmail: { type: String, required: true },
  name: String,
  batch: String,
  contact: String,
  familyMembers: [{ name: String, relation: String }],
  amount: Number,
  receiptUrl: String, // Cloudinary URL
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
}, { timestamps: true });

RegistrationSchema.index({ oauthUid: 1, event: 1 }, { unique: true });
export default mongoose.model("Registration", RegistrationSchema);