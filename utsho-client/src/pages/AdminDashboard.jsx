import React from 'react';
import logo from '../assets/logo.png';
import { 
  Menu, Bell, User, Users, Calendar, 
  ClipboardList, BookOpen, HelpCircle, 
  FileText, Home 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import LogoutModal from "../components/LogoutModal";
import { useState } from "react";

const user = getUser();

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ✅ ADDED: state for modal
  const [showLogout, setShowLogout] = useState(false);
  
  const [stats, setStats] = React.useState({
    students: 0,
    teachers: 0,
    notices: 0
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/stats", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setStats(data);

    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">
        
        {/* --- HEADER --- */}
        <header className="flex items-center justify-between p-5 bg-white shadow-sm">
          
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="h-8" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Hi, {user?.name || "Admin"}</p>
            </div>
          </div>

          {/* ✅ CHANGED: open modal instead of instant logout */}
          <button
            onClick={() => setShowLogout(true)}
            className="text-sm font-bold text-[#CC0000]"
          >
            Logout
          </button>

        </header>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-3 gap-3 px-5 mt-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{stats.students}</span>
            <span className="text-xs text-gray-500 mt-1">Students</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{stats.teachers}</span>
            <span className="text-xs text-gray-500 mt-1">Teachers</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{stats.notices}</span>
            <span className="text-xs text-gray-500 mt-1">Notices</span>
          </div>
        </div>

        {/* --- ADMIN FUNCTIONS GRID --- */}
        <div className="px-5 mt-8">
          
          
          <div className="grid grid-cols-2 gap-4">
            
            <button onClick={() => navigate('/students')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-red-50 rounded-lg text-[#CC0000] mb-3">
                <User className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Manage Students</span>
            </button>

            <button onClick={() => navigate('/teachers')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mb-3">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Manage Teachers</span>
            </button>

            <button onClick={() => navigate('/schedule')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-green-50 rounded-lg text-green-600 mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Manage Schedule</span>
            </button>

            <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mb-3">
                <ClipboardList className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Attendance Report</span>
            </button>

            <button onClick={() => navigate('/resources')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600 mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Manage Resources</span>
            </button>

            <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-pink-50 rounded-lg text-pink-600 mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Manage Questions</span>
            </button>

            <button onClick={() => navigate('/notices')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors col-span-2">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Manage Notices</span>
            </button>

          </div>
        </div>

        {/* --- BOTTOM NAVIGATION BAR --- */}
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around items-center py-2 px-2 pb-6 z-50">
          <button className="flex flex-col items-center p-2 text-[#CC0000]">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </button>
          
          <button onClick={() => navigate('/schedule')} className="flex flex-col items-center p-2 text-gray-400 hover:text-gray-800 transition-colors">
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Schedule</span>
          </button>
          
          <button onClick={() => navigate('/notices')} className="flex flex-col items-center p-2 text-gray-400 hover:text-gray-800 transition-colors">
            <Bell className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Notices</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-gray-400 hover:text-gray-800 transition-colors">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>

        {/* ✅ ADDED: LOGOUT MODAL */}
        <LogoutModal
          open={showLogout}
          onCancel={() => setShowLogout(false)}
          onConfirm={() => {
            logout();
            window.location.href = "/";
          }}
        />

      </div>
    </div>
  );
};

export default AdminDashboard;