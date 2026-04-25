import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Plus, X, Trash2, Edit2, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

const NoticeBoard = () => {
  const navigate = useNavigate();
  const user = getUser();

  const API_URL = "http://localhost:5000";

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

      // ONLY sort, no UI change
      setNotices(data.sort((a, b) => b.isPinned - a.isPinned));

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
      body: JSON.stringify(formData)
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

  // ✅ FIX: Add button bug
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">

        {/* HEADER */}
        <header className="flex items-center gap-4 p-5 bg-white shadow-sm">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Notice Board</h1>
            <p className="text-xs text-gray-500">Live database feed</p>
          </div>
        </header>

        {/* CONTENT */}
        <div className="px-5 mt-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900">Latest Notices</h2>

          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-blue-400 border border-gray-100"
            >

              {/* TOP BAR */}
              <div className="mb-2 flex justify-between items-center">

                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded">
                    {notice.category}
                  </span>

                  {/* ✅ PIN LABEL ONLY (NO DESIGN CHANGE) */}
                  {notice.isPinned && (
                    <span className="text-[10px] font-bold text-yellow-600">
                      PINNED
                    </span>
                  )}
                </div>

                {user?.role === "admin" && (
                  <div className="flex items-center gap-3">

                    {/* PIN */}
                    <button onClick={() => togglePin(notice._id)}>
                      <Pin className={`w-4 h-4 ${notice.isPinned ? "text-yellow-500" : "text-gray-400"}`} />
                    </button>

                    {/* EDIT */}
                    <button onClick={() => openEditModal(notice)}>
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </button>

                    {/* DELETE */}
                    <button onClick={() => handleDelete(notice._id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>

                  </div>
                )}

              </div>

              <h3 className="font-bold text-gray-900 text-sm mb-1">
                {notice.title}
              </h3>

              <p className="text-xs text-gray-500 mb-2">
                {notice.description}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span>{notice.author}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(notice.createdAt)}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* ADD BUTTON */}
        {user?.role === "admin" && (
          <button
            onClick={openAddModal}
            className="fixed bottom-6 right-[calc(50%-10rem)] md:right-[calc(50%-13rem)] w-14 h-14 bg-[#CC0000] text-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Plus className="w-8 h-8" />
          </button>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-xl w-[90%] max-w-sm relative">

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4"
              >
                <X />
              </button>

              <h2 className="font-bold mb-3">
                {editMode ? "Edit Notice" : "Post New Notice"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

  <div>
    <label className="block text-xs font-bold text-gray-700 mb-1">
      Title
    </label>
    <input
      type="text"
      required
      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
      value={formData.title}
      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    />
  </div>

  <div>
    <label className="block text-xs font-bold text-gray-700 mb-1">
      Category
    </label>
    <select
      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
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
    <label className="block text-xs font-bold text-gray-700 mb-1">
      Description
    </label>
    <textarea
      required
      rows="3"
      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#CC0000]"
      value={formData.description}
      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    />
  </div>

  <button
    type="submit"
    className="w-full bg-[#CC0000] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
  >
    {editMode ? "Update Notice" : "Publish Notice"}
  </button>

</form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NoticeBoard;