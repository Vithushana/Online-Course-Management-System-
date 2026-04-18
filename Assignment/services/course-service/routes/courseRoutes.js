/**
 * Course Routes
 * Maps HTTP methods + paths to course controller functions.
 */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/courseController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - credits
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *           example: 1
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *           example: "Introduction to IT"
 *         description:
 *           type: string
 *           maxLength: 500
 *           example: "Covers fundamental IT concepts"
 *         duration:
 *           type: string
 *           maxLength: 50
 *           example: "3 months"
 *         schedule:
 *           type: string
 *           maxLength: 100
 *           example: "Mon/Wed 10:00 AM"
 *         category:
 *           type: string
 *           maxLength: 50
 *           example: "Information Technology"
 *         credits:
 *           type: integer
 *           minimum: 1
 *           maximum: 30
 *           description: "Number of academic credits (1-30)"
 *           example: 3
 *         createdDate:
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
 *           example: ["Title is required", "Description must not exceed 500 characters"]
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', ctrl.getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get('/:id', ctrl.getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - credits
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Introduction to IT"
 *               description:
 *                 type: string
 *                 example: "Covers fundamental IT concepts"
 *               duration:
 *                 type: string
 *                 example: "3 months"
 *               schedule:
 *                 type: string
 *                 example: "Mon/Wed 10:00 AM"
 *               category:
 *                 type: string
 *                 example: "Information Technology"
 *               credits:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 30
 *                 example: 3
 *     responses:
 *       201:
 *         description: Course created
 *       400:
 *         description: Missing required fields
 */
router.post('/', ctrl.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               schedule:
 *                 type: string
 *               category:
 *                 type: string
 *               credits:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 30
 *     responses:
 *       200:
 *         description: Course updated
 *       404:
 *         description: Course not found
 */
router.put('/:id', ctrl.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted
 *       404:
 *         description: Course not found
 */
router.delete('/:id', ctrl.deleteCourse);

module.exports = router;
