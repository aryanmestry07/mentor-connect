import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SessionPage = ({ role }) => {
  const { sessionCode } = useParams();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // ✅ FIX: always fallback properly
  const currentUser = localStorage.getItem("name") || "User";

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`chat_${sessionCode}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [code, setCode] = useState("// Start coding...");
  const [sessionEnded, setSessionEnded] = useState(false);

  // Save chat
  useEffect(() => {
    localStorage.setItem(`chat_${sessionCode}`, JSON.stringify(messages));
  }, [messages, sessionCode]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join session
  useEffect(() => {
    const joinSession = async () => {
      try {
        const res = await fetch("http://localhost:8000/session/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_code: sessionCode }),
        });

        if (!res.ok) {
          alert("Session not found or ended");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
      }
    };

    joinSession();
  }, [sessionCode, navigate]);

  // WebSocket
  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/ws/session/${sessionCode}`
    );

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join" }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        if (!data.message) return;

        setMessages((prev) => [
          ...prev,
          {
            sender: data.sender || "User",  // ✅ FIX
            message: data.message,
            time: data.time || "",          // ✅ USE BACKEND TIME ONLY
          },
        ]);
      }

      if (data.type === "editor") {
        setCode(data.code);
      }

      if (data.type === "session_end") {
        setSessionEnded(true);
        socket.close();
      }
    };

    socketRef.current = socket;

    return () => socket.close();
  }, [sessionCode]);

  // Send chat (no duplicate)
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: "chat",
        message: input,
        sender: currentUser,
      })
    );

    setInput("");
  };

  // Code editor
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    socketRef.current?.send(
      JSON.stringify({
        type: "editor",
        code: newCode,
      })
    );
  };

  // End session
  const endSession = async () => {
    try {
      await fetch(
        `http://localhost:8000/session/end?user_id=${localStorage.getItem(
          "user_id"
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_code: sessionCode }),
        }
      );

      socketRef.current?.send(JSON.stringify({ type: "session_end" }));
    } catch (err) {
      console.error(err);
    }
  };

  // Session ended UI
  if (sessionEnded) {
    return (
      <div style={styles.centerScreen}>
        <h1>Session Ended</h1>
        <button style={styles.primaryBtn} onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>Session: {sessionCode}</div>

        {role === "mentor" && (
          <button style={styles.endBtn} onClick={endSession}>
            End Session
          </button>
        )}
      </div>

      <div style={styles.main}>
        <div style={styles.leftPanel}>
          <div style={styles.videoBox}>
            <p>Video Area</p>
          </div>

          <div style={styles.editorBox}>
            <textarea
              value={code}
              onChange={handleCodeChange}
              style={styles.textarea}
            />
          </div>
        </div>

        <div style={styles.chatPanel}>
          <div style={styles.chatHeader}>Chat</div>

          <div style={styles.chatMessages}>
            {messages.map((msg, i) => {
              const sender = msg.sender || "User";
              const isMe = sender === currentUser;

              return (
                <div
                  key={`${sender}-${i}`} // ✅ FIXED KEY
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      ...styles.chatBubble,
                      background: isMe ? "#2563eb" : "#1e293b",
                    }}
                  >
                    {!isMe && (
                      <div style={styles.sender}>{sender}</div>
                    )}
                    <div>{msg.message}</div>
                    <div style={styles.time}>{msg.time}</div>
                  </div>
                </div>
              );
            })}

            <div ref={chatEndRef} />
          </div>

          <div style={styles.chatInputArea}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
              placeholder="Type a message..."
            />
            <button style={styles.sendBtn} onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;



const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
    color: "white",
  },

  topBar: {
    height: "60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    background: "#1e293b",
  },

  main: {
    flex: 1,
    display: "flex",
  },

  leftPanel: {
    flex: 3,
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    gap: "10px",
  },

  videoBox: {
    flex: 1,
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
  },

  editorBox: {
    flex: 1,
    background: "#1e293b",
    borderRadius: "10px",
    padding: "10px",
  },

  textarea: {
    width: "100%",
    height: "100%",
    background: "#020617",
    color: "white",
    border: "none",
    outline: "none",
  },

  chatPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#020617",
    borderLeft: "1px solid #334155",
  },

  chatHeader: {
    padding: "10px",
    borderBottom: "1px solid #334155",
  },

  chatMessages: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
  },

  chatBubble: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "8px",
  },

  sender: {
    fontSize: "12px",
    color: "#38bdf8",
  },

  time: {
    fontSize: "10px",
    opacity: 0.6,
    marginTop: "4px",
    textAlign: "right",
  },

  chatInputArea: {
    display: "flex",
    borderTop: "1px solid #334155",
  },

  input: {
    flex: 1,
    padding: "10px",
    background: "#020617",
    border: "none",
    color: "white",
  },

  sendBtn: {
    padding: "10px 15px",
    background: "#2563eb",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  endBtn: {
    background: "red",
    padding: "8px 15px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  centerScreen: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  primaryBtn: {
    marginTop: "10px",
    padding: "10px 20px",
    background: "#2563eb",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
};