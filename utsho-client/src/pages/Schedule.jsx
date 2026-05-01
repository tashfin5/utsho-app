import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Plus, X, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

const Schedule = () => {
  const navigate = useNavigate();
  const user = getUser();

  const API_URL = "http://localhost:5000";

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const [activeDay, setActiveDay] = useState("Saturday");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [schedule, setSchedule] = useState({
    Saturday: [], Sunday: [], Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: []
  });

  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    subject: "",
    teacher: "",
    teacherId: "",
    className: "6", // Default to 6
    time: "",
    room: "",
    color: "border-l-blue-500"
  });

  // FETCH TEACHERS
  useEffect(() => {
    fetch(`${API_URL}/api/teachers`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setTeachers(Array.isArray(data) ? data : []))
      .catch(() => setTeachers([]));
  }, []);

  // FETCH SCHEDULE
  const fetchSchedule = async () => {
    try {
      const res = await fetch(`${API_URL}/api/schedule`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();

      const grouped = {
        Saturday: [], Sunday: [], Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: []
      };

      if (Array.isArray(data)) {
        data.forEach(item => {
          if (grouped[item.day]) grouped[item.day].push(item);
        });
      }

      setSchedule(grouped);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const getFilteredClasses = () => {
    return schedule[activeDay] || [];
  };

  const sortByTime = (classes) => {
    const toMin = (time) => {
      if (!time) return 0;
      const [start] = time.split(" - ");
      let [h, m] = start.split(":").map(Number);
      if (h >= 1 && h <= 6) h += 12;
      return h * 60 + m;
    };
    return [...classes].sort((a, b) => toMin(a.time) - toMin(b.time));
  };

  const calculateDuration = (timeString) => {
    if (!timeString || !timeString.includes('-')) return "90 minutes";
    try {
      const [start, end] = timeString.split('-').map(t => t.trim());
      const parseTime = (t) => {
        let [h, m] = t.split(':').map(Number);
        if (h < 8) h += 12; 
        return (h * 60) + (m || 0);
      };
      const mins = parseTime(end) - parseTime(start);
      return mins > 0 ? `${mins} minutes` : "90 minutes";
    } catch {
      return "90 minutes";
    }
  };

  const myWeeklyClasses = Object.values(schedule).flat();
  const totalClasses = myWeeklyClasses.length;
  const uniqueSubjects = new Set(myWeeklyClasses.map(c => c.subject)).size;
  const uniqueTeachers = new Set(myWeeklyClasses.map(c => c.teacher)).size;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.teacherId || !formData.time || !formData.className) {
      alert("Fill all required fields");
      return;
    }

    try {
      const url = editMode ? `${API_URL}/api/schedule/${editId}` : `${API_URL}/api/schedule`;
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...formData, day: activeDay })
      });

      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);

      setIsModalOpen(false);
      setEditMode(false);
      setEditId(null);
      setFormData({ subject: "", teacher: "", teacherId: "", className: "6", time: "", room: "", color: "border-l-blue-500" });

      fetchSchedule();
    } catch (err) {
      alert(editMode ? "Failed to update class." : "Failed to add class.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;

    try {
      const res = await fetch(`${API_URL}/api/schedule/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      fetchSchedule();
    } catch (err) {
      alert("Failed to delete class.");
    }
  };

  const openEdit = (cls) => {
    setEditMode(true);
    setEditId(cls._id);
    setFormData({
      subject: cls.subject || "",
      teacher: cls.teacher || "",
      teacherId: cls.teacherId || "",
      className: cls.className || "6",
      time: cls.time || "",
      room: cls.room || "",
      color: cls.color || "border-l-blue-500"
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setEditId(null);
    setFormData({ subject: "", teacher: "", teacherId: "", className: "6", time: "", room: "", color: "border-l-blue-500" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">

        <header className="sticky top-0 z-40 flex items-center gap-4 p-5 bg-white shadow-sm w-full">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Class Schedule</h1>
            <p className="text-xs text-gray-500">Weekly timetable</p>
          </div>
        </header>

        <div className="px-5 mt-5">
          <div className="bg-[#CC0000] rounded-xl p-5 text-white shadow-md">
            <h2 className="text-lg font-bold mb-4">This Week</h2>
            
            {/* ✅ ROLE-BASED CONDITIONAL RENDERING FOR STATS */}
            {user?.role === 'admin' ? (
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
                  <span className="text-3xl font-bold">{uniqueTeachers}</span>
                  <span className="text-xs opacity-90">Teachers</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center px-2">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{totalClasses}</span>
                  <span className="text-xs opacity-90">Total Classes</span>
                </div>
              </div>
            )}
            
          </div>

          <div className="flex gap-2 overflow-x-auto mt-6 pb-2 scrollbar-hide">
            {["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"].map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm whitespace-nowrap transition-colors ${
                  activeDay === day ? "bg-[#CC0000] text-white" : "bg-white text-gray-600 border border-gray-100"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <h3 className="font-bold text-gray-900 mt-6 mb-4">{activeDay}'s Classes</h3>

          <div className="space-y-4">
            {sortByTime(getFilteredClasses()).map((cls) => (
              <div key={cls._id} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${cls.color || 'border-l-blue-500'} border-y border-r border-gray-100 relative flex flex-col hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900 text-[16px]">{cls.subject}</h4>
                  <span className="bg-gray-100 px-2 py-1 rounded text-[11px] font-semibold text-gray-600">{cls.time}</span>
                </div>
                
                <p className="text-xs text-gray-500 mb-2">{cls.teacher}</p>
                <p className="text-[11px] text-gray-400">Class {cls.className}</p>

                <div className="flex gap-5 mt-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {calculateDuration(cls.time)}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {cls.room}</span>
                </div>

                {user?.role === "admin" && (
                  <div className="absolute bottom-4 right-4 flex gap-3">
                    <button type="button" onClick={(e) => { e.stopPropagation(); openEdit(cls); }} className="p-1 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 cursor-pointer" />
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(cls._id); }} className="p-1 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 cursor-pointer" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {getFilteredClasses().length === 0 && <p className="text-center text-gray-400 text-sm mt-10">No classes scheduled.</p>}
          </div>
        </div>

        {user?.role === "admin" && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="fixed bottom-6 right-[calc(50%-10rem)] w-14 h-14 bg-[#CC0000] text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-red-700 hover:scale-105 transition-all"
          >
            <Plus className="w-8 h-8" />
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h2 className="text-xl font-bold mb-5 text-gray-800">{editMode ? "Edit Class" : "Add New Class"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Subject</label>
                <input required type="text" placeholder="e.g. Mathematics" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Teacher</label>
                <select required value={formData.teacherId || ""} onChange={e => {
                  const selectedTeacher = teachers.find(t => t._id === e.target.value || t.userId === e.target.value);
                  setFormData({ ...formData, teacherId: e.target.value, teacher: selectedTeacher ? selectedTeacher.name : "" });
                }} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors bg-white">
                  <option value="" disabled>Select a Teacher</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Class</label>
                <select required value={formData.className || ""} onChange={e => setFormData({...formData, className: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors bg-white">
                  <option value="" disabled>Select Class</option>
                  {["6", "7", "8", "9", "10", "11", "12"].map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Time</label>
                <select required value={formData.time || ""} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors bg-white">
                  <option value="" disabled>Select a Time Slot</option>
                  <option value="08:00 - 09:20">08:00 - 09:20</option>
                  <option value="09:30 - 10:50">09:30 - 10:50</option>
                  <option value="10:00 - 11:20">10:00 - 11:20</option>
                  <option value="11:30 - 12:50">11:30 - 12:50</option>
                  <option value="13:00 - 14:20">01:00 - 02:20</option>
                  <option value="14:30 - 15:50">02:30 - 03:50</option>
                  <option value="16:00 - 17:20">04:00 - 05:20</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Room</label>
                <input type="text" placeholder="e.g. Room 102" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors" />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-[#CC0000] hover:bg-red-700 text-white rounded-xl py-3 shadow-md font-bold transition-colors">
                  {editMode ? "Update Schedule" : "Save to Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;