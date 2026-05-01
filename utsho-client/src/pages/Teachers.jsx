import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, GraduationCap, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://utsho-app.onrender.com";

const Teachers = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', subject: '', phone: '', email: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  // ✅ AUTH HEADER
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/teachers`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({ name: '', subject: '', phone: '', email: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (teacher) => {
    setEditMode(true);
    setCurrentId(teacher._id);
    setFormData({ 
      name: teacher.name, 
      subject: teacher.subject, 
      phone: teacher.phone, 
      email: teacher.email || '' 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (editMode) {
        // ✅ ADDED MISSING EDIT LOGIC (PUT REQUEST)
        const res = await fetch(`${API_URL}/api/teachers/${currentId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData)
        });

        if (!res.ok) throw new Error("Update failed");

        alert("Teacher Updated Successfully!");
        setIsModalOpen(false);
        fetchTeachers(); // Refresh list

      } else {
        // ✅ ORIGINAL CREATE LOGIC
        // 1. CREATE USER
        const userRes = await fetch(`${API_URL}/api/auth/create-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            password: formData.phone,
            role: "teacher"
          })
        });

        let userData;
        try { userData = await userRes.json(); } catch { userData = null; }

        if (!userRes.ok) {
          console.error("User creation error:", userData);
          alert("User creation failed");
          return;
        }

        // 2. CREATE TEACHER
        const teacherRes = await fetch(`${API_URL}/api/teachers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            userId: userData.userId
          })
        });

        let teacherData;
        try { teacherData = await teacherRes.json(); } catch { teacherData = null; }

        if (!teacherRes.ok) {
          console.error("Teacher creation error:", teacherData);
          alert("Teacher creation failed");
          return;
        }

        // 3. SUCCESS
        alert(`Teacher Created!\nID: ${userData.userId}\nPassword: ${formData.phone}`);

        setIsModalOpen(false);

        // 4. INSTANT UPDATE
        setTeachers(prev => [teacherData, ...prev]);
      }

    } catch (err) {
      console.error("FINAL ERROR:", err);
      alert("Something went wrong");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/teachers/${currentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Delete failed");

      setIsModalOpen(false);
      fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Failed to delete teacher");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">

        {/* ✅ FIXED STICKY TOP NAV BAR */}
        <header className="sticky top-0 z-40 flex items-center gap-4 p-5 bg-white shadow-sm w-full">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Teachers Directory</h1>
            <p className="text-xs text-gray-500">Manage Utsho teachers</p>
          </div>
        </header>

        {/* --- TEACHER LIST --- */}
        <div className="px-5 mt-5 space-y-4">
          {teachers.length === 0 ? (
            <div className="text-center mt-24 text-gray-400 flex flex-col items-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="bg-red-50 p-4 rounded-full mb-3">
                <GraduationCap className="w-10 h-10 text-[#CC0000] opacity-80" />
              </div>
              <p className="text-sm font-semibold text-gray-700">No teachers found</p>
              <p className="text-xs mt-1">Tap the + button to add your first teacher!</p>
            </div>
          ) : (
            teachers.map((teacher) => (
              <div 
                key={teacher._id} 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow border-l-4 border-l-[#CC0000]"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{teacher.name}</h3>
                  <div className="text-[11px] text-gray-500 mt-1 font-medium space-x-2 mb-1.5">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">ID: {teacher.userId || "N/A"}</span>
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{teacher.subject}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">📞 {teacher.phone}</p>
                  {teacher.email && <p className="text-[11px] text-gray-500 mt-0.5">✉️ {teacher.email}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-100">
                    Teacher
                  </span>
                  <button 
                    onClick={() => openEditModal(teacher)} 
                    className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- ADD BUTTON --- */}
        <button 
          onClick={openAddModal}
          className="fixed bottom-6 right-[calc(50%-10rem)] w-14 h-14 bg-[#CC0000] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all z-40"
        >
          <Plus className="w-8 h-8" />
        </button>

        {/* --- MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
              
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                {editMode ? 'Edit Teacher' : 'Add New Teacher'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Full Name</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Prof. Rahman" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Subject Taught</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors"
                    value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="e.g. Mathematics" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Phone Number <span className="text-gray-400 font-normal lowercase">(used as password)</span></label>
                  <input type="tel" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="01XXX-XXXXXX" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Email (Optional)</label>
                  <input type="email" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="teacher@gmail.com" />
                </div>
                
                <div className="pt-4 flex flex-col gap-3">
                  <button type="submit" className="w-full bg-[#CC0000] text-white font-bold py-3 rounded-xl shadow-md hover:bg-red-700 transition-colors">
                    {editMode ? 'Update Teacher' : 'Save Teacher'}
                  </button>

                  {editMode && (
                    <button type="button" onClick={handleDelete} className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete Teacher
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Teachers;