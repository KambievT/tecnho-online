import { Router } from "express";
import * as ctrl from "../controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Вход администратора
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, password]
 *             properties:
 *               login:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: JWT токен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Неверные данные
 */
router.post("/login", ctrl.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Текущий администратор
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные администратора
 *       401:
 *         description: Не авторизован
 */
router.get("/me", ctrl.me);

export default router;
