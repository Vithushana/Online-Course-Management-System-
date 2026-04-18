/**
 * Enrollment Model — In-memory data store
 * Each enrollment links a student to a course.
 * Fields: id, studentId, courseId, enrolledDate, status.
 */

let enrollments = [
  {
    id: 1,
    studentId: 1,
    courseId: 1,
    enrolledDate: '2026-03-23',
    status: 'active',
  },
  {
    id: 2,
    studentId: 2,
    courseId: 2,
    enrolledDate: '2026-03-23',
    status: 'active',
  },
];
let nextId = 3;

const getAll = () => enrollments;

const getById = (id) => enrollments.find((e) => e.id === id);

const create = (data) => {
  const enrollment = {
    id: nextId++,
    studentId: data.studentId,
    courseId: data.courseId,
    enrolledDate: new Date().toISOString().split('T')[0],
    status: data.status || 'active',
  };
  enrollments.push(enrollment);
  return enrollment;
};

const update = (id, data) => {
  const index = enrollments.findIndex((e) => e.id === id);
  if (index === -1) return null;
  enrollments[index] = { ...enrollments[index], ...data, id };
  return enrollments[index];
};

const remove = (id) => {
  const index = enrollments.findIndex((e) => e.id === id);
  if (index === -1) return false;
  enrollments.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };
