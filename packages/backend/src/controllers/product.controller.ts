import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import prisma from "../config/prisma";
import { minioClient, BUCKET } from "../config/minio";

// ——— PUBLIC ———

export async function getAll(req: Request, res: Response): Promise<void> {
  const { categoryId, page = "1", limit = "20", search } = req.query;

  const take = Math.min(Number(limit), 100);
  const skip = (Number(page) - 1) * take;

  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (search) where.name = { contains: String(search), mode: "insensitive" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { position: "asc" } }, category: true },
      orderBy: { id: "desc" },
      take,
      skip,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);
  res.json({
    data: products,
    total,
    page: Number(page),
    limit: take,
    totalPages,
  });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      filterValues: { include: { filterValue: { include: { filter: true } } } },
    },
  });

  if (!product) {
    res.status(404).json({ error: "Товар не найден" });
    return;
  }
  res.json(product);
}

// ——— ADMIN ———

export async function create(req: Request, res: Response): Promise<void> {
  const {
    name,
    slug,
    description,
    price,
    oldPrice,
    inStock,
    categoryId,
    filterValueIds,
  } = req.body;

  if (!name || !slug) {
    res.status(400).json({ error: "name и slug обязательны" });
    return;
  }

  // Загрузка изображений
  const imageUrls = await uploadImages(req);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      price: price || 0,
      oldPrice: oldPrice || null,
      inStock: inStock !== undefined ? String(inStock) === "true" : true,
      categoryId: categoryId ? Number(categoryId) : null,
      images: imageUrls.length
        ? {
            createMany: {
              data: imageUrls.map((url, i) => ({ url, position: i })),
            },
          }
        : undefined,
      filterValues: filterValueIds?.length
        ? {
            createMany: {
              data: (filterValueIds as number[]).map((fvId) => ({
                filterValueId: fvId,
              })),
            },
          }
        : undefined,
    },
    include: { images: true, category: true },
  });

  res.status(201).json(product);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const {
    name,
    slug,
    description,
    price,
    oldPrice,
    inStock,
    categoryId,
    filterValueIds,
  } = req.body;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Товар не найден" });
    return;
  }

  // Новые изображения (если приложили)
  const imageUrls = await uploadImages(req);

  if (imageUrls.length) {
    // удаляем старые записи и добавляем новые
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productImage.createMany({
      data: imageUrls.map((url, i) => ({ url, position: i, productId: id })),
    });
  }

  if (Array.isArray(filterValueIds)) {
    await prisma.productFilterValue.deleteMany({ where: { productId: id } });
    if (filterValueIds.length) {
      await prisma.productFilterValue.createMany({
        data: (filterValueIds as number[]).map((fvId) => ({
          productId: id,
          filterValueId: fvId,
        })),
      });
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(oldPrice !== undefined && { oldPrice: oldPrice || null }),
      ...(inStock !== undefined && { inStock: String(inStock) === "true" }),
      ...(categoryId !== undefined && {
        categoryId: categoryId ? Number(categoryId) : null,
      }),
    },
    include: { images: true, category: true },
  });

  res.json(product);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    res.status(404).json({ error: "Товар не найден" });
    return;
  }

  // удаляем файлы из MinIO
  for (const img of existing.images) {
    const key = img.url.split("/").pop();
    if (key) {
      try {
        await minioClient.removeObject(BUCKET, key);
      } catch {
        // игнорируем — файл мог быть удалён
      }
    }
  }

  await prisma.product.delete({ where: { id } });
  res.json({ message: "Товар удалён" });
}

// ——— helpers ———

async function uploadImages(req: Request): Promise<string[]> {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) return [];

  const urls: string[] = [];
  for (const file of files) {
    const ext = file.originalname.split(".").pop() || "jpg";
    const key = `${uuid()}.${ext}`;
    await minioClient.putObject(BUCKET, key, file.buffer, file.size, {
      "Content-Type": file.mimetype,
    });

    // MINIO_PUBLIC_URL — публичный адрес MinIO (для production nginx proxy / S3)
    const publicUrl = process.env.MINIO_PUBLIC_URL;
    if (publicUrl) {
      urls.push(`${publicUrl}/${BUCKET}/${key}`);
    } else {
      const proto = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
      const host = process.env.MINIO_ENDPOINT || "localhost";
      const port = process.env.MINIO_PORT || "9000";
      urls.push(`${proto}://${host}:${port}/${BUCKET}/${key}`);
    }
  }
  return urls;
}
