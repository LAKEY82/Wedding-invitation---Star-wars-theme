"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, X, Heart, Sparkles, Send } from "lucide-react";
import { weddingConfig } from "@/config";

interface InvitationCardProps {
  scrollProgress: number; // 0 to 1
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function InvitationCard({ scrollProgress }: InvitationCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  
  // RSVP Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState("yes");
  const [guests, setGuests] = useState("1");
  const [diet, setDiet] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Countdown timer logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(weddingConfig.weddingDate) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Form submission handler
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsRsvpOpen(false);
        // Reset states
        setName("");
        setEmail("");
        setDiet("");
        setMessage("");
        setIsSuccess(false);
      }, 3500);
    }, 2000);
  };

  // Fade-in invitation card when scroll progress is near 0.8
  const threshold = 0.76;
  const opacity = scrollProgress > threshold 
    ? Math.min((scrollProgress - threshold) / 0.15, 1.0) 
    : 0;

  const isVisible = scrollProgress > threshold;

  return (
    <div 
      className="fixed inset-0 z-30 flex items-center justify-center px-4 overflow-y-auto py-12"
      style={{
        opacity: opacity,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.2s ease-out"
      }}
    >
      <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-[#E5A93C]/20 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(229,169,60,0.06)] relative group">
        
        {/* Subtle glowing borders and details */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5A93C]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5A93C]/40 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-[#E5A93C]/10 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-[#E5A93C]/10 to-transparent" />

        {/* Elegant geometric frame corners */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#E5A93C]/40" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#E5A93C]/40" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#E5A93C]/40" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#E5A93C]/40" />

        {/* Card Content */}
        <div className="px-6 py-10 md:p-12 flex flex-col items-center text-center space-y-8">
          
          {/* Header icon / theme */}
          <div className="flex items-center gap-2 text-[#E5A93C]/70">
            <Heart className="w-5 h-5 fill-[#E5A93C]/20" />
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            <Heart className="w-5 h-5 fill-[#E5A93C]/20" />
          </div>

          {/* Names */}
          <div>
            <span className="text-[#ffd700]/40 text-xs md:text-sm font-sans uppercase tracking-[0.3em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Join Us for the Celebration of
            </span>
            <h2 
              className="text-4xl md:text-6xl font-normal text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] via-[#FFFDF0] to-[#E5A93C] mt-2 mb-1"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              {weddingConfig.brideName}
            </h2>
            <p className="text-[#E5A93C]/60 text-lg md:text-xl font-serif italic my-1">&amp;</p>
            <h2 
              className="text-4xl md:text-6xl font-normal text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] via-[#FFFDF0] to-[#E5A93C]"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              {weddingConfig.groomName}
            </h2>
          </div>

          <div className="w-12 h-[1px] bg-[#E5A93C]/30" />

          {/* Event details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg text-[#FFFDF0]/90 text-sm font-sans tracking-wide">
            
            {/* Date */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <Calendar className="w-5 h-5 text-[#E5A93C] shrink-0 mt-0.5" />
              <div className="text-left space-y-1">
                <span className="text-xs text-[#E5A93C]/60 uppercase tracking-widest block font-medium">When</span>
                <span className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Saturday, Sept 18, 2027</span>
                <span className="text-xs text-white/50 block">Ceremony: 4:00 PM PST</span>
              </div>
            </div>

            {/* Venue */}
            <a 
              href={weddingConfig.venueGoogleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] transition-all hover:bg-white/[0.05] hover:border-[#E5A93C]/30 group/map"
            >
              <MapPin className="w-5 h-5 text-[#E5A93C] shrink-0 mt-0.5 group-hover/map:animate-bounce" />
              <div className="text-left space-y-1">
                <span className="text-xs text-[#E5A93C]/60 uppercase tracking-widest block font-medium">Where</span>
                <span className="font-semibold block transition-colors group-hover/map:text-[#FFE81F]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {weddingConfig.venueName}
                </span>
                <span className="text-[11px] text-white/50 block leading-tight">{weddingConfig.venueAddress}</span>
              </div>
            </a>
          </div>

          {/* Countdown timer */}
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#E5A93C]/50 uppercase tracking-[0.2em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <Clock className="w-3.5 h-3.5" />
              Countdown to Launch
            </div>
            
            <div className="grid grid-cols-4 gap-2 md:gap-4 font-sans text-center">
              {[
                { label: "Days", val: timeLeft.days },
                { label: "Hours", val: timeLeft.hours },
                { label: "Mins", val: timeLeft.minutes },
                { label: "Secs", val: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white/[0.01] border border-white/[0.04] backdrop-blur-md rounded-lg">
                  <span 
                    className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#E5A93C] block"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item.val.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 block mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Call to action */}
          <button
            onClick={() => setIsRsvpOpen(true)}
            className="px-10 py-3.5 rounded-full border border-[#E5A93C]/50 bg-gradient-to-r from-[#E5A93C]/10 to-[#FFE81F]/10 hover:from-[#E5A93C]/20 hover:to-[#FFE81F]/20 text-[#FFE81F] font-sans text-xs uppercase tracking-[0.3em] transition-all duration-300 shadow-[0_0_20px_rgba(229,169,60,0.1)] hover:shadow-[0_0_35px_rgba(229,169,60,0.3)] hover:scale-105"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Transmission Response (RSVP)
          </button>
        </div>
      </div>

      {/* RSVP Modal Overlay */}
      <AnimatePresence>
        {isRsvpOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-[#0c0c17]/95 border border-[#E5A93C]/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(229,169,60,0.15)] relative p-6 md:p-8"
            >
              {/* Close button */}
              <button 
                onClick={() => setIsRsvpOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Success Screen */}
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-[#E5A93C]/20 flex items-center justify-center border border-[#E5A93C]"
                  >
                    <Heart className="w-8 h-8 text-[#FFE81F] fill-[#FFE81F]/30" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-[#FFE81F] font-serif text-2xl tracking-wider">Transmission Logged</h3>
                    <p className="text-white/60 text-sm max-w-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Your RSVP signal has been broadcasted to the stars. May the light guide your arrival!
                    </p>
                  </div>
                </div>
              ) : (
                /* Form screen */
                <form onSubmit={handleRsvpSubmit} className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl text-[#FFE81F] font-serif tracking-widest uppercase">RSVP Transmission</h3>
                    <p className="text-xs text-white/40 mt-1 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Log your attendance in the systems
                    </p>
                  </div>

                  <div className="space-y-4 text-left font-sans text-sm">
                    {/* Name input */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-[#E5A93C]/80 text-[11px] uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Luke Skywalker" 
                        className="bg-white/[0.03] border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#E5A93C]/60 text-sm"
                      />
                    </div>

                    {/* Email input */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-[#E5A93C]/80 text-[11px] uppercase tracking-wider">HoloNet Address (Email)</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. luke@rebelalliance.org" 
                        className="bg-white/[0.03] border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#E5A93C]/60 text-sm"
                      />
                    </div>

                    {/* Attending options */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <label className="text-[#E5A93C]/80 text-[11px] uppercase tracking-wider">Coordinates (Attending?)</label>
                        <select 
                          value={attending}
                          onChange={(e) => setAttending(e.target.value)}
                          className="bg-[#0c0c17] border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#E5A93C]/60 text-sm"
                        >
                          <option value="yes">Attending</option>
                          <option value="no">Unable to Attend</option>
                        </select>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[#E5A93C]/80 text-[11px] uppercase tracking-wider">Crew Count</label>
                        <select 
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="bg-[#0c0c17] border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#E5A93C]/60 text-sm"
                        >
                          <option value="1">1 Person</option>
                          <option value="2">2 People</option>
                          <option value="3">3 People</option>
                          <option value="4">4 People</option>
                        </select>
                      </div>
                    </div>

                    {/* Dietary */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-[#E5A93C]/80 text-[11px] uppercase tracking-wider">Dietary Preferences</label>
                      <input 
                        type="text" 
                        value={diet}
                        onChange={(e) => setDiet(e.target.value)}
                        placeholder="e.g. Vegetarian, Gluten Free, Blue milk only" 
                        className="bg-white/[0.03] border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#E5A93C]/60 text-sm"
                      />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-[#E5A93C]/80 text-[11px] uppercase tracking-wider">Message to Couple</label>
                      <textarea 
                        rows={3} 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="May the force be with you..."
                        className="bg-white/[0.03] border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#E5A93C]/60 text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-md border border-[#E5A93C]/50 bg-[#E5A93C]/10 text-[#FFE81F] font-sans text-xs uppercase tracking-widest hover:bg-[#E5A93C]/20 transition-all flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        Transmitting... <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Transmit Signal <Send className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
