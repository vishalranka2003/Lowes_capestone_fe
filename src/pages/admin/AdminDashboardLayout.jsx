// src/pages/admin/AdminDashboardLayout.js
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Wrench, Monitor } from 'lucide-react';
import '../../styles/AdminDashboard.css';

export const AdminDashboardLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard/admin" end className="nav-link">
            <LayoutDashboard className="nav-icon" />
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/admin/technicians" className="nav-link">
            <Users className="nav-icon" />
            Technicians
          </NavLink>
          <NavLink to="/dashboard/admin/service-requests" className="nav-link">
            <Wrench className="nav-icon" />
            Service Requests
          </NavLink>
          <NavLink to="/dashboard/admin/appliances" className="nav-link">
            <Monitor className="nav-icon" />
            Appliances
          </NavLink>
        </nav>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <h1>Welcome, Admin</h1>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
