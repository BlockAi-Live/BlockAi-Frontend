import React, { useEffect } from 'react'

import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';


const AuthSuccess = () => {
  
    const navigate = useNavigate();
    const { login } = useAuth();
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userParam = params.get("user");

  if (token && userParam) {
    const user = JSON.parse(decodeURIComponent(userParam));
    login(token, user); 
    
    navigate("/dashboard", { replace: true });
  }
}, []);
  return (
    <div>Authorization</div>
  )
}

export default AuthSuccess