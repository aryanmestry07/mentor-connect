import React from "react";
import { useLocation } from "react-router-dom";

function Navbar({ user, setToken }) {
  const location = useLocation();

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
  };

  // Copy session link
  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Session link copied");
  };

  // Check if inside session page
  const isSessionPage = location.pathname.includes("/session/");

  return (
    <div style={styles.navbar}>
      {/* Left */}
      <div style={styles.left}>
        <h2 style={styles.logo}>MentorConnect</h2>

        {isSessionPage && (
          <button style={styles.copyBtn} onClick={copyLink}>
            Copy Link
          </button>
        )}
      </div>

      {/* Right */}
      <div style={styles.right}>
        <span style={styles.role}>
          {user?.role ? user.role.toUpperCase() : "GUEST"}
        </span>

        {user?.user_id && (
          <span style={styles.userId}>ID: {user.user_id}</span>
        )}

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;

const styles = {
  navbar: {
    height: "60px",
    background: "#0f172a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderBottom: "1px solid #1e293b",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logo: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
  },

  copyBtn: {
    padding: "6px 12px",
    background: "#2563eb",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  role: {
    fontSize: "13px",
    opacity: 0.8,
  },

  userId: {
    fontSize: "12px",
    opacity: 0.6,
  },

  logoutBtn: {
    padding: "6px 12px",
    background: "#ef4444",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
  },
};