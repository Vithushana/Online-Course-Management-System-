/**
 * Enrollment Controller
 * Handles HTTP request/response logic for enrollment endpoints.
 */

const enrollmentModel = require('../models/enrollmentModel');
const { validateEnrollment } = require('../validators/enrollmentValidator');

const getAllEnrollments = (req, res) => {
  res.json(enrollmentModel.getAll());
};

const getEnrollmentById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const enrollment = enrollmentModel.getById(id);
  if (!enrollment) {
    return res.status(404).json({ message: `Enrollment with id ${id} not found` });
  }
  res.json(enrollment);
};

const createEnrollment = (req, res) => {
  const errors = validateEnrollment(req.body, false, enrollmentModel.getAll());
  if (errors.length > 0) {
    // Pick the right status code based on error type
    const isDuplicate = errors.some((e) => e.includes('already enrolled'));
    const isMissing = (!req.body.studentId || !req.body.courseId);
    const status = isDuplicate ? 409 : isMissing ? 400 : 422;
    return res.status(status).json({ message: 'Validation failed', errors });
  }
  const enrollment = enrollmentModel.create(req.body);
  res.status(201).json(enrollment);
};

const updateEnrollment = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const errors = validateEnrollment(req.body, true);
  if (errors.length > 0) {
    return res.status(422).json({ message: 'Validation failed', errors });
  }
  const updated = enrollmentModel.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ message: `Enrollment with id ${id} not found` });
  }
  res.json(updated);
};

const deleteEnrollment = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = enrollmentModel.remove(id);
  if (!deleted) {
    return res.status(404).json({ message: `Enrollment with id ${id} not found` });
  }
  res.json({ message: `Enrollment with id ${id} deleted successfully` });
};

module.exports = {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
