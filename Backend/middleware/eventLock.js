import Event from "../models/Event.js";

export default async function eventLock(req, res, next) {
  try {
    const { eventSlug } = req.params;
    // Find the event based on the unique slug in the URL
    const event = await Event.findOne({ slug: eventSlug, isDeleted: false });

    if (!event) return res.status(404).json({ message: "Invalid event link" });

    // Attach to request so following controllers can use req.event._id
    req.event = event;
    next();
  } catch (error) {
    res.status(500).json({ message: "Event scoping failed" });
  }
}