import React, { useState } from "react";
import axios from "axios";
import Signup from "./Signup";

function Login({ setToken }) {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [showSignup, setShowSignup] = useState(false);

// 🔁 Switch to Signup
if (showSignup) {
return <Signup onBack={() => setShowSignup(false)} />;
}

const login = async () => {
const email = username.trim();
const pass = password.trim();


if (!email || !pass) {
  alert("Please enter email and password");
  return;
}

try {
  setLoading(true);

  const res = await axios.post("http://127.0.0.1:8000/login", {
    email,
    password: pass,
  });

  const newToken = res.data.access_token;

  // ✅ Save token
  localStorage.setItem("token", newToken);

  console.log("✅ TOKEN SAVED");

  // 🔥 Update App state (NO RELOAD)
  setToken(newToken);

} catch (err) {
  console.error("❌ LOGIN ERROR:", err.response?.data || err.message);

  if (err.response?.status === 401) {
    alert("Invalid password ❌");
  } else if (err.response?.status === 404) {
    alert("User not found ❌");
  } else {
    alert("Login failed ❌");
  }

} finally {
  setLoading(false);
}


};

return (
<div
style={{
height: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
background: "#1e1e26",
}}
>
<div
style={{
background: "#2d2d3a",
padding: "30px",
borderRadius: "10px",
width: "320px",
display: "flex",
flexDirection: "column",
gap: "15px",
boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
}}
>
<h2 style={{ color: "#fff", textAlign: "center" }}>Login</h2>

```
    <input
      placeholder="Email"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      style={{
        padding: "10px",
        borderRadius: "6px",
        border: "none",
        outline: "none",
      }}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={{
        padding: "10px",
        borderRadius: "6px",
        border: "none",
        outline: "none",
      }}
    />

    <button
      onClick={login}
      disabled={loading}
      style={{
        padding: "10px",
        borderRadius: "6px",
        border: "none",
        background: loading ? "#888" : "#4CAF50",
        color: "#fff",
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: "bold",
      }}
    >
      {loading ? "Logging in..." : "Login"}
    </button>

    <p style={{ color: "#fff", textAlign: "center" }}>
      Don't have an account?{" "}
      <span
        onClick={() => setShowSignup(true)}
        style={{
          color: "#4CAF50",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Signup
      </span>
    </p>
  </div>
</div>


);
}

export default Login;
