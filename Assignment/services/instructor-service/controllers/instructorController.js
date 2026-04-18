/**
 * Instructor Controller
 * Handles HTTP request/response logic for instructor endpoints.
 */

const instructorModel = require('../models/instructorModel');
const { validateInstructor } = require('../validators/instructorValidator');

const getAllInstructors = (req, res) => {
  res.json(instructorModel.getAll());
};

const getInstructorById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const instructor = instructorModel.getById(id);
  if (!instructor) {
    return res.status(404).json({ message: `Instructor with id ${id} not found` });
  }
  res.json(instructor);
};

const createInstructor = (req, res) => {
  const errors = validateInstructor(req.body, false);
  if (errors.length > 0) {
    const status = (!req.body.name || !req.body.email) ? 400 : 422;
    return res.status(status).json({ message: 'Validation failed', errors });
  }
  const instructor = instructorModel.create(req.body);
  res.status(201).json(instructor);
};

const updateInstructor = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const errors = validateInstructor(req.body, true);
  if (errors.length > 0) {
    return res.status(422).json({ message: 'Validation failed', errors });
  }
  const updated = instructorModel.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ message: `Instructor with id ${id} not found` });
  }
  res.json(updated);
};

const deleteInstructor = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = instructorModel.remove(id);
  if (!deleted) {
    return res.status(404).json({ message: `Instructor with id ${id} not found` });
  }
  res.json({ message: `Instructor with id ${id} deleted successfully` });
};

module.exports = {
  getAllInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor,
};
