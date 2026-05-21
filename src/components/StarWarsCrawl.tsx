"use client";

import React, { useRef } from "react";
import { weddingConfig } from "@/config";

interface StarWarsCrawlProps {
  scrollProgress: number; // 0 to 1
}

export default function StarWarsCrawl({ scrollProgress }: StarWarsCrawlProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Map scroll progress (0 to 1) to translateY percentage
  // At progress 0: crawl starts off-screen (e.g. 100% translate)
  // At progress 0.8: crawl finishes off-screen top (e.g. -140% translate)
  // We clamp it so the crawl stops scrolling upwards after 0.8 and lets the card fade in.
  const crawlLimit = 0.78;
  const normalizedCrawlProgress = Math.min(scrollProgress / crawlLimit, 1.0);
  const translateY = 100 - normalizedCrawlProgress * 230; // 100% to -130%

  // Fade out crawl as it reaches the end
  const opacity = scrollProgress > 0.65 
    ? Math.max(0, 1 - (scrollProgress - 0.65) / 0.1) 
    : 1;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-20 flex justify-center w-full h-full pointer-events-none select-none overflow-hidden"
      style={{
        perspective: "280px",
        perspectiveOrigin: "50% 28%",
      }}
    >
      {/* 3D Tilted Crawl Plane */}
      <div
        className="absolute w-[90%] md:w-[65%] lg:w-[48%] h-full origin-[50%_100%] transition-transform duration-75 ease-out"
        style={{
          transform: `rotateX(23deg) translate3d(0, ${translateY}%, 0)`,
          opacity: opacity,
          // Custom mask gradient to fade text out at the top of the perspective viewport
          maskImage: "linear-gradient(to top, transparent 5%, white 30%, white 75%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 5%, white 30%, white 75%, transparent 95%)",
        }}
      >
        <div className="flex flex-col items-center text-center space-y-8 pb-32">
          {/* Episode Title */}
          <div className="text-center">
            <h3 
              className="text-[#FFE81F] text-lg md:text-2xl font-bold uppercase tracking-[0.4em] mb-3"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                textShadow: "0 0 8px rgba(255, 232, 31, 0.4)",
              }}
            >
              {weddingConfig.crawlTitle}
            </h3>
            <h2 
              className="text-[#FFE81F] text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-[0.22em] leading-normal"
              style={{
                fontFamily: "'Cinzel', Georgia, serif",
                textShadow: "0 0 10px rgba(255, 232, 31, 0.6)",
              }}
            >
              {weddingConfig.crawlSubtitle}
            </h2>
          </div>

          {/* Yellow Line Divider */}
          <div 
            className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#FFE81F]/70 to-transparent"
            style={{ boxShadow: "0 0 8px rgba(255, 232, 31, 0.4)" }}
          />

          {/* Crawl Paragraphs */}
          <div className="space-y-8 md:space-y-12 text-justify">
            {weddingConfig.crawlParagraphs.map((para, index) => (
              <p
                key={index}
                className="text-[#FFE81F] text-xl md:text-3xl lg:text-[2.25rem] font-semibold tracking-wide leading-relaxed md:leading-[1.8] text-center"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  textShadow: "0 0 8px rgba(255, 232, 31, 0.4)",
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* End of Crawl scroll hint */}
          <div className="pt-16 flex flex-col items-center">
            <span className="text-[#FFE81F]/40 font-serif italic text-xs md:text-sm tracking-widest animate-pulse">
              Continue scrolling to view transmission
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
