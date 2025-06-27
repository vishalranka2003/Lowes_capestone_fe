import { Outlet, useLocation } from 'react-router-dom';

export const HomeownerDashboard = () => {
  const location = useLocation();
  
  const getHeaderTitle = () => {
    if (location.pathname.includes('/service-requests')) {
      return 'Service Dashboard';
    }
    return 'Homeowner Dashboard';
  };

  return (
     <>
      <h1>{getHeaderTitle()}</h1>
      {/* other dashboard layout elements like sidebar, header */}
      <Outlet /> {/* This renders the nested routes, e.g. MyAppliances */}
    </>
  );
};
