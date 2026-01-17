import mongoose from "mongoose";

export const IMAGE_CATEGORIES = [
  "home_announcement",
  "home_memories", 
  "event_memories"    // new event-specific
];

const ImageSchema = new mongoose.Schema(
  {
    /* Which event this belongs to (null for home images) */
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      index: true,
      default: null
    },

    url: { type: String, required: true },
    public_id: { type: String, required: true },

    category: { type: String, enum: IMAGE_CATEGORIES, required: true },
  },
  { timestamps: true }
);

/* Fast gallery loading */
ImageSchema.index({ event: 1, category: 1 });
const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);
export default Image;
