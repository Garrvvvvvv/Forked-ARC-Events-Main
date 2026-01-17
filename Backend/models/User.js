// User.js            → Google identity


import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    oauthUid: { type: String, required: true, unique: true },
    oauthEmail: { type: String, required: true, lowercase: true },
    name: String,
    photo: String,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
