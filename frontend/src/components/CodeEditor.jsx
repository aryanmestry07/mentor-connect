import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor({ code, sendCode }) {
  const timeoutRef = useRef(null);
  const lastSentCode = useRef("");
  const isRemoteUpdate = useRef(false); // 🔥 NEW (IMPORTANT)

  // 🔥 HANDLE USER TYPING
  const handleChange = (value) => {
    if (value === undefined) return;

    // ❌ Ignore updates coming from WebSocket
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    // ❌ Prevent duplicate sending
    if (value === lastSentCode.current) return;

    // debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      lastSentCode.current = value;

      sendCode(value); // 🔥 ONLY send
    }, 300);
  };

  // 🔥 LISTEN FOR REMOTE CODE (WS EVENT)
  useEffect(() => {
    const handleCodeUpdate = (e) => {
      const newCode = e.detail;

      // mark as remote update
      isRemoteUpdate.current = true;

      lastSentCode.current = newCode;
    };

    window.addEventListener("code_update", handleCodeUpdate);

    return () => {
      window.removeEventListener("code_update", handleCodeUpdate);
    };
  }, []);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px",
          background: "#2d2d3a",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        💻 Live Code Editor
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code || ""}
          onChange={handleChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;