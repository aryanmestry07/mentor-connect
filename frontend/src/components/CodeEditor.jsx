import React from "react";
import Editor from "@monaco-editor/react";

function CodeEditor({ code, sendCode }) {
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
          onChange={(value) => {
            if (value !== undefined) {
              sendCode(value);
            }
          }}
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