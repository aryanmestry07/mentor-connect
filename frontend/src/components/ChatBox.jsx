import React from "react";

function ChatBox({ chat }) {
  return (
    <div>
      <h3>💬 Chat</h3>

      <div style={{
        border: "1px solid #ddd",
        height: "200px",
        overflowY: "auto",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "8px"
      }}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "5px",
              padding: "5px",
              borderBottom: "1px solid #eee"
            }}
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatBox;