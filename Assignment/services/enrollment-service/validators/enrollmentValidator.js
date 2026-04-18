/**
 * Enrollment Validator
 * Pure validation function — returns an array of error messages.
 *
 * Rules:
 *  - studentId: required on create, must be a positive integer
 *  - courseId:   required on create, must be a positive integer
 *  - status:    optional, must be one of: active, completed, dropped
 *  - Duplicate: prevent same studentId + courseId pair on create
 */

const VALID_STATUSES = ['active', 'completed', 'dropped'];

/**
 * @param {Object} data — request body
 * @param {boolean} isUpdate
 * @param {Array} existingEnrollments — current enrollment list (for duplicate check)
 * @returns {string[]}
 */
function validateEnrollment(data, isUpdate = false, existingEnrollments = []) {
  const errors = [];

  // --- studentId ---
  if (!isUpdate) {
    if (data.studentId === undefined || data.studentId === null) {
      errors.push('studentId is required');
    } else if (!Number.isInteger(data.studentId) || data.studentId < 1) {
      errors.push('studentId must be a positive integer');
    }
  } else if (data.studentId !== undefined) {
    if (!Number.isInteger(data.studentId) || data.studentId < 1) {
      errors.push('studentId must be a positive integer');
    }
  }

  // --- courseId ---
  if (!isUpdate) {
    if (data.courseId === undefined || data.courseId === null) {
      errors.push('courseId is required');
    } else if (!Number.isInteger(data.courseId) || data.courseId < 1) {
      errors.push('courseId must be a positive integer');
    }
  } else if (data.courseId !== undefined) {
    if (!Number.isInteger(data.courseId) || data.courseId < 1) {
      errors.push('courseId must be a positive integer');
    }
  }

  // --- status ---
  if (data.status !== undefined && data.status !== '') {
    if (!VALID_STATUSES.includes(data.status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  // --- Duplicate check (create only) ---
  if (!isUpdate && data.studentId && data.courseId) {
    const duplicate = existingEnrollments.find(
      (e) => e.studentId === data.studentId && e.courseId === data.courseId
    );
    if (duplicate) {
      errors.push(`Student ${data.studentId} is already enrolled in course ${data.courseId}`);
    }
  }

  return errors;
}

module.exports = { validateEnrollment };
