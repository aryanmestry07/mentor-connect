import React, { useEffect, useState } from "react";
import axios from "axios";

function MentorDashboard({ user }) {
  const [invites, setInvites] = useState([]);

  const token = localStorage.getItem("token");

  // 🔹 Fetch Invites
  const fetchInvites = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/invite/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvites(res.data);
    } catch (err) {
      console.error("Error fetching invites:", err);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  // 🔹 Accept Invite
  const acceptInvite = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/invite/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Invite Accepted");
      fetchInvites();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Reject Invite
  const rejectInvite = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/invite/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("❌ Invite Rejected");
      fetchInvites();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        background: "#1e1e26",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1>👨‍🏫 Mentor Dashboard</h1>

      <h3 style={{ marginTop: "20px" }}>📩 Incoming Invites</h3>

      {invites.length === 0 ? (
        <p>No invites yet</p>
      ) : (
        invites.map((invite) => (
          <div
            key={invite.id}
            style={{
              background: "#2d2d3a",
              padding: "15px",
              marginTop: "10px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p>From User ID: {invite.sender_id}</p>
              <p>Status: {invite.status}</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => acceptInvite(invite.id)}
                style={{
                  background: "#4CAF50",
                  border: "none",
                  padding: "8px 12px",
                  color: "#fff",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Accept
              </button>

              <button
                onClick={() => rejectInvite(invite.id)}
                style={{
                  background: "#ff4d4d",
                  border: "none",
                  padding: "8px 12px",
                  color: "#fff",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MentorDashboard;