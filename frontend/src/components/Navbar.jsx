import React from "react";

function Navbar({ user, setToken }) {

// 🔓 Logout (React way 🔥)
const handleLogout = () => {
localStorage.removeItem("token");
sessionStorage.clear();

setToken(null); // 🔥 triggers App re-render

console.log("👋 Logged out");


};

return (
<div
style={{
height: "60px",
backgroundColor: "#1e1e2f",
color: "#fff",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
padding: "0 20px",
boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
}}
>
<h2 style={{ margin: 0 }}>MentorConnect 🚀</h2>

  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
    
    {/* 🎯 Role */}
    <span style={{ fontSize: "14px", opacity: 0.8 }}>
      Role: {user?.role ? user.role.toUpperCase() : "Guest"}
    </span>

    {/* 🆔 User ID */}
    {user?.user_id && (
      <span style={{ fontSize: "12px", opacity: 0.6 }}>
        ID: {user.user_id}
      </span>
    )}

    {/* 🔓 Logout */}
    <button
      onClick={handleLogout}
      style={{
        padding: "6px 12px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#ff4d4d",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Logout
    </button>
  </div>
</div>


);
}

export default Navbar;
