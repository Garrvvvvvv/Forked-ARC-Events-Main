import jwt from "jsonwebtoken";
import Controller from "../models/Controller.js";

export default async function requireController(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Login required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const controller = await Controller.findById(payload.id);

    if (!controller || !controller.active) {
      return res.status(403).json({ message: "Not authorized" });
    }

    req.controller = controller;
    req.approvedEvents = controller.approvedEvents.map(e => e.toString());

    next();
  } catch {
    res.status(401).json({ message: "Invalid session" });
  }
}
