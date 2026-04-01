import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import MentorDashboard from "./components/MentorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import SessionPage from "./components/SessionPage";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Decode user
  const user = useMemo(() => {
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Invalid token",err);
      localStorage.removeItem("token");
      return null;
    }
  }, [token]);

  // Login
  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };


  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Dashboard */}
        <Route
          path="/"
          element={
            user.role === "mentor" ? (
              <MentorDashboard user={user} setToken={setToken} />
            ) : (
              <StudentDashboard user={user} setToken={setToken} />
            )
          }
        />

        {/* Session Page */}
        <Route
          path="/session/:sessionCode"
          element={<SessionPage role={user.role} />}
        />
      </Routes>
    </Router>
  );
}

export default App;