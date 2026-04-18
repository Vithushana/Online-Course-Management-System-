/**
 * Course Controller
 * Handles HTTP request/response logic for course endpoints.
 */

const courseModel = require('../models/courseModel');
const { validateCourse } = require('../validators/courseValidator');

const getAllCourses = (req, res) => {
  res.json(courseModel.getAll());
};

const getCourseById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const course = courseModel.getById(id);
  if (!course) {
    return res.status(404).json({ message: `Course with id ${id} not found` });
  }
  res.json(course);
};

const createCourse = (req, res) => {
  const errors = validateCourse(req.body, false);

  if (req.body.code) {
    const code = req.body.code.trim().toUpperCase();
    const existing = courseModel.getAll().find((c) => c.code === code);
    if (existing) {
      errors.push('Course code must be unique');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  const course = courseModel.create(req.body);
  res.status(201).json(course);
};

const updateCourse = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const errors = validateCourse(req.body, true);

  if (req.body.code) {
    const code = req.body.code.trim().toUpperCase();
    const existing = courseModel.getAll().find((c) => c.code === code && c.id !== id);
    if (existing) {
      errors.push('Course code must be unique');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  const updated = courseModel.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ message: `Course with id ${id} not found` });
  }
  res.json(updated);
};

const deleteCourse = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = courseModel.remove(id);
  if (!deleted) {
    return res.status(404).json({ message: `Course with id ${id} not found` });
  }
  res.json({ message: `Course with id ${id} deleted successfully` });
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
