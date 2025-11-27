import React, { useState } from "react";

export default function AddPackageModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    studentName: "",
    phone: "",
    courier: "",
  });

  const update = (key, value) => setForm({ ...form, [key]: value });

  const handleAdd = async () => {
    if (!form.studentName || form.phone.length !== 10 || !form.courier) return;

    const token = localStorage.getItem("token");

    const body = {
      deliveryCompany: form.courier,
      name: form.studentName,
      phoneNumber: form.phone,
    };

    try {
      const res = await fetch("/api/guard/addPackage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("Failed to add package");
        return;
      }

      // Notify parent to update UI
      window.location.reload();

      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div
      className="
          fixed inset-0 z-50 
          bg-white/70 backdrop-blur-sm 
          flex items-start justify-center pt-10
          p-4
        "
    >
      {/* Modal */}
      <div
        className="
            bg-white rounded-2xl shadow-xl 
            border-2 border-gray-400
            w-full max-w-md 
            p-6 space-y-5 
            animate-zoomIn
            max-h-[90vh] overflow-y-auto
          "
      >
        <h2 className="text-xl font-bold text-purple-600">Add New Package</h2>

        <div className="space-y-4">
          <input
            placeholder="Student Name"
            className="w-full p-3 text-sm border rounded-lg focus:ring-2 
                       focus:ring-purple-300 outline-none"
            onChange={(e) => update("studentName", e.target.value)}
          />

          <input
            placeholder="Phone (10 digits)"
            maxLength={10}
            className="w-full p-3 text-sm border rounded-lg focus:ring-2 
                       focus:ring-purple-300 outline-none"
            onChange={(e) =>
              update("phone", e.target.value.replace(/\D/g, ""))
            }
          />

          <input
            placeholder="Courier Company"
            className="w-full p-3 text-sm border rounded-lg focus:ring-2 
                       focus:ring-purple-300 outline-none"
            onChange={(e) => update("courier", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            disabled={
              !form.studentName || form.phone.length !== 10 || !form.courier
            }
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                       transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        <style jsx>{`
          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-zoomIn {
            animation: zoomIn 0.25s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
