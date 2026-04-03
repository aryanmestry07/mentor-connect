import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight } from "lucide-react"; // npm i lucide-react
import Signup from "./Signup";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState("");

  if (showSignup) {
    return <Signup onBack={() => setShowSignup(false)} />;
  }

  const login = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields to continue.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/login", { email, password });

      const { access_token, user_id, role } = res.data;

      let name = "User";
      try {
        const payload = JSON.parse(atob(access_token.split(".")[1]));
        name = payload.name || "User";
      } catch (e) { console.error("Token parse error", e) }

      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);

      onLogin(access_token);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) setError("No account associated with this email.");
      else if (status === 401) setError("The password you entered is incorrect.");
      else setError("We're having trouble connecting to the server. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-black px-4 selection:bg-indigo-500/30">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[440px] z-10">
        {/* Logo/Branding Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/20 mb-4 transform transition-transform hover:rotate-3">
             <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400 font-medium">
            Enter your credentials to access <span className="text-indigo-400">MentorConnect</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl shadow-2xl p-8 transition-all hover:border-white/20">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={login} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Sign In 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-slate-500 font-medium">Or continue with</span></div>
          </div>

          <div className="text-center text-sm text-slate-400">
            New here?{" "}
            <button
              onClick={() => setShowSignup(true)}
              className="text-white font-semibold hover:text-indigo-400 transition-colors underline-offset-4 hover:underline"
            >
              Create an account
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-slate-600">
          &copy; 2026 MentorConnect. All rights reserved. Secure encrypted connection.
        </p>
      </div>
    </div>
  );
}

export default Login;