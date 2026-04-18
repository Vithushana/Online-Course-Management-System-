/**
 * Instructors Page — Full CRUD
 * Lists instructors with Create/Edit modal and Delete confirmation.
 */

import { useState, useEffect } from 'react';
import { GraduationCap, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import '../../styles/CrudPage.css';

const emptyForm = { name: '', email: '', specialization: '', phone: '', assignedCourses: '' };

export default function Instructors() {
  const api = useApi();
  const { addToast } = useToast();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadInstructors(); }, []);

  async function loadInstructors() {
    setLoading(true);
    try {
      setInstructors(await api.get('/api/instructors'));
    } catch {
      addToast('Failed to load instructors', 'error');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(i) {
    setEditing(i);
    setForm({
      name: i.name, email: i.email,
      specialization: i.specialization || '',
      phone: i.phone || '',
      assignedCourses: (i.assignedCourses || []).join(', '),
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.email) { addToast('Name and email are required', 'warning'); return; }
    const payload = {
      ...form,
      assignedCourses: form.assignedCourses
        ? form.assignedCourses.split(',').map((s) => parseInt(s.trim())).filter(Boolean)
        : [],
    };
    try {
      if (editing) {
        await api.put(`/api/instructors/${editing.id}`, payload);
        addToast('Instructor updated', 'success');
      } else {
        await api.post('/api/instructors', payload);
        addToast('Instructor created', 'success');
      }
      setModalOpen(false);
      loadInstructors();
    } catch { addToast('Failed to save instructor', 'error'); }
  }

  function confirmDelete(i) { setDeleteTarget(i); setConfirmOpen(true); }
  async function handleDelete() {
    try {
      await api.del(`/api/instructors/${deleteTarget.id}`);
      addToast('Instructor deleted', 'success');
      setConfirmOpen(false);
      loadInstructors();
    } catch { addToast('Failed to delete instructor', 'error'); }
  }

  const filtered = instructors.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.specialization || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Instructors</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add Instructor</button>
      </div>

      <div className="page-card">
        <div className="page-card-header">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--gray-400)' }} />
            <input className="search-input" style={{ paddingLeft: 32 }} placeholder="Search instructors..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>{filtered.length} instructor{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><GraduationCap size={48} /><p>No instructors found. Click "Add Instructor" to create one.</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Specialization</th><th>Phone</th><th>Courses</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{i.name}</td>
                    <td>{i.email}</td>
                    <td><span className="badge badge-info">{i.specialization || 'N/A'}</span></td>
                    <td>{i.phone || '—'}</td>
                    <td>{(i.assignedCourses || []).length > 0 ? i.assignedCourses.join(', ') : '—'}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(i)}><Pencil size={15} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => confirmDelete(i)} style={{ color: 'var(--error)' }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Instructor' : 'Add New Instructor'}
        footer={<><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</button></>}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input className="form-input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input className="form-input" placeholder="e.g. AI, Web Dev" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Assigned Course IDs</label>
            <input className="form-input" placeholder="e.g. 1, 3, 5 (comma-separated)" value={form.assignedCourses} onChange={(e) => setForm({ ...form, assignedCourses: e.target.value })} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Instructor"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} />
    </div>
  );
}
