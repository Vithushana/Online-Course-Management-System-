/**
 * Student Validator
 * Pure validation function — returns an array of error messages.
 * Called by the controller before creating/updating a student.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ContactNo constraints: either starts with 0 and has 10 digits total, OR starts with +94 and has +94 followed by 9 digits.
const PHONE_REGEX = /^(0\d{9}|\+94\d{9})$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const REG_NUM_REGEX = /^[A-Za-z0-9]{4,20}$/;
const VALID_STATUSES = ['active', 'inactive', 'graduated'];

function validateStudent(data, isUpdate = false) {
  const errors = [];

  // --- registrationNumber ---
  if (!isUpdate && (!data.registrationNumber || !data.registrationNumber.trim())) {
    errors.push('registrationNumber is required');
  }
  if (data.registrationNumber !== undefined) {
    if (typeof data.registrationNumber !== 'string') {
      errors.push('registrationNumber must be a string');
    } else if (!REG_NUM_REGEX.test(data.registrationNumber.trim())) {
      errors.push('registrationNumber must be 4-20 alphanumeric characters');
    }
  }

  // --- name ---
  if (!isUpdate && (!data.name || !data.name.trim())) {
    errors.push('Name is required');
  }
  if (data.name !== undefined) {
    if (typeof data.name !== 'string') {
      errors.push('Name must be a string');
    } else if (data.name.trim().length < 2 || data.name.trim().length > 50) {
      errors.push('Name must be between 2 and 50 characters');
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
    } else if (!EMAIL_REGEX.test(data.email.trim().toLowerCase())) {
      errors.push('Email must be a valid email address');
    } else if (data.email !== data.email.toLowerCase()) {
      errors.push('Email must be lowercased');
    }
  }

  // --- phone (contactNo) ---
  if (!isUpdate && (!data.phone || !data.phone.trim())) {
    errors.push('Contact number (phone) is required');
  }
  if (data.phone !== undefined) {
    if (typeof data.phone !== 'string') {
      errors.push('Phone must be a string');
    } else if (!PHONE_REGEX.test(data.phone.trim())) {
      errors.push('Phone must be 10 digits starting with 0, or start with +94 followed by 9 digits');
    }
  }

  // --- dateOfBirth ---
  if (!isUpdate && (!data.dateOfBirth || !data.dateOfBirth.trim())) {
    errors.push('Date of birth is required');
  }
  if (data.dateOfBirth !== undefined) {
    if (typeof data.dateOfBirth !== 'string') {
      errors.push('Date of birth must be a string');
    } else if (!DATE_REGEX.test(data.dateOfBirth.trim())) {
      errors.push('Date of birth must be in YYYY-MM-DD format');
    } else {
      const dob = new Date(data.dateOfBirth.trim());
      const now = new Date();
      if (isNaN(dob.getTime())) {
         errors.push('Date of birth is not a valid calendar date');
      } else if (dob >= now) {
         errors.push('Date of birth must be in the past');
      }
    }
  }

  // --- status ---
  if (!isUpdate && (!data.status || !data.status.trim())) {
    errors.push('status is required');
  }
  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status.trim().toLowerCase())) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  return errors;
}

module.exports = { validateStudent };
