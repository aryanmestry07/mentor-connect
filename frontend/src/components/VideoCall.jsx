import React, { useState } from "react";

function VideoCall({
  localVideoRef,
  remoteVideoRef,
  sendCallRequest,
  callAccepted,
  acceptCall,
  rejectCall,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  // 🎤 MUTE / UNMUTE
  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });

    setIsMuted(!isMuted);
  };

  // 🎥 CAMERA ON/OFF
  const toggleCamera = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = cameraOff;
    });

    setCameraOff(!cameraOff);
  };

  // 📞 START CALL
  const handleStart = () => {
    sendCallRequest();
    acceptCall(); // auto connect both users
  };

  // ❌ END CALL
  const handleEnd = () => {
    rejectCall();

    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setIsMuted(false);
    setCameraOff(false);
  };

  return (
    <div className="flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

      {/* 🎥 VIDEO AREA */}
      <div className="relative aspect-video bg-black">

        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video */}
        <div className="absolute bottom-3 right-3 w-32 h-24 border rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 🎮 CONTROLS */}
      <div className="flex justify-center gap-4 p-3 bg-slate-800">

        {!callAccepted ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-600 text-white rounded-lg"
          >
            Start Call
          </button>
        ) : (
          <>
            {/* 🎤 MUTE */}
            <button
              onClick={toggleMute}
              className={`px-3 py-2 rounded ${
                isMuted ? "bg-red-500" : "bg-slate-700"
              }`}
            >
              🎤
            </button>

            {/* 🎥 CAMERA */}
            <button
              onClick={toggleCamera}
              className={`px-3 py-2 rounded ${
                cameraOff ? "bg-red-500" : "bg-slate-700"
              }`}
            >
              🎥
            </button>

            {/* ❌ END */}
            <button
              onClick={handleEnd}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              End
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VideoCall;