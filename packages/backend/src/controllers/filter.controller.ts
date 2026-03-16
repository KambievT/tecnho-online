import { Request, Response } from "express";
import prisma from "../config/prisma";

// ——— PUBLIC ———

export async function getAll(req: Request, res: Response): Promise<void> {
  const { categoryId } = req.query;
  const where = categoryId ? { categoryId: Number(categoryId) } : {};

  const filters = await prisma.filter.findMany({
    where,
    include: { values: true },
    orderBy: { id: "asc" },
  });
  res.json(filters);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const filter = await prisma.filter.findUnique({
    where: { id },
    include: { values: true, category: true },
  });
  if (!filter) {
    res.status(404).json({ error: "Фильтр не найден" });
    return;
  }
  res.json(filter);
}

// ——— ADMIN ———

export async function create(req: Request, res: Response): Promise<void> {
  const { name, slug, categoryId, values } = req.body;
  if (!name || !slug) {
    res.status(400).json({ error: "name и slug обязательны" });
    return;
  }

  const filter = await prisma.filter.create({
    data: {
      name,
      slug,
      categoryId: categoryId ? Number(categoryId) : null,
      values: values?.length
        ? { createMany: { data: values.map((v: string) => ({ value: v })) } }
        : undefined,
    },
    include: { values: true },
  });
  res.status(201).json(filter);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { name, slug, categoryId, values } = req.body;

  const existing = await prisma.filter.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Фильтр не найден" });
    return;
  }

  // Если передали values — пересоздаём
  if (Array.isArray(values)) {
    await prisma.filterValue.deleteMany({ where: { filterId: id } });
    await prisma.filterValue.createMany({
      data: values.map((v: string) => ({ value: v, filterId: id })),
    });
  }

  const filter = await prisma.filter.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(categoryId !== undefined && {
        categoryId: categoryId ? Number(categoryId) : null,
      }),
    },
    include: { values: true },
  });
  res.json(filter);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const existing = await prisma.filter.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Фильтр не найден" });
    return;
  }
  await prisma.filter.delete({ where: { id } });
  res.json({ message: "Фильтр удалён" });
}
