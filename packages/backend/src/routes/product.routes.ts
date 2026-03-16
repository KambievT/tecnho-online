import { Router } from "express";
import { authRequired } from "../middleware/auth";
import upload from "../middleware/upload";
import * as ctrl from "../controllers/product.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         url:
 *           type: string
 *         alt:
 *           type: string
 *           nullable: true
 *         position:
 *           type: integer
 *         productId:
 *           type: integer
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         price:
 *           type: number
 *         oldPrice:
 *           type: number
 *           nullable: true
 *         inStock:
 *           type: boolean
 *         categoryId:
 *           type: integer
 *           nullable: true
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductImage'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Товары]
 *     summary: Список товаров (пагинация)
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Товары с пагинацией
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
router.get("/", ctrl.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Товары]
 *     summary: Товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Товар
 *       404:
 *         description: Не найден
 */
router.get("/:id", ctrl.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Товары]
 *     summary: Создать товар (админ)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               oldPrice:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *               categoryId:
 *                 type: integer
 *               filterValueIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Несколько изображений товара
 *     responses:
 *       201:
 *         description: Созданный товар
 *       401:
 *         description: Не авторизован
 */
router.post("/", authRequired, upload.array("images", 20), ctrl.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Товары]
 *     summary: Обновить товар (админ)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               oldPrice:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *               categoryId:
 *                 type: integer
 *               filterValueIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *       404:
 *         description: Не найден
 */
router.put("/:id", authRequired, upload.array("images", 20), ctrl.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Товары]
 *     summary: Удалить товар (админ)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Удалён
 *       404:
 *         description: Не найден
 */
router.delete("/:id", authRequired, ctrl.remove);

export default router;
