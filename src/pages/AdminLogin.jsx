import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <button onClick={handleLogin}>Login as Admin</button>
    </div>
  );
}