import React from "react";

function ChatInput({ message, setMessage, sendMessage }) {
  return (
    <div style={{ display: "flex", gap: "5px" }}>
      <input
        style={{ flex: 1, padding: "8px" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        style={{
          padding: "8px 15px",
          border: "none",
          borderRadius: "5px",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;