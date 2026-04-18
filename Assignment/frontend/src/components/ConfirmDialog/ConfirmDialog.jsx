/**
 * ConfirmDialog — Delete / destructive action confirmation
 * Shows a warning-styled modal asking the user to confirm.
 */

import Modal from '../Modal/Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Confirm Action'}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </>
      }
    >
      <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>
        {message || 'Are you sure you want to perform this action? This cannot be undone.'}
      </p>
    </Modal>
  );
}
