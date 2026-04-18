/**
 * Sidebar — Left navigation panel
 * Contains the app logo/brand and links to every page.
 * On mobile, slides in as an overlay.
 */

import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/enrollments', label: 'Enrollments', icon: ClipboardList },
  { to: '/instructors', label: 'Instructors', icon: GraduationCap },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <GraduationCap size={22} />
          </div>
          <div className="sidebar-brand">
            OC<span>MS</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main Menu</div>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={logout} style={{ width: '100%' }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
