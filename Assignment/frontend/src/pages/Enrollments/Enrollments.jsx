/**
 * Enrollments Page — Full CRUD
 * Lists enrollments (student ↔ course links) with Create/Edit modal and Delete.
 */

import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import '../../styles/CrudPage.css';

const emptyForm = { studentId: '', courseId: '', status: 'active' };

export default function Enrollments() {
  const api = useApi();
  const { addToast } = useToast();
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [enr, stu, crs] = await Promise.all([
        api.get('/api/enrollments'),
        api.get('/api/students'),
        api.get('/api/courses'),
      ]);
      setEnrollments(enr);
      setStudents(stu);
      setCourses(crs);
    } catch {
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Helper: look up names from IDs
  const studentName = (id) => students.find((s) => s.id === id)?.name || `Student #${id}`;
  const courseName = (id) => courses.find((c) => c.id === id)?.title || `Course #${id}`;

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(e) {
    setEditing(e);
    setForm({ studentId: String(e.studentId), courseId: String(e.courseId), status: e.status || 'active' });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.studentId || !form.courseId) { addToast('Student and Course are required', 'warning'); return; }
    const payload = { studentId: parseInt(form.studentId), courseId: parseInt(form.courseId), status: form.status };
    try {
      if (editing) {
        await api.put(`/api/enrollments/${editing.id}`, payload);
        addToast('Enrollment updated', 'success');
      } else {
        await api.post('/api/enrollments', payload);
        addToast('Enrollment created', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch { addToast('Failed to save enrollment', 'error'); }
  }

  function confirmDelete(e) { setDeleteTarget(e); setConfirmOpen(true); }
  async function handleDelete() {
    try {
      await api.del(`/api/enrollments/${deleteTarget.id}`);
      addToast('Enrollment deleted', 'success');
      setConfirmOpen(false);
      loadData();
    } catch { addToast('Failed to delete enrollment', 'error'); }
  }

  const filtered = enrollments.filter((e) =>
    studentName(e.studentId).toLowerCase().includes(search.toLowerCase()) ||
    courseName(e.courseId).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Enrollments</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> New Enrollment</button>
      </div>

      <div className="page-card">
        <div className="page-card-header">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--gray-400)' }} />
            <input className="search-input" style={{ paddingLeft: 32 }} placeholder="Search enrollments..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>{filtered.length} enrollment{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><ClipboardList size={48} /><p>No enrollments found. Click "New Enrollment" to enroll a student.</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>ID</th><th>Student</th><th>Course</th><th>Status</th><th>Enrolled Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td style={{ fontWeight: 600 }}>{studentName(e.studentId)}</td>
                    <td>{courseName(e.courseId)}</td>
                    <td>
                      <span className={`badge ${e.status === 'active' ? 'badge-success' : e.status === 'completed' ? 'badge-info' : 'badge-warning'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td>{e.enrolledDate}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(e)}><Pencil size={15} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => confirmDelete(e)} style={{ color: 'var(--error)' }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Enrollment' : 'New Enrollment'}
        footer={<><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>{editing ? 'Update' : 'Enroll'}</button></>}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Student *</label>
            <select className="form-select" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
              <option value="">Select a student</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} (#{s.id})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Course *</label>
            <select className="form-select" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
              <option value="">Select a course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title} (#{c.id})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Enrollment"
        message={`Are you sure you want to remove this enrollment? This action cannot be undone.`} />
    </div>
  );
}
