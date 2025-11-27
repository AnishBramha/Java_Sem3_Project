import React, { useEffect, useState } from "react";

export default function GuardOldPackages() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const [packages, setPackages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  // -------------------------------------------------------------------
  // FETCH PAGINATED COLLECTED PACKAGES (when NOT searching)
  // -------------------------------------------------------------------
  useEffect(() => {
    if (search.trim() !== "") return; // don't fetch pagination during search

    async function fetchData() {
      const res = await fetch(`/api/package/getCollected?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Error fetching collected packages");
        return;
      }

      const body = await res.json();

      const mapped = body.data.map((p) => ({
        id: p.id,
        recipientName: p.name ?? "Unknown",
        phoneNumber: p.phoneNumber,
        deliveryDate: p.deliveredTnD,
        pickedUpDate: p.receivedTnD,
        pickedUpBy: {
          name: p.receivedName ?? "Unknown",
          rollNumber: p.receivedEmail ?? "N/A",
        },
        courier: p.deliveryCompany,
      }));

      setPackages(mapped);
      setTotalPages(body.totalPages);
    }

    fetchData();
  }, [currentPage, search]);

  // -------------------------------------------------------------------
  // BACKEND SEARCH (when search has text)
  // -------------------------------------------------------------------
  useEffect(() => {
    if (search.trim() === "") return;

    async function doSearch() {
      const res = await fetch(
        `/api/package/search/collected?query=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        console.error("Search failed");
        return;
      }

      const data = await res.json();

      const mapped = data.map((p) => ({
        id: p.id,
        recipientName: p.name ?? "Unknown",
        phoneNumber: p.phoneNumber,
        deliveryDate: p.deliveredTnD,
        pickedUpDate: p.receivedTnD,
        pickedUpBy: {
          name: p.receivedName ?? "Unknown",
          rollNumber: p.receivedEmail ?? "N/A",
        },
        courier: p.deliveryCompany,
      }));

      setPackages(mapped);
    }

    doSearch();
  }, [search]);

  // -------------------------------------------------------------------
  // PAGINATION RANGE
  // -------------------------------------------------------------------
  const paginationRange = () => {
    const range = [];
    const show = 5;

    let start = Math.max(0, currentPage - Math.floor(show / 2));
    let end = Math.min(totalPages - 1, start + show - 1);

    if (end - start < show - 1) start = Math.max(0, end - show + 1);

    for (let i = start; i <= end; i++) range.push(i);

    return range;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Old Packages
        </h2>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(0);
        }}
        placeholder="Search by package ID or name"
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
      />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:scale-[1.02]"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3.5 flex justify-between items-center">
              <span className="text-white font-bold text-sm">{pkg.id}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">
                ✔ Collected
              </span>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-bold">
                  {pkg.recipientName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Recipient</p>
                  <p className="font-bold text-gray-900">{pkg.recipientName}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">📱</div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-800">{pkg.phoneNumber}</p>
                </div>
              </div>

              {/* Courier */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">📦</div>
                <div>
                  <p className="text-xs text-gray-500">Courier</p>
                  <p className="font-bold text-gray-900">{pkg.courier}</p>
                </div>
              </div>

              {/* Picked Up */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-100 p-3 rounded-xl">
                <p className="text-xs text-purple-700 font-semibold mb-1">Picked Up By</p>
                <p className="text-sm font-bold">Name: {pkg.pickedUpBy.name}</p>
                <p className="text-sm font-semibold text-gray-700">
                  Email: {pkg.pickedUpBy.rollNumber}
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-700 font-semibold">Delivered</p>
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

                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-purple-700 font-semibold">Picked Up</p>
                  <p className="text-sm font-bold">
                    {pkg.pickedUpDate
                      ? new Date(pkg.pickedUpDate).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not recorded"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {packages.length === 0 && (
          <p className="text-gray-500 text-center col-span-full py-10">
            No Results Found
          </p>
        )}
      </div>

      {/* Pagination — hidden during search */}
      {search.trim() === "" && totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4">

          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 0
                ? "bg-gray-200 text-gray-400"
                : "bg-white border hover:bg-purple-600 hover:text-white"
            }`}
          >
            ← Prev
          </button>

          {paginationRange().map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-10 h-10 rounded-lg font-semibold transition ${
                p === currentPage
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-white border hover:bg-purple-600 hover:text-white"
              }`}
            >
              {p + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages - 1
                ? "bg-gray-200 text-gray-400"
                : "bg-white border hover:bg-purple-600 hover:text-white"
            }`}
          >
            Next →
          </button>

        </div>
      )}
    </div>
  );
}
