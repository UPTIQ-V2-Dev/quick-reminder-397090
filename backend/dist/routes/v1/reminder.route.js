import { reminderController } from "../../controllers/index.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { reminderValidation } from "../../validations/index.js";
import express from 'express';
const router = express.Router();
// Authenticated routes
router
    .route('/')
    .post(auth('manageReminders'), validate(reminderValidation.createReminder), reminderController.createReminder)
    .get(auth('getReminders'), validate(reminderValidation.getReminders), reminderController.getReminders);
router
    .route('/:reminderId')
    .get(auth('getReminders'), validate(reminderValidation.getReminderById), reminderController.getReminder)
    .patch(auth('manageReminders'), validate(reminderValidation.updateReminder), reminderController.updateReminder)
    .delete(auth('manageReminders'), validate(reminderValidation.deleteReminder), reminderController.deleteReminder);
export default router;
/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Reminder management and retrieval
 */
/**
 * @swagger
 * /reminders:
 *   post:
 *     summary: Create a reminder
 *     description: Authenticated users can create reminders for themselves.
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - dateTime
 *             properties:
 *               text:
 *                 type: string
 *                 description: The reminder text
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 description: When to be reminded (ISO date string)
 *             example:
 *               text: Call doctor for appointment
 *               dateTime: 2025-10-30T14:00:00Z
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Reminder'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "422":
 *         $ref: '#/components/responses/ValidationError'
 *
 *   get:
 *     summary: Get all reminders
 *     description: Authenticated users can retrieve their own reminders.
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by reminder status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reminders
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
/**
 * @swagger
 * /reminders/{reminderId}:
 *   get:
 *     summary: Get a reminder
 *     description: Authenticated users can fetch their own reminders by ID.
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reminderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reminder id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Reminder'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a reminder
 *     description: Authenticated users can update their own reminders.
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reminderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reminder id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The reminder text
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 description: When to be reminded (ISO date string)
 *               status:
 *                 type: string
 *                 description: Reminder status
 *             example:
 *               status: completed
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Reminder'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a reminder
 *     description: Authenticated users can delete their own reminders.
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reminderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reminder id
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Reminder:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique reminder identifier (cuid)
 *         text:
 *           type: string
 *           description: The reminder text
 *         dateTime:
 *           type: string
 *           format: date-time
 *           description: When to be reminded
 *         status:
 *           type: string
 *           description: Reminder status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the reminder was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the reminder was last updated
 *         userId:
 *           type: integer
 *           description: ID of the user who owns this reminder
 *       example:
 *         id: clm1n2o3p4q5r6s7t8u9v0w1
 *         text: Call doctor for appointment
 *         dateTime: 2025-10-30T14:00:00Z
 *         status: upcoming
 *         createdAt: 2025-10-30T10:00:00Z
 *         updatedAt: 2025-10-30T10:00:00Z
 *         userId: 1
 */
