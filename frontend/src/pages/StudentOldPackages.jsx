import React, { useState } from 'react'

const StudentOldPackages = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const packagesPerPage = 20

  // Sample old package data (expanded to show pagination)
  const [allPackages] = useState([
    {
      id: 'PKG-2024-001',
      recipientName: 'Rahul Sharma',
      phoneNumber: '+91 98765 43210',
      deliveryDate: '2024-10-10',
      pickedUpDate: '2024-10-15',
      pickedUpBy: {
        rollNumber: 'IMT2021001',
        name: 'Rahul Sharma'
      },
      courier: 'Amazon'
    },
    {
      id: 'PKG-2024-002',
      recipientName: 'Priya Patel',
      phoneNumber: '+91 87654 32109',
      deliveryDate: '2024-10-12',
      pickedUpDate: '2024-10-18',
      pickedUpBy: {
        rollNumber: 'IMT2021045',
        name: 'Priya Patel'
      },
      courier: 'Flipkart'
    },
    {
      id: 'PKG-2024-003',
      recipientName: 'Amit Kumar',
      phoneNumber: '+91 76543 21098',
      deliveryDate: '2024-09-14',
      pickedUpDate: '2024-09-20',
      pickedUpBy: {
        rollNumber: 'IMT2021078',
        name: 'Amit Kumar'
      },
      courier: 'BlueDart'
    },
    {
      id: 'PKG-2024-004',
      recipientName: 'Sneha Reddy',
      phoneNumber: '+91 65432 10987',
      deliveryDate: '2024-09-15',
      pickedUpDate: '2024-09-19',
      pickedUpBy: {
        rollNumber: 'IMT2021102',
        name: 'Sneha Reddy'
      },
      courier: 'Delhivery'
    },
    {
      id: 'PKG-2024-005',
      recipientName: 'Vikram Singh',
      phoneNumber: '+91 54321 09876',
      deliveryDate: '2024-10-13',
      pickedUpDate: '2024-10-16',
      pickedUpBy: {
        rollNumber: 'IMT2021134',
        name: 'Vikram Singh'
      },
      courier: 'Amazon'
    },
    {
      id: 'PKG-2024-006',
      recipientName: 'Ananya Das',
      phoneNumber: '+91 43210 98765',
      deliveryDate: '2024-10-11',
      pickedUpDate: '2024-10-17',
      pickedUpBy: {
        rollNumber: 'IMT2021156',
        name: 'Ananya Das'
      },
      courier: 'Flipkart'
    }
  ])

  // Generate more sample data to demonstrate pagination
  const generateMorePackages = () => {
    const additionalPackages = []
    for (let i = 7; i <= 45; i++) {
      const couriers = ['Amazon', 'Flipkart', 'BlueDart', 'Delhivery']
      const names = ['Rahul Kumar', 'Priya Singh', 'Amit Patel', 'Sneha Verma', 'Vikram Reddy', 'Ananya Sharma']
      additionalPackages.push({
        id: `PKG-2024-${String(i).padStart(3, '0')}`,
        recipientName: names[i % names.length],
        phoneNumber: `+91 ${90000 + i}00000`,
        deliveryDate: `2024-${String(Math.floor(Math.random() * 3) + 8).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        pickedUpDate: `2024-${String(Math.floor(Math.random() * 3) + 8).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        pickedUpBy: {
          rollNumber: `IMT2021${String(i).padStart(3, '0')}`,
          name: names[i % names.length]
        },
        courier: couriers[i % couriers.length]
      })
    }
    return additionalPackages
  }

  const allPackagesData = [...allPackages, ...generateMorePackages()]

  // Calculate pagination
  const totalPages = Math.ceil(allPackagesData.length / packagesPerPage)
  const indexOfLastPackage = currentPage * packagesPerPage
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage
  const currentPackages = allPackagesData.slice(indexOfFirstPackage, indexOfLastPackage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPaginationRange = () => {
    const range = []
    const showPages = 5
    
    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    let end = Math.min(totalPages, start + showPages - 1)
    
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i)
    }
    
    return range
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Old Packages
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {allPackagesData.length} packages collected • Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentPackages.map((pkg) => {
          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:scale-[1.03] group cursor-pointer"
            >
              {/* Purple Gradient Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3.5 flex items-center justify-between">
                <span className="text-white font-bold text-sm">{pkg.id}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">
                  ✅ Collected
                </span>
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

                {/* Picked Up By */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-purple-100">
                  <p className="text-xs text-purple-700 font-semibold mb-2">Picked Up By</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-600">Roll:</span>
                    <span className="text-sm font-bold text-gray-900">{pkg.pickedUpBy.rollNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Name:</span>
                    <span className="text-sm font-bold text-gray-900">{pkg.pickedUpBy.name}</span>
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
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <p className="text-xs text-purple-700 font-semibold mb-1">Picked Up</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(pkg.pickedUpDate).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pb-4">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white border border-purple-200 shadow-sm hover:shadow-md'
            }`}
          >
            ← Previous
          </button>

          {/* First Page */}
          {getPaginationRange()[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="w-10 h-10 rounded-lg font-semibold bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white border border-purple-200 shadow-sm hover:shadow-md transition-all"
              >
                1
              </button>
              {getPaginationRange()[0] > 2 && (
                <span className="text-gray-400 font-bold">...</span>
              )}
            </>
          )}

          {/* Page Numbers */}
          {getPaginationRange().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                currentPage === pageNum
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white border border-purple-200 shadow-sm hover:shadow-md'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Last Page */}
          {getPaginationRange()[getPaginationRange().length - 1] < totalPages && (
            <>
              {getPaginationRange()[getPaginationRange().length - 1] < totalPages - 1 && (
                <span className="text-gray-400 font-bold">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="w-10 h-10 rounded-lg font-semibold bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white border border-purple-200 shadow-sm hover:shadow-md transition-all"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white border border-purple-200 shadow-sm hover:shadow-md'
            }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* Empty State */}
      {allPackagesData.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            📁
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No Old Packages</h3>
          <p className="text-gray-500 text-sm">You don't have any collected packages yet.</p>
        </div>
      )}
    </div>
  )
}

export default StudentOldPackages