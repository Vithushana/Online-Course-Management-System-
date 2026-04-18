/**
 * Instructor Model — In-memory data store
 * Each instructor has: id, name, email, specialization, phone, assignedCourses.
 */

let instructors = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    email: 'sarah@university.edu',
    specialization: 'Software Engineering',
    phone: '0771001001',
    assignedCourses: [1, 2],
    joinedDate: '2026-03-23',
  },
  {
    id: 2,
    name: 'Prof. James Cooper',
    email: 'james@university.edu',
    specialization: 'Database Systems',
    phone: '0772002002',
    assignedCourses: [3],
    joinedDate: '2026-03-23',
  },
  {
    id: 3,
    name: 'Dr. Emily Watson',
    email: 'emily@university.edu',
    specialization: 'Artificial Intelligence',
    phone: '0773003003',
    assignedCourses: [],
    joinedDate: '2026-03-23',
  },
];
let nextId = 4;

const getAll = () => instructors;

const getById = (id) => instructors.find((i) => i.id === id);

const create = (data) => {
  const instructor = {
    id: nextId++,
    name: data.name,
    email: data.email,
    specialization: data.specialization || '',
    phone: data.phone || '',
    assignedCourses: data.assignedCourses || [],
    joinedDate: new Date().toISOString().split('T')[0],
  };
  instructors.push(instructor);
  return instructor;
};

const update = (id, data) => {
  const index = instructors.findIndex((i) => i.id === id);
  if (index === -1) return null;
  instructors[index] = { ...instructors[index], ...data, id };
  return instructors[index];
};

const remove = (id) => {
  const index = instructors.findIndex((i) => i.id === id);
  if (index === -1) return false;
  instructors.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };
