import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import React from 'react'

const ProtectedRoute = () => {
    const [isAuthenticated,setIsAuthenticated]=useState(null);
    useEffect(() => {
        const checkAuth = async () => {
          const response = await fetch("http://localhost/ProjectMatchUp/Core/checksession.php", {
            method: "GET",
            credentials: "include",
          });
          const result = await response.json();
          
          setIsAuthenticated(result.success);
        };
        
        checkAuth();
      }, []);
      if (isAuthenticated === null) {
        return <div>Loading...</div>; 
      }
      return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute