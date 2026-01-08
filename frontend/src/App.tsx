import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Leads from './pages/Leads'
import Login from './pages/Login'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Topbar />
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <Routes>
                        <Route path="/" element={<Leads />} />
                        <Route path="/leads" element={<Leads />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
