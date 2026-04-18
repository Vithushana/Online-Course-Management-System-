/**
 * Navbar — Top navigation bar
 * Shows app name, menu toggle (mobile), user avatar, and logout button.
 */

import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  // Get initials from user name for avatar
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu size={22} />
        </button>
        <span className="navbar-title">Online Course Management System</span>
      </div>
      <div className="navbar-right">
        <span className="navbar-user-name">{user?.name || 'User'}</span>
        <div className="navbar-avatar" title={user?.name || 'User'}>
          {initials}
        </div>
        <button className="navbar-logout btn btn-ghost btn-sm" onClick={logout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
