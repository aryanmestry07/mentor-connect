import React, { useEffect, useRef, memo } from "react";

function ChatBox({ chat = [], currentUser }) {
  const chatEndRef = useRef(null);

  // ✅ fallback if not passed
  const user = currentUser || localStorage.getItem("name") || "You";

  // ✅ Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ✅ FIXED Time Format
  const formatTime = (time) => {
    if (!time) return "";

    // Already formatted (like "14:32")
    if (typeof time === "string" && time.includes(":")) {
      return time;
    }

    try {
      const date = new Date(time);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>💬 Chat</div>

      <div style={styles.chatArea}>
        {/* ✅ Empty state */}
        {chat.length === 0 && (
          <div style={styles.emptyState}>
            Start the conversation 👋
          </div>
        )}

        {chat.map((msg, index) => {
          const sender = msg.sender || "User";
          const isMe = sender === user;

          const prevMsg = chat[index - 1];
          const showSender =
            !isMe && (!prevMsg || prevMsg.sender !== sender);

          return (
            <div
              key={`${sender}-${index}`}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  background: isMe ? "#2563eb" : "#1e293b",
                  borderTopRightRadius: isMe ? "4px" : "10px",
                  borderTopLeftRadius: !isMe ? "4px" : "10px",
                }}
              >
                {/* Sender */}
                {showSender && (
                  <div style={styles.sender}>{sender}</div>
                )}

                {/* Message */}
                <div style={styles.message}>{msg.message}</div>

                {/* Time */}
                <div style={styles.time}>
                  {formatTime(msg.time)}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

export default memo(ChatBox);


// 🔥 STYLES (UNCHANGED)
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  header: {
    padding: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    borderBottom: "1px solid #334155",
    background: "#020617",
    color: "white",
  },

  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    background: "#020617",
  },

  bubble: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "10px",
    color: "white",
    wordBreak: "break-word",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },

  message: {
    fontSize: "14px",
    lineHeight: "1.4",
  },

  sender: {
    fontSize: "11px",
    color: "#38bdf8",
    marginBottom: "3px",
  },

  time: {
    fontSize: "10px",
    opacity: 0.6,
    marginTop: "5px",
    textAlign: "right",
  },

  emptyState: {
    textAlign: "center",
    opacity: 0.5,
    marginTop: "20px",
    fontSize: "13px",
  },
};