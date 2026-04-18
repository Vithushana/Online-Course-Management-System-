/**
 * Layout — App shell that wraps authenticated pages.
 * Contains the Sidebar, Navbar, and a content area.
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
