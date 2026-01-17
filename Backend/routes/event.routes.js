import { Router } from "express";
import multer from "multer";

// 1. Import from PUBLIC controller
import {
  getEvents,
  getEventBySlug,
  getEventFlow,
  getEventMemories
} from "../controllers/events/publicEventController.js";

// 2. Import from REGISTRATION controller 
// FIX: Added 'getMyAllRegistrations' to this list 👇
import {
  registerEvent,
  getMyRegistration,
  getMyAllRegistrations
} from "../controllers/registration/eventController.js";

import requireUser from "../middleware/requireUser.js";
import eventLock from "../middleware/eventLock.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ===========================================
   1. USER DASHBOARD ROUTES (My Registrations)
   Must be BEFORE generic /:slug routes
   =========================================== */
router.get("/registrations/mine", requireUser, getMyAllRegistrations);

/* ===========================================
   2. PUBLIC EVENT ROUTES
   =========================================== */
router.get("/ongoing", getEvents);
router.get("/:slug/flow", getEventFlow);
router.get("/:slug/memories", getEventMemories);

/* ===========================================
   3. SINGLE EVENT DETAILS
   =========================================== */
router.get("/:slug", getEventBySlug);

/* ===========================================
   4. REGISTRATION ACTIONS
   =========================================== */
router.post(
  "/:eventSlug/register",
  requireUser,
  eventLock,
  upload.single("receipt"),
  registerEvent
);

router.get(
  "/:eventSlug/me",
  requireUser,
  eventLock,
  getMyRegistration
);

export default router;