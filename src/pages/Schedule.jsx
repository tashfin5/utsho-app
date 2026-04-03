import React from 'react';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Schedule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">

        {/* --- HEADER --- */}
        <header className="flex items-center gap-4 p-5 bg-white shadow-sm relative z-10">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Class Schedule</h1>
            <p className="text-xs text-gray-500">Weekly timetable</p>
          </div>
        </header>

        <div className="px-5 mt-5">
          {/* --- RED SUMMARY BANNER --- */}
          <div className="bg-[#CC0000] rounded-xl p-5 text-white shadow-md">
            <h2 className="font-bold mb-4">This Week</h2>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-2xl font-bold">24</p>
                <p className="text-[10px] text-red-100 uppercase tracking-wide mt-1">Classes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">6</p>
                <p className="text-[10px] text-red-100 uppercase tracking-wide mt-1">Subjects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">8</p>
                <p className="text-[10px] text-red-100 uppercase tracking-wide mt-1">Teachers</p>
              </div>
            </div>
          </div>

          {/* --- DAY SELECTOR TABS --- */}
          {/* Note: 'overflow-x-auto' allows swiping left/right on mobile */}
          <div className="flex gap-2 overflow-x-auto mt-6 pb-2 hide-scrollbar">
            <button className="px-5 py-2 bg-[#CC0000] text-white text-sm font-semibold rounded-lg shadow-sm whitespace-nowrap">Monday</button>
            <button className="px-5 py-2 bg-white text-gray-600 text-sm font-semibold rounded-lg shadow-sm border border-gray-100 whitespace-nowrap hover:bg-gray-50 transition-colors">Tuesday</button>
            <button className="px-5 py-2 bg-white text-gray-600 text-sm font-semibold rounded-lg shadow-sm border border-gray-100 whitespace-nowrap hover:bg-gray-50 transition-colors">Wednesday</button>
            <button className="px-5 py-2 bg-white text-gray-600 text-sm font-semibold rounded-lg shadow-sm border border-gray-100 whitespace-nowrap hover:bg-gray-50 transition-colors">Thursday</button>
            <button className="px-5 py-2 bg-white text-gray-600 text-sm font-semibold rounded-lg shadow-sm border border-gray-100 whitespace-nowrap hover:bg-gray-50 transition-colors">Friday</button>
          </div>

          {/* --- CLASSES LIST --- */}
          <h3 className="font-bold text-gray-900 mt-6 mb-4">Monday's Classes</h3>

          <div className="space-y-4">
            
            {/* Math Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-red-500 border-y border-r border-gray-100 relative hover:shadow-md transition-shadow">
              <span className="absolute top-4 right-4 text-xs font-semibold text-gray-500">08:00 - 09:30</span>
              <h4 className="font-bold text-gray-900 text-base">Mathematics</h4>
              <p className="text-sm text-gray-500 mt-0.5">Prof. Rahman</p>
              <div className="flex items-center gap-5 mt-4 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 90 minutes</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Room 101</span>
              </div>
            </div>

            {/* Physics Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-blue-500 border-y border-r border-gray-100 relative hover:shadow-md transition-shadow">
              <span className="absolute top-4 right-4 text-xs font-semibold text-gray-500">10:00 - 11:30</span>
              <h4 className="font-bold text-gray-900 text-base">Physics</h4>
              <p className="text-sm text-gray-500 mt-0.5">Prof. Ahmed</p>
              <div className="flex items-center gap-5 mt-4 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 90 minutes</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Room 102</span>
              </div>
            </div>

            {/* Chemistry Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-purple-500 border-y border-r border-gray-100 relative hover:shadow-md transition-shadow">
              <span className="absolute top-4 right-4 text-xs font-semibold text-gray-500">12:00 - 01:30</span>
              <h4 className="font-bold text-gray-900 text-base">Chemistry</h4>
              <p className="text-sm text-gray-500 mt-0.5">Prof. Hasan</p>
              <div className="flex items-center gap-5 mt-4 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 90 minutes</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Room 103</span>
              </div>
            </div>

            {/* English Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-green-500 border-y border-r border-gray-100 relative hover:shadow-md transition-shadow">
              <span className="absolute top-4 right-4 text-xs font-semibold text-gray-500">02:00 - 03:30</span>
              <h4 className="font-bold text-gray-900 text-base">English</h4>
              <p className="text-sm text-gray-500 mt-0.5">Prof. Khan</p>
              <div className="flex items-center gap-5 mt-4 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 90 minutes</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Room 104</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Schedule;