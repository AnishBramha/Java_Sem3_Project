import React, { useState } from "react";

export default function AddReturnModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    courier: "",
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleAdd = async () => {
    if (!form.name || form.phone.length !== 10 || !form.courier) return;

    const token = localStorage.getItem("token");

    const body = {
      name: form.name,
      phoneNumbers: [form.phone],
      deliveryCompany: form.courier,
    };

    try {
      const res = await fetch("/api/return/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("Failed to add return package");
        return;
      }

      window.location.reload();
      onClose();
    } catch (e) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-start justify-center pt-10 p-4">
      <div className="bg-white rounded-2xl shadow-xl border w-full max-w-md p-6 space-y-5 animate-zoomIn max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-red-600">Add Returned Package</h2>

        <div className="space-y-4">
          <input
            placeholder="Name"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => update("name", e.target.value)}
          />

          <input
            placeholder="Phone (10 digits)"
            maxLength={10}
            className="w-full p-3 border rounded-lg"
            onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
          />

          <input
            placeholder="Courier Company"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => update("courier", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleAdd}
            disabled={!form.name || form.phone.length !== 10 || !form.courier}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
