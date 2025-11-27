import React, { useState, useEffect } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"

export default function StudentDashboard() {
  const { pathname } = useLocation()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Load user profile from localStorage
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      setUser(JSON.parse(storedProfile))
    }
  }, [])

  const isActive = (route) => {
    if (route === "") return pathname === "/student/dashboard"
    return pathname.endsWith(route)
  }

  const getPageTitle = () => {
    if (pathname.endsWith("MyPackages")) return "My Packages"
    if (pathname.endsWith("OldPackages")) return "Old Packages"
    if (pathname.endsWith("profile")) return "Profile"
    return "Dashboard"
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userProfile")
    window.location.href = "/logout"
  }

  const navItems = [
    { to: "MyPackages", icon: "📦", label: "My Packages"},
    { to: "OldPackages", icon: "📁", label: "Old Packages" },
    { to: "profile", icon: "👤", label: "Profile" },
    {to: "QRCode", icon: "⛶", label: "My QR Code" },
  ]

  // Loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative w-72 h-full bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-2xl flex flex-col transition-transform duration-300 z-50`}>
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-2xl">📦</span>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ParcelTrack
            </h1>
            <p className="text-xs text-gray-500 font-medium">IIIT Bangalore</p>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-br from-blue-100/50 via-purple-100/50 to-pink-100/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-blue-200/50">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-sm text-gray-800 truncate">{user.name || "User"}</h2>
              <p className="text-xs text-gray-500 truncate">{user.email || "user@iiitb.ac.in"}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.to)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30 scale-[1.02]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-blue-50/80"
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive(item.to) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                  
                  {/* Icon */}
                  <span className="text-2xl transform group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  
                  {/* Label & Badge */}
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-semibold text-sm">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full shadow ${
                        isActive(item.to) 
                          ? "bg-white/30 text-white" 
                          : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-red-300/40 transition-all hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-30 px-4 lg:px-8">
          <div className="h-full flex items-center justify-between">
            
            {/* Left: Mobile Menu + Title */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Page Title */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center backdrop-blur-xl border border-purple-200/50">
                  <span className="text-2xl">
                    {pathname.endsWith("MyPackages") ? "📦" : pathname.endsWith("OldPackages") ? "📁" : "👤"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {getPageTitle()}
                  </h2>
                  <p className="text-xs text-gray-500">Welcome back, {user.name?.split(" ")[0] || "User"}</p>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 min-h-[calc(100vh-8rem)] transition-all duration-300">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}