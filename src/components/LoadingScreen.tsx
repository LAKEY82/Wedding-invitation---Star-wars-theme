"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";

interface LoadingScreenProps {
  onEnter: () => void;
}

export default function LoadingScreen({ onEnter }: LoadingScreenProps) {
  const [stage, setStage] = useState<"blue-text" | "loading-bar" | "ready">("blue-text");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Stage 1: Blue text fades in and out
    const textTimer = setTimeout(() => {
      setStage("loading-bar");
    }, 4500); // 4.5 seconds for blue text segment

    return () => clearTimeout(textTimer);
  }, []);

  useEffect(() => {
    if (stage !== "loading-bar") return;

    // 2. Stage 2: Animate progress bar from 0 to 100
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStage("ready");
          }, 500);
          return 100;
        }
        // Random progressive increment for realistic loader feel
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020208] text-center select-none overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === "blue-text" && (
          <motion.div
            key="blue-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="px-6 max-w-lg md:max-w-2xl font-serif text-[1.4rem] md:text-[1.8rem] text-[#4bd5ee] tracking-wide leading-relaxed"
            style={{
              textShadow: "0 0 12px rgba(75, 213, 238, 0.4)",
              fontFamily: "'Cinzel', Georgia, serif"
            }}
          >
            A long time ago in a galaxy far, far away...
          </motion.div>
        )}

        {stage === "loading-bar" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center px-4"
          >
            <motion.h3
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-[#E5A93C] uppercase text-xs md:text-sm font-sans tracking-[0.4em] mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Aligning Celestial Coordinates
            </motion.h3>
            <div className="w-64 md:w-80 h-1 bg-[#101026] rounded-full overflow-hidden border border-[#ffd700]/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FFE81F] via-[#E5A93C] to-[#FFE81F]"
                style={{
                  width: `${progress}%`,
                  boxShadow: "0 0 10px #E5A93C, 0 0 20px rgba(229, 169, 60, 0.5)"
                }}
              />
            </div>
            <span className="text-[#ffd700]/50 font-mono text-xs mt-3 tracking-widest">
              {progress}%
            </span>
          </motion.div>
        )}

        {stage === "ready" && (
          <motion.div
            key="enter"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="flex flex-col items-center gap-6 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-2"
            >
              <h2
                className="text-[#E5A93C] text-sm md:text-md uppercase tracking-[0.6em] font-sans font-medium"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Vessels Locked
              </h2>
            </motion.div>

            <button
              onClick={onEnter}
              className="relative group px-10 py-4 overflow-hidden rounded-full border border-[#E5A93C]/50 bg-transparent text-white font-sans text-xs uppercase tracking-[0.4em] transition-all duration-500 hover:border-[#E5A93C] hover:text-[#020208] shadow-[0_0_15px_rgba(229,169,60,0.15)] hover:shadow-[0_0_30px_rgba(229,169,60,0.4)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {/* Golden button fill transition on hover */}
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#FFE81F] to-[#E5A93C] transition-all duration-500 ease-out group-hover:w-full -z-10" />
              
              <span className="relative z-10 flex items-center gap-2">
                Enter Galaxy <Volume2 className="w-3.5 h-3.5 ml-1 animate-pulse" />
              </span>
            </button>

            <span className="text-[#ffd700]/30 font-serif text-[10px] italic tracking-widest mt-2">
              Best experienced with audio enabled
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
