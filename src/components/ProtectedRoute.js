import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const testResponse = await fetch("/User/test", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (testResponse.ok) {
          setIsAuthenticated(true);
        } else {
          // Try to refresh the token
          const refreshResponse = await fetch("/User/refresh", {
            method: "GET",
            credentials: "include",
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem("accessToken", data.accessToken);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("accessToken");
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <div>Ładowanie...</div>;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Authenticated
  return children;
};

export default ProtectedRoute;
