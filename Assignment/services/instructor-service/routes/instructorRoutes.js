/**
 * Instructor Routes
 * Maps HTTP methods + paths to instructor controller functions.
 */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/instructorController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Instructor:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *           example: 1
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Dr. Smith"
 *         email:
 *           type: string
 *           format: email
 *           minLength: 5
 *           maxLength: 100
 *           example: "smith@university.edu"
 *         specialization:
 *           type: string
 *           maxLength: 100
 *           example: "Artificial Intelligence"
 *         phone:
 *           type: string
 *           pattern: "^[\\d+\\-\\s]{7,15}$"
 *           example: "0779876543"
 *         assignedCourses:
 *           type: array
 *           items:
 *             type: integer
 *             minimum: 1
 *           description: List of course IDs assigned to this instructor
 *           example: [1, 3]
 *         joinedDate:
 *           type: string
 *           example: "2026-03-22"
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
 *           example: ["Name is required", "Email must be a valid email address"]
 */

/**
 * @swagger
 * /api/instructors:
 *   get:
 *     summary: Get all instructors
 *     tags: [Instructors]
 *     responses:
 *       200:
 *         description: A list of instructors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
 */
router.get('/', ctrl.getAllInstructors);

/**
 * @swagger
 * /api/instructors/{id}:
 *   get:
 *     summary: Get an instructor by ID
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Instructor ID
 *     responses:
 *       200:
 *         description: Instructor found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: Instructor not found
 */
router.get('/:id', ctrl.getInstructorById);

/**
 * @swagger
 * /api/instructors:
 *   post:
 *     summary: Create a new instructor
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dr. Smith"
 *               email:
 *                 type: string
 *                 example: "smith@university.edu"
 *               specialization:
 *                 type: string
 *                 example: "Artificial Intelligence"
 *               phone:
 *                 type: string
 *                 example: "0779876543"
 *               assignedCourses:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3]
 *     responses:
 *       201:
 *         description: Instructor created
 *       400:
 *         description: Missing required fields
 */
router.post('/', ctrl.createInstructor);

/**
 * @swagger
 * /api/instructors/{id}:
 *   put:
 *     summary: Update an instructor
 *     tags: [Instructors]
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
 *               email:
 *                 type: string
 *               specialization:
 *                 type: string
 *               phone:
 *                 type: string
 *               assignedCourses:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Instructor updated
 *       404:
 *         description: Instructor not found
 */
router.put('/:id', ctrl.updateInstructor);

/**
 * @swagger
 * /api/instructors/{id}:
 *   delete:
 *     summary: Delete an instructor
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Instructor deleted
 *       404:
 *         description: Instructor not found
 */
router.delete('/:id', ctrl.deleteInstructor);

module.exports = router;
