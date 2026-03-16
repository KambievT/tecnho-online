import { Router } from "express";
import { authRequired } from "../middleware/auth";
import * as ctrl from "../controllers/filter.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FilterValue:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         value:
 *           type: string
 *         filterId:
 *           type: integer
 *     Filter:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         categoryId:
 *           type: integer
 *           nullable: true
 *         values:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FilterValue'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/filters:
 *   get:
 *     tags: [Фильтры]
 *     summary: Список фильтров
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Фильтр по категории
 *     responses:
 *       200:
 *         description: Массив фильтров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Filter'
 */
router.get("/", ctrl.getAll);

/**
 * @swagger
 * /api/filters/{id}:
 *   get:
 *     tags: [Фильтры]
 *     summary: Фильтр по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Фильтр
 *       404:
 *         description: Не найден
 */
router.get("/:id", ctrl.getById);

/**
 * @swagger
 * /api/filters:
 *   post:
 *     tags: [Фильтры]
 *     summary: Создать фильтр (админ)
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
 *               categoryId:
 *                 type: integer
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Значения фильтра
 *     responses:
 *       201:
 *         description: Созданный фильтр
 *       401:
 *         description: Не авторизован
 */
router.post("/", authRequired, ctrl.create);

/**
 * @swagger
 * /api/filters/{id}:
 *   put:
 *     tags: [Фильтры]
 *     summary: Обновить фильтр (админ)
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
 *               categoryId:
 *                 type: integer
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Обновлённый фильтр
 *       404:
 *         description: Не найден
 */
router.put("/:id", authRequired, ctrl.update);

/**
 * @swagger
 * /api/filters/{id}:
 *   delete:
 *     tags: [Фильтры]
 *     summary: Удалить фильтр (админ)
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
