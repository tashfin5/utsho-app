import React from 'react';
import { ArrowLeft, Search, FileText, Video, Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudyResources = () => {
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
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Study Resources</h1>
            <p className="text-xs text-gray-500">Access learning materials</p>
          </div>
        </header>

        <div className="px-5 mt-2 space-y-6">
          
          {/* --- SEARCH BAR --- */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] transition-shadow shadow-sm"
            />
          </div>

          {/* --- CATEGORY TABS --- */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <button className="px-4 py-1.5 bg-[#CC0000] text-white text-sm font-semibold rounded-lg shadow-sm whitespace-nowrap">All</button>
            <button className="px-4 py-1.5 bg-white text-gray-600 text-sm font-semibold rounded-lg shadow-sm border border-gray-100 whitespace-nowrap hover:bg-gray-50 transition-colors">Mathematics</button>
            <button className="px-4 py-1.5 bg-white text-gray-600 text-sm font-semibold rounded-lg shadow-sm border border-gray-100 whitespace-nowrap hover:bg-gray-50 transition-colors">Physics</button>
            <button className="px-4 py-1.5 bg-white text-gray-600 text-sm font-semibold rounded-lg shadow-sm border border-gray-100 whitespace-nowrap hover:bg-gray-50 transition-colors">Chemistry</button>
            <button className="px-4 py-1.5 bg-white text-gray-600 text-sm font-semibold rounded-lg shadow-sm border border-gray-100 whitespace-nowrap hover:bg-gray-50 transition-colors">English</button>
          </div>

          {/* --- SUMMARY STATS --- */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white py-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center col-span-1">
              <span className="text-xl font-bold text-gray-900">48</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Total Files</span>
            </div>
            <div className="bg-white py-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center col-span-1">
              <span className="text-xl font-bold text-gray-900">12</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Videos</span>
            </div>
            <div className="bg-white py-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center col-span-1">
              <span className="text-xl font-bold text-gray-900">36</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Documents</span>
            </div>
          </div>

          {/* --- RESOURCES LIST --- */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Available Resources</h3>
            
            <div className="space-y-3">
              
              {/* Item 1: Calculus PDF */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-2 bg-red-50 text-[#CC0000] rounded-lg mt-1">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">Advanced Calculus - Chapter 5</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Mathematics</p>
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                    PDF • 2.4 MB • Mar 12, 2026
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">by Prof. Rahman</p>
                </div>
                <button className="p-2 bg-red-50 text-[#CC0000] rounded-lg hover:bg-[#CC0000] hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              {/* Item 2: Chemistry Video */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg mt-1">
                  <Video className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">Organic Chemistry Lecture</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Chemistry</p>
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                    Video • 45 min • Mar 11, 2026
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">by Prof. Hasan</p>
                </div>
                <button className="p-2 bg-red-50 text-[#CC0000] rounded-lg hover:bg-[#CC0000] hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              {/* Item 3: Physics PDF */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-1">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">Physics Formula Sheet</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Physics</p>
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                    PDF • 1.8 MB • Mar 10, 2026
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">by Prof. Ahmed</p>
                </div>
                <button className="p-2 bg-red-50 text-[#CC0000] rounded-lg hover:bg-[#CC0000] hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* --- FLOATING ACTION BUTTON (Add Resource) --- */}
        <button className="fixed bottom-6 right-[calc(50%-10rem)] md:right-[calc(50%-13rem)] w-14 h-14 bg-[#CC0000] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all z-50">
          <Plus className="w-8 h-8" />
        </button>

      </div>
    </div>
  );
};

export default StudyResources;