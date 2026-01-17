import Event from "../../models/Event.js";

/* ----------------------------------------------------
   1. CREATE EVENT
---------------------------------------------------- */
export async function createEvent(req, res) {
  try {
    const { name, slug } = req.body;

    // Check duplicate slug
    const existing = await Event.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Slug already exists!" });
    }

    const event = await Event.create({
      ...req.body,
      status: req.body.status || "DRAFT",
      createdBy: req.admin._id,
      isDeleted: false
    });

    res.status(201).json(event);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: "Slug taken" });
    console.error(error);
    res.status(500).json({ message: "Creation failed" });
  }
}

/* ----------------------------------------------------
   2. GET ALL EVENTS (No filters)
---------------------------------------------------- */
export async function getEvents(req, res) {
  try {
    // Return everything so admin sees all
    const events = await Event.find({}).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("getEvents Error:", err);
    res.status(500).json({ message: "Failed to load events" });
  }
}

/* ----------------------------------------------------
   3. UPDATE EVENT
---------------------------------------------------- */
export async function updateEvent(req, res) {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
}

/* ----------------------------------------------------
   4. HARD DELETE EVENT (Permanently Remove)
---------------------------------------------------- */
export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    
    // Physically delete the document from MongoDB
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event permanently deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
}