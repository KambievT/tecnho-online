import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

export interface AuthRequest extends Request {
  adminId?: number;
}

export function authRequired(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Требуется авторизация" });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    req.adminId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: "Невалидный токен" });
  }
}
