import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

export async function login(req: Request, res: Response): Promise<void> {
  const { login, password } = req.body;
  if (!login || !password) {
    res.status(400).json({ error: "Логин и пароль обязательны" });
    return;
  }

  const admin = await prisma.admin.findUnique({ where: { login } });
  if (!admin) {
    res.status(401).json({ error: "Неверный логин или пароль" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    res.status(401).json({ error: "Неверный логин или пароль" });
    return;
  }

  const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
}

export async function me(req: Request, res: Response): Promise<void> {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: "Не авторизован" });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: { id: true, login: true, createdAt: true },
    });
    if (!admin) {
      res.status(401).json({ error: "Админ не найден" });
      return;
    }
    res.json(admin);
  } catch {
    res.status(401).json({ error: "Невалидный токен" });
  }
}

/** Seed-утилита — создаёт админа, если ещё нет */
export async function seedAdmin(): Promise<void> {
  const count = await prisma.admin.count();
  if (count === 0) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin", 10);
    await prisma.admin.create({ data: { login: "admin", password: hash } });
    console.log("✅ Создан админ по умолчанию (login: admin)");
  }
}
