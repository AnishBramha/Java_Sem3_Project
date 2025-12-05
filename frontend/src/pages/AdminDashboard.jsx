import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [guards, setGuards] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const token = localStorage.getItem("token");

  // ---------------------------------------
  // Fetch Guards
  // ---------------------------------------
  const fetchGuards = async () => {
    const res = await fetch("/api/admin/listGuards", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error("Failed to load guards");
      return;
    }

    const data = await res.json();
    setGuards(data);
  };

  useEffect(() => {
    fetchGuards();
  }, []);

  // ---------------------------------------
  // Delete Guard
  // ---------------------------------------
  const deleteGuard = async () => {
    if (!deleteTarget) return;

    const res = await fetch(`/api/admin/delGuard/${deleteTarget.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setGuards(guards.filter((g) => g.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    window.location.href = "/logout";
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative w-72 h-full bg-white/80 backdrop-blur-xl 
        border-r border-gray-200 shadow-xl flex flex-col transition-transform duration-300 z-50`}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 
            flex items-center justify-center shadow-lg shadow-purple-500/40">
            <span className="text-2xl">👑</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 
              bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4">
          <div
            className="group flex items-center gap-3 px-4 py-3 rounded-xl 
            bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg 
            shadow-purple-500/30 scale-[1.02]"
          >
            <span className="text-2xl">🛡️</span>
            <span className="font-semibold text-sm">Manage Guards</span>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 
            bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 
            text-white font-bold rounded-xl shadow-lg shadow-red-300/40 
            transition-all hover:scale-[1.02]"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm 
          sticky top-0 z-30 px-4 lg:px-8">

          <div className="h-full flex items-center gap-4">
            
            {/* Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                flex items-center justify-center backdrop-blur-xl border border-purple-200/50">
                <span className="text-2xl">🛡️</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 
                  bg-clip-text text-transparent">
                  Manage Guards
                </h2>
                <p className="text-xs text-gray-500">Admin Control Panel</p>
              </div>
            </div>

          </div>
        </header>

        {/* Manage Guards */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border 
              border-gray-200/50 p-6 min-h-[calc(100vh-8rem)] animate-fadeIn">

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Guard Accounts</h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 
                  text-white font-semibold rounded-xl shadow hover:scale-[1.03] transition"
                >
                  + Add Guard
                </button>
              </div>

              {/* Guard List */}
              <div className="space-y-4">
                {guards.map((g) => (
                  <div
                    key={g.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{g.name}</p>
                      <p className="text-xs text-gray-500">{g.email}</p>
                    </div>

                    <button
                      onClick={() => setDeleteTarget({ id: g.id, name: g.name })}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {guards.length === 0 && (
                  <p className="text-center text-gray-500 mt-10">
                    No guards found.
                  </p>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Add Guard Modal */}
      {showAddModal && <AddGuardModal onClose={() => { setShowAddModal(false); fetchGuards(); }} />}

      {/* Delete Confirmation */}
      {deleteTarget && <DeleteModal target={deleteTarget} onClose={() => setDeleteTarget(null)} onDelete={deleteGuard} />}

      {/* Fade Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

/* Add Guard Modal */
function AddGuardModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pswd, setPswd] = useState("");
  const token = localStorage.getItem("token");

  const addGuard = async () => {
    const res = await fetch("/api/admin/addGuard", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, email, pswd }),
    });

    if (res.ok) {
      onClose();
      window.location.reload();
    } else {
      alert("Failed to add guard");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">

        <h2 className="text-xl font-bold text-purple-600">Add Guard</h2>

        <input
          className="w-full p-3 border rounded"
          placeholder="Guard Username"
          onChange={(e) => setName(e.target.value)}
        />

       
        <input
          className="w-full p-3 border rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPswd(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
            Cancel
          </button>

          <button
            onClick={addGuard}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* Delete Confirmation Modal */
function DeleteModal({ target, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">

        <h2 className="text-lg font-bold text-red-600">Delete Guard</h2>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete guard <b>{target.name}</b>?
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
