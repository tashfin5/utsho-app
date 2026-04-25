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
    Saturday: [],
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
  });

  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    subject: "",
    teacher: "",
    teacherId: "",
    className: "Class 6",
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
        Saturday: [],
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: []
      };

      data.forEach(item => {
        if (grouped[item.day]) grouped[item.day].push(item);
      });

      setSchedule(grouped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // ✅ FIX ROLE FILTER (IMPORTANT)
  const getFilteredClasses = () => {
    const dayClasses = schedule[activeDay] || [];

    if (!user) return [];

    if (user.role === "admin") return dayClasses;

    if (user.role === "teacher") {
      return dayClasses.filter(c => String(c.teacherId) === String(user.userId));
    }

    if (user.role === "student") {
      return dayClasses.filter(c => String(c.className) === String(user.assignedClass));
    }

    return [];
  };

  // ✅ SORT BY TIME
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

  // SUBMIT (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.teacherId || !formData.time) {
      alert("Fill all required fields");
      return;
    }

    try {
      const url = editMode
        ? `${API_URL}/api/schedule/${editId}`
        : `${API_URL}/api/schedule`;

      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...formData, day: activeDay })
      });

      if (!res.ok) throw new Error();

      setIsModalOpen(false);
      setEditMode(false);
      setEditId(null);

      setFormData({
        subject: "",
        teacher: "",
        teacherId: "",
        className: "Class 6",
        time: "",
        room: "",
        color: "border-l-blue-500"
      });

      fetchSchedule();
    } catch {
      alert("Failed to add class");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;

    await fetch(`${API_URL}/api/schedule/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    fetchSchedule();
  };

  const openEdit = (cls) => {
    setEditMode(true);
    setEditId(cls._id);
    setFormData(cls);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">

        <header className="flex items-center gap-4 p-5 bg-white shadow-sm">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Class Schedule</h1>
            <p className="text-xs text-gray-500">Weekly timetable</p>
          </div>
        </header>

        <div className="px-5 mt-5">

          <div className="flex gap-2 overflow-x-auto mt-6 pb-2">
            {["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"].map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm whitespace-nowrap ${
                  activeDay === day
                    ? "bg-[#CC0000] text-white"
                    : "bg-white text-gray-600 border border-gray-100"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <h3 className="font-bold text-gray-900 mt-6 mb-4">
            {activeDay}'s Classes
          </h3>

          <div className="space-y-4">
            {sortByTime(getFilteredClasses()).map((cls) => (
              <div key={cls._id} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${cls.color} border-y border-r border-gray-100 relative`}>

                {/* EDIT + DELETE ONLY */}
                {user.role === "admin" && (
                  <div className="absolute top-2 right-2 flex gap-3">
                    <Edit2 className="w-4 h-4 text-blue-500 cursor-pointer" onClick={() => openEdit(cls)} />
                    <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => handleDelete(cls._id)} />
                  </div>
                )}

                {/* TIME SLOT */}
                <span className="absolute top-6 right-4 text-xs text-gray-500">
                  {cls.time}
                </span>

                <h4 className="font-bold text-gray-900">{cls.subject}</h4>
                <p className="text-sm text-gray-500">{cls.teacher}</p>

                <p className="text-[11px] text-gray-400 mt-1">
                  {cls.className}
                </p>

                <div className="flex gap-5 mt-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {cls.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {cls.room}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

        {user.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 right-[calc(50%-10rem)] w-14 h-14 bg-[#CC0000] text-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Plus className="w-8 h-8" />
          </button>
        )}

      </div>
    </div>
  );
};

export default Schedule;