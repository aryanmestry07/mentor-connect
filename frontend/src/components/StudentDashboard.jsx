import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function StudentDashboard({ user, setToken }) {
  const navigate = useNavigate();

  const [sessionCodeInput, setSessionCodeInput] = useState("");
  const [createdLink, setCreatedLink] = useState("");

  // Create session
  const createSession = async () => {
    try {
      const res = await api.post(`/session/create?user_id=${user.user_id}`);

      const code = res.data.session_code;

      setCreatedLink(code);

      // Auto redirect to session
      navigate(`/session/${code}`);
    } catch (err) {
      console.error("Create session error:", err);
    }
  };

  // Join session
  const joinSession = () => {
    if (!sessionCodeInput.trim()) return;

    navigate(`/session/${sessionCodeInput}`);
  };

  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        <Navbar user={user} setToken={setToken} />

        <div style={styles.content}>
          <h1 style={styles.title}>Student Hub</h1>

          {/* Create Session */}
          <div style={styles.card}>
            <h2>Create Session</h2>
            <button style={styles.primaryBtn} onClick={createSession}>
              Start New Session
            </button>

            {createdLink && (
              <div style={styles.linkBox}>
                <p>Session Code:</p>
                <strong>{createdLink}</strong>
              </div>
            )}
          </div>

          {/* Join Session */}
          <div style={styles.card}>
            <h2>Join Session</h2>

            <div style={styles.joinBox}>
              <input
                value={sessionCodeInput}
                onChange={(e) => setSessionCodeInput(e.target.value)}
                placeholder="Enter session code"
                style={styles.input}
              />

              <button style={styles.primaryBtn} onClick={joinSession}>
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#0f172a",
    color: "white",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  content: {
    padding: "30px",
  },

  title: {
    marginBottom: "20px",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  joinBox: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
    background: "#020617",
    border: "1px solid #334155",
    color: "white",
  },

  primaryBtn: {
    padding: "10px 20px",
    background: "#2563eb",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  linkBox: {
    marginTop: "10px",
    padding: "10px",
    background: "#020617",
    borderRadius: "6px",
  },
};