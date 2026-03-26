import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Login from "./components/Login";
import MentorDashboard from "./components/MentorDashboard";
import StudentDashboard from "./components/StudentDashboard";

function App() {
const socketRef = useRef(null);

// ✅ TOKEN STATE
const [token, setToken] = useState(localStorage.getItem("token"));

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

// 🔐 Decode Token
useEffect(() => {
if (!token) {
setUser(null);
setLoading(false);
return;
}
try {
  const decoded = JSON.parse(atob(token.split(".")[1]));

  console.log("🔥 TOKEN DATA:", decoded);

  if (decoded?.user_id && decoded?.role) {
    setUser(decoded);
  } else {
    throw new Error("Invalid token payload");
  }

} catch (err) {
  console.error("❌ Invalid token → clearing", err);

  localStorage.removeItem("token");
  setToken(null);
  setUser(null);
}

setLoading(false);


}, [token]);

// 🔌 WebSocket
useEffect(() => {
if (!user?.user_id) return;

console.log("🔥 Connecting WS for:", user.user_id);

const ws = new WebSocket(
  `ws://127.0.0.1:8000/ws/session/${user.user_id}`
);

socketRef.current = ws;

ws.onopen = () =>
  console.log("✅ Connected to session", user.user_id);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "invite") {
    alert(`📩 New invite from User ${data.sender_id}`);
  }
};

ws.onerror = (err) => {
  console.error("❌ WebSocket error:", err);
};

ws.onclose = () => {
  console.log("🔌 Disconnected from session", user.user_id);
};

return () => ws.close();


}, [user?.user_id]);

// ❌ END SESSION FUNCTION (NEW 🔥)
const endSession = async () => {
try {
await axios.delete(
`http://127.0.0.1:8000/session/end/${user.user_id}`
);


  // 🔌 Close WebSocket
  if (socketRef.current) {
    socketRef.current.close();
  }

  alert("❌ Session Ended");

} catch (err) {
  console.error("End session error:", err);
}


};

// 🛑 Loading
if (loading) {
return <div style={{ color: "#fff" }}>Loading...</div>;
}

// 🔐 Not logged in
if (!user) {
return <Login setToken={setToken} />;
}

// 🎯 Role-based UI
if (user.role === "mentor") {
return (
<MentorDashboard
user={user}
setToken={setToken}
endSession={endSession} // 🔥 PASS THIS
/>
);
}

if (user.role === "student") {
return (
<StudentDashboard
user={user}
setToken={setToken}
endSession={endSession} // 🔥 PASS THIS
/>
);
}

// fallback
localStorage.removeItem("token");
setToken(null);

return <Login setToken={setToken} />;
}

export default App;
