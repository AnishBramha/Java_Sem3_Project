import { Routes, Route, Link } from "react-router-dom"
import  Home  from "./pages/Home.jsx"
import  StudentDashboard  from "./pages/StudentDashboard.jsx"
import  AdminDashboard  from "./pages/AdminDashboard.jsx"
import  GuardDashboard  from "./pages/GuardDashboard.jsx"
import  AdminLogin  from "./pages/AdminLogin.jsx"
import  GuardLogin  from "./pages/GuardLogin.jsx"
import  LoginSuccess  from "./pages/LoginSuccess.jsx"
import StudentMyPackages from "./pages/StudentMyPackages.jsx"
import StudentOldPackages from "./pages/StudentOldPackages.jsx"
import StudentProfile from "./pages/StudentProfile.jsx"
import Logout from "./pages/Logout.jsx"
import GuardActivePackages from "./pages/GuardActivePackages.jsx"
import GuardOldPackages from "./pages/GuardOldPackages.jsx"
import StudentQRCode from "./pages/StudentQRCode.jsx"

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/success" element={<LoginSuccess />} />        
        <Route path="/student" element={<StudentDashboard />}>
          <Route path="" element={<StudentMyPackages />} />
          <Route path="MyPackages" element={<StudentMyPackages />} />
          <Route path="OldPackages" element={<StudentOldPackages />} />
          <Route path="QRCode" element={<StudentQRCode />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="/admin" element={<AdminDashboard />} />


        <Route path="/guard" element={<GuardDashboard />}>
          <Route path="" element={<GuardActivePackages />} />
          <Route path="ActivePackages" element={<GuardActivePackages />} />
          <Route path="OldPackages" element={<GuardOldPackages />} />
        </Route>
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/guard/login" element={<GuardLogin />} />
        <Route path="/logout" element={<Logout />} />
    
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
              <p className="text-lg text-gray-600 mb-6">The page you are looking for does not exist.</p>
              <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Go to Home
              </Link>
            </div>
          </div>
        } 
        />


      </Routes>
    </>
  )
}

export default App
