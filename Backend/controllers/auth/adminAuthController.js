import Admin from "../../models/Admin.js";
import jwt from "jsonwebtoken";

export async function seedAdmin(req, res) {
  const { username, password } = req.body;
  const exists = await Admin.findOne({ username });
  if (exists) return res.status(400).json({ message: "Admin exists" });

  const admin = await Admin.create({ username, password });
  res.json({ message: "Admin created", id: admin._id });
}

export async function login(req, res) {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: admin._id,
      role: "ADMIN",
    },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    token,
    admin: { id: admin._id, username: admin.username },
  });
}

export function logout(req, res) {
  res.json({ ok: true });
}
