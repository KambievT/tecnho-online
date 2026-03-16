import { Request, Response } from "express";
import prisma from "../config/prisma";

// ——— PUBLIC ———

export async function getAll(req: Request, res: Response): Promise<void> {
  const { parentId } = req.query;
  const where = parentId ? { parentId: Number(parentId) } : {};

  const categories = await prisma.category.findMany({
    where,
    include: { children: true, _count: { select: { products: true } } },
    orderBy: { id: "asc" },
  });
  res.json(categories);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      children: true,
      filters: { include: { values: true } },
      products: { take: 20 },
    },
  });
  if (!category) {
    res.status(404).json({ error: "Категория не найдена" });
    return;
  }
  res.json(category);
}

// ——— ADMIN ———

export async function create(req: Request, res: Response): Promise<void> {
  const { name, slug, image, parentId } = req.body;
  if (!name || !slug) {
    res.status(400).json({ error: "name и slug обязательны" });
    return;
  }
  const category = await prisma.category.create({
    data: {
      name,
      slug,
      image: image || null,
      parentId: parentId ? Number(parentId) : null,
    },
  });
  res.status(201).json(category);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { name, slug, image, parentId } = req.body;

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Категория не найдена" });
    return;
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(image !== undefined && { image }),
      ...(parentId !== undefined && {
        parentId: parentId ? Number(parentId) : null,
      }),
    },
  });
  res.json(category);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Категория не найдена" });
    return;
  }
  await prisma.category.delete({ where: { id } });
  res.json({ message: "Категория удалена" });
}
