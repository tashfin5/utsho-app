import React from 'react';
import { ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AttendanceTracker = () => {
  const navigate = useNavigate();

  // Generating a simple array of 31 days for March 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">

        {/* --- HEADER --- */}
        <header className="flex items-center gap-4 p-5 bg-white shadow-sm relative z-10">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Attendance</h1>
            <p className="text-xs text-gray-500">Track your presence</p>
          </div>
        </header>

        {/* --- OVERALL ATTENDANCE BANNER --- */}
        <div className="px-5 mt-5">
          <div className="bg-[#CC0000] rounded-xl p-6 text-white shadow-md relative overflow-hidden">
            {/* Background decorative icon */}
            <div className="absolute right-[-20px] top-[-10px] opacity-10">
              <CalendarIcon className="w-32 h-32" />
            </div>
            
            <p className="text-sm font-semibold mb-1 opacity-90">Overall Attendance</p>
            <p className="text-5xl font-bold mb-8">80%</p>
            
            <div className="flex justify-between items-center text-center relative z-10">
              <div>
                <p className="text-xl font-bold">12</p>
                <p className="text-[10px] text-red-100 uppercase tracking-wider mt-0.5">Present</p>
              </div>
              <div className="w-px h-8 bg-red-400 opacity-50"></div>
              <div>
                <p className="text-xl font-bold">2</p>
                <p className="text-[10px] text-red-100 uppercase tracking-wider mt-0.5">Absent</p>
              </div>
              <div className="w-px h-8 bg-red-400 opacity-50"></div>
              <div>
                <p className="text-xl font-bold">1</p>
                <p className="text-[10px] text-red-100 uppercase tracking-wider mt-0.5">Leave</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- INTERACTIVE CALENDAR --- */}
        <div className="px-5 mt-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            
            {/* Calendar Controls */}
            <div className="flex justify-between items-center mb-6">
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <h3 className="font-bold text-gray-900">March 2026</h3>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Days of the Week */}
            <div className="grid grid-cols-7 gap-1 text-center mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <span key={day} className="text-[10px] font-bold text-gray-400 uppercase">
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Grid (Hardcoded logic for prototype display) */}
            <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
              {daysInMonth.map(day => {
                // Mocking data based on prototype:
                const isAbsent = day === 4 || day === 11;
                const isLeave = day === 6;
                const isPresent = day < 15 && !isAbsent && !isLeave;
                const isToday = day === 15;

                let dayStyle = "text-gray-700 hover:bg-gray-50"; // Future days
                if (isToday) dayStyle = "bg-[#CC0000] text-white font-bold shadow-sm";
                else if (isAbsent) dayStyle = "bg-red-50 text-[#CC0000] font-bold border border-red-100";
                else if (isLeave) dayStyle = "bg-orange-50 text-orange-600 font-bold border border-orange-100";
                else if (isPresent) dayStyle = "bg-green-50 text-green-600 font-bold border border-green-100";

                return (
                  <div key={day} className="flex justify-center items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors ${dayStyle}`}>
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex justify-center gap-5 mt-8 border-t border-gray-100 pt-5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></span> Present
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CC0000] shadow-sm"></span> Absent
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm"></span> Leave
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AttendanceTracker;