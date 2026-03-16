import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

dotenv.config();

import prisma from "./config/prisma";
import { ensureBucket } from "./config/minio";
import swaggerSpec from "./config/swagger";
import { seedAdmin } from "./controllers/auth.controller";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import filterRoutes from "./routes/filter.routes";
import productRoutes from "./routes/product.routes";
import addressRoutes from "./routes/address.routes";

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

// ——— Middleware ———
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// ——— Swagger UI ———
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Techno-Dom API Docs",
  }),
);

// JSON-спецификация
app.get("/api/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ——— Routes ———
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/filters", filterRoutes);
app.use("/api/products", productRoutes);
app.use("/api/addresses", addressRoutes);

// Health-check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ——— Start ———
async function main() {
  // Подключаем Prisma
  try {
    await prisma.$connect();
    console.log("✅ Подключено к PostgreSQL");

    // Создаём дефолтного админа
    await seedAdmin();
  } catch (err) {
    console.warn(
      "⚠️  PostgreSQL недоступен, CRUD-операции не будут работать:",
      (err as Error).message,
    );
  }

  // Создаём бакет MinIO, если нет
  try {
    await ensureBucket();
    console.log("✅ MinIO бакет готов");
  } catch (err) {
    console.warn(
      "⚠️  MinIO недоступен, загрузка файлов не будет работать:",
      (err as Error).message,
    );
  }

  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
    console.log(`📚 Swagger UI: http://localhost:${PORT}/api/docs`);
  });
}

main().catch((err) => {
  console.error("Ошибка запуска:", err);
  process.exit(1);
});
