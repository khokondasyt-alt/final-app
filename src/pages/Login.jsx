import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/user-dashboard");
  };

  return (
    <div>
      <h2>User Login</h2>
      <button onClick={handleLogin}>Login as User</button>
    </div>
  );
}