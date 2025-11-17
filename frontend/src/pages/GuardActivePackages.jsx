import React, { useState } from "react"
import AddPackageModal from "../Components/AddPackageModal"
import VerifyPackageModal from "../Components/VerifyPackageModal"

export default function GuardActivePackages() {
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [verifyModalData, setVerifyModalData] = useState(null)

  const [packages, setPackages] = useState([
    {
      id: "PKG-2024-101",
      studentName: "Rahul Sharma",
      phone: "9876543210",
      courier: "Amazon",
      deliveryDate: "2024-11-10"
    },
    {
      id: "PKG-2024-102",
      studentName: "Priya Patel",
      phone: "8765432109",
      courier: "Flipkart",
      deliveryDate: "2024-11-12"
    },
    {
      id: "PKG-2024-103",
      studentName: "Amit Kumar",
      phone: "7654321098",
      courier: "Bluedart",
      deliveryDate: "2024-11-13"
    },
  ])

  const filtered = packages.filter(pkg =>
    pkg.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Active Packages
          </h2>
          <p className="text-gray-500 text-sm mt-1">{packages.length} awaiting verification</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
        >
          + Add Package
        </button>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search by Package ID"
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:scale-[1.03] group"
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
                  <p className="text-xs text-gray-500 font-medium">Student</p>
                  <p className="font-bold text-gray-900">{pkg.studentName}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  📱
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm font-semibold">{pkg.phone}</p>
                </div>
              </div>

              {/* Courier */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  📦
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Courier</p>
                  <p className="text-sm font-bold">{pkg.courier}</p>
                </div>
              </div>

              {/* Date */}
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-700 font-semibold mb-1">Delivered</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(pkg.deliveryDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </div>

              {/* Verify Button */}
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

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-10">No packages found.</p>
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
            setPackages(packages.filter(p => p.id !== verifyModalData.id))
            setVerifyModalData(null)
          }}
          onDetected={(code) => {
    console.log("Verified barcode:", code);
    alert("Detected: " + code);
  }}
        />
      )}

    </div>
  )
}
