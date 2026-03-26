import React, { useEffect, useState } from "react";
import axios from "axios";

function InvitePanel() {
  const [invites, setInvites] = useState([]);
  const [userId, setUserId] = useState("");

  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  // 🔹 Fetch invites (SAFE VERSION)
  const fetchInvites = async () => {
    // ❌ Don't call API if no token
    if (!token) {
      console.log("No token found, skipping fetch");
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/invite/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setInvites(res.data);
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);

      // 🔥 Handle unauthorized
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.reload();
      }
    }
  };

  // 🔹 Only run when token exists
  useEffect(() => {
    if (token) {
      fetchInvites();
    }
  }, [token]);

  // 🔹 Send invite
  const sendInvite = async () => {
    if (!userId) return alert("Enter User ID");
    if (!token) return alert("Login required");

    try {
      await axios.post(
        `http://127.0.0.1:8000/invite/send?receiver_id=${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserId("");
      alert("Invite Sent 🚀");
      fetchInvites();
    } catch (err) {
      console.error("Send Error:", err.response?.data || err.message);
    }
  };

  // 🔹 Accept invite
  const acceptInvite = async (id) => {
    if (!token) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/invite/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchInvites();
    } catch (err) {
      console.error("Accept Error:", err.response?.data || err.message);
    }
  };

  // 🔹 Reject invite
  const rejectInvite = async (id) => {
    if (!token) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/invite/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchInvites();
    } catch (err) {
      console.error("Reject Error:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: "30px", width: "100%" }}>
      <h2>📩 Invitations</h2>

      {/* Send Invite */}
      <div style={{
        background: "#2d2d3a",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        color: "#fff"
      }}>
        <h4>Send Invite</h4>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "none"
            }}
          />

          <button
            onClick={sendInvite}
            style={{
              padding: "10px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "6px"
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Invite List */}
      <div style={{
        background: "#2d2d3a",
        padding: "20px",
        borderRadius: "10px",
        color: "#fff"
      }}>
        {invites.length === 0 ? (
          <p>No invites</p>
        ) : (
          invites.map((inv) => (
            <div key={inv.id} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #444"
            }}>
              <div>
                User {inv.sender_id} - {inv.status}
              </div>

              {inv.status === "pending" && (
                <div>
                  <button onClick={() => acceptInvite(inv.id)}>✔</button>
                  <button onClick={() => rejectInvite(inv.id)}>❌</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default InvitePanel;