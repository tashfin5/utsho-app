import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, GraduationCap, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ ADD THIS
const API_URL = "http://localhost:5000";

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
    try {
      userData = await userRes.json();
    } catch {
      userData = null;
    }

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
        name: formData.name,
        subject: formData.subject,
        phone: formData.phone,
        email: formData.email,
        userId: userData.userId
      })
    });

    let teacherData;
    try {
      teacherData = await teacherRes.json();
    } catch {
      teacherData = null;
    }

    if (!teacherRes.ok) {
      console.error("Teacher creation error:", teacherData);
      alert("Teacher creation failed");
      return;
    }

    // 3. SUCCESS
    alert(`Teacher Created!\nID: ${userData.userId}\nPassword: ${formData.phone}`);

    setIsModalOpen(false);

    // 4. INSTANT UPDATE (NO REFRESH)
    setTeachers(prev => [teacherData, ...prev]);

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

        <header className="flex items-center gap-4 p-5 bg-white relative z-10 shadow-sm">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Teachers Directory</h1>
            <p className="text-xs text-gray-500">Manage school teachers</p>
          </div>
        </header>

        <div className="px-5 mt-5 space-y-4">
          {teachers.length === 0 ? (
            <div className="text-center mt-20 text-gray-400 flex flex-col items-center">
              <GraduationCap className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">No teachers found. Add your first teacher!</p>
            </div>
          ) : (
            teachers.map((teacher) => (
              <div key={teacher._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{teacher.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    ID: {teacher.userId || "N/A"} | Subject: {teacher.subject}
                  </p>
                  <p className="text-xs text-gray-500">
                    Phone: {teacher.phone}
                  </p>
                  <p className="text-xs text-gray-500">
                    Email: {teacher.email || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">
                    Teacher
                  </span>
                  <button onClick={() => openEditModal(teacher)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={openAddModal}
          className="fixed bottom-6 right-[calc(50%-10rem)] md:right-[calc(50%-13rem)] w-14 h-14 bg-[#CC0000] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all z-40"
        >
          <Plus className="w-8 h-8" />
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {editMode ? 'Edit Teacher' : 'Add New Teacher'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input type="text" required className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject Taught</label>
                  <input type="text" required className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
                    value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" required className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
                      value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email (Optional)</label>
                    <input type="email" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                
                <div className="pt-2 flex flex-col gap-2">
                  <button type="submit" className="w-full bg-[#CC0000] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
                    {editMode ? 'Update Teacher' : 'Save Teacher'}
                  </button>

                  {editMode && (
                    <button type="button" onClick={handleDelete} className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 font-bold py-3 rounded-lg hover:bg-red-100 transition-colors">
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