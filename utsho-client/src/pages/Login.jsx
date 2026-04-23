import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 🔥 CHANGE THIS TO YOUR LOCAL IP IF NEEDED
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = res.data;

      // ✅ Save token
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Role-based redirect
      if (user.role === "admin") {
        navigate('/admin');
      } else if (user.role === "teacher") {
        navigate('/teacher');
      } else {
        navigate('/student');
      }

    } catch (err) {
      console.error(err);

      // 🔁 FALLBACK (your old logic, so nothing breaks)
      if (email === 'admin@email.com') {
        navigate('/admin');
      } else if (email === 'teacher@email.com') {
        navigate('/teacher');
      } else if (email === 'student@email.com') {
        navigate('/student');
      } else {
        alert('Login failed. Check credentials or use test emails.');
      }
    }
  };

  useEffect(() => {
  const user = localStorage.getItem("user");

  if (user) {
    const parsed = JSON.parse(user);

    if (parsed.role === "admin") navigate("/admin");
    else if (parsed.role === "teacher") navigate("/teacher");
    else navigate("/student");
  }
}, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        
        <div className="flex justify-center mb-6">
          <div className="text-[#CC0000] font-bold px-4 py-1 text-2xl flex items-center gap-2">
            <span className="bg-[#CC0000] text-white px-2 py-1 rounded">উ</span> 
            উৎস
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email / Phone</label>
            <div className="relative">
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone" 
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] transition-colors"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] transition-colors"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-sm font-semibold text-[#CC0000] hover:underline">Forgot Password?</a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#CC0000] text-white font-bold py-3 rounded-md mt-2 hover:bg-red-700 transition-colors shadow-sm"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
          <p>Use admin@email.com, teacher@email.com, or student@email.com to</p>
          <p>test different roles</p>
        </div>

      </div>
    </div>
  );
};

export default Login;