import Controller from "../../models/Controller.js";
import jwt from "jsonwebtoken";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const existing = await Controller.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const controller = await Controller.create({
      username,
      password,
      active: false, // Requires Admin Approval
      requestedEvents: req.body.requestedEvent ? [req.body.requestedEvent] : []
    });

    res.status(201).json({ message: "Account created! Ask an admin to approve you." });
  } catch (error) {
    console.error("Controller Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const controller = await Controller.findOne({ username });

    if (!controller || !(await controller.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!controller.active) {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    const token = jwt.sign(
      { id: controller._id, role: "CONTROLLER" },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.json({ token, username: controller.username });
  } catch (error) {
    console.error("Controller Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT (Client-side mainly, but provided for consistency)
export const logout = (req, res) => {
  res.json({ message: "Logged out" });
};
