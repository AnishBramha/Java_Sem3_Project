import React, { useState, useEffect } from "react"


export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    setIsVisible(true)

    const p = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }))
    setParticles(p)
  }, [])

const login = () => {
  const clientId = import.meta.env.VITE_MS_CLIENT_ID;
  const tenantId = import.meta.env.VITE_MS_TENANT_ID;
  const redirectUri = import.meta.env.VITE_MS_REDIRECT_URI;

  const authUrl = 
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_mode=query` +
    `&scope=openid profile email`;

  window.location.href = authUrl;
};


  const loginGuard = () => {
    window.location.href = "/guard"
  }

  const loginAdmin = () => {
    window.location.href = "/admin"
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
        style={{
          backgroundImage: "url('/parcel_bg.jpg')",
          filter: "blur(2px)",
          opacity: 0.35
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-indigo-900/60" />

      {/* Floating Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">

        {/* App Logo */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <div className="w-28 h-28 rounded-3xl bg-white/80 backdrop-blur-md flex items-center justify-center shadow-xl">
            <img src="/logo.png" className="w-20 h-20" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className={`text-5xl md:text-7xl font-black text-white tracking-tight mb-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          ParcelTrack
        </h1>

        {/* Subtitle */}
        <p className={`text-lg md:text-2xl text-white/80 font-light max-w-xl mb-10 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          Your deliveries at IIITB — logged, stored with the guard, and ready for pickup anytime.
        </p>

        {/* Login Buttons */}
<div className={`flex flex-col items-center gap-4 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>

  {/* Main Student Login */}
  <button
    onClick={login}
    className="group relative bg-white text-gray-800 px-10 py-4 rounded-2xl border-2 border-gray-200 shadow-xl hover:shadow-blue-500/30 hover:border-blue-500 hover:scale-105 transition-all duration-300 flex items-center gap-4"
  >
    <svg className="h-6 w-6 group-hover:scale-110 transition-transform" viewBox="0 0 23 23" fill="none">
      <rect width="10.88" height="10.88" fill="#F25022" />
      <rect x="12.12" width="10.88" height="10.88" fill="#7FBA00" />
      <rect y="12.12" width="10.88" height="10.88" fill="#00A4EF" />
      <rect x="12.12" y="12.12" width="10.88" height="10.88" fill="#FFB900" />
    </svg>
    <span className="font-semibold">Login with Microsoft (Students)</span>
  </button>

  {/* Secondary buttons */}
  <div className="flex gap-4 mt-2">

    <button
      onClick={loginAdmin}
      className="bg-white/20 text-white/80 px-6 py-2 rounded-xl border border-white/30 hover:bg-white/30 hover:text-white transition-all duration-300 backdrop-blur-md"
    >
      Admin Login
    </button>

    <button
      onClick={loginGuard}
      className="bg-white/20 text-white/80 px-6 py-2 rounded-xl border border-white/30 hover:bg-white/30 hover:text-white transition-all duration-300 backdrop-blur-md"
    >
      Guard Login
    </button>

  </div>

</div>


      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slow-zoom {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.07); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        .animate-slow-zoom { animation: slow-zoom 18s ease-in-out infinite; }
        .animate-float { animation: float 3.5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
