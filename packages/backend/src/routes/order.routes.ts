import { Router } from "express";
import { authRequired } from "../middleware/auth";
import * as ctrl from "../controllers/order.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         orderId:
 *           type: integer
 *         productId:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: integer
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         customerName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         comment:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [NEW, PROCESSING, COMPLETED, CANCELLED]
 *         totalPrice:
 *           type: number
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Заявки]
 *     summary: Создать заявку (публичный)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerName, phone, items]
 *             properties:
 *               customerName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               comment:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Заявка создана
 *       400:
 *         description: Ошибка валидации
 */
router.post("/", ctrl.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Заявки]
 *     summary: Список заявок (админ)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [NEW, PROCESSING, COMPLETED, CANCELLED]
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
 *         description: Заявки с пагинацией
 */
router.get("/", authRequired, ctrl.getAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Заявки]
 *     summary: Заявка по ID (админ)
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
 *         description: Заявка
 *       404:
 *         description: Не найдена
 */
router.get("/:id", authRequired, ctrl.getById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     tags: [Заявки]
 *     summary: Обновить статус заявки (админ)
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [NEW, PROCESSING, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Статус обновлён
 */
router.patch("/:id/status", authRequired, ctrl.updateStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     tags: [Заявки]
 *     summary: Удалить заявку (админ)
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
 *         description: Заявка удалена
 */
router.delete("/:id", authRequired, ctrl.remove);

export default router;
