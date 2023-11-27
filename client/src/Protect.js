import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const Protect = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? <Outlet /> : <Navigate to="/" replace />;
};

export default Protect;
