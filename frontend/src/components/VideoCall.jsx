import React from "react";

function VideoCall({ localVideoRef, remoteVideoRef, startCall }) {
  return (
    <div>
      <h3>📹 Video Call</h3>

      <div style={{ display: "flex", gap: "10px" }}>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          width="150"
          style={{ borderRadius: "8px", background: "#000" }}
        />

        <video
          ref={remoteVideoRef}
          autoPlay
          width="150"
          style={{ borderRadius: "8px", background: "#000" }}
        />
      </div>

      <button
        onClick={startCall}
        style={{
          marginTop: "10px",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#4CAF50",
          color: "#fff"
        }}
      >
        Start Call
      </button>
    </div>
  );
}

export default VideoCall;