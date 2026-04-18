/**
 * Student Controller
 * Handles HTTP request/response logic for student endpoints.
 * Delegates data operations to the studentModel.
 */

const studentModel = require('../models/studentModel');
const { validateStudent } = require('../validators/studentValidator');

// GET /api/students — return all students
const getAllStudents = (req, res) => {
  const students = studentModel.getAll();
  res.json(students);
};

// GET /api/students/:id — return one student by ID
const getStudentById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = studentModel.getById(id);
  if (!student) {
    return res.status(404).json({ message: `Student with id ${id} not found` });
  }
  res.json(student);
};

// POST /api/students — create a new student
const createStudent = (req, res) => {
  const errors = validateStudent(req.body, false);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  const student = studentModel.create(req.body);
  res.status(201).json(student);
};

// PUT /api/students/:id — update an existing student
const updateStudent = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const errors = validateStudent(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  const updated = studentModel.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ message: `Student with id ${id} not found` });
  }
  res.json(updated);
};

// DELETE /api/students/:id — remove a student
const deleteStudent = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = studentModel.remove(id);
  if (!deleted) {
    return res.status(404).json({ message: `Student with id ${id} not found` });
  }
  res.json({ message: `Student with id ${id} deleted successfully` });
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
