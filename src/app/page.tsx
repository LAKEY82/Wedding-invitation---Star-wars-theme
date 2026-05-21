"use client";

import React, { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import OpeningTitle from "@/components/OpeningTitle";
import SpaceStarfield from "@/components/SpaceStarfield";
import StarWarsCrawl from "@/components/StarWarsCrawl";
import InvitationCard from "@/components/InvitationCard";
import AudioEngine from "@/utils/AudioEngine";
import { weddingConfig } from "@/config";

export default function Home() {
  const [phase, setPhase] = useState<"loading" | "title" | "experience">("loading");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heartProgress, setHeartProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const audioEngineRef = useRef<AudioEngine | null>(null);
  const requestRef = useRef<number | null>(null);
  
  // Track scroll position with lerp for high performance smooth scroll feel
  const scrollData = useRef({
    current: 0,
    target: 0,
    ease: 0.08,
  });

  // Initialize audio engine
  useEffect(() => {
    audioEngineRef.current = new AudioEngine(weddingConfig.audioUrl);
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    };
  }, []);

  // Enter experience on loading complete
  const handleEnterExperience = () => {
    setPhase("title");
    if (audioEngineRef.current) {
      audioEngineRef.current.start();
    }
  };

  // Skip title to experience
  const handleTitleComplete = () => {
    setPhase("experience");
    setShowScrollHint(true);
  };

  // Mute audio toggle
  const toggleMute = () => {
    if (audioEngineRef.current) {
      const nextMuted = audioEngineRef.current.toggleMute();
      setIsMuted(nextMuted);
    }
  };

  // Scroll tracking loop
  useEffect(() => {
    if (phase !== "experience") return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      scrollData.current.target = window.scrollY / scrollHeight;
    };

    const updateScroll = () => {
      // Lerping the scroll value for 60fps cinematic damping
      scrollData.current.current += (scrollData.current.target - scrollData.current.current) * scrollData.current.ease;
      
      const currentProgress = Math.max(0, Math.min(1.0, scrollData.current.current));
      setScrollProgress(currentProgress);

      // Hide scroll hint once user has scrolled past 5%
      if (currentProgress > 0.05) {
        setShowScrollHint(false);
      }

      // Map scroll progress to heart constellation morphing progress
      // Heart starts forming at 68% scroll and is fully formed at 85% scroll
      const heartStart = 0.66;
      const heartEnd = 0.84;
      if (currentProgress < heartStart) {
        setHeartProgress(0);
      } else if (currentProgress > heartEnd) {
        setHeartProgress(1.0);
      } else {
        const p = (currentProgress - heartStart) / (heartEnd - heartStart);
        setHeartProgress(p);
      }

      requestRef.current = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    requestRef.current = requestAnimationFrame(updateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [phase]);

  return (
    <div className={`relative w-full ${phase === "experience" ? "h-[380vh]" : "h-screen overflow-hidden"}`}>
      
      {/* 3D Starfield Canvas (renders throughout all stages once loaded) */}
      {phase !== "loading" && (
        <SpaceStarfield heartProgress={heartProgress} scrollProgress={scrollProgress} />
      )}

      {/* Cinematic Overlays / Interface */}
      <AnimatePresence>
        {phase === "loading" && (
          <LoadingScreen onEnter={handleEnterExperience} />
        )}

        {phase === "title" && (
          <OpeningTitle onComplete={handleTitleComplete} />
        )}
      </AnimatePresence>

      {/* Main Experience Elements */}
      {phase === "experience" && (
        <>
          {/* Scroll-Linked perspective crawl */}
          <StarWarsCrawl scrollProgress={scrollProgress} />

          {/* Invitation Glassmorphic Card */}
          <InvitationCard scrollProgress={scrollProgress} />

          {/* Initial Scroll Hint */}
          <AnimatePresence>
            {showScrollHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 1.0, duration: 1.0 }}
                className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 select-none pointer-events-none"
              >
                <span className="text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Scroll down to begin crawl
                </span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <ArrowDown className="w-4 h-4 text-[#E5A93C] animate-pulse" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Audio Controller */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={toggleMute}
              className="p-3.5 rounded-full border border-[#E5A93C]/20 bg-black/40 backdrop-blur-md text-[#E5A93C] transition-all hover:bg-black/60 hover:border-[#E5A93C]/50 hover:shadow-[0_0_15px_rgba(229,169,60,0.2)] focus:outline-none focus:ring-1 focus:ring-[#E5A93C]/40 group"
              aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 transition-transform group-hover:scale-110" />
              ) : (
                <Volume2 className="w-5 h-5 transition-transform group-hover:scale-110" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
