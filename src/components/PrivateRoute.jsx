// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("access_token"); // Replace with your actual logic

  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" />;
};

const AppLayout = () => {
  return <Outlet />;
};

export default PrivateRoute;
