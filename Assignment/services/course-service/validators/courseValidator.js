/**
 * Course Validator
 * Pure validation function — returns an array of error messages.
 *
 * Rules:
 *  - code:        required, uppercase alphanumeric, 3-10 chars
 *  - title:       required, 2–150 chars
 *  - description: optional, max 500 chars
 *  - duration:    optional, max 50 chars
 *  - schedule:    optional, max 100 chars
 *  - category:    optional, max 50 chars
 *  - level:       required, ['Beginner', 'Intermediate', 'Advanced']
 *  - status:      required, ['active', 'inactive']
 */

const CODE_REGEX = /^[A-Z0-9]{3,10}$/;
const VALID_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const VALID_STATUSES = ['active', 'inactive'];

function validateCourse(data, isUpdate = false) {
  const errors = [];

  // --- code ---
  if (!isUpdate && (!data.code || !data.code.trim())) {
    errors.push('Course code is required');
  }
  if (data.code !== undefined) {
    if (typeof data.code !== 'string') {
      errors.push('Course code must be a string');
    } else if (!CODE_REGEX.test(data.code.trim().toUpperCase())) {
      errors.push('Course code must be 3-10 uppercase alphanumeric characters');
    }
  }

  // --- title ---
  if (!isUpdate && (!data.title || !data.title.trim())) {
    errors.push('Title is required');
  }
  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      errors.push('Title must be a string');
    } else if (data.title.trim().length < 2) {
      errors.push('Title must be at least 2 characters');
    } else if (data.title.trim().length > 150) {
      errors.push('Title must not exceed 150 characters');
    }
  }

  // --- description ---
  if (data.description !== undefined && data.description !== '') {
    if (typeof data.description !== 'string') {
      errors.push('Description must be a string');
    } else if (data.description.length > 500) {
      errors.push('Description must not exceed 500 characters');
    }
  }

  // --- duration ---
  if (data.duration !== undefined && data.duration !== '') {
    if (typeof data.duration !== 'string') {
      errors.push('Duration must be a string');
    } else if (data.duration.length > 50) {
      errors.push('Duration must not exceed 50 characters');
    }
  }

  // --- schedule ---
  if (data.schedule !== undefined && data.schedule !== '') {
    if (typeof data.schedule !== 'string') {
      errors.push('Schedule must be a string');
    } else if (data.schedule.length > 100) {
      errors.push('Schedule must not exceed 100 characters');
    }
  }

  // --- category ---
  if (data.category !== undefined && data.category !== '') {
    if (typeof data.category !== 'string') {
      errors.push('Category must be a string');
    } else if (data.category.length > 50) {
      errors.push('Category must not exceed 50 characters');
    }
  }

  // --- level ---
  if (!isUpdate && (!data.level || !data.level.trim())) {
    errors.push('Level is required');
  }
  if (data.level !== undefined) {
    if (!VALID_LEVELS.includes(data.level)) {
      errors.push(`Level must be one of: ${VALID_LEVELS.join(', ')}`);
    }
  }

  // --- status ---
  if (!isUpdate && (!data.status || !data.status.trim())) {
    errors.push('Status is required');
  }
  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  // --- credits (required) ---
  if (!isUpdate && (data.credits === undefined || data.credits === null || data.credits === '')) {
    errors.push('Credits is required');
  }
  if (data.credits !== undefined && data.credits !== null && data.credits !== '') {
    const num = Number(data.credits);
    if (!Number.isInteger(num)) {
      errors.push('Credits must be a whole number');
    } else if (num < 1 || num > 30) {
      errors.push('Credits must be between 1 and 30');
    }
  }

  return errors;
}

module.exports = { validateCourse };
