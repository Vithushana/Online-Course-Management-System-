/**
 * Enrollment Routes
 * Maps HTTP methods + paths to enrollment controller functions.
 */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/enrollmentController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       required:
 *         - studentId
 *         - courseId
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *           example: 1
 *         studentId:
 *           type: integer
 *           minimum: 1
 *           description: ID of the student being enrolled
 *           example: 1
 *         courseId:
 *           type: integer
 *           minimum: 1
 *           description: ID of the course
 *           example: 1
 *         enrolledDate:
 *           type: string
 *           description: Auto-set to today's date
 *           example: "2026-03-22"
 *         status:
 *           type: string
 *           enum: [active, completed, dropped]
 *           description: Enrollment status
 *           example: "active"
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["studentId is required", "Student 1 is already enrolled in course 1"]
 */

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollments]
 *     responses:
 *       200:
 *         description: A list of enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 */
router.get('/', ctrl.getAllEnrollments);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   get:
 *     summary: Get an enrollment by ID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Enrollment not found
 */
router.get('/:id', ctrl.getEnrollmentById);

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll a student in a course
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - courseId
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 1
 *               courseId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Enrollment created
 *       400:
 *         description: Missing required fields
 */
router.post('/', ctrl.createEnrollment);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   put:
 *     summary: Update an enrollment
 *     tags: [Enrollments]
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
 *               studentId:
 *                 type: integer
 *               courseId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Enrollment updated
 *       404:
 *         description: Enrollment not found
 */
router.put('/:id', ctrl.updateEnrollment);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   delete:
 *     summary: Drop / remove an enrollment
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Enrollment deleted
 *       404:
 *         description: Enrollment not found
 */
router.delete('/:id', ctrl.deleteEnrollment);

module.exports = router;
