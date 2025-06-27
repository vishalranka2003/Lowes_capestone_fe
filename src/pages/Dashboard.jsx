import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const Dashboard = () => {
  const { role } = useSelector((state) => state.auth);

  if (role === 'ROLE_HOMEOWNER') return <Navigate to="/dashboard/homeowner" replace />;
  if (role === 'ROLE_TECHNICIAN') return <Navigate to="/dashboard/technician" replace />;
  if (role === 'ROLE_ADMIN') return <Navigate to="/dashboard/admin" replace />;

  return <Navigate to="/" replace />;
};
