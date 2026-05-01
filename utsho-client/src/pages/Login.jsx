import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ adjust path if needed
import logo from '../assets/Asset.png';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://utsho-app.onrender.com", {
        userId,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ BACK-BUTTON FIX: Added { replace: true } to wipe Login from history
      if (user.role === "admin") navigate('/admin', { replace: true });
      else if (user.role === "teacher") navigate('/teacher', { replace: true });
      else navigate('/student', { replace: true });

    } catch (err) {
      console.error(err);
      alert('Login failed. Check ID and password.');
    }
  };

  // ✅ AUTO-LOGIN & HISTORY FIX
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsed = JSON.parse(user);
      // ✅ Added { replace: true } here so already logged-in users 
      // can't "go back" to the login screen
      if (parsed.role === "admin") navigate("/admin", { replace: true });
      else if (parsed.role === "teacher") navigate("/teacher", { replace: true });
      else navigate("/student", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans text-left">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Utsho Logo" className="h-12 object-contain" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Utsho</h1>
          <p className="text-gray-500 text-sm mt-1">Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* USER ID FIELD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">User ID</label>
            <div className="relative">
              <input 
                type="text" 
                value={userId}
                onChange={(e) => setUserId(e.target.value.toUpperCase())} 
                placeholder="Enter your ID" 
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000]"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A4 4 0 017 16h10a4 4 0 011.879.804M12 12a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000]"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm font-semibold text-[#CC0000] hover:underline">
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#CC0000] text-white font-bold py-3 rounded-md mt-2 hover:bg-red-700 transition-colors shadow-sm"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;