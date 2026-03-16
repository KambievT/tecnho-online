import { Router } from "express";
import { authRequired } from "../middleware/auth";
import * as ctrl from "../controllers/address.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         city:
 *           type: string
 *         street:
 *           type: string
 *         building:
 *           type: string
 *         floor:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           nullable: true
 *         lat:
 *           type: number
 *           nullable: true
 *         lng:
 *           type: number
 *           nullable: true
 *         isMain:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     tags: [Адреса]
 *     summary: Список адресов
 *     responses:
 *       200:
 *         description: Массив адресов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 */
router.get("/", ctrl.getAll);

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     tags: [Адреса]
 *     summary: Адрес по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Адрес
 *       404:
 *         description: Не найден
 */
router.get("/:id", ctrl.getById);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     tags: [Адреса]
 *     summary: Создать адрес (админ)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [city, street, building]
 *             properties:
 *               city:
 *                 type: string
 *               street:
 *                 type: string
 *               building:
 *                 type: string
 *               floor:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               isMain:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Созданный адрес
 *       401:
 *         description: Не авторизован
 */
router.post("/", authRequired, ctrl.create);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     tags: [Адреса]
 *     summary: Обновить адрес (админ)
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
 *               city:
 *                 type: string
 *               street:
 *                 type: string
 *               building:
 *                 type: string
 *               floor:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               isMain:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Обновлённый адрес
 *       404:
 *         description: Не найден
 */
router.put("/:id", authRequired, ctrl.update);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     tags: [Адреса]
 *     summary: Удалить адрес (админ)
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
