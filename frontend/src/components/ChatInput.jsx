import React, { useState } from "react";

function ChatInput({ message, setMessage, sendMessage }) {
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!message.trim() || sending) return;

    setSending(true);
    sendMessage();

    setTimeout(() => setSending(false), 150);
  };

  return (
    <div style={styles.container}>
      <textarea
        style={styles.input}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <button
        onClick={handleSend}
        disabled={sending}
        style={{
          ...styles.button,
          background: sending ? "#334155" : "#2563eb",
          cursor: sending ? "not-allowed" : "pointer",
        }}
      >
        {sending ? "..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;

const styles = {
  container: {
    display: "flex",
    gap: "8px",
    padding: "10px",
    borderTop: "1px solid #334155",
    background: "#020617",
  },

  input: {
    flex: 1,
    resize: "none",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
  },
};