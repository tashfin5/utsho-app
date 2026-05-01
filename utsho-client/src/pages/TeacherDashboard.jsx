import React, { useState, useEffect } from 'react';
import { 
  Bell, User, Clock, HelpCircle, 
  FileText, UserCheck, Upload, Home, Calendar, LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { getUser, logout } from '../utils/auth';
import LogoutModal from "../components/LogoutModal";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [showLogout, setShowLogout] = useState(false);
  
  const [weeklyClasses, setWeeklyClasses] = useState([]);
  const [todaysClasses, setTodaysClasses] = useState([]);

  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  };

  const fetchScheduleData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/schedule", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setWeeklyClasses(data);
        const today = getCurrentDay();
        setTodaysClasses(data.filter(cls => cls.day === today));
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  // ✅ Calculate Teacher Stats (Classes, Subjects, Days)
  const totalClasses = weeklyClasses.length;
  const uniqueSubjects = new Set(weeklyClasses.map(c => c.subject)).size;
  const uniqueDays = new Set(weeklyClasses.map(c => c.day)).size;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">
        
        <header className="flex items-center justify-between p-5 bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="h-8" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-xs text-gray-500">Hi, {user?.name || "Teacher"}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogout(true)}
            className="p-2 text-gray-400 hover:text-[#CC0000] hover:bg-red-50 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* ✅ UPDATED RED CARD: Classes, Subjects, Days */}
        <div className="px-5 mt-5">
          <div className="bg-[#CC0000] rounded-xl p-5 text-white shadow-md">
            <h2 className="text-lg font-bold mb-4">This Week's Schedule</h2>
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col">
                <span className="text-3xl font-bold">{totalClasses}</span>
                <span className="text-xs opacity-90">Classes</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">{uniqueSubjects}</span>
                <span className="text-xs opacity-90">Subjects</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">{uniqueDays}</span>
                <span className="text-xs opacity-90">Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- TODAY'S CLASSES --- */}
        <div className="px-5 mt-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-sm font-bold text-gray-900">Today's Classes</h2>
            <span className="text-xs font-semibold text-[#CC0000] bg-red-50 px-2 py-1 rounded">{getCurrentDay()}</span>
          </div>
          
          <div className="space-y-3">
            {todaysClasses.length > 0 ? (
              todaysClasses.map((cls) => (
                <div key={cls._id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-[#CC0000] border-y border-r border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{cls.subject}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Class {cls.className}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {cls.time} • {cls.room}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500 text-sm">You have no classes scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- QUICK ACTIONS GRID --- */}
        <div className="px-5 mt-8">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-red-50 rounded-lg text-[#CC0000] mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Create Questions</span>
            </button>
            <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Exam Input</span>
            </button>
            <button onClick={() => navigate('/attendance')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-green-50 rounded-lg text-green-600 mb-3">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Take Attendance</span>
            </button>
            <button onClick={() => navigate('/resources')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Upload Resources</span>
            </button>
            <button onClick={() => navigate('/schedule')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-teal-50 rounded-lg text-teal-600 mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Class Schedule</span>
            </button>
            <button onClick={() => navigate('/notices')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600 mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Post Notice</span>
            </button>
          </div>
        </div>

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

        <LogoutModal open={showLogout} onCancel={() => setShowLogout(false)} onConfirm={() => { logout(); window.location.href = "/"; }} />
      </div>
    </div>
  );
};

export default TeacherDashboard;