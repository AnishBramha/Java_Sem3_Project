import React, { useState } from 'react'
import { useEffect } from 'react';

const StudentMyPackages = () => {
  // Sample package data
    const [packages, setPackages] = useState([]);

  useEffect(() => {
    async function loadPackages() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/package/myActive", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          console.error("Failed to fetch packages");
          return;
        }

        const data = await res.json();

        const formatted = data.map((pkg) => {
        const deliveryDateObj = pkg.deliveredTnD ? new Date(pkg.deliveredTnD) : null;

        const deliveryDate = deliveryDateObj
          ? deliveryDateObj.toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "N/A";

        let dueDate = "N/A";
        if (deliveryDateObj) {
          const temp = new Date(deliveryDateObj);
          temp.setDate(temp.getDate() + 7);

          dueDate = temp.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }

        return {
          id: pkg.id,
          recipientName: "You",
          phoneNumber: pkg.phoneNumber,
          deliveryDate,
          dueDate,
          courier: pkg.deliveryCompany,
        };
      });

      // Sort by deliveryDate descending
      formatted.sort((a, b) => {
        const dateA = new Date(a.deliveryDate);
        const dateB = new Date(b.deliveryDate);
        return dateB - dateA;
      });


        setPackages(formatted);
      } catch (err) {
        console.error("Error fetching packages:", err);
      }
    }

    loadPackages();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Packages
          </h2>
          <p className="text-gray-500 text-sm mt-1">{packages.length} packages waiting for pickup</p>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map((pkg) => {
          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:scale-[1.03] group cursor-pointer"
            >
              {/* Purple Gradient Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3.5">
                <span className="text-white font-bold text-sm">{pkg.id}</span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Recipient Name */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                    {pkg.recipientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Recipient</p>
                    <p className="font-bold text-gray-900 truncate">{pkg.recipientName}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📱</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-sm font-semibold text-gray-800">{pkg.phoneNumber}</p>
                  </div>
                </div>

                {/* Courier */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Courier</p>
                    <p className="text-sm font-bold text-gray-900">{pkg.courier}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-100">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Delivered</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(pkg.deliveryDate).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short',
                        year: 'numeric',
                        minute: '2-digit',
                        hour: '2-digit',
                        hour12: false
                      })}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <p className="text-xs text-purple-700 font-semibold mb-1">Due Date</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(pkg.dueDate).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short',
                        year: 'numeric',
                        minute: '2-digit',
                        hour: '2-digit',
                        hour12: false 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {packages.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            📦
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No Packages</h3>
          <p className="text-gray-500 text-sm">You don't have any packages at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default StudentMyPackages