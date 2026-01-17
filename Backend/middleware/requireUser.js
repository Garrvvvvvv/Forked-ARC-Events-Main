import jwt from "jsonwebtoken";

export default function requireUser(req, res, next) {
  try {
    let user = null;

    // 1. Try Bearer token (Google or custom JWT)
    const auth = req.headers.authorization || "";
    if (auth.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
        user = {
          sub: decoded.sub || decoded.uid || decoded.id,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        };
      } catch {
        // ignore and try headers
      }
    }

    // 2. Fallback to headers sent by frontend
    if (!user) {
      const uid = req.headers["x-oauth-uid"];
      const email = req.headers["x-oauth-email"];
      if (uid || email) {
        user = { sub: uid, email };
      }
    }

    if (!user || !user.sub) {
      return res.status(401).json({ message: "Login required" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid user session" });
  }
}
