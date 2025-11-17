import React, { useState } from "react"

export default function GuardOldPackages() {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 20

  // --- SAMPLE DATA (same as student version) ---
  const initialPackages = [
    {
      id: "PKG-2024-001",
      recipientName: "Rahul Sharma",
      phoneNumber: "9876543210",
      deliveryDate: "2024-10-10",
      pickedUpDate: "2024-10-15",
      pickedUpBy: { rollNumber: "IMT2021001", name: "Rahul Sharma" },
      courier: "Amazon",
    },
    {
      id: "PKG-2024-002",
      recipientName: "Priya Patel",
      phoneNumber: "8765432109",
      deliveryDate: "2024-10-12",
      pickedUpDate: "2024-10-18",
      pickedUpBy: { rollNumber: "IMT2021045", name: "Priya Patel" },
      courier: "Flipkart",
    },
    {
      id: "PKG-2024-003",
      recipientName: "Amit Kumar",
      phoneNumber: "7654321098",
      deliveryDate: "2024-09-14",
      pickedUpDate: "2024-09-20",
      pickedUpBy: { rollNumber: "IMT2021078", name: "Amit Kumar" },
      courier: "BlueDart",
    },
  ]

  const generateMore = () => {
    const arr = []
    const courierList = ["Amazon", "Flipkart", "BlueDart", "Delhivery"]
    const names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Ananya"]

    for (let i = 4; i < 80; i++) {
      arr.push({
        id: `PKG-2024-${String(i + 1).padStart(3, "0")}`,
        recipientName: names[i % names.length],
        phoneNumber: `98${Math.floor(10000000 + Math.random() * 89999999)}`,
        deliveryDate: "2024-11-01",
        pickedUpDate: "2024-11-03",
        pickedUpBy: { rollNumber: `IMT2021${i}`, name: names[i % names.length] },
        courier: courierList[i % courierList.length],
      })
    }
    return arr
  }

  const allPackages = [...initialPackages, ...generateMore()]

  // --- SEARCH ---
  const filtered = allPackages.filter(
    (pkg) =>
      pkg.id.toLowerCase().includes(search.toLowerCase()) ||
      pkg.recipientName.toLowerCase().includes(search.toLowerCase())
  )

  // --- PAGINATION ---
  const totalPages = Math.ceil(filtered.length / perPage)
  const start = (currentPage - 1) * perPage
  const current = filtered.slice(start, start + perPage)

  const changePage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const paginationRange = () => {
    const range = []
    const show = 5

    let start = Math.max(1, currentPage - Math.floor(show / 2))
    let end = Math.min(totalPages, start + show - 1)
    if (end - start < show - 1) start = Math.max(1, end - show + 1)

    for (let i = start; i <= end; i++) range.push(i)
    return range
  }

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
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
        placeholder="Search by package ID or name"
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {current.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:scale-[1.02]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3.5 flex justify-between items-center">
              <span className="text-white font-bold text-sm">{pkg.id}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">✔ Collected</span>
            </div>

            <div className="p-5 space-y-4">

              {/* Recipient */}
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

              {/* Picked Up By */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-100 p-3 rounded-xl">
                <p className="text-xs text-purple-700 font-semibold mb-1">Picked Up By</p>
                <p className="text-sm font-bold">Name: {pkg.pickedUpBy.name}</p>
                <p className="text-sm font-semibold text-gray-700">Roll: {pkg.pickedUpBy.rollNumber}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-700 font-semibold">Delivered</p>
                  <p className="text-sm font-bold">
                    {new Date(pkg.deliveryDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-purple-700 font-semibold">Picked Up</p>
                  <p className="text-sm font-bold">
                    {new Date(pkg.pickedUpDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

            </div>
          </div>
        ))}

        {current.length === 0 && (
          <p className="text-gray-500 text-center col-span-full py-10">No Results Found</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-white border hover:bg-purple-600 hover:text-white"
            }`}
          >
            ← Prev
          </button>

          {paginationRange().map((p) => (
            <button
              key={p}
              onClick={() => changePage(p)}
              className={`w-10 h-10 rounded-lg font-semibold transition ${
                p === currentPage
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-white border hover:bg-purple-600 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-white border hover:bg-purple-600 hover:text-white"
            }`}
          >
            Next →
          </button>
        </div>
      )}

    </div>
  )
}
