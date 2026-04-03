import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const PremiumCursor = () => {
  const { sessionId } = useParams();

  const socketRef = useRef(null);

  const [code, setCode] = useState("");
  const [connected, setConnected] = useState(false);

  // ✅ Get user identity
  const currentUser =
    localStorage.getItem("name") ||
    localStorage.getItem("role") ||
    "User";

  // 🌐 CONNECT WEBSOCKET
  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/ws/session/${sessionId}`
    );

    socket.onopen = () => {
      console.log("✅ Premium Cursor Connected");
      setConnected(true);

      socket.send(
        JSON.stringify({
          type: "join",
          sender: currentUser,
        })
      );
    };

    socket.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      // ✅ RECEIVE CODE UPDATE
      if (data.type === "code_update") {
        setCode(data.code || "");
      }
    };

    socket.onerror = (err) => {
      console.error("❌ Socket error:", err);
    };

    socket.onclose = () => {
      console.log("🔌 Disconnected");
      setConnected(false);
    };

    socketRef.current = socket;

    return () => socket.close();
  }, [sessionId]);

  // 💻 SEND CODE
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    if (!socketRef.current || socketRef.current.readyState !== 1) return;

    socketRef.current.send(
      JSON.stringify({
        type: "code_update",
        code: newCode,
        sender: currentUser, // 🔥 IMPORTANT
      })
    );
  };

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center p-3 bg-slate-800">
        <h2 className="font-bold text-lg">
          🚀 Premium Cursor Mode
        </h2>

        <span
          className={`text-sm ${
            connected ? "text-green-400" : "text-red-400"
          }`}
        >
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* CODE EDITOR */}
      <textarea
        value={code}
        onChange={handleCodeChange}
        placeholder="Start typing your code..."
        className="flex-1 bg-slate-900 p-4 outline-none font-mono text-sm"
      />
    </div>
  );
};

export default PremiumCursor;