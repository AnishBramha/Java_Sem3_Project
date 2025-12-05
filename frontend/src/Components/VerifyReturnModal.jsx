import React from "react";

export default function VerifyReturnModal({ pkg, onClose, onUpdate }) {
  const token = localStorage.getItem("token");

  const confirmReturn = async () => {
    
    await fetch("/api/return/returned", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body:pkg.id ,
    });

    onUpdate();
    window.location.reload();
  };

  const rejectReturn = async () => {
    await fetch("/api/return/rejected", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body:pkg.id,
    });

    onUpdate();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4 animate-zoomIn">
        <h2 className="text-xl font-bold text-red-600">Manage Return</h2>

        <div className="space-y-2">
          <p className="text-sm">
            <b>ID:</b> {pkg.id}
          </p>
          <p className="text-sm">
            <b>Name:</b> {pkg.name}
          </p>
          <p className="text-sm">
            <b>Phone:</b> {pkg.phone}
          </p>
          <p className="text-sm">
            <b>Courier:</b> {pkg.courier}
          </p>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={rejectReturn}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Reject Return
          </button>

          <button
            onClick={confirmReturn}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
}
