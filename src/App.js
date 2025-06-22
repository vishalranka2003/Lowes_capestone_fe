import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomeownerDashboard } from './pages/HomeownerDashboard';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import { AdminDashboard } from './pages/AdminDashboard';


function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['ROLE_HOMEOWNER', 'ROLE_TECHNICIAN', 'ROLE_ADMIN']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/homeowner" element={
          <ProtectedRoute allowedRoles={['ROLE_HOMEOWNER']}>
            <HomeownerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/technician" element={
          <ProtectedRoute allowedRoles={['ROLE_TECHNICIAN']}>
            <TechnicianDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/admin" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
export default App;
