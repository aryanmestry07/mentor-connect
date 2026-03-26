import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function StudentDashboard({ user, setToken, endSession }) {
const [mentorId, setMentorId] = useState("");
const [loading, setLoading] = useState(false);

// 🔹 Send Invite
const sendInvite = async () => {
if (!mentorId) {
alert("Enter Mentor ID ❗");
return;
}


try {
  setLoading(true);

  const token = localStorage.getItem("token");

  await axios.post(
    `http://127.0.0.1:8000/invite/send?receiver_id=${Number(mentorId)}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert("📩 Invite Sent Successfully");
  setMentorId("");

} catch (err) {
  console.error("❌ Invite Error:", err.response?.data || err.message);

  if (err.response?.status === 401) {
    alert("Session expired. Please login again ❌");
    setToken(null); // 🔥 auto logout
  } else {
    alert("Failed to send invite ❌");
  }

} finally {
  setLoading(false);
}


};

return (
<div
style={{
background: "#1e1e26",
color: "#fff",
minHeight: "100vh",
}}
>
{/* 🔥 Navbar */} <Navbar user={user} setToken={setToken} />


  <div style={{ padding: "20px" }}>
    <h1>🎓 Student Dashboard</h1>

    {/* 📤 Invite Box */}
    <div
      style={{
        marginTop: "20px",
        background: "#2d2d3a",
        padding: "20px",
        borderRadius: "10px",
        width: "300px",
      }}
    >
      <h3>📤 Send Invite</h3>

      <input
        type="number"
        placeholder="Enter Mentor ID"
        value={mentorId}
        onChange={(e) => setMentorId(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "5px",
          border: "none",
          outline: "none",
        }}
      />

      <button
        onClick={sendInvite}
        disabled={loading}
        style={{
          marginTop: "15px",
          width: "100%",
          padding: "10px",
          background: loading ? "#888" : "#4CAF50",
          border: "none",
          borderRadius: "5px",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Sending..." : "Send Invite 🚀"}
      </button>
    </div>

    {/* ❌ End Session Button */}
    <div style={{ marginTop: "30px", width: "300px" }}>
      <button
        onClick={endSession}
        style={{
          width: "100%",
          padding: "12px",
          background: "#ff4d4d",
          border: "none",
          borderRadius: "6px",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ❌ End Session
      </button>
    </div>
  </div>
</div>


);
}

export default StudentDashboard;
