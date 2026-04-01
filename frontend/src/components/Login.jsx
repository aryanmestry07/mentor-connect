import React, { useState } from "react";
import axios from "axios";
import Signup from "./Signup";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (showSignup) {
    return <Signup onBack={() => setShowSignup(false)} />;
  }

  const login = async () => {
    const userEmail = email.trim();
    const pass = password.trim();

    if (!userEmail || !pass) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/login", {
        email: userEmail,
        password: pass,
      });

      const { access_token, user_id, role } = res.data;

      // ✅ SAFE TOKEN DECODE (NO CRASH)
      let name = "User";

      try {
        const payload = JSON.parse(atob(access_token.split(".")[1]));
        name = payload.name || "User";
      } catch (err) {
        console.error("Token decode failed",err);
      }

      // ✅ SAVE ALL DATA
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);

      console.log("Login success:", { user_id, role, name });

      onLogin(access_token);

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      if (err.response?.status === 404) {
        alert("User not found");
      } else if (err.response?.status === 401) {
        alert("Invalid password");
      } else {
        alert("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>MentorConnect</h2>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.text}>
          Don't have an account?{" "}
          <span
            onClick={() => setShowSignup(true)}
            style={styles.link}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },

  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  title: {
    color: "white",
    textAlign: "center",
    marginBottom: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
  },

  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  text: {
    color: "#cbd5f5",
    textAlign: "center",
    fontSize: "14px",
  },

  link: {
    color: "#38bdf8",
    cursor: "pointer",
  },
};