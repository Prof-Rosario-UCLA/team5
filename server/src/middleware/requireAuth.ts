import type { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies["_jwt"];
  if (!token) return res.status(401).json({ error: "unauthenticated" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    res.locals.userId = payload.sub;
    console.log("Auth Ok userID:", payload.sub);
    next();
  } catch {
    return res.status(401).json({ error: "token_invalid" });
  }
}
