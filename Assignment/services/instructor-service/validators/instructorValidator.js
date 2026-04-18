/**
 * Instructor Validator
 * Pure validation function — returns an array of error messages.
 *
 * Rules:
 *  - name:            required on create, 2–100 chars
 *  - email:           required on create, valid email format, 5–100 chars
 *  - specialization:  optional, max 100 chars
 *  - phone:           optional, 7–15 chars, digits / + / - / spaces only
 *  - assignedCourses: optional, must be an array of positive integers
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d+\-\s]{7,15}$/;

function validateInstructor(data, isUpdate = false) {
  const errors = [];

  // --- name ---
  if (!isUpdate && (!data.name || !data.name.trim())) {
    errors.push('Name is required');
  }
  if (data.name !== undefined) {
    if (typeof data.name !== 'string') {
      errors.push('Name must be a string');
    } else if (data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    } else if (data.name.trim().length > 100) {
      errors.push('Name must not exceed 100 characters');
    }
  }

  // --- email ---
  if (!isUpdate && (!data.email || !data.email.trim())) {
    errors.push('Email is required');
  }
  if (data.email !== undefined) {
    if (typeof data.email !== 'string') {
      errors.push('Email must be a string');
    } else if (data.email.trim().length < 5 || data.email.trim().length > 100) {
      errors.push('Email must be between 5 and 100 characters');
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      errors.push('Email must be a valid email address (e.g. user@example.com)');
    }
  }

  // --- specialization (optional) ---
  if (data.specialization !== undefined && data.specialization !== '') {
    if (typeof data.specialization !== 'string') {
      errors.push('Specialization must be a string');
    } else if (data.specialization.length > 100) {
      errors.push('Specialization must not exceed 100 characters');
    }
  }

  // --- phone (optional) ---
  if (data.phone !== undefined && data.phone !== '') {
    if (typeof data.phone !== 'string') {
      errors.push('Phone must be a string');
    } else if (!PHONE_REGEX.test(data.phone.trim())) {
      errors.push('Phone must be 7–15 characters and contain only digits, +, - or spaces');
    }
  }

  // --- assignedCourses (optional) ---
  if (data.assignedCourses !== undefined) {
    if (!Array.isArray(data.assignedCourses)) {
      errors.push('assignedCourses must be an array');
    } else {
      const invalid = data.assignedCourses.some(
        (id) => !Number.isInteger(id) || id < 1
      );
      if (invalid) {
        errors.push('Each item in assignedCourses must be a positive integer');
      }
    }
  }

  return errors;
}

module.exports = { validateInstructor };
