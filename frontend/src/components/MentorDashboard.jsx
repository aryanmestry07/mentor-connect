import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function MentorDashboard({ user }) {
  const navigate = useNavigate();
  const [sessionCodeInput, setSessionCodeInput] = useState("");
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/session/create?user_id=${user.user_id}`);
      const code = res.data.session_code;
      navigate(`/session/${code}`);
    } catch (err) {
      console.error("Create session error:", err);
    } finally {
      setLoading(false);
    }
  };

  const joinSession = (e) => {
    e.preventDefault();
    if (!sessionCodeInput.trim()) return;
    navigate(`/session/${sessionCodeInput}`);
  };

  return (
    <div className="space-y-8">
      {/* Mentor Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mentor Dashboard</h1>
          <p className="text-slate-500 text-lg">Manage your sessions and guide your students.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-emerald-700 border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-semibold uppercase tracking-wider">Ready to Mentor</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Primary Action: Host Session */}
        <div className="lg:col-span-2 rounded-2xl bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-200">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold">Host a New Session</h2>
            <p className="mt-2 text-indigo-100">
              Launch a collaborative workspace with real-time tools to help your students solve complex problems.
            </p>
            <button
              onClick={createSession}
              disabled={loading}
              className="mt-8 rounded-xl bg-white px-8 py-3 font-bold text-indigo-600 transition-all hover:bg-indigo-50 active:scale-95 disabled:opacity-70"
            >
              {loading ? "Preparing Workspace..." : "Start Session Now"}
            </button>
          </div>
        </div>

        {/* Secondary Action: Join by Code */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-slate-300">
          <h2 className="text-xl font-bold text-slate-900">Join via Code</h2>
          <p className="mt-2 text-sm text-slate-500">Entering an existing student session?</p>
          
          <form onSubmit={joinSession} className="mt-6 space-y-3">
            <input
              type="text"
              value={sessionCodeInput}
              onChange={(e) => setSessionCodeInput(e.target.value)}
              placeholder="ENTER CODE"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-mono text-lg tracking-widest text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-800"
            >
              Enter Session
            </button>
          </form>
        </div>
      </div>

      
    </div>
  );
}

export default MentorDashboard;