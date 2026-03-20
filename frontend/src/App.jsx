import { useEffect, useRef, useState } from "react";

function App() {
  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/session/1");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        setChat((prev) => [...prev, data.message]);
      }
    };

    socketRef.current = ws;

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (!socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: "chat",
        message: message,
      })
    );

    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 MentorConnect Chat</h2>

      <div
        style={{
          border: "1px solid black",
          height: 200,
          overflowY: "scroll",
          marginBottom: 10,
          padding: 10,
        }}
      >
        {chat.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;