/**
 * Courses Page — Full CRUD
 * Lists courses in a table, with Create/Edit modal and Delete confirmation.
 */

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import '../../styles/CrudPage.css';

const emptyForm = { title: '', description: '', credits: '', duration: '', schedule: '', category: '' };

function validateCourseForm(form) {
  const errors = {};
  if (!form.title || !form.title.trim()) errors.title = 'Title is required';
  else if (form.title.trim().length < 2 || form.title.trim().length > 150) errors.title = 'Title must be 2-150 characters';
  if (form.description && form.description.length > 500) errors.description = 'Max 500 characters';
  if (!form.credits && form.credits !== 0) errors.credits = 'Credits is required';
  else {
    const num = Number(form.credits);
    if (!Number.isInteger(num)) errors.credits = 'Must be a whole number';
    else if (num < 1 || num > 30) errors.credits = 'Must be between 1 and 30';
  }
  if (form.duration && form.duration.length > 50) errors.duration = 'Max 50 characters';
  if (form.schedule && form.schedule.length > 100) errors.schedule = 'Max 100 characters';
  if (form.category && form.category.length > 50) errors.category = 'Max 50 characters';
  return errors;
}

export default function Courses() {
  const api = useApi();
  const { addToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadCourses(); }, []);

  async function loadCourses() {
    setLoading(true);
    try {
      setCourses(await api.get('/api/courses'));
    } catch {
      addToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() { setEditing(null); setForm(emptyForm); setFormErrors({}); setModalOpen(true); }
  function openEdit(c) {
    setEditing(c);
    setForm({ title: c.title, description: c.description || '', credits: c.credits ?? '', duration: c.duration || '', schedule: c.schedule || '', category: c.category || '' });
    setFormErrors({});
    setModalOpen(true);
  }

  async function handleSave() {
    const errors = validateCourseForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    // Send credits as a number
    const payload = { ...form, credits: Number(form.credits) };
    try {
      if (editing) {
        await api.put(`/api/courses/${editing.id}`, payload);
        addToast('Course updated successfully', 'success');
      } else {
        await api.post('/api/courses', payload);
        addToast('Course created successfully', 'success');
      }
      setModalOpen(false);
      loadCourses();
    } catch { addToast('Failed to save course', 'error'); }
  }

  function confirmDelete(c) { setDeleteTarget(c); setConfirmOpen(true); }
  async function handleDelete() {
    try {
      await api.del(`/api/courses/${deleteTarget.id}`);
      addToast('Course deleted', 'success');
      setConfirmOpen(false);
      loadCourses();
    } catch { addToast('Failed to delete course', 'error'); }
  }

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Courses</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add Course</button>
      </div>

      <div className="page-card">
        <div className="page-card-header">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--gray-400)' }} />
            <input className="search-input" style={{ paddingLeft: 32 }} placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>{filtered.length} course{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><BookOpen size={48} /><p>No courses found. Click "Add Course" to create one.</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>ID</th><th>Title</th><th>Category</th><th>Credits</th><th>Duration</th><th>Schedule</th><th>Created</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{c.title}</td>
                    <td><span className="badge badge-info">{c.category || 'N/A'}</span></td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{c.credits ?? '—'}</td>
                    <td>{c.duration || '—'}</td>
                    <td>{c.schedule || '—'}</td>
                    <td>{c.createdDate}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}><Pencil size={15} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => confirmDelete(c)} style={{ color: 'var(--error)' }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Course' : 'Add New Course'}
        footer={<><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</button></>}>
        <div className="form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="Course title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            {formErrors.title && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.title}</span>}
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Description</label>
            <input className="form-input" placeholder="Brief description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {formErrors.description && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.description}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Credits *</label>
            <input className="form-input" type="number" min="1" max="30" placeholder="e.g. 3" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} />
            {formErrors.credits && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.credits}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Duration</label>
            <input className="form-input" placeholder="e.g. 3 months" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            {formErrors.duration && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.duration}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Schedule</label>
            <input className="form-input" placeholder="e.g. Mon/Wed 10am" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
            {formErrors.schedule && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.schedule}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input className="form-input" placeholder="e.g. IT, Science" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            {formErrors.category && <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{formErrors.category}</span>}
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Course"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`} />
    </div>
  );
}
