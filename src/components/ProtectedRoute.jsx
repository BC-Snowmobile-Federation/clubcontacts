import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ hasUser, children }) => {
  console.log(hasUser)
  if (!hasUser) {
    return <Navigate to="/" />;
  }
  return children;
};


export default ProtectedRoute;