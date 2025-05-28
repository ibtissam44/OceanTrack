import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, layout: Layout }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return Layout ? <Layout>{element}</Layout> : element;
};

export default PrivateRoute;
