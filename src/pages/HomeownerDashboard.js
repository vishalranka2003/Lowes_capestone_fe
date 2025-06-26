import { Outlet } from 'react-router-dom';

export const HomeownerDashboard = () => {
  return (
     <>
      <h1> Homeowner Dashboard </h1>
      {/* other dashboard layout elements like sidebar, header */}
      <Outlet /> {/* This renders the nested routes, e.g. MyAppliances */}
    </>
  );
};
