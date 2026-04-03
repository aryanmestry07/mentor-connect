import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function CodeEditor({ code, sendCode, sendCursor, remoteCursors = [] }) {
  const timeoutRef = useRef(null);
  const lastSentCode = useRef("");
  const isRemoteUpdate = useRef(false);
  const editorRef = useRef(null);

  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [cursorPositions, setCursorPositions] = useState([]);

  const templates = {
    python: "print('Hello World')",
    javascript: "console.log('Hello World');",
    cpp: "#include<iostream>\nusing namespace std;\nint main() {\n    cout << \"Hello World\" << endl;\n    return 0;\n}",
    java: "class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}"
  };

  // ✅ Editor mount
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    // 🔥 Cursor tracking
    editor.onDidChangeCursorPosition((e) => {
      const position = e.position;

      sendCursor({
        lineNumber: position.lineNumber,
        column: position.column,
      });
    });
  };

  // ✅ Handle typing
  const handleChange = (value) => {
    if (value === undefined) return;

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    if (value === lastSentCode.current) return;

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      lastSentCode.current = value;

      sendCode({
        code: value,
        language,
      });
    }, 200);
  };

  // ✅ Language change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);

    const newCode = templates[newLang];

    sendCode({
      code: newCode,
      language: newLang,
    });

    setOutput("");
  };

  // ✅ Run code
  const runCode = async () => {
    try {
      setOutput("Running process...");

      const res = await axios.post("http://localhost:8000/run-code", {
        code,
        language,
      });

      setOutput(res.data.error || res.data.output || "No output");
    } catch {
      setOutput("Execution error");
    }
  };

  // ✅ Remote code sync
  useEffect(() => {
    const handleCodeUpdate = (e) => {
      const { code: newCode, language: newLang } = e.detail;

      if (!editorRef.current) return;
      if (newCode === editorRef.current.getValue()) return;

      isRemoteUpdate.current = true;
      lastSentCode.current = newCode;

      editorRef.current.setValue(newCode);

      if (newLang && newLang !== language) {
        setLanguage(newLang);
      }
    };

    window.addEventListener("code_update", handleCodeUpdate);
    return () => window.removeEventListener("code_update", handleCodeUpdate);
  }, [language]);

  // 🔥 FIX: unique cursor per user (NO overwrite bug)
  useEffect(() => {
    if (!editorRef.current) return;

    const uniqueUsers = {};
    remoteCursors.forEach((c) => {
      if (c.user) {
        uniqueUsers[c.user] = c; // last position per user
      }
    });

    const positions = Object.values(uniqueUsers)
      .map((cursor) => {
        try {
          const coords = editorRef.current.getScrolledVisiblePosition({
            lineNumber: cursor.lineNumber,
            column: cursor.column,
          });

          if (!coords) return null;

          return {
            ...cursor,
            top: coords.top - 20,
            left: coords.left,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    setCursorPositions(positions);
  }, [remoteCursors]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-700 bg-[#1e1e1e] overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#252526]">
        <span className="text-xs text-slate-400 uppercase">
          {language} Editor
        </span>

        <div className="flex gap-2">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-slate-800 text-xs px-2 py-1 rounded"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={runCode}
            className="bg-indigo-600 px-3 py-1 text-xs text-white rounded"
          >
            Run
          </button>
        </div>
      </div>

      {/* EDITOR */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onMount={handleEditorDidMount}
          onChange={handleChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
          }}
        />

        {/* 🔥 Cursor labels */}
        {cursorPositions.map((c, i) => (
          <div
            key={c.user || i}
            style={{
              position: "absolute",
              top: c.top,
              left: c.left,
              background: "#2563eb",
              color: "white",
              padding: "2px 6px",
              fontSize: "10px",
              borderRadius: "4px",
              pointerEvents: "none",
            }}
          >
            {c.user}
          </div>
        ))}
      </div>

      {/* OUTPUT */}
      <div className="h-32 bg-black p-2 text-green-400 text-sm overflow-auto">
        {output}
      </div>
    </div>
  );
}

export default CodeEditor;