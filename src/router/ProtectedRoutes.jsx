// import React, { useEffect } from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoutes = ({ children, redirect, isAuthenticated }) => {
//   const { role } = useSelector((state) => state.auth);

//   if (!isAuthenticated) {
//     return <Navigate to={redirect} />;
//   }
//   return <>{children}</>;
// };

// export default ProtectedRoutes;


import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = ({
  children,
  redirect = "/login",
  isAuthenticated,
  notAllowedRoles = [],
  fallbackRedirect = "/dashboard", // Optional - redirect when role is not allowed
}) => {
  const { role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={redirect} replace />;
  }

  if (notAllowedRoles.includes(role)) {
    return <Navigate to={fallbackRedirect} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;

