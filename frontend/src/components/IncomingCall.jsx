import React from "react";

function IncomingCall({ caller, onAccept, onReject }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h3 style={styles.title}>Incoming Call</h3>

        <p style={styles.text}>
          {caller || "User"} is calling you...
        </p>

        <div style={styles.actions}>
          <button style={styles.acceptBtn} onClick={onAccept}>
            Accept
          </button>

          <button style={styles.rejectBtn} onClick={onReject}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCall;

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    width: "300px",
  },

  title: {
    marginBottom: "10px",
  },

  text: {
    marginBottom: "20px",
    fontSize: "14px",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },

  acceptBtn: {
    flex: 1,
    padding: "10px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  rejectBtn: {
    flex: 1,
    padding: "10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};