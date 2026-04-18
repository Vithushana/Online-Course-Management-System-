/**
 * StatCard — Dashboard metric card
 * Displays a label, value, and icon with a coloured theme (indigo/teal/amber/rose).
 */

import './StatCard.css';

export default function StatCard({ label, value, icon: Icon, color = 'indigo' }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className={`stat-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}
