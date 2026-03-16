import { Request, Response } from "express";
import prisma from "../config/prisma";

// ——— PUBLIC ———

export async function getAll(_req: Request, res: Response): Promise<void> {
  const addresses = await prisma.address.findMany({ orderBy: { id: "asc" } });
  res.json(addresses);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) {
    res.status(404).json({ error: "Адрес не найден" });
    return;
  }
  res.json(address);
}

// ——— ADMIN ———

export async function create(req: Request, res: Response): Promise<void> {
  const { city, street, building, floor, phone, email, lat, lng, isMain } =
    req.body;
  if (!city || !street || !building) {
    res.status(400).json({ error: "city, street и building обязательны" });
    return;
  }

  const address = await prisma.address.create({
    data: {
      city,
      street,
      building,
      floor: floor || null,
      phone: phone || null,
      email: email || null,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      isMain: isMain === true,
    },
  });
  res.status(201).json(address);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { city, street, building, floor, phone, email, lat, lng, isMain } =
    req.body;

  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Адрес не найден" });
    return;
  }

  const address = await prisma.address.update({
    where: { id },
    data: {
      ...(city !== undefined && { city }),
      ...(street !== undefined && { street }),
      ...(building !== undefined && { building }),
      ...(floor !== undefined && { floor }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(lat !== undefined && { lat: lat ? Number(lat) : null }),
      ...(lng !== undefined && { lng: lng ? Number(lng) : null }),
      ...(isMain !== undefined && { isMain: Boolean(isMain) }),
    },
  });
  res.json(address);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Адрес не найден" });
    return;
  }
  await prisma.address.delete({ where: { id } });
  res.json({ message: "Адрес удалён" });
}
