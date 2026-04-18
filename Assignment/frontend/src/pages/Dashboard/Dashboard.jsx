/**
 * Dashboard Page
 * Shows overview stats, recent enrollments, and quick action links.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, ClipboardList, GraduationCap, UserPlus, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import StatCard from '../../components/StatCard/StatCard';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const api = useApi();
  const [stats, setStats] = useState({ students: 0, courses: 0, enrollments: 0, instructors: 0 });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoadingStats(true);
    try {
      // Fetch counts from all services in parallel
      const [students, courses, enrollments, instructors] = await Promise.all([
        api.get('/api/students'),
        api.get('/api/courses'),
        api.get('/api/enrollments'),
        api.get('/api/instructors'),
      ]);
      setStats({
        students: students.length,
        courses: courses.length,
        enrollments: enrollments.length,
        instructors: instructors.length,
      });
      // Show the most recent 5 enrollments
      setRecentEnrollments(enrollments.slice(-5).reverse());
    } catch {
      // If services aren't running yet, show zeros
      console.log('Could not fetch dashboard data — are all services running?');
    } finally {
      setLoadingStats(false);
    }
  }

  return (
    <div className="dashboard">
      {/* Greeting */}
      <div className="dashboard-header">
        <h1 className="dashboard-greeting">
          Welcome back, {user?.name || 'Admin'} 👋
        </h1>
        <p className="dashboard-subtitle">
          Here's an overview of your learning platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 12 }} />
          ))
        ) : (
          <>
            <StatCard label="Total Students" value={stats.students} icon={Users} color="indigo" />
            <StatCard label="Total Courses" value={stats.courses} icon={BookOpen} color="teal" />
            <StatCard label="Active Enrollments" value={stats.enrollments} icon={ClipboardList} color="amber" />
            <StatCard label="Instructors" value={stats.instructors} icon={GraduationCap} color="rose" />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/students" className="quick-action-card">
            <UserPlus size={28} />
            <span>Add Student</span>
          </Link>
          <Link to="/courses" className="quick-action-card">
            <PlusCircle size={28} />
            <span>Add Course</span>
          </Link>
          <Link to="/enrollments" className="quick-action-card">
            <ClipboardList size={28} />
            <span>New Enrollment</span>
          </Link>
          <Link to="/instructors" className="quick-action-card">
            <GraduationCap size={28} />
            <span>Add Instructor</span>
          </Link>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Recent Enrollments</h2>
        {recentEnrollments.length === 0 ? (
          <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>
            No enrollments yet. Start by adding students and courses, then create enrollments.
          </p>
        ) : (
          <div className="recent-list">
            {recentEnrollments.map((enr) => (
              <div key={enr.id} className="recent-item">
                <div className="recent-item-left">
                  <div className="recent-item-icon">
                    <ClipboardList size={18} />
                  </div>
                  <div className="recent-item-text">
                    <strong>Student #{enr.studentId} → Course #{enr.courseId}</strong>
                    <span>Enrolled on {enr.enrolledDate}</span>
                  </div>
                </div>
                <span className={`badge badge-${enr.status === 'active' ? 'success' : 'warning'}`}>
                  {enr.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
