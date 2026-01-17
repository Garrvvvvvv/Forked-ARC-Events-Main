import { Router } from "express";
import { signup, login, logout } from "../controllers/auth/controllerAuthController.js";
import { seedDashboard } from "../controllers/auth/seedController.js";

const router = Router();

router.post("/seed-dashboard", seedDashboard); // Dev tool
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
