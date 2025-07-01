// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomeownerDashboard } from './pages/HomeownerDashboard';
import  TechnicianDashboard from './pages/TechnicianDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { MyAppliances } from './pages/MyAppliances';
import  MyServiceRequests  from './pages/MyServiceRequests';
import { AdminDashboardLayout } from './pages/admin/AdminDashboardLayout';
import {Technicians}  from './pages/admin/Technicians';
import { ServiceRequests } from './pages/admin/ServiceRequests';
import { Appliances } from './pages/admin/Appliances';
import { TechnicianDetails } from './pages/admin/TechnicianDetails';


console.log('HomeownerDashboard:', HomeownerDashboard);
console.log('TechnicianDashboard:', TechnicianDashboard);
console.log('AdminDashboard:', AdminDashboard);

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_HOMEOWNER', 'ROLE_TECHNICIAN', 'ROLE_ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/homeowner"
          element={
            <ProtectedRoute allowedRoles={['ROLE_HOMEOWNER']}>
              <HomeownerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyAppliances />} />
          <Route path="service-requests" element={<MyServiceRequests />} />
        </Route>

        <Route
          path="/dashboard/technician"
          element={
            <ProtectedRoute allowedRoles={['ROLE_TECHNICIAN']}>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />

<Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <AdminDashboardLayout />
      
    </ProtectedRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="technicians" element={<Technicians />} />
  <Route path="service-requests" element={<ServiceRequests/>}/>
  <Route path="appliances" element={<Appliances/>}/>
  <Route path="technicians/:id" element={<TechnicianDetails />} />

</Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
