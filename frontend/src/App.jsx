import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

function App() {
  const socketRef = useRef(null);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [code, setCode] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/session/1");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // 💬 Chat messages
      if (data.type === "chat") {
        setChat((prev) => [...prev, data.message]);
      }

      // 💻 Code editor sync
      if (data.type === "editor") {
        setCode(data.code);
      }
    };

    socketRef.current = ws;

    return () => ws.close();
  }, []);

  // 💬 Send chat
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

  // 💻 Send code
  const sendCode = (value) => {
    setCode(value);

    if (!socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: "editor",
        code: value,
      })
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 MentorConnect Chat</h2>

      {/* Chat Box */}
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

      {/* Chat Input */}
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />

      <button onClick={sendMessage}>Send</button>

      {/* Code Editor */}
      <h2 style={{ marginTop: 20 }}>💻 Live Code Editor</h2>

      <Editor
        height="300px"
        defaultLanguage="javascript"
        value={code}
        onChange={sendCode}
      />
    </div>
  );
}

export default App;