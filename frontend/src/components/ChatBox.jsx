import React, { useEffect, useRef } from "react";

function ChatBox({ chat }) {
  const chatEndRef = useRef(null);
  const currentUser = localStorage.getItem("name") || "You";

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Chat</h3>

      <div style={styles.chatArea}>
        {chat.map((msg, index) => {
          const sender = msg.sender || "User"; // ✅ Safe fallback
          const isMe = sender === currentUser;

          return (
            <div
              key={`${sender}-${index}`} // ✅ Better key
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  background: isMe ? "#2563eb" : "#2d2d3a",
                }}
              >
                {/* Show sender name only for others */}
                {!isMe && (
                  <div style={styles.sender}>{sender}</div>
                )}

                {/* Message */}
                <div>{msg.message}</div>

                {/* Timestamp */}
                <div style={styles.time}>{msg.time || ""}</div>
              </div>
            </div>
          );
        })}

        {/* Auto-scroll anchor */}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

export default ChatBox;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  header: {
    margin: "0 0 10px 0",
    fontSize: "14px",
    color: "white",
  },

  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    background: "#1e1e2f",
    borderRadius: "8px",
  },

  bubble: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "8px",
    color: "white",
    wordBreak: "break-word",
  },

  sender: {
    fontSize: "11px",
    color: "#38bdf8",
    marginBottom: "2px",
  },

  time: {
    fontSize: "10px",
    opacity: 0.6,
    marginTop: "4px",
    textAlign: "right",
  },
};