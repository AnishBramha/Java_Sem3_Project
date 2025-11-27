import React, { useEffect, useState } from "react";
import AddPackageModal from "../Components/AddPackageModal";
import VerifyPackageModal from "../Components/VerifyPackageModal";

export default function GuardActivePackages() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [verifyModalData, setVerifyModalData] = useState(null);

  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  // -------------------------------
  // FETCH ACTIVE (PAGINATED) DATA
  // -------------------------------
  useEffect(() => {
    if (search.trim() !== "") return; // do NOT fetch paginated when searching

    async function fetchPackages() {
      const res = await fetch(`/api/package/getActive?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch active packages");
        return;
      }

      const data = await res.json();

      const mapped = data.data.map((p) => ({
        id: p.id,
        studentName: p.name ?? "UNKNOWN",
        phone: p.phoneNumber,
        courier: p.deliveryCompany,
        deliveryDate: p.deliveredTnD,
      }));

      setPackages(mapped);
      setTotalPages(data.totalPages);
    }

    fetchPackages();
  }, [currentPage, search]);

  // -------------------------------
  // SEARCH — CALL BACKEND
  // -------------------------------
  useEffect(() => {
    if (search.trim() === "") {
      setCurrentPage(0);
      return;
    }

    async function searchPackages() {
      const res = await fetch(
        `/api/package/search/active?query=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        console.error("Search failed");
        return;
      }

      const data = await res.json();

      const mapped = data.map((p) => ({
        id: p.id,
        studentName: p.receivedName ?? "Unknown",
        phone: p.phoneNumber,
        courier: p.deliveryCompany,
        deliveryDate: p.deliveredTnD,
      }));

      setPackages(mapped);
    }

    searchPackages();
  }, [search]);

  // Filtered list handled by backend — no local filtering
  const displayed = packages;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Active Packages
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
        >
          + Add Package
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search active packages"
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayed.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:scale-[1.03]"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3">
              <span className="text-white font-bold text-sm">{pkg.id}</span>
            </div>

            <div className="p-5 space-y-4">
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  {pkg.studentName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Student</p>
                  <p className="font-bold text-gray-900">{pkg.studentName}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  📱
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-semibold">{pkg.phone}</p>
                </div>
              </div>

              {/* Courier */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  📦
                </div>
                <div>
                  <p className="text-xs text-gray-500">Courier</p>
                  <p className="text-sm font-bold">{pkg.courier}</p>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-700 font-semibold mb-1">
                  Delivered
                </p>
                <p className="text-sm font-bold">
                  {new Date(pkg.deliveryDate).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Verify */}
              <button
                onClick={() => setVerifyModalData(pkg)}
                className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
              >
                Verify Pickup
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {displayed.length === 0 && (
        <p className="text-center text-gray-500 py-10">No packages found.</p>
      )}

      {/* Pagination (Only when NOT searching) */}
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

      {/* Modals */}
      {showAddModal && (
        <AddPackageModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newPkg) => setPackages([...packages, newPkg])}
        />
      )}

      {verifyModalData && (
        <VerifyPackageModal
          pkg={verifyModalData}
          onClose={() => setVerifyModalData(null)}
          onVerify={() => {
            setPackages(packages.filter((p) => p.id !== verifyModalData.id));
            setVerifyModalData(null);
          }}
        />
      )}
    </div>
  );
}
