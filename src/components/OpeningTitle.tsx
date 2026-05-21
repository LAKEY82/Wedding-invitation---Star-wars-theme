"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface OpeningTitleProps {
  onComplete: () => void;
}

export default function OpeningTitle({ onComplete }: OpeningTitleProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseMoveEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10px to +10px
      const y = (e.clientY / window.innerHeight - 0.5) * 20; // -10px to +10px
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove as any);
    return () => window.removeEventListener("mousemove", handleMouseMove as any);
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-transparent pointer-events-none select-none overflow-hidden">
      {/* Dynamic Lens Flare Overlay shifting with mouse */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.06)_0%,transparent_60%)] filter blur-3xl pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px, 0)`,
          transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />

      <motion.div
        initial={{ scale: 2.2, opacity: 0 }}
        animate={{ scale: [2.2, 1.0, 1.0, 0.08] }}
        transition={{
          times: [0, 0.35, 0.65, 1], // Timing markers for entry, stay, scaling down, finish
          duration: 7.5,
          ease: [0.25, 0.1, 0.25, 1.0], // Custom cinematic curves
        }}
        onAnimationComplete={onComplete}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          transition: "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        className="flex flex-col items-center justify-center text-center px-4"
      >
        <h1
          className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-[0.2em] text-transparent select-none text-center leading-none"
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            WebkitTextStroke: "2px #FFE81F",
            filter: "drop-shadow(0 0 10px rgba(255, 232, 31, 0.75)) drop-shadow(0 0 25px rgba(229, 169, 60, 0.45))",
          }}
        >
          TWO SOULS
        </h1>
        
        <div 
          className="w-24 md:w-48 h-[1px] my-8 bg-gradient-to-r from-transparent via-[#FFE81F]/70 to-transparent" 
          style={{ boxShadow: "0 0 10px rgba(255, 232, 31, 0.6)" }}
        />
        
        <h1
          className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-[0.2em] text-transparent select-none text-center leading-none"
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            WebkitTextStroke: "2px #FFE81F",
            filter: "drop-shadow(0 0 10px rgba(255, 232, 31, 0.75)) drop-shadow(0 0 25px rgba(229, 169, 60, 0.45))",
          }}
        >
          ONE GALAXY
        </h1>
      </motion.div>
    </div>
  );
}
interface MouseMoveEvent {
  clientX: number;
  clientY: number;
}
