import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

// Components
import Login from "./components/Login";
import MentorDashboard from "./components/MentorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import SessionPage from "./components/SessionPage";
import PremiumCursor from "./components/PremiumCursor"; // ✅ ADD THIS

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // ✅ Decode user
  const user = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.exp || Date.now() >= payload.exp * 1000) {
        throw new Error("Token expired");
      }
      return payload;
    } catch (err) {
      console.error("Auth Error:", err.message);
      return null;
    }
  }, [token]);

  // ✅ Logout if invalid
  useEffect(() => {
    if (token && !user) {
      handleLogout();
    }
  }, [token, user]);

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // 🔒 Auth guard
  if (!token) return <Login onLogin={handleLogin} />;

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <p className="text-white">Loading...</p>
      </div>
    );

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        
        {/* NAVBAR */}
        <nav className="border-b bg-white p-4 flex justify-between">
          <Link to="/">MentorConnect</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>

        <main className="p-4">
          <Routes>

            {/* HOME */}
            <Route
              path="/"
              element={
                user.role === "mentor" ? (
                  <MentorDashboard user={user} />
                ) : (
                  <StudentDashboard user={user} />
                )
              }
            />

            {/* SESSION */}
            <Route
              path="/session/:sessionCode"
              element={
                <SessionPage
                  role={user.role}
                  user={user}
                />
              }
            />


            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;