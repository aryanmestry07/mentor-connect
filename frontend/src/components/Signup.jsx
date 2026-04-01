import React, { useState } from "react";
import axios from "axios";

function Signup({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!username || !password) {
      alert("Fill all fields ❗");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://127.0.0.1:8000/register", {
        name: username,
        email: username,
        password,
        role,
        age: 20,
      });

      alert("Signup successful 🎉");

      // ✅ Go back to login instead of reload
      onBack();

    } catch (err) {
      console.error(err.response?.data || err.message);

      if (err.response?.status === 400) {
        alert("User already exists ❌");
      } else {
        alert("Signup failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#1e1e26" }}>
      <div style={{ background: "#2d2d3a", padding: "30px", borderRadius: "10px", width: "300px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <h2 style={{ color: "#fff", textAlign: "center" }}>Signup</h2>

        <input
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
        </select>

        <button onClick={signup} disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>

        <button onClick={onBack}>⬅ Back to Login</button>
      </div>
    </div>
  );
}

export default Signup;