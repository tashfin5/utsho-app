import React from 'react';
import { 
  Menu, Bell, User, Clock, HelpCircle, 
  FileText, UserCheck, Upload, Home, Calendar 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">
        
        {/* --- HEADER --- */}
        <header className="flex justify-between items-center p-5 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <Menu className="w-6 h-6 text-gray-800" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Teacher Dashboard</h1>
              <p className="text-xs text-gray-500">Welcome back, Prof. Rahman</p>
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

        {/* --- TODAY'S CLASSES --- */}
        <div className="px-5 mt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Today's Classes</h2>
          
          <div className="space-y-3">
            {/* Math Class */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Mathematics</h3>
                <p className="text-xs text-gray-500 mt-0.5">Class 10A</p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  10:00 AM - 11:30 AM
                </div>
              </div>
              <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-100">
                Upcoming
              </span>
            </div>

            {/* Physics Class */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Physics</h3>
                <p className="text-xs text-gray-500 mt-0.5">Class 10B</p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  12:00 PM - 1:30 PM
                </div>
              </div>
              <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-100">
                Upcoming
              </span>
            </div>

            {/* Chemistry Class */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center opacity-70">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Chemistry</h3>
                <p className="text-xs text-gray-500 mt-0.5">Class 11A</p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  2:00 PM - 3:30 PM
                </div>
              </div>
              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200">
                Completed
              </span>
            </div>
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

            <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors">
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

            <button onClick={() => navigate('/notices')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-[#CC0000] transition-colors col-span-2">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600 mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Post Notice</span>
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

      </div>
    </div>
  );
};

export default TeacherDashboard;