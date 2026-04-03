import React from 'react';
import { ArrowLeft, Pin, Calendar, BookOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NoticeBoard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">

        {/* --- HEADER --- */}
        <header className="flex items-center gap-4 p-5 bg-white relative z-10">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Notice Board</h1>
            <p className="text-xs text-gray-500">Stay updated with announcements</p>
          </div>
        </header>

        <div className="px-5 mt-5 space-y-8">
          
          {/* --- PINNED NOTICES SECTION --- */}
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
              <Pin className="w-4 h-4 text-[#CC0000]" /> Pinned Notices
            </h2>
            
            <div className="space-y-4">
              
              {/* Important Notice */}
              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-[#CC0000] border-y border-r border-gray-100 relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 rounded">Important</span>
                  <Pin className="w-3 h-3 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">Semester Final Exam Schedule Released</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  The final exam schedule for the current semester has been published. Please check your dashboard for detailed timings.
                </p>
                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-600">A</span> Admin</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Mar 15, 2026</span>
                </div>
              </div>

              {/* Holiday Notice */}
              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-[#CC0000] border-y border-r border-gray-100 relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 rounded">Holiday</span>
                  <Pin className="w-3 h-3 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">Holiday Notice - March 21</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  The coaching center will remain closed on March 21, 2026 due to national holiday. Regular classes will resume on March 22.
                </p>
                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-600">A</span> Admin</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Mar 14, 2026</span>
                </div>
              </div>

            </div>
          </div>

          {/* --- ALL NOTICES SECTION --- */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-4">All Notices</h2>
            
            <div className="space-y-4">
              
              {/* Event Notice */}
              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-blue-400 border-y border-r border-gray-100">
                <div className="mb-2">
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded">Event</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">Parent-Teacher Meeting</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  A parent-teacher meeting is scheduled for March 25, 2026 at 3:00 PM. All parents are requested to attend.
                </p>
                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-600">A</span> Admin</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Mar 13, 2026</span>
                </div>
              </div>

              {/* Academic Notice */}
              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-green-400 border-y border-r border-gray-100">
                <div className="mb-2">
                  <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded">Academic</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">New Study Materials Available</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  Updated study materials for Physics and Chemistry have been uploaded to the resources section.
                </p>
                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-600">P</span> Prof. Rahman</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Mar 12, 2026</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* --- FLOATING ACTION BUTTON (Add Notice) --- */}
        <button className="fixed bottom-6 right-[calc(50%-10rem)] md:right-[calc(50%-13rem)] w-14 h-14 bg-[#CC0000] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all z-50">
          <Plus className="w-8 h-8" />
        </button>

      </div>
    </div>
  );
};

export default NoticeBoard;