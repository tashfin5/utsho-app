import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Plus, X, Trash2, Edit2, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

const NoticeBoard = () => {
  const navigate = useNavigate();
  const user = getUser(); // ✅ Gets the logged-in user's data

  const API_URL = "https://utsho-app.onrender.com";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General'
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notices`, {
        headers: getAuthHeaders()
      });

      const data = await res.json();
      
      // Sort by creation date (newest first) as a baseline
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotices(sortedData);

    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editMode
      ? `${API_URL}/api/notices/${editId}`
      : `${API_URL}/api/notices`;

    const method = editMode ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: getAuthHeaders(),
      // ✅ INJECT THE LOGGED-IN USER'S NAME AS THE AUTHOR
      body: JSON.stringify({
        ...formData,
        author: user?.name || "Admin" 
      })
    });

    setIsModalOpen(false);
    setEditMode(false);
    setEditId(null);

    fetchNotices();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    await fetch(`${API_URL}/api/notices/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    fetchNotices();
  };

  const togglePin = async (id) => {
    await fetch(`${API_URL}/api/notices/${id}/pin`, {
      method: "PATCH",
      headers: getAuthHeaders()
    });

    fetchNotices();
  };

  const openEditModal = (notice) => {
    setEditMode(true);
    setEditId(notice._id);

    setFormData({
      title: notice.title,
      description: notice.description,
      category: notice.category
    });

    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditId(null);

    setFormData({
      title: '',
      description: '',
      category: 'General'
    });

    setIsModalOpen(true);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

  // SPLIT NOTICES INTO PINNED AND LATEST
  const pinnedNotices = notices.filter(n => n.isPinned);
  const latestNotices = notices.filter(n => !n.isPinned);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">

        {/* FIXED STICKY HEADER */}
        <header className="sticky top-0 z-40 flex items-center gap-4 p-5 bg-white shadow-sm w-full">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Notice Board</h1>
            <p className="text-xs text-gray-500"></p>
          </div>
        </header>

        <div className="px-5 mt-6 space-y-8">
          
          {/* PINNED NOTICES SECTION */}
          {pinnedNotices.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Pin className="w-4 h-4 text-[#CC0000] fill-[#CC0000]" /> Pinned Notices
              </h2>
              <div className="space-y-4">
                {pinnedNotices.map((notice) => (
                  <div
                    key={notice._id}
                    className="bg-yellow-50/50 p-4 rounded-xl shadow-sm border-l-4 border-l-yellow-500 border-y border-r border-yellow-100 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-2 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded">
                          {notice.category}
                        </span>
                        <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">
                          PINNED
                        </span>
                      </div>

                      {user?.role === "admin" && (
                        <div className="flex items-center gap-3">
                          <button onClick={() => togglePin(notice._id)} className="p-1 hover:bg-yellow-100 rounded">
                            <Pin className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                          </button>
                          <button onClick={() => openEditModal(notice)} className="p-1 hover:bg-blue-50 rounded">
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          </button>
                          <button onClick={() => handleDelete(notice._id)} className="p-1 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm mb-1">{notice.title}</h3>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{notice.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium border-t border-yellow-200/50 pt-2">
                      <span className="font-semibold text-gray-700">{notice.author || "Admin"}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(notice.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LATEST NOTICES SECTION */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3">Latest Notices</h2>
            {latestNotices.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10 bg-white rounded-xl border border-gray-100">No new notices available.</p>
            ) : (
              <div className="space-y-4">
                {latestNotices.map((notice) => (
                  <div
                    key={notice._id}
                    className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-blue-400 border-y border-r border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-2 flex justify-between items-center">
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded">
                        {notice.category}
                      </span>

                      {user?.role === "admin" && (
                        <div className="flex items-center gap-3">
                          <button onClick={() => togglePin(notice._id)} className="p-1 hover:bg-gray-100 rounded">
                            <Pin className="w-4 h-4 text-gray-400" />
                          </button>
                          <button onClick={() => openEditModal(notice)} className="p-1 hover:bg-blue-50 rounded">
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          </button>
                          <button onClick={() => handleDelete(notice._id)} className="p-1 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm mb-1">{notice.title}</h3>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{notice.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium border-t border-gray-50 pt-2">
                      <span className="font-semibold text-gray-600">{notice.author || "Admin"}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(notice.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ADD BUTTON */}
        {user?.role === "admin" && (
          <button
            onClick={openAddModal}
            className="fixed bottom-6 right-[calc(50%-10rem)] md:right-[calc(50%-13rem)] w-14 h-14 bg-[#CC0000] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all z-40"
          >
            <Plus className="w-8 h-8" />
          </button>
        )}

        {/* UPGRADED MODAL */}
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
                {editMode ? "Edit Notice" : "Post New Notice"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Exam Schedule Released"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Category</label>
                  <select
                    className="w-full border border-gray-300 bg-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>General</option>
                    <option>Important</option>
                    <option>Academic</option>
                    <option>Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Description</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter notice details here..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#CC0000] text-white font-bold py-3 rounded-xl shadow-md hover:bg-red-700 transition-colors"
                  >
                    {editMode ? "Update Notice" : "Publish Notice"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NoticeBoard;