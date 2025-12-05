import React, { useState, useEffect } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"

export default function GuardDashboard() {
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Guard navigation items
  const navItems = [
    
    { to: "ActivePackages", icon: "📦", label: "Active Packages" },
    { to: "OldPackages", icon: "📁", label: "Old Packages" },
    { to: "ReturnPackages", icon: " 🔄", label: "Return Packages" },
  ]

  const isActive = (route) => {
    if (route === "") return pathname === "/guard"
    return pathname.endsWith(route)
  }

  const getPageTitle = () => {
    if (pathname.endsWith("ActivePackages") || pathname === "/guard") return "Active Packages"
    if (pathname.endsWith("OldPackages")) return "Old Packages"
    return "Dashboard"
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("guardProfile")
    window.location.href = "/logout"
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">

      {/* Mobile shade */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:relative w-72 h-full bg-white/80 backdrop-blur-xl
        border-r border-gray-200 shadow-2xl flex flex-col transition-transform 
        duration-300 z-50`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 
          flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-2xl">🛂</span>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 
              bg-clip-text text-transparent">
              ParcelTrack
            </h1>
            <p className="text-xs text-gray-500 font-medium">Guard Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl 
                    transition-all duration-200 ${
                      isActive(item.to)
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30 scale-[1.02]"
                        : "text-gray-600 hover:text-gray-900 hover:bg-blue-50/80"
                    }`}
                >
                  {isActive(item.to) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}

                  {/* Icon */}
                  <span className="text-2xl transform group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r 
              from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold 
              rounded-xl shadow-lg shadow-red-300/40 transition-all hover:scale-[1.02]"
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

          <div className="h-full flex items-center justify-between">
            
            <div className="flex items-center gap-4">
              
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Page Title */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                  flex items-center justify-center backdrop-blur-xl border border-purple-200/50">
                  <span className="text-2xl">
                    {pathname.endsWith("OldPackages") ? "📁" : "📦"}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                    bg-clip-text text-transparent">
                    {getPageTitle()}
                  </h2>
                  <p className="text-xs text-gray-500">Guard Panel</p>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border 
              border-gray-200/50 p-6 min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
