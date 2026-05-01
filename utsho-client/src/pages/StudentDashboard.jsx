import React, { useState, useEffect } from 'react';
import { 
  Menu, Bell, User, Calendar, 
  BookOpen, FileText, Home, LogOut, Edit3, 
  BarChart2, CalendarDays 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { getUser, logout } from '../utils/auth';
import LogoutModal from "../components/LogoutModal";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [showLogout, setShowLogout] = useState(false);
  
  // States for real data
  const [weeklyClasses, setWeeklyClasses] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalExams: 0,
    nextExam: { subject: "No upcoming exams", date: "--", time: "--" }
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Schedule
      const scheduleRes = await fetch("https://utsho-app.onrender.com", { headers });
      if (scheduleRes.ok) {
        const schedData = await scheduleRes.json();
        if (Array.isArray(schedData)) setWeeklyClasses(schedData);
      }

      // 2. Fetch Other Dashboard Data
      const dashRes = await fetch("https://utsho-app.onrender.com", { headers });
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setDashboardData(dashData);
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Calculate Student Stats
  const totalClasses = weeklyClasses.length;
  const uniqueSubjects = new Set(weeklyClasses.map(c => c.subject)).size;
  const totalExams = dashboardData.totalExams || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">
        
        <header className="flex items-center justify-between p-5 bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="h-8" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-xs text-gray-500">Hi, {user?.name || "Student"}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogout(true)}
            className="p-2 text-gray-400 hover:text-[#CC0000] hover:bg-red-50 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="px-5 mt-5 space-y-5">
          
          {/* ✅ UPDATED RED CARD: Classes, Subjects, Exams */}
          <div className="bg-[#CC0000] rounded-xl p-5 text-white shadow-md">
            <h2 className="text-lg font-bold mb-4">This Week's Overview</h2>
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
                <span className="text-3xl font-bold">{totalExams}</span>
                <span className="text-xs opacity-90">Exams</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#CC0000]"></div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Next Exam</p>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{dashboardData.nextExam?.subject || "No upcoming exams"}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {dashboardData.nextExam?.date !== "--" 
                    ? `${dashboardData.nextExam.date} • ${dashboardData.nextExam.time}` 
                    : "No dates scheduled"}
                </p>
              </div>
              <button className="bg-[#CC0000] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-colors">
                Prepare
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-4 mt-2">Student Portal</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => navigate('/attendance')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors relative overflow-hidden">
                <div className="p-2 bg-red-50 rounded-lg text-[#CC0000] mb-3 relative z-10">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-800 relative z-10">Attendance %</span>
                <span className="text-xs text-gray-400 mt-0.5 relative z-10">Attendance Calendar</span>
              </button>

              <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mb-3">
                  <Edit3 className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-800">Give Exams</span>
              </button>

              <button onClick={() => navigate('/schedule')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
                <div className="p-2 bg-green-50 rounded-lg text-green-600 mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-800">Class Schedule</span>
              </button>

              <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mb-3">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-800">View Results</span>
              </button>

              <button onClick={() => navigate('/resources')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600 mb-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-800">Study Resources</span>
              </button>

              <button onClick={() => navigate('/notices')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-800">Notices</span>
              </button>
            </div>
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

export default StudentDashboard;