import { Request, Response } from "express";
import prisma from "../config/prisma";

// ——— PUBLIC: создание заявки ———

export async function createOrder(req: Request, res: Response): Promise<void> {
  const { customerName, phone, email, address, comment, items } = req.body;

  if (!customerName || !phone) {
    res.status(400).json({ error: "Имя и телефон обязательны" });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Корзина пуста" });
    return;
  }

  // Получаем актуальные цены товаров из БД
  const productIds = items.map((i: { productId: number }) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  const orderItems = items.map(
    (item: { productId: number; quantity: number }) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Товар ${item.productId} не найден`);
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: Math.max(1, Math.floor(item.quantity)),
      };
    },
  );

  const totalPrice = orderItems.reduce(
    (sum: number, item: { price: any; quantity: number }) =>
      sum + Number(item.price) * item.quantity,
    0,
  );

  const order = await prisma.order.create({
    data: {
      customerName,
      phone,
      email: email || null,
      address: address || null,
      comment: comment || null,
      totalPrice,
      items: {
        createMany: { data: orderItems },
      },
    },
    include: { items: true },
  });

  res.status(201).json(order);
}

// ——— ADMIN ———

export async function getAll(req: Request, res: Response): Promise<void> {
  const { page = "1", limit = "20", status } = req.query;

  const take = Math.min(Number(limit), 100);
  const skip = (Number(page) - 1) * take;

  const where: Record<string, unknown> = {};
  if (status) where.status = String(status);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { position: "asc" }, take: 1 } },
            },
          },
        },
      },
      orderBy: { id: "desc" },
      take,
      skip,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);
  res.json({
    data: orders,
    total,
    page: Number(page),
    limit: take,
    totalPages,
  });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { position: "asc" }, take: 1 } },
          },
        },
      },
    },
  });

  if (!order) {
    res.status(404).json({ error: "Заявка не найдена" });
    return;
  }
  res.json(order);
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { status } = req.body;

  const validStatuses = ["NEW", "PROCESSING", "COMPLETED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "Недопустимый статус" });
    return;
  }

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Заявка не найдена" });
    return;
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  });

  res.json(order);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Заявка не найдена" });
    return;
  }

  await prisma.order.delete({ where: { id } });
  res.json({ message: "Заявка удалена" });
}
