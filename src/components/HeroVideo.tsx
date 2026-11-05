"use client";

import { useEffect, useRef, useState } from "react";

type VideoSource = { src: string; type?: string };

type HeroVideoProps = {
  sources: VideoSource[];
  poster?: string;
  label: string;
  unmuteLabel: string;
  className?: string;
};

type Mode = "ambient" | "listening" | "idle";

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" />
      {muted ? (
        <>
          <path d="m16 9 5 6" />
          <path d="m21 9-5 6" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

const pill =
  "inline-flex items-center gap-2 rounded-full bg-ink/70 px-4 py-2.5 text-sm font-medium text-paper shadow-lg backdrop-blur-sm transition hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper";

export function HeroVideo({
  sources,
  poster,
  label,
  unmuteLabel,
  className = "",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>("ambient");
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React does not reliably serialize `muted`, and browsers only autoplay muted media.
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      setMode("idle");
      return;
    }
    video.play().catch(() => setMode("idle"));
  }, []);

  function listen() {
    const video = videoRef.current;
    if (!video) return;
    video.loop = false;
    video.currentTime = 0;
    video.muted = false;
    setMuted(false);
    setMode("listening");
    video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      setMode("idle");
    });
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function handleEnded() {
    const video = videoRef.current;
    if (!video || mode !== "listening") return;
    video.muted = true;
    video.loop = true;
    setMuted(true);
    setMode("ambient");
    video.play().catch(() => setMode("idle"));
  }

  return (
    <>
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full ${className}`}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={label}
        onEnded={handleEnded}
      >
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>

      {mode === "listening" ? (
        <button
          type="button"
          onClick={toggleMute}
          className={`${pill} absolute right-4 bottom-5 z-10 !p-3`}
          aria-label={muted ? "Unmute video" : "Mute video"}
          aria-pressed={!muted}
        >
          <SpeakerIcon muted={muted} />
        </button>
      ) : (
        <button
          type="button"
          onClick={listen}
          className={`${pill} hero-video-prompt absolute bottom-5 left-1/2 z-10 -translate-x-1/2 md:bottom-6`}
        >
          {mode === "idle" ? <PlayIcon /> : <SpeakerIcon muted />}
          <span className="whitespace-nowrap">
            {mode === "idle" ? "Play with sound" : unmuteLabel}
          </span>
        </button>
      )}
    </>
  );
}
