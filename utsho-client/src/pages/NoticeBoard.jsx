import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Plus, X } from 'lucide-react';
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
      const response = await fetch(`${API_URL}/api/notices`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/notices`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          author: 'Admin'
        })
      });

      if (!response.ok) throw new Error("Failed to post");

      setFormData({ title: '', description: '', category: 'General' });
      setIsModalOpen(false);
      fetchNotices();
    } catch (error) {
      console.error("Error posting notice:", error);
      alert("Failed to post notice");
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative">

        {/* HEADER */}
        <header className="flex items-center gap-4 p-5 bg-white relative z-10 shadow-sm">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Notice Board</h1>
            <p className="text-xs text-gray-500">Live database feed</p>
          </div>
        </header>

        {/* CONTENT */}
        <div className="px-5 mt-5 space-y-8">
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-4">Latest Notices</h2>

            {notices.length === 0 ? (
              <p className="text-sm text-gray-500 text-center mt-10">
                No notices yet. Click the + button to add one!
              </p>
            ) : (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice._id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-blue-400 border-y border-r border-gray-100">

                    <div className="mb-2 flex justify-between items-center">
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded">
                        {notice.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm mb-2">
                      {notice.title}
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      {notice.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-600">
                          {notice.author?.charAt(0)}
                        </span>
                        {notice.author}
                      </span>

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

        {/* ➕ BUTTON (ADMIN ONLY) */}
        {user?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 right-[calc(50%-10rem)] md:right-[calc(50%-13rem)] w-14 h-14 bg-[#CC0000] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all z-40"
          >
            <Plus className="w-8 h-8" />
          </button>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative">

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Post New Notice
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
                  Publish Notice
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