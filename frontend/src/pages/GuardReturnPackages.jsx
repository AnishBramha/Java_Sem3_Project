import React, { useEffect, useState } from "react";
import AddReturnModal from "../Components/AddReturnModal";
import VerifyReturnModal from "../Components/VerifyReturnModal";

export default function GuardReturnPackages() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [verifyModalData, setVerifyModalData] = useState(null);

  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (search.trim() !== "") return;

    async function fetchReturns() {
      const res = await fetch(`/api/return/all?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();

      console.log(data);
      const mapped = data.map((p) => ({
        id: p.id,
        name: p.name ?? "UNKNOWN",
        phone: p.phoneNumbers,
        courier: p.deliveryCompany,
        timestamp: p.timestamp,
        status: p.status,
      }));

      //sort by timestamp descending
      mapped.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      

      setPackages(mapped);
      setTotalPages(data.totalPages);
    }

    fetchReturns();
  }, [currentPage, search]);

  useEffect(() => {
    if (search.trim() === "") {
      setCurrentPage(0);
      return;
    }

    async function searchReturns() {
      const res = await fetch(
        `/api/return/search?id=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) return;

      const p = await res.json();

      const mapped = [
        {
          id: p.id,
          name: p.name,
          phone: p.phoneNumbers,
          courier: p.deliveryCompany,
          timestamp: p.timestamp,
          status: p.status,
        },
      ];

      setPackages(mapped);
    }

    searchReturns();
  }, [search]);

  const displayed = packages;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
          Return Packages
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
        >
          + Add Returned Package
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search return packages by ID"
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayed.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-red-100 hover:scale-[1.03]"
          >
            <div className="bg-gradient-to-r from-red-500 to-purple-600 px-5 py-3 flex justify-between items-center">
              <span className="text-white font-bold text-sm">{pkg.id}</span>
              <span
                className={`text-xs px-3 py-1 rounded-full text-white ${
                  pkg.status === "pending"
                    ? "bg-yellow-500/40"
                    : pkg.status === "returned"
                    ? "bg-green-500/40"
                    : "bg-red-500/40"
                }`}
              >
                {pkg.status.toUpperCase()}
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  {pkg.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-bold text-gray-900">{pkg.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  📱
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-semibold">{pkg.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  📦
                </div>
                <div>
                  <p className="text-xs text-gray-500">Courier</p>
                  <p className="text-sm font-bold">{pkg.courier}</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-xs text-red-700 font-semibold mb-1">
                  Timestamp
                </p>
                <p className="text-sm font-bold">
                  {new Date(pkg.timestamp).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {pkg.status === "pending" && (
                <button
                  onClick={() => setVerifyModalData(pkg)}
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
                >
                  Manage Return
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayed.length === 0 && (
        <p className="text-center text-gray-500 py-10">No return packages found.</p>
      )}

      {search.trim() === "" && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border shadow hover:scale-105"
            }`}
          >
            ← Prev
          </button>

          <span className="text-gray-700 font-bold">
            Page {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) => (p + 1 < totalPages ? p + 1 : p))
            }
            disabled={currentPage + 1 >= totalPages}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage + 1 >= totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border shadow hover:scale-105"
            }`}
          >
            Next →
          </button>
        </div>
      )}

      {showAddModal && (
        <AddReturnModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newPkg) => setPackages([...packages, newPkg])}
        />
      )}

      {verifyModalData && (
        <VerifyReturnModal
          pkg={verifyModalData}
          onClose={() => setVerifyModalData(null)}
          onUpdate={() => {
            setPackages(packages.filter((p) => p.id !== verifyModalData.id));
            setVerifyModalData(null);
          }}
        />
      )}
    </div>
  );
}
