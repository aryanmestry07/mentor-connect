import React, { useState } from "react";

function VideoCall({ localVideoRef, remoteVideoRef, startCall }) {
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });

    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = cameraOff;
    });

    setCameraOff(!cameraOff);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Video Call</h3>

      {/* Video Area */}
      <div style={styles.videoWrapper}>
        {/* Remote Video (Main) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={styles.remoteVideo}
        />

        {/* Local Video (Small Overlay) */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={styles.localVideo}
        />
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button style={styles.btn} onClick={startCall}>
          Start
        </button>

        <button style={styles.btn} onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <button style={styles.btn} onClick={toggleCamera}>
          {cameraOff ? "Camera On" : "Camera Off"}
        </button>
      </div>
    </div>
  );
}

export default VideoCall;

const styles = {
  container: {
    background: "#1e293b",
    padding: "10px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  title: {
    margin: 0,
    fontSize: "14px",
  },

  videoWrapper: {
    position: "relative",
    width: "100%",
    height: "200px",
    background: "#020617",
    borderRadius: "8px",
    overflow: "hidden",
  },

  remoteVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  localVideo: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    width: "80px",
    height: "60px",
    borderRadius: "6px",
    background: "#000",
    objectFit: "cover",
  },

  controls: {
    display: "flex",
    justifyContent: "space-between",
    gap: "5px",
  },

  btn: {
    flex: 1,
    padding: "8px",
    background: "#2563eb",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
};