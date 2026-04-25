import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Users, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ ADD THIS
const API_URL = "http://localhost:5000";

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', rollNumber: '', className: '', phone: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ GET TOKEN
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({ name: '', rollNumber: '', className: '', phone: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditMode(true);
    setCurrentId(student._id);
    setFormData({ 
      name: student.name, 
      rollNumber: student.rollNumber, 
      className: student.className, 
      phone: student.phone 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    // ✅ 1. CREATE USER FIRST
    const userRes = await fetch(`${API_URL}/api/auth/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: formData.name,
        password: formData.phone,
        role: "student"
      })
    });

    let userData;
    try {
      userData = await userRes.json();
    } catch {
      userData = null;
    }

    if (!userRes.ok) {
      console.error("User API error:", userData);
      throw new Error("User creation failed");
    }

    // ✅ 2. CREATE STUDENT WITH userId
    const studentRes = await fetch(`${API_URL}/api/students`, {
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

    let studentData;
    try {
      studentData = await studentRes.json();
    } catch {
      studentData = null;
    }

    if (!studentRes.ok) {
      console.error("Student API error:", studentData);
      throw new Error("Student creation failed");
    }

    // ✅ 3. SHOW SUCCESS (keep your alert or modal)
    alert(`Student Created!\nID: ${userData.userId}\nPassword: ${formData.phone}`);

    setIsModalOpen(false);

    // ✅ 4. INSTANT UI UPDATE (NO REFRESH NEEDED)
    const newStudent = studentData;
    setStudents(prev => [newStudent, ...prev]);

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
};

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/students/${currentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Delete failed");

      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
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
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Students Directory</h1>
            <p className="text-xs text-gray-500">Manage enrolled students</p>
          </div>
        </header>

        <div className="px-5 mt-5 space-y-4">
          {students.length === 0 ? (
            <div className="text-center mt-20 text-gray-400 flex flex-col items-center">
              <Users className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">No students found. Add one!</p>
            </div>
          ) : (
            students.map((student) => (
              <div key={student._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{student.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    ID: {student.userId || "N/A"} | Class: {student.className} | Roll: {student.rollNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full">
                    Active
                  </span>
                  <button onClick={() => openEditModal(student)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg transition-colors">
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
                {editMode ? 'Edit Student' : 'Add New Student'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input type="text" required className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
                    <select
                      required
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    >
                      <option value="">Select Class</option>
                      <option>Class 6</option>
                      <option>Class 7</option>
                      <option>Class 8</option>
                      <option>Class 9</option>
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Roll Number</label>
                    <input type="text" required className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
                      value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" required className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                
                <div className="pt-2 flex flex-col gap-2">
                  <button type="submit" className="w-full bg-[#CC0000] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
                    {editMode ? 'Update Student' : 'Save Student'}
                  </button>

                  {editMode && (
                    <button type="button" onClick={handleDelete} className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 font-bold py-3 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete Student
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

export default Students;