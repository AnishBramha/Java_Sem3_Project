import React, { useState, useEffect } from "react";

const StudentOldPackages = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 20;

  // Backend package list
  const [allPackages, setAllPackages] = useState([]);

  // Fetch old collected packages
  useEffect(() => {
    async function fetchOldPackages() {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/package/myCollected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch old packages");
        return;
      }

      const data = await res.json();

      // Transform backend → UI format
      const transformed = data.map((p) => {
        

        return {
          id: p.id,
          recipientName: p.name?p.name:"Unknown",
          phoneNumber: `+91 ${p.phoneNumber}`,
          deliveryDate: p.deliveredTnD,
          pickedUpDate: p.receivedTnD,
          pickedUpBy: {
            email: p.receivedEmail,
            name: p.receivedName,
          },
          courier: p.deliveryCompany,
        };
      });

      setAllPackages(transformed);
    }

    fetchOldPackages();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(allPackages.length / packagesPerPage);
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = allPackages.slice(
    indexOfFirstPackage,
    indexOfLastPackage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationRange = () => {
    const range = [];
    const showPages = 5;

    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Old Packages
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {allPackages.length} packages collected • Page {currentPage} of{" "}
            {totalPages}
          </p>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:scale-[1.03] group cursor-pointer"
          >
            {/* Purple Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3.5 flex items-center justify-between">
              <span className="text-white font-bold text-sm">{pkg.id}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">
                ✅ Collected
              </span>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Recipient */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                  {pkg.recipientName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Recipient</p>
                  <p className="font-bold text-gray-900">{pkg.recipientName}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  📱
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="font-semibold text-gray-800">
                    {pkg.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Courier */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  📦
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Courier</p>
                  <p className="font-bold text-gray-900">{pkg.courier}</p>
                </div>
              </div>

              {/* Picked Up By */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-purple-100">
                <p className="text-xs text-purple-700 font-semibold mb-2">
                  Picked Up By
                </p>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-600">Email:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {pkg.pickedUpBy.email}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Name:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {pkg.pickedUpBy.name}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-100">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-700 font-semibold mb-1">
                    Delivered
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(pkg.deliveryDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      minute: "2-digit",  
                      hour: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-purple-700 font-semibold mb-1">
                    Picked Up
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(pkg.pickedUpDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      minute: "2-digit",
                      hour: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pb-4">
          {/* Previous */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white border border-purple-200 shadow-sm"
            }`}
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          {getPaginationRange().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-10 h-10 rounded-lg font-semibold ${
                currentPage === pageNum
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110"
                  : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white border border-purple-200"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white border border-purple-200"
            }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* Empty State */}
      {allPackages.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            📁
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            No Old Packages
          </h3>
          <p className="text-gray-500 text-sm">
            You don't have any collected packages yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentOldPackages;
