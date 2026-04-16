"use client";
import { useState } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface VideoFeedProps {
  participantName: string;
  videoId: string;
  isUserVideo?: boolean;
}

export default function VideoFeed({
  participantName,
  videoId,
  isUserVideo = false,
}: VideoFeedProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  return (
    <div className="group w-full">
      <div className="w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-950 rounded-lg border border-slate-700/50 hover:border-blue-500/50 transition-colors overflow-hidden flex flex-col justify-between p-4">
        {/* Top Section - Participant Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-semibold text-white">{participantName}</span>
          </div>
          {isUserVideo && (
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
              You
            </span>
          )}
        </div>

        {/* Center - Video Placeholder */}
        <div className="flex flex-col items-center justify-center my-auto">
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-slate-300">
              {participantName.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-slate-300 font-medium">{participantName}</p>
          <p className="text-xs text-slate-500 mt-1">{isCameraOff ? "Camera off" : "Camera on"}</p>
        </div>

        {/* Bottom Section - Controls and Status */}
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Status Indicators */}
          <div className="flex gap-2">
            {isMuted && (
              <div className="bg-red-500/80 text-white p-1 rounded-md">
                <MicOff size={14} />
              </div>
            )}
            {isCameraOff && (
              <div className="bg-red-500/80 text-white p-1 rounded-md">
                <VideoOff size={14} />
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-full transition-all ${
                isMuted
                  ? "bg-red-500/80 hover:bg-red-600 text-white"
                  : "bg-slate-700/80 hover:bg-slate-600 text-white"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`p-2 rounded-full transition-all ${
                isCameraOff
                  ? "bg-red-500/80 hover:bg-red-600 text-white"
                  : "bg-slate-700/80 hover:bg-slate-600 text-white"
              }`}
              title={isCameraOff ? "Turn on camera" : "Turn off camera"}
            >
              {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
