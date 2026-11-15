import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Silakan login untuk melanjutkan." });
  }

  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET belum dikonfigurasi.");
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Token tidak valid atau sudah kedaluwarsa." });
  }
}
