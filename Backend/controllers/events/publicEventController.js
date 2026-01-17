import Event from "../../models/Event.js";

/* ----------------------------------------------------
   1. GET ALL "LIVE" EVENTS (Public Directory)
   - Used for Home Page / Event Directory
   - Filters out DRAFT, PAUSED, CLOSED, HIDDEN, DELETED
---------------------------------------------------- */
export async function getEvents(req, res) {
  try {
    const events = await Event.find({
      status: "LIVE",
      isHidden: false,
      isDeleted: false,
    })
      .select("name slug posterUrl status paid description") // Lightweight selection
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    console.error("getEvents Error:", err);
    res.status(500).json({ message: "Failed to load events" });
  }
}

/* ----------------------------------------------------
   2. GET SINGLE EVENT BY SLUG (Full Details)
   - Used for Registration Page logic
---------------------------------------------------- */
export async function getEventBySlug(req, res) {
  try {
    const { slug } = req.params;
    const event = await Event.findOne({ slug, isDeleted: false });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // Hide sensitive fields if needed (none strictly sensitive here yet)
    res.json(event);
  } catch (err) {
    console.error("getEventBySlug Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ----------------------------------------------------
   3. GET EVENT FLOW (Timeline Only) - NEW FUNCTION
   - Used for the Timeline/Flow Page
---------------------------------------------------- */
export async function getEventFlow(req, res) {
  try {
    const { slug } = req.params;

    // Find event by slug, return ONLY name and flow array
    const event = await Event.findOne({ slug, isDeleted: false })
      .select("name flow");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Get Flow Error:", err);
    res.status(500).json({ message: "Server error fetching flow" });
  }
}

/* ----------------------------------------------------
   4. GET EVENT MEMORIES (Gallery)
   - Used for the Public Gallery Page
---------------------------------------------------- */
export async function getEventMemories(req, res) {
  try {
    const { slug } = req.params;
    const event = await Event.findOne({ slug, isDeleted: false }).select("gallery");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event.gallery || []);
  } catch (err) {
    console.error("Get Memories Error:", err);
    res.status(500).json({ message: "Server error fetching memories" });
  }
}