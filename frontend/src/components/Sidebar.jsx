import React from "react";

function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100%",
      backgroundColor: "#2c2c3e",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      padding: "20px",
      gap: "20px"
    }}>
      <h3>Menu</h3>

      <button style={btnStyle}>🏠 Dashboard</button>
      <button style={btnStyle}>💻 Session</button>
      <button style={btnStyle}>📩 Invitations</button>
      <button style={btnStyle}>👤 Profile</button>
    </div>
  );
}

const btnStyle = {
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#3a3a50",
  color: "#fff",
  cursor: "pointer",
  textAlign: "left"
};

export default Sidebar;