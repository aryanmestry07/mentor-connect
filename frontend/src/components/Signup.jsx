import React, { useState } from "react";
import axios from "axios";

function Signup({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:8000/register", {
        name: email.split('@')[0], // Default name from email
        email: email,
        password,
        role,
        age: 20,
      });

      // Instead of alert, we could show a success toast, 
      // but for now, we'll head back to login.
      onBack();
    } catch (err) {
      if (err.response?.status === 400) {
        setError("An account with this email already exists.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl shadow-slate-200/50">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join the community and start connecting
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={signup}>
          <div className="space-y-4">
            {/* Role Selection Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  role === "student" 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setRole("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  role === "mentor" 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setRole("mentor")}
              >
                Mentor
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
            
            <button
              type="button"
              onClick={onBack}
              className="flex w-full justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;