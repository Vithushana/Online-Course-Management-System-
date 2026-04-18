/**
 * Student Model — In-memory data store
 * Stores student records in a simple array.
 * Each student has: id, registrationNumber, name, email, phone, dateOfBirth, status, registeredDate.
 */

// In-memory array acting as our "database" — pre-seeded with sample data
let students = [
  {
    id: 1,
    registrationNumber: 'IT2026001',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '0771234567',
    dateOfBirth: '2000-01-15',
    status: 'active',
    registeredDate: '2026-03-23',
  },
  {
    id: 2,
    registrationNumber: 'IT2026002',
    name: 'Bob Williams',
    email: 'bob@example.com',
    phone: '0779876543',
    dateOfBirth: '1999-06-20',
    status: 'active',
    registeredDate: '2026-03-23',
  },
  {
    id: 3,
    registrationNumber: 'IT2026003',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    phone: '0771112233',
    dateOfBirth: '2001-11-05',
    status: 'graduated',
    registeredDate: '2026-03-23',
  },
];
let nextId = 4;

/**
 * Get every student in the system.
 * @returns {Array} List of student objects
 */
const getAll = () => students;

/**
 * Find a single student by their numeric ID.
 * @param {number} id
 * @returns {Object|undefined} The student, or undefined if not found
 */
const getById = (id) => students.find((s) => s.id === id);

/**
 * Create a new student record.
 * Automatically assigns an ID and the current date as registeredDate.
 * @param {Object} data — { registrationNumber, name, email, phone, dateOfBirth, status }
 * @returns {Object} The newly created student
 */
const create = (data) => {
  const student = {
    id: nextId++,
    registrationNumber: data.registrationNumber,
    name: data.name,
    email: data.email,
    phone: data.phone,
    dateOfBirth: data.dateOfBirth,
    status: data.status,
    registeredDate: new Date().toISOString().split('T')[0],
  };
  students.push(student);
  return student;
};

/**
 * Update an existing student's fields.
 * Only overwrites fields that are present in `data`.
 * @param {number} id
 * @param {Object} data — partial student fields to update
 * @returns {Object|null} The updated student, or null if not found
 */
const update = (id, data) => {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;
  students[index] = { ...students[index], ...data, id }; // keep original id
  return students[index];
};

/**
 * Delete a student by ID.
 * @param {number} id
 * @returns {boolean} true if deleted, false if not found
 */
const remove = (id) => {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return false;
  students.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };
