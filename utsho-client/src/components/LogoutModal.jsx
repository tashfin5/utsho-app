import React from "react";

const LogoutModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Logout
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to logout?
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-[#CC0000] text-white py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;