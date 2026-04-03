import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import VideoCall from "./VideoCall";
import Navbar from "./Navbar";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";

const SessionPage = ({ user }) => {
  const { sessionCode } = useParams();

  const currentUser =
    user?.name || localStorage.getItem("name") || "User";

  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  const [callIncoming, setCallIncoming] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [sessionEnded, setSessionEnded] = useState(false);

  const [remoteCursors, setRemoteCursors] = useState([]);

  // 🎥 WEBRTC
  const setupWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (e) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (e) => {
        if (e.candidate && socketRef.current?.readyState === 1) {
          socketRef.current.send(
            JSON.stringify({
              type: "ice-candidate",
              data: e.candidate,
            })
          );
        }
      };
    } catch (err) {
      console.error("WebRTC error:", err);
    }
  };

  const startCall = async () => {
    if (!peerConnection.current) return;

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socketRef.current?.send(
      JSON.stringify({
        type: "offer",
        data: offer,
      })
    );
  };

  const sendCallRequest = () => {
    socketRef.current?.send(
      JSON.stringify({
        type: "call_request",
        caller: currentUser,
      })
    );
  };

  const acceptCall = async () => {
    setCallIncoming(false);
    setCallAccepted(true);

    socketRef.current?.send(JSON.stringify({ type: "call_accept" }));

    await setupWebRTC();
    setTimeout(startCall, 500);
  };

  const rejectCall = () => {
    setCallIncoming(false);
    socketRef.current?.send(JSON.stringify({ type: "call_reject" }));
  };

  // ✅ CURSOR
  const sendCursor = (cursor) => {
    socketRef.current?.send(
      JSON.stringify({
        type: "cursor",
        ...cursor,
        user: currentUser,
      })
    );
  };

  // 🌐 SOCKET
  useEffect(() => {
    if (socketRef.current) return;

    const socket = new WebSocket(
      `ws://localhost:8000/ws/session/${sessionCode}`
    );

    socket.onopen = async () => {
      socket.send(
        JSON.stringify({
          type: "join",
          sender: currentUser,
        })
      );

      await setupWebRTC();
    };

    socket.onmessage = async (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (data.type) {
        case "chat":
          setMessages((prev) => [
            ...prev,
            {
              sender: data.sender,
              message: data.message,
              time: data.time,
            },
          ]);
          break;

        case "code_update":
          window.dispatchEvent(
            new CustomEvent("code_update", {
              detail: data,
            })
          );
          break;

        case "cursor":
          if (!data.user || data.user === currentUser) return;

          setRemoteCursors((prev) => {
            const others = prev.filter((c) => c.user !== data.user);
            return [...others, data];
          });
          break;

        case "call_request":
          setCallIncoming(true);
          break;

        case "call_accept":
          setCallAccepted(true);
          break;

        case "call_reject":
          setCallIncoming(false);
          break;

        case "offer": {
          await peerConnection.current.setRemoteDescription(data.data);

          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          socket.send(
            JSON.stringify({
              type: "answer",
              data: answer,
            })
          );
          break;
        }

        case "answer":
          await peerConnection.current.setRemoteDescription(data.data);
          break;

        case "ice-candidate":
          await peerConnection.current.addIceCandidate(data.data);
          break;

        case "session_end":
          setSessionEnded(true);
          break;

        default:
          break;
      }
    };

    socketRef.current = socket;

    return () => socket.close();
  }, [sessionCode]);

  // 💬 SEND MESSAGE
  const sendMessage = () => {
    if (!input.trim()) return false;

    socketRef.current?.send(
      JSON.stringify({
        type: "chat",
        message: input,
        sender: currentUser,
      })
    );

    return true;
  };

  // 💻 SEND CODE
  const sendCode = (payload) => {
    setCode(payload.code);

    socketRef.current?.send(
      JSON.stringify({
        type: "code_update",
        ...payload,
        sender: currentUser,
      })
    );
  };

  if (sessionEnded) return <h1>Session Ended</h1>;

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      <Navbar user={user} />

      <div className="flex flex-1 gap-4 p-4">
        <div className="flex-1 bg-slate-800 rounded-2xl">
          <CodeEditor
            code={code}
            sendCode={sendCode}
            sendCursor={sendCursor}
            remoteCursors={remoteCursors}
          />
        </div>

        <div className="w-[380px] flex flex-col gap-4">
          <div className="bg-slate-800 rounded-2xl p-3">
            <VideoCall
              localVideoRef={localVideoRef}
              remoteVideoRef={remoteVideoRef}
              sendCallRequest={sendCallRequest}
              callAccepted={callAccepted}
              callIncoming={callIncoming}
              acceptCall={acceptCall}
              rejectCall={rejectCall}
            />
          </div>

          <div className="flex-1 bg-slate-800 rounded-2xl flex flex-col overflow-hidden">
            <ChatBox chat={messages} currentUser={currentUser} />

            <ChatInput
              message={input}
              setMessage={setInput}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;