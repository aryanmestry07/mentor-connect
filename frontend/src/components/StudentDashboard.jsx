import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function StudentDashboard({ user }) {
  const navigate = useNavigate();
  const [sessionCodeInput, setSessionCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create session
  const createSession = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post(`/session/create?user_id=${user.user_id}`);
      const code = res.data.session_code;
      
      // Redirect to the newly created session
      navigate(`/session/${code}`);
    } catch (err) {
      console.error("Create session error:", err);
      setError("Failed to create session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Join session
  const joinSession = (e) => {
    e.preventDefault();
    setError("");
    
    let code = sessionCodeInput.trim();

    if (!code) {
      setError("Please enter a valid session code.");
      return;
    }

    // Logic to handle if a student accidentally pastes the full URL
    // e.g., http://localhost:5173/session/ABCDEF -> ABCDEF
    if (code.includes("/session/")) {
      code = code.split("/session/").pop();
    }

    // Standardize to uppercase (assuming your backend generates uppercase codes)
    const finalCode = code.toUpperCase();

    console.log(`Navigating to session: ${finalCode}`);
    navigate(`/session/${finalCode}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Student Hub</h1>
        <p className="text-slate-500 font-medium text-lg">
          Welcome back, <span className="text-indigo-600">{user.name}</span>. Ready to learn?
        </p>
      </div>

      {/* Global Error Display */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Action Card: Create Session */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Start a Session</h2>
          <p className="mt-3 text-slate-500 leading-relaxed">
            Create a fresh collaborative workspace and invite your mentor to help you with code or projects.
          </p>
          <button
            onClick={createSession}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Initializing...
               </span>
            ) : "Create New Session"}
          </button>
        </div>

        {/* Action Card: Join Session */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-slate-300 shadow-sm">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Join Existing</h2>
          <p className="mt-3 text-slate-500 leading-relaxed">
            Have a code from your mentor? Enter it below to jump directly into your active workspace.
          </p>
          
          <form onSubmit={joinSession} className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={sessionCodeInput}
              onChange={(e) => setSessionCodeInput(e.target.value)}
              placeholder="ENTER CODE"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center font-mono text-lg font-bold tracking-[0.3em] text-slate-900 placeholder:text-slate-300 placeholder:font-sans placeholder:tracking-normal focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase"
            />
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-slate-50/50">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">History</p>
        <p className="mt-2 text-slate-500 font-medium">No recent sessions found. Your collaborative journey starts here!</p>
      </div>
    </div>
  );
}

export default StudentDashboard;