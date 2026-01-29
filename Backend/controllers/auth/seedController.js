import Controller from "../../models/Controller.js";
import Event from "../../models/Event.js";
import Registration from "../../models/Registration.js";
import bcrypt from "bcryptjs";

export const seedDashboard = async (req, res) => {
    try {
        // 1. Create Event
        const eventSlug = "test-event-" + Date.now();
        const event = await Event.create({
            name: "Test Event " + new Date().toISOString().split('T')[0],
            slug: eventSlug,
            date: new Date(),
            description: "A seeded event for testing controller dashboard."
        });

        // 2. Create Controller
        const username = "controller@test.com";
        const password = "password123";

        // Check if exists
        let controller = await Controller.findOne({ username });
        if (!controller) {
            controller = await Controller.create({
                username,
                password: password, // Will be hashed by hook? No, hook runs on save/create if instance?
                // Mongoose .create triggers save middleware? YES.
                approvedEvents: [event._id],
                active: true // Auto-approve
            });
        } else {
            // Update existing
            if (!controller.approvedEvents.includes(event._id)) {
                controller.approvedEvents.push(event._id);
                await controller.save();
            }
        }

        // 3. Create Registrations
        await Registration.create([
            { event: event._id, name: "Alice Seed", status: "APPROVED", oauthUid: "seed1", oauthEmail: "seed1@test.com" },
            { event: event._id, name: "Bob Seed", status: "PENDING", oauthUid: "seed2", oauthEmail: "seed2@test.com" },
            { event: event._id, name: "Charlie Seed", status: "REJECTED", oauthUid: "seed3", oauthEmail: "seed3@test.com" }
        ]);

        res.json({
            message: "Seeded successfully",
            credentials: { username, password },
            event: event.name
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Seed failed", error: error.message });
    }
};
