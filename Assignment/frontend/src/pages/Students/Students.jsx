/**
 * Students Page — Full CRUD
 * Lists all students in a table, with Create/Edit (modal) and Delete (confirm dialog).
 */

import { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import '../../styles/CrudPage.css';

const emptyForm = { registrationNumber: '', name: '', email: '', phone: '', dateOfBirth: '', status: 'active' };

const STATUS_OPTIONS = ['active', 'inactive', 'graduated'];

// ---------- Inline validation helpers ----------
function validateStudentForm(form, isEdit) {
  const errors = {};

  // registrationNumber
  if (!form.registrationNumber || !form.registrationNumber.trim()) {
    errors.registrationNumber = 'Registration number is required';
  } else if (!/^[A-Za-z0-9]{4,20}$/.test(form.registrationNumber.trim())) {
    errors.registrationNumber = 'Must be 4-20 alphanumeric characters';
  }

  // name
  if (!form.name || !form.name.trim()) {
    errors.name = 'Name is required';
  } else if (form.name.trim().length < 2 || form.name.trim().length > 50) {
    errors.name = 'Name must be 2-50 characters';
  }

  // email
  if (!form.email || !form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Invalid email format';
  } else if (form.email !== form.email.toLowerCase()) {
    errors.email = 'Email must be lowercase';
  }

  // phone
  if (!form.phone || !form.phone.trim()) {
    errors.phone = 'Phone is required';
  } else if (!/^(0\d{9}|\+94\d{9})$/.test(form.phone.trim())) {
    errors.phone = '10 digits starting with 0, or +94 followed by 9 digits';
  }

  // dateOfBirth
  if (!form.dateOfBirth || !form.dateOfBirth.trim()) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const dob = new Date(form.dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.dateOfBirth = 'Invalid date';
    } else if (dob >= new Date()) {
      errors.dateOfBirth = 'Must be a past date';
    }
  }

  // status
  if (!form.status || !STATUS_OPTIONS.includes(form.status)) {
    errors.status = 'Status must be active, inactive, or graduated';
  }

  return errors;
}

// Status badge color helper
function statusBadge(status) {
  const colors = {
    active: { bg: '#dcfce7', color: '#166534' },
    inactive: { bg: '#fef3c7', color: '#92400e' },
    graduated: { bg: '#dbeafe', color: '#1e40af' },
  };
  const style = colors[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 12,
      fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'capitalize',
      backgroundColor: style.bg, color: style.color,
    }}>
      {status || '—'}
    </span>
  );
}

export default function Students() {
  const api = useApi();
  const { addToast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, object = edit
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadStudents(); }, []);

  async function loadStudents() {
    setLoading(true);
    try {
      const data = await api.get('/api/students');
      setStudents(data);
    } catch {
      addToast('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(student) {
    setEditing(student);
    setForm({
      registrationNumber: student.registrationNumber || '',
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      dateOfBirth: student.dateOfBirth || '',
      status: student.status || 'active',
    });
    setFormErrors({});
    setModalOpen(true);
  }

  async function handleSave() {
    const errors = validateStudentForm(form, !!editing);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      if (editing) {
        await api.put(`/api/students/${editing.id}`, form);
        addToast('Student updated successfully', 'success');
      } else {
        await api.post('/api/students', form);
        addToast('Student created successfully', 'success');
      }
      setModalOpen(false);
      loadStudents();
    } catch (err) {
      // Try to show backend validation errors if available
      if (err?.response?.data?.errors) {
        addToast(err.response.data.errors.join(', '), 'error');
      } else {
        addToast('Failed to save student', 'error');
      }
    }
  }

  function confirmDelete(student) {
    setDeleteTarget(student);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    try {
      await api.del(`/api/students/${deleteTarget.id}`);
      addToast('Student deleted', 'success');
      setConfirmOpen(false);
      loadStudents();
    } catch {
      addToast('Failed to delete student', 'error');
    }
  }

  const filtered = students.filter((s) =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.registrationNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Students</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="page-card">
        <div className="page-card-header">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--gray-400)' }} />
            <input
              className="search-input"
              style={{ paddingLeft: 32 }}
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>
            {filtered.length} student{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <p>No students found. Click "Add Student" to create one.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Reg. No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date of Birth</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td style={{ fontFamily: 'monospace' }}>{s.registrationNumber || '—'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.phone || '—'}</td>
                    <td>{s.dateOfBirth || '—'}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td>{s.registeredDate}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)} title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => confirmDelete(s)} title="Delete" style={{ color: 'var(--error)' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Student' : 'Add New Student'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editing ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Registration Number *</label>
            <input className="form-input" placeholder="e.g. IT2026001" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
            {formErrors.registrationNumber && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.registrationNumber}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input className="form-input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {formErrors.name && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" placeholder="Email address (lowercase)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {formErrors.email && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input className="form-input" placeholder="e.g. 0771234567 or +94771234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            {formErrors.phone && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.phone}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth *</label>
            <input className="form-input" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            {formErrors.dateOfBirth && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.dateOfBirth}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Status *</label>
            <select className="form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
            {formErrors.status && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.status}</span>}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
