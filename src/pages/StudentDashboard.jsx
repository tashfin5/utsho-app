import React from 'react';
import { 
  Menu, Bell, User, Calendar, 
  BookOpen, FileText, Home, Edit3, 
  BarChart2, CalendarDays 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">
        
        <header className="flex justify-between items-center p-5 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <Menu className="w-6 h-6 text-gray-800" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Student Dashboard</h1>
              <p className="text-xs text-gray-500">Hi, Nafiz Ahmed</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="relative p-1 hover:bg-gray-100 rounded transition-colors">
              <Bell className="w-6 h-6 text-gray-800" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#CC0000] rounded-full"></span>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <User className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </header>

        <div className="px-5 mt-5 space-y-5">
          <div className="bg-[#CC0000] rounded-xl p-5 text-white shadow-md">
            <h2 className="text-sm font-semibold mb-4 opacity-90">Performance Overview</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold">87%</p>
                <p className="text-[11px] text-red-100 mt-0.5">Attendance</p>
              </div>
              <div className="w-px h-10 bg-red-400 opacity-50"></div>
              <div>
                <p className="text-3xl font-bold">8.5</p>
                <p className="text-[11px] text-red-100 mt-0.5">Avg Score</p>
              </div>
              <div className="w-px h-10 bg-red-400 opacity-50"></div>
              <div>
                <p className="text-3xl font-bold">12</p>
                <p className="text-[11px] text-red-100 mt-0.5">Exams</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#CC0000]"></div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Next Exam</p>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Mathematics Final</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  March 20, 2026 • 10:00 AM
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
              
              {/* THIS BUTTON NOW NAVIGATES TO THE ATTENDANCE PAGE */}
              <button onClick={() => navigate('/attendance')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors relative overflow-hidden">
                <div className="p-2 bg-red-50 rounded-lg text-[#CC0000] mb-3 relative z-10">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-800 relative z-10">Attendance %</span>
                <span className="text-xs text-gray-400 mt-0.5 relative z-10">Attendance Calendar</span>
                <span className="absolute -bottom-2 -right-2 text-5xl font-bold text-gray-50 opacity-50 z-0">87%</span>
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

      </div>
    </div>
  );
};

export default StudentDashboard;