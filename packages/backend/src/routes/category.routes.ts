import { Router } from "express";
import { authRequired } from "../middleware/auth";
import * as ctrl from "../controllers/category.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         parentId:
 *           type: integer
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Категории]
 *     summary: Список категорий
 *     parameters:
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: integer
 *         description: Фильтр по родительской категории
 *     responses:
 *       200:
 *         description: Массив категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", ctrl.getAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Категории]
 *     summary: Категория по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Категория
 *       404:
 *         description: Не найдена
 */
router.get("/:id", ctrl.getById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Категории]
 *     summary: Создать категорию (админ)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               image:
 *                 type: string
 *               parentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Созданная категория
 *       401:
 *         description: Не авторизован
 */
router.post("/", authRequired, ctrl.create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags: [Категории]
 *     summary: Обновить категорию (админ)
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               image:
 *                 type: string
 *               parentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Обновлённая категория
 *       404:
 *         description: Не найдена
 */
router.put("/:id", authRequired, ctrl.update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Категории]
 *     summary: Удалить категорию (админ)
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
 *         description: Удалено
 *       404:
 *         description: Не найдена
 */
router.delete("/:id", authRequired, ctrl.remove);

export default router;
