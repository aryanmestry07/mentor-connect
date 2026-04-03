import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

function Navbar({ user, setToken }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // ✅ SAFE Logout handler
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    // 🔥 FIX: only call if exists
    if (setToken) {
      setToken(null);
    }

    navigate("/"); // redirect to home/login
  };

  // Copy session link
  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSessionPage = location.pathname.includes("/session/");

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-indigo-600 hover:opacity-80 transition-opacity"
            >
              Mentor<span className="text-slate-900">Connect</span>
            </Link>

            {isSessionPage && (
              <button
                onClick={copyLink}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  copied
                    ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 ring-1 ring-indigo-200"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {copied ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  )}
                </svg>
                {copied ? "Copied!" : "Invite Others"}
              </button>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-semibold text-slate-900">
                {user?.name || "User Account"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {user?.role || "GUEST"}
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 ring-2 ring-white shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;