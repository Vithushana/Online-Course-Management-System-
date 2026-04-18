/**
 * Student Routes
 * Maps HTTP methods + paths to the appropriate controller functions.
 * All routes are relative to /api/students (mounted in index.js).
 */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - registrationNumber
 *         - name
 *         - email
 *         - phone
 *         - dateOfBirth
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *           example: 1
 *         registrationNumber:
 *           type: string
 *           minLength: 4
 *           maxLength: 20
 *           pattern: "^[A-Za-z0-9]{4,20}$"
 *           description: Unique alphanumeric registration code
 *           example: "IT2026001"
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: Student full name (letters only, 2-50 chars)
 *           example: "Alice Johnson"
 *         email:
 *           type: string
 *           format: email
 *           minLength: 5
 *           maxLength: 100
 *           description: Valid email address (must be lowercased)
 *           example: "alice@example.com"
 *         phone:
 *           type: string
 *           pattern: "^(0\\d{9}|\\+94\\d{9})$"
 *           description: "10 digits starting with 0, or +94 followed by 9 digits"
 *           example: "0771234567"
 *         dateOfBirth:
 *           type: string
 *           pattern: "^\\d{4}-\\d{2}-\\d{2}$"
 *           description: Date of birth in YYYY-MM-DD format (must be in the past)
 *           example: "2000-01-15"
 *         status:
 *           type: string
 *           enum: [active, inactive, graduated]
 *           description: "Student status: active, inactive, or graduated"
 *           example: "active"
 *         registeredDate:
 *           type: string
 *           description: Auto-set to today's date
 *           example: "2026-03-23"
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
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', ctrl.getAllStudents);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 */
router.get('/:id', ctrl.getStudentById);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNumber
 *               - name
 *               - email
 *               - phone
 *               - dateOfBirth
 *               - status
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: "IT2026001"
 *               name:
 *                 type: string
 *                 example: "Alice Johnson"
 *               email:
 *                 type: string
 *                 example: "alice@example.com"
 *               phone:
 *                 type: string
 *                 example: "0771234567"
 *               dateOfBirth:
 *                 type: string
 *                 example: "2000-01-15"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, graduated]
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Student created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post('/', ctrl.createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, graduated]
 *     responses:
 *       200:
 *         description: Student updated
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Student not found
 */
router.put('/:id', ctrl.updateStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student deleted
 *       404:
 *         description: Student not found
 */
router.delete('/:id', ctrl.deleteStudent);

module.exports = router;
