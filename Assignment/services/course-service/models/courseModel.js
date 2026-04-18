/**
 * Course Model — In-memory data store
 * Stores course records in a simple array.
 * Each course has: id, code, title, description, credits, duration, schedule, category, level, status.
 */

let courses = [
  {
    id: 1,
    code: 'IT101',
    title: 'Introduction to IT',
    description: 'Fundamentals of information technology and computing.',
    credits: 3,
    duration: '3 months',
    schedule: 'Mon & Wed 9:00 AM',
    category: 'IT',
    level: 'Beginner',
    status: 'active',
    createdDate: '2026-03-23',
  },
  {
    id: 2,
    code: 'SE201',
    title: 'Web Development',
    description: 'Full-stack web development with HTML, CSS, JavaScript, and Node.js.',
    credits: 4,
    duration: '6 months',
    schedule: 'Tue & Thu 2:00 PM',
    category: 'Software Engineering',
    level: 'Intermediate',
    status: 'active',
    createdDate: '2026-03-23',
  },
  {
    id: 3,
    code: 'DS301',
    title: 'Database Management',
    description: 'Relational databases, SQL, and data modeling.',
    credits: 3,
    duration: '4 months',
    schedule: 'Fri 10:00 AM',
    category: 'Data Science',
    level: 'Advanced',
    status: 'inactive',
    createdDate: '2026-03-23',
  },
];
let nextId = 4;

const getAll = () => courses;

const getById = (id) => courses.find((c) => c.id === id);

const create = (data) => {
  const course = {
    id: nextId++,
    code: data.code.toUpperCase(),
    title: data.title,
    description: data.description || '',
    credits: data.credits,
    duration: data.duration || '',
    schedule: data.schedule || '',
    category: data.category || '',
    level: data.level,
    status: data.status,
    createdDate: new Date().toISOString().split('T')[0],
  };
  courses.push(course);
  return course;
};

const update = (id, data) => {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return null;
  courses[index] = { 
    ...courses[index], 
    ...data, 
    code: data.code ? data.code.toUpperCase() : courses[index].code,
    id 
  };
  return courses[index];
};

const remove = (id) => {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return false;
  courses.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };

