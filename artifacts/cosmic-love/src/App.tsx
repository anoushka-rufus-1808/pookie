import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Star, X } from "lucide-react";

// --- MINI CAT DECORATION ---
// A small, cute lo-fi cat silhouette used as a recurring decorative motif.
function MiniCat({
  className = "",
  size = 28,
  color = "hsl(var(--secondary))",
  flip = false,
}: {
  className?: string;
  size?: number;
  color?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`animate-cat-float pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, transform: flip ? "scaleX(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-cat-blink"
      >
        {/* Ears */}
        <path d="M12 14 L15 6 L20 13" />
        <path d="M36 14 L33 6 L28 13" />
        {/* Head + body (curled sitting cat) */}
        <path d="M10 22c0-6 5-10 14-10s14 4 14 10c0 8-6 14-14 14-3 0-5.5-.6-7.5-1.8" />
        {/* Face details */}
        <circle cx="19" cy="21" r="0.8" fill={color} />
        <circle cx="29" cy="21" r="0.8" fill={color} />
        <path d="M22 25c1 1 3 1 4 0" />
        {/* Tail */}
        <path
          className="animate-tail-flick"
          d="M28 34c5 1 9-2 9-7"
        />
      </svg>
    </div>
  );
}

// --- WELCOME OVERLAY ---
function WelcomeOverlay({ onStart }: { onStart: () => void }) {
  const [visible, setVisible] = useState(true);

  const handleStart = () => {
    setVisible(false);
    onStart();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="welcome"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          onAnimationComplete={(def) => {
            if ((def as { opacity: number }).opacity === 0) {
              // fully gone — nothing to clean up, AnimatePresence handles unmount
            }
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "#0B0F19" }}
        >
          {/* Subtle twinkling stars in the overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animationDelay: `${Math.random() * 4}s`,
                  opacity: Math.random() * 0.6 + 0.1,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="relative z-10 text-center px-8 flex flex-col items-center gap-10"
          >
            {/* Decorative star row */}
            <div className="flex items-center gap-3">
              <Star className="w-3 h-3 text-primary/50 fill-primary/50" />
              <Star className="w-5 h-5 text-primary/80 fill-primary/80" />
              <Star className="w-3 h-3 text-primary/50 fill-primary/50" />
            </div>

            <h1 className="font-script text-4xl md:text-6xl text-primary drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
              A Cosmic Gift For You
            </h1>

            <p className="text-secondary/70 text-sm md:text-base tracking-widest uppercase font-light">
              Press play to begin your journey
            </p>

            <motion.button
              id="start-journey-btn"
              data-testid="button-start-journey"
              onClick={handleStart}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className="mt-2 flex items-center gap-3 px-8 py-4 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm tracking-widest uppercase font-medium hover:bg-primary/20 transition-colors shadow-[0_0_30px_rgba(251,191,36,0.15)]"
            >
              <Play size={18} fill="currentColor" />
              Begin the Journey
            </motion.button>

            <div className="flex items-center gap-3">
              <Star className="w-3 h-3 text-primary/50 fill-primary/50" />
              <Star className="w-5 h-5 text-primary/80 fill-primary/80" />
              <Star className="w-3 h-3 text-primary/50 fill-primary/50" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- HERO COMPONENT ---
function Hero() {
  const [time, setTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startDate = new Date("2026-06-30T00:00:00");

    const calculate = () => {
      const now = new Date();
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const startBase = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
      );
      const baseMs = startDate.getTime() - startBase.getTime();
      let remainMs = now.getTime() - startOfToday.getTime() - baseMs;
      if (remainMs < 0) remainMs += 86400000;

      const hours = Math.floor(remainMs / 3600000);
      const minutes = Math.floor((remainMs % 3600000) / 60000);
      const seconds = Math.floor((remainMs % 60000) / 1000);

      setTime({ years, months, days, hours, minutes, seconds });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Rain */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] bg-gradient-to-b from-transparent via-white to-transparent rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 20 + 10}vh`,
              animationDuration: `${Math.random() * 1 + 0.5}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-10 text-center px-4"
      >
        <h1 className="font-script text-5xl md:text-7xl text-primary mb-8 text-glow drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
          Our Story, Written in the Stars
        </h1>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-12">
          {Object.entries(time).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="text-3xl md:text-5xl font-light tabular-nums text-white">
                {String(value).padStart(2, "0")}
              </div>
              <div className="text-xs md:text-sm uppercase tracking-[0.2em] text-secondary mt-2 font-medium">
                {unit}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Little cat perched on the hillside */}
      <MiniCat
        className="absolute bottom-16 md:bottom-24 left-[12%] z-10"
        size={32}
      />
      <MiniCat
        className="absolute bottom-20 md:bottom-28 right-[15%] z-10"
        size={22}
        flip
      />

      {/* Mountains */}
      <div className="absolute bottom-0 w-full h-48 md:h-64 pointer-events-none text-card">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,224,1152,197.3C1248,171,1344,160,1392,154.7L1440,149L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
}

// --- MUSIC CORNER COMPONENT ---
function MusicCorner({
  audioRef,
  isPlaying,
  setIsPlaying,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}) {
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full py-24 px-4 bg-card border-t border-border/50 relative overflow-hidden">
      {/* Ambient stars for this section */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.6 + 0.5}px`,
              height: `${Math.random() * 1.6 + 0.5}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              opacity: Math.random() * 0.4 + 0.05,
            }}
          />
        ))}
      </div>

      <MiniCat className="absolute top-8 left-[8%] z-10" size={20} />
      <MiniCat className="absolute bottom-10 right-[10%] z-10" size={26} flip />

      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-background/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(251,191,36,0.1)] relative"
        >
          <h2 className="text-2xl font-script text-primary mb-6 text-center">
            Cosmic Mixtape
          </h2>

          <div className="flex items-center justify-between mb-8">
            {/* Cat with headphones */}
            <div className={`relative ${isPlaying ? "animate-bob" : ""}`}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1-19.995.324A10 10 0 0 1 12 2Z" />
                <path d="M8 14v-2M16 14v-2M12 16v-2" />
                <path d="M3 12a9 9 0 0 1 18 0" />
              </svg>
              {/* Headphones */}
              <svg
                className="absolute -top-1 -left-1 text-primary"
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
              </svg>
            </div>

            <button
              data-testid="button-toggle-play"
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 hover:scale-105 transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-1" />
              )}
            </button>
          </div>

          {/* Waveform bars */}
          <div className="w-full h-6 bg-white/5 rounded-full overflow-hidden flex items-end gap-[2px] px-1 pb-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="bg-primary flex-1 rounded-sm transition-all duration-500"
                style={{
                  height: isPlaying
                    ? `${Math.floor(Math.random() * 80 + 20)}%`
                    : "15%",
                  opacity: isPlaying ? 0.7 + Math.random() * 0.3 : 0.25,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- TIMELINE COMPONENT ---
const TIMELINE_NODES = [
  {
    id: 1,
    title: "I arrived, heheheh before you",
    date: "August 18, 2004",
    content:
      "Born a bit earlier, entirely clueless that a workshop would eventually wreck my single status.",
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: 2,
    title: "My Pookie entered the world yayyyyy",
    date: "May 23, 2005",
    content:
      "The universe took its time crafting someone extraordinary. Every star had to be in exactly the right place.",
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "When Cosmic Paths Crossed",
    date: "June 23, 2026",
    content:
      "The day we actually met. The weather outside was terrible but definitely worth it.",
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: 4,
    title: "Started Dating",
    date: "June 30, 2026",
    content:
      "A Micro Full Moon rose that night — rare, close, impossibly bright. Just like this.",
    icon: <Star className="w-6 h-6" />,
  },
];

function Timeline() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <div className="w-full py-32 px-4 relative min-h-screen bg-gradient-to-b from-card to-background overflow-hidden">
      {/* Celestial star particles for background depth */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.8 + 0.4}px`,
              height: `${Math.random() * 1.8 + 0.4}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              opacity: Math.random() * 0.5 + 0.05,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Hint line */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center font-script text-lg text-secondary/60 mb-20 tracking-wide"
        >
          Tap the glowing stars to retrace our journey...
        </motion.p>

        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 -translate-x-1/2" />

        <MiniCat className="absolute -left-10 top-16 hidden md:block" size={24} />
        <MiniCat className="absolute -right-10 bottom-24 hidden md:block" size={20} flip />

        <div className="space-y-32">
          {TIMELINE_NODES.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative flex items-center justify-center ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              <div
                className={`w-1/2 ${i % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}
              >
                <h3 className="text-xl font-medium text-white mb-1">
                  {node.title}
                </h3>
                <p className="text-sm tracking-wider text-secondary/80 font-mono">
                  {node.date}
                </p>
              </div>

              {/* Node button with tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                <button
                  data-testid={`button-timeline-node-${node.id}`}
                  onClick={() => setActiveNode(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="w-12 h-12 rounded-full bg-card border border-primary/70 flex items-center justify-center text-primary animate-node-glow cursor-pointer hover:bg-primary/15 transition-colors"
                >
                  {node.icon}
                </button>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {hoveredNode === node.id && (
                    <motion.span
                      key="tooltip"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full mt-2 whitespace-nowrap text-[11px] tracking-widest uppercase text-primary/70 bg-background/80 backdrop-blur-sm border border-primary/15 rounded-full px-3 py-1 pointer-events-none select-none"
                    >
                      Tap to open memory
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeNode !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNode(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-card border border-primary/20 rounded-2xl p-8 shadow-2xl z-10 text-center"
            >
              <button
                onClick={() => setActiveNode(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6 flex justify-center text-primary">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  {/* Constellation graphic — dots connected by lines */}
                  <circle cx="50" cy="20" r="3" fill="currentColor" />
                  <circle cx="75" cy="40" r="2" fill="currentColor" />
                  <circle cx="65" cy="68" r="3" fill="currentColor" />
                  <circle cx="35" cy="68" r="2" fill="currentColor" />
                  <circle cx="25" cy="40" r="3" fill="currentColor" />
                  <line x1="50" y1="20" x2="75" y2="40" strokeOpacity="0.4" />
                  <line x1="75" y1="40" x2="65" y2="68" strokeOpacity="0.4" />
                  <line x1="65" y1="68" x2="35" y2="68" strokeOpacity="0.4" />
                  <line x1="35" y1="68" x2="25" y2="40" strokeOpacity="0.4" />
                  <line x1="25" y1="40" x2="50" y2="20" strokeOpacity="0.4" />
                </svg>
              </div>

              <h3 className="text-xl font-script text-primary mb-2">
                {TIMELINE_NODES.find((n) => n.id === activeNode)?.title}
              </h3>
              <p className="text-sm text-primary/70 tracking-widest uppercase mb-6 font-mono">
                {TIMELINE_NODES.find((n) => n.id === activeNode)?.date}
              </p>
              <p className="text-base leading-relaxed text-white/90 italic">
                "{TIMELINE_NODES.find((n) => n.id === activeNode)?.content}"
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- EASTER EGG COMPONENT ---
function MountainPeak() {
  const [showNote, setShowNote] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (showNote || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      setShowNote(true);
    }, 2000);
  };

  return (
    <div className="relative w-full h-[80vh] bg-background overflow-hidden flex items-end justify-center">
      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${Math.random() * 70}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2}px`,
              height: `${Math.random() * 2}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {animating && (
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-shooting-star" />
      )}

      {/* The special star */}
      <button
        data-testid="button-easter-egg-star"
        onClick={handleClick}
        className={`absolute top-1/4 right-1/3 p-4 group transition-opacity duration-500 ${showNote ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="relative">
          <Star className="w-8 h-8 text-primary fill-primary animate-pulse" />
          <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 animate-pulse" />
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-primary/70 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Find Me
          </div>
        </div>
      </button>

      {/* Cats resting on the peak */}
      <MiniCat className="absolute bottom-40 left-[20%] z-10" size={26} />
      <MiniCat className="absolute bottom-52 right-[22%] z-10" size={18} flip />
      <MiniCat className="absolute top-1/3 left-[8%] z-10" size={16} />

      {/* Mountain Silhouette — charcoal-blue peaks */}
      <div
        className="absolute bottom-0 w-full pointer-events-none"
        style={{ height: "40%" }}
      >
        <svg
          viewBox="0 0 1440 400"
          className="w-full h-full"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back range — slightly lighter, further away */}
          <path
            d="M0,320 L120,240 L200,280 L320,180 L440,250 L560,160 L680,220 L760,140 L860,200 L1000,120 L1100,180 L1200,100 L1320,170 L1440,130 L1440,400 L0,400 Z"
            fill="#162032"
          />
          {/* Front range — sharper, darker charcoal-blue */}
          <path
            d="M0,380 L80,310 L160,350 L280,260 L380,320 L480,230 L600,290 L700,210 L820,280 L920,200 L1040,270 L1160,190 L1280,250 L1360,210 L1440,240 L1440,400 L0,400 Z"
            fill="#1E293B"
          />
          {/* Foreground foothills — darkest, closest */}
          <path
            d="M0,400 L0,370 L100,355 L200,375 L320,345 L440,368 L560,352 L680,372 L800,350 L920,365 L1040,355 L1160,370 L1300,358 L1440,365 L1440,400 Z"
            fill="#152030"
          />
        </svg>
      </div>

      <AnimatePresence>
        {showNote && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-32 z-20 w-full max-w-lg px-4"
          >
            <div className="bg-card/90 backdrop-blur-md border border-primary/30 rounded-2xl p-8 shadow-2xl text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <h3 className="text-2xl font-script text-primary">
                  You found it
                </h3>
                <Star className="w-4 h-4 text-primary fill-primary" />
              </div>

              <p className="text-white/90 leading-relaxed mb-8">
                "If the cosmos had a purpose, I think it was this — putting you
                and me in the same room, under the same skies. Forever feels
                like not enough time with you, my adorable pookie."
              </p>

              <button
                onClick={() => setShowNote(false)}
                className="text-xs text-secondary/60 hover:text-secondary uppercase tracking-widest transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {
        // autoplay policy may block — user gesture was provided so this should succeed
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="dark">
      {/* Single shared audio element — mounted at app root so it persists across sections */}
      <audio ref={audioRef} src="/lofi.mp3" loop preload="auto" />

      <WelcomeOverlay onStart={handleStart} />

      <main className="w-full bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
        <Hero />
        <MusicCorner
          audioRef={audioRef}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
        <Timeline />
        <MountainPeak />
      </main>
    </div>
  );
}
