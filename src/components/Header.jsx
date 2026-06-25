// components/Header.jsx — SHADOW MONARCH ANTIQUE SYSTEM
import { Activity, Cloud, CloudOff, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useRef, useState, useEffect } from "react";

// ─── GOLD CIRCUIT TRACER ─────────────────────────────────────────────────────
function CircuitLine({ x1, y1, x2, y2, mx, my, delay, duration = 3 }) {
  const d = `M${x1},${y1} L${mx},${my} L${x2},${y2}`;
  const len = 300;
  return (
    <g>
      <path d={d} fill="none" stroke="#3b82f6" strokeWidth="0.4" opacity="0.1" />
      <motion.path
        d={d}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="0.7"
        opacity="0.5"
        strokeDasharray={len}
        strokeDashoffset={len}
        animate={{ strokeDashoffset: [len, 0, -len] }}
        transition={{ duration, delay, repeat: Infinity, repeatDelay: 2 + delay * 0.5, ease: "easeInOut" }}
      />
    </g>
  );
}

// ─── SHADOW TENDRIL ───────────────────────────────────────────────────────────
function Tendril({ x1, y1, cx1, cy1, cx2, cy2, x2, y2, delay, width = 1.5 }) {
  const variants = {
    idle: { pathLength: 0, opacity: 0 },
    grow: {
      pathLength: [0, 1, 1, 0],
      opacity: [0, 0.4, 0.2, 0],
      transition: { duration: 5, delay, repeat: Infinity, repeatDelay: 4, ease: [0.4, 0, 0.2, 1] },
    },
  };
  return (
    <motion.path
      d={`M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`}
      fill="none"
      stroke="#8b5cf6"
      strokeWidth={width}
      strokeLinecap="round"
      initial="idle"
      animate="grow"
      variants={variants}
    />
  );
}

// ─── MONARCH SEAL (replaces GateHex) ─────────────────────────────────────────
function MonarchSeal({ cx, cy, r }) {
  const points6 = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  const points8 = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI / 4) * i;
    const rr = i % 2 === 0 ? r * 0.55 : r * 0.38;
    return [cx + rr * Math.cos(angle), cy + rr * Math.sin(angle)];
  });

  return (
    <g>
      {/* Outer dashed gold ring */}
      <motion.circle
        cx={cx} cy={cy} r={r + 8}
        fill="none"
        stroke="rgba(59,130,246,0.15)"
        strokeWidth="1"
        strokeDasharray="6 12"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* Outer hex */}
      <motion.polygon
        points={points6.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="rgba(59,130,246,0.35)"
        strokeWidth="1"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner star burst */}
      <motion.polygon
        points={points8.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="rgba(139,92,246,0.5)"
        strokeWidth="0.8"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      {/* Pulsing center orb */}
      <motion.circle
        cx={cx} cy={cy} r={r * 0.22}
        fill="rgba(59,130,246,0.06)"
        stroke="rgba(59,130,246,0.8)"
        strokeWidth="1.5"
        animate={{ r: [r * 0.2, r * 0.28, r * 0.2], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Spokes */}
      {points6.map(([x, y], i) => (
        <motion.line
          key={i}
          x1={cx} y1={cy} x2={x} y2={y}
          stroke="rgba(59,130,246,0.18)"
          strokeWidth="0.5"
          strokeDasharray="3 6"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* Expanding pulse ring */}
      <motion.circle
        cx={cx} cy={cy} r={8}
        fill="none"
        stroke="rgba(59,130,246,0.6)"
        strokeWidth="1"
        animate={{ r: [8, r * 0.9, 8], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", repeatDelay: 1 }}
      />
    </g>
  );
}

// ─── ANTIQUE PARTICLE FIELD ────────────────────────────────────────────────
function GoldDustField({ width, height }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const GRAVITY_X = width * 0.75;
  const GRAVITY_Y = height * 0.5;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    particlesRef.current = Array.from({ length: 22 }, (_, i) => {
      const band = i % 3;
      const orbitR = 50 + band * 28 + Math.random() * 18;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.003 + Math.random() * 0.003) * (band % 2 === 0 ? 1 : -1);
      return {
        angle, orbitR, speed,
        size: 0.7 + Math.random() * 1.1,
        // gold / amber / dark-amber only
        color: i % 3 === 0 ? "59,130,246" : i % 3 === 1 ? "139,92,246" : "99,102,241",
        alpha: 0.2 + Math.random() * 0.45,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.012 + Math.random() * 0.012,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particlesRef.current.forEach((p) => {
        p.angle += p.speed;
        p.wobble += p.wobbleSpeed;
        const wobbleR = p.orbitR + Math.sin(p.wobble) * 5;
        const x = GRAVITY_X + Math.cos(p.angle) * wobbleR;
        const y = GRAVITY_Y + Math.sin(p.angle) * wobbleR * 0.36;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(rafRef.current);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        zIndex: 0, pointerEvents: "none", opacity: 0.7,
      }}
    />
  );
}

// ─── ANCIENT RUNE MATRIX ────────────────────────────────────────────────────
const RUNE_SHAPE_COUNT    = 12;
const CORRUPT_SHAPE_COUNT = 6;

// Hand-drawn vector runes — small magic-circle glyphs instead of font characters
function RuneShape({ type, size = 5, color }) {
  const sw = 0.75;
  switch (type % RUNE_SHAPE_COUNT) {
    case 0: // circled cross
      return (
        <>
          <circle r={size} fill="none" stroke={color} strokeWidth={sw} />
          <line x1={-size} y1="0" x2={size} y2="0" stroke={color} strokeWidth={sw} />
          <line x1="0" y1={-size} x2="0" y2={size} stroke={color} strokeWidth={sw} />
        </>
      );
    case 1: // circled X
      return (
        <>
          <circle r={size} fill="none" stroke={color} strokeWidth={sw} />
          <line x1={-size * 0.7} y1={-size * 0.7} x2={size * 0.7} y2={size * 0.7} stroke={color} strokeWidth={sw} />
          <line x1={-size * 0.7} y1={size * 0.7} x2={size * 0.7} y2={-size * 0.7} stroke={color} strokeWidth={sw} />
        </>
      );
    case 2: // diamond seal
      return <polygon points={`0,${-size} ${size},0 0,${size} ${-size},0`} fill="none" stroke={color} strokeWidth={sw} />;
    case 3: // triangle sigil
      return (
        <>
          <polygon points={`0,${-size} ${size},${size * 0.6} ${-size},${size * 0.6}`} fill="none" stroke={color} strokeWidth={sw} />
          <line x1={-size * 0.55} y1={size * 0.1} x2={size * 0.55} y2={size * 0.1} stroke={color} strokeWidth={sw * 0.8} />
        </>
      );
    case 4: // boxed grid
      return (
        <>
          <rect x={-size} y={-size} width={size * 2} height={size * 2} fill="none" stroke={color} strokeWidth={sw} />
          <line x1={-size} y1="0" x2={size} y2="0" stroke={color} strokeWidth={sw * 0.7} />
          <line x1="0" y1={-size} x2="0" y2={size} stroke={color} strokeWidth={sw * 0.7} />
        </>
      );
    case 5: // boxed X
      return (
        <>
          <rect x={-size} y={-size} width={size * 2} height={size * 2} fill="none" stroke={color} strokeWidth={sw} />
          <line x1={-size} y1={-size} x2={size} y2={size} stroke={color} strokeWidth={sw * 0.8} />
          <line x1={-size} y1={size} x2={size} y2={-size} stroke={color} strokeWidth={sw * 0.8} />
        </>
      );
    case 6: // 4-point star
      return (
        <polygon
          points={`0,${-size} ${size * 0.28},${-size * 0.28} ${size},0 ${size * 0.28},${size * 0.28} 0,${size} ${-size * 0.28},${size * 0.28} ${-size},0 ${-size * 0.28},${-size * 0.28}`}
          fill="none" stroke={color} strokeWidth={sw}
        />
      );
    case 7: // boxed core
      return (
        <>
          <rect x={-size} y={-size} width={size * 2} height={size * 2} fill="none" stroke={color} strokeWidth={sw} />
          <circle r={size * 0.2} fill={color} />
        </>
      );
    case 8: { // hex cell
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${size * Math.cos(a)},${size * Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} fill="none" stroke={color} strokeWidth={sw} />;
    }
    case 9: // asterisk burst
      return (
        <>
          <line x1="0" y1={-size} x2="0" y2={size} stroke={color} strokeWidth={sw * 0.8} />
          <line x1={-size * 0.87} y1={-size * 0.5} x2={size * 0.87} y2={size * 0.5} stroke={color} strokeWidth={sw * 0.8} />
          <line x1={-size * 0.87} y1={size * 0.5} x2={size * 0.87} y2={-size * 0.5} stroke={color} strokeWidth={sw * 0.8} />
        </>
      );
    case 10: // zigzag rune
      return (
        <polyline
          points={`${-size},${-size * 0.5} ${-size * 0.3},${size * 0.5} ${size * 0.3},${-size * 0.5} ${size},${size * 0.5}`}
          fill="none" stroke={color} strokeWidth={sw}
        />
      );
    default: // double ring seal
      return (
        <>
          <circle r={size} fill="none" stroke={color} strokeWidth={sw * 0.7} />
          <circle r={size * 0.55} fill="none" stroke={color} strokeWidth={sw * 0.6} />
          <circle r={size * 0.12} fill={color} />
        </>
      );
  }
}

// Jagged "corrupted" flicker shapes — system glitch state between rune cycles
function CorruptShape({ type, size = 5, color }) {
  const sw = 0.85;
  switch (type % CORRUPT_SHAPE_COUNT) {
    case 0: // fracture bolt
      return (
        <polyline
          points={`${-size},${-size} ${-size * 0.15},${size * 0.25} ${size * 0.45},${-size * 0.35} ${size},${size}`}
          fill="none" stroke={color} strokeWidth={sw}
        />
      );
    case 1: // cracked X
      return (
        <>
          <line x1={-size} y1={-size} x2={size} y2={size} stroke={color} strokeWidth={sw} />
          <line x1={-size * 0.25} y1={size} x2={size * 0.25} y2={-size} stroke={color} strokeWidth={sw * 0.7} />
        </>
      );
    case 2: // broken bracket
      return (
        <polyline
          points={`${size * 0.4},${-size} ${-size * 0.5},${-size * 0.2} ${size * 0.2},${size * 0.15} ${-size * 0.4},${size}`}
          fill="none" stroke={color} strokeWidth={sw}
        />
      );
    case 3: // static burst
      return (
        <>
          <line x1={-size} y1="0" x2={size} y2="0" stroke={color} strokeWidth={sw * 0.7} />
          <line x1={-size * 0.4} y1={-size * 0.7} x2={size * 0.4} y2={size * 0.7} stroke={color} strokeWidth={sw * 0.6} />
        </>
      );
    case 4: // shattered triangle
      return (
        <polyline
          points={`0,${-size} ${size},${size * 0.5} ${-size * 0.2},${size * 0.2} ${-size},${size * 0.6}`}
          fill="none" stroke={color} strokeWidth={sw}
        />
      );
    default: // glitch tick
      return (
        <>
          <line x1="0" y1={-size} x2="0" y2={size * 0.2} stroke={color} strokeWidth={sw * 0.7} />
          <line x1={-size * 0.6} y1={size * 0.4} x2={size * 0.6} y2={size * 0.4} stroke={color} strokeWidth={sw * 0.6} />
        </>
      );
  }
}

function RuneChar({ x, y, delay }) {
  const [runeType, setRuneType]       = useState(0);
  const [corruptType, setCorruptType] = useState(null);
  const [opacity, setOpacity]         = useState(0);

  useEffect(() => {
    const cycle = () => {
      setOpacity(0);
      const t1 = setTimeout(() => {
        let ticks = 0;
        const corrupt = setInterval(() => {
          setCorruptType(Math.floor(Math.random() * CORRUPT_SHAPE_COUNT));
          setOpacity(0.4 + Math.random() * 0.3);
          ticks++;
          if (ticks > 4) {
            clearInterval(corrupt);
            setCorruptType(null);
            setRuneType(Math.floor(Math.random() * RUNE_SHAPE_COUNT));
            setOpacity(0.12 + Math.random() * 0.15);
          }
        }, 80);
      }, delay * 1000 + Math.random() * 3000);
      return t1;
    };
    const t = cycle();
    const interval = setInterval(cycle, 5000 + Math.random() * 6000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, [delay]);

  return (
    <g transform={`translate(${x},${y})`} opacity={opacity} style={{ transition: "opacity 0.15s ease" }}>
      {corruptType !== null
        ? <CorruptShape type={corruptType} size={5} color="#3b82f6" />
        : <RuneShape type={runeType} size={5} color="#3b82f6" />}
    </g>
  );
}

// ─── MAIN HEADER ──────────────────────────────────────────────────────────────
export default function Header({
  overallPercent, studyPercent, workoutPercent,
  user, isSync, isOnline, lastSync, onEnableSync,
}) {
  const headerRef = useRef(null);
  const [dims, setDims] = useState({ w: 900, h: 180 });

  useEffect(() => {
    const measure = () => {
      if (headerRef.current)
        setDims({ w: headerRef.current.offsetWidth, h: headerRef.current.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const now = new Date().toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "short", day: "numeric",
  });

  const handleSignOut = async () => {
    try { await signOut(auth); } catch (e) { console.error(e); }
  };

  const W = dims.w;
  const H = dims.h;

  const runePositions = Array.from({ length: 12 }, (_, i) => ({
    x: 200 + (i % 4) * ((W - 250) / 4) + Math.random() * 30,
    y: 15 + Math.floor(i / 4) * 35 + Math.random() * 15,
    delay: i * 0.25,
  }));

  const circuits = [
    { x1: 0,       y1: H * 0.2, mx: W * 0.16, my: H * 0.2, x2: W * 0.16, y2: H * 0.8, delay: 0,   duration: 2.8 },
    { x1: W,       y1: H * 0.3, mx: W * 0.76, my: H * 0.3, x2: W * 0.76, y2: H * 0.9, delay: 1.3, duration: 3.1 },
    { x1: W * 0.5, y1: H,       mx: W * 0.5,  my: H * 0.4, x2: W * 0.88, y2: H * 0.4, delay: 2.1, duration: 2.5 },
  ];

  const tendrils = [
    { x1: 0, y1: 0, cx1: 70, cy1: 18, cx2: 35, cy2: H * 0.6, x2: 18, y2: H, delay: 0,   width: 1.2 },
    { x1: W, y1: H, cx1: W - 55, cy1: H - 28, cx2: W - 28, cy2: H * 0.38, x2: W - 18, y2: 0, delay: 2.2, width: 1 },
  ];

  return (
    <header
      ref={headerRef}
      className="card-glow p-6 md:p-8"
      style={{ position: "relative", overflow: "hidden", minHeight: "160px" }}
    >
      {/* Gold dust particles */}
      {W > 0 && <GoldDustField width={W} height={H} />}

      {/* SVG overlay */}
      <svg
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          zIndex: 1, pointerEvents: "none", overflow: "visible",
        }}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
      >
        {tendrils.map((t, i)  => <Tendril key={i} {...t} />)}
        {circuits.map((c, i)  => <CircuitLine key={i} {...c} />)}
        {runePositions.map((r, i) => <RuneChar key={i} {...r} />)}

        <MonarchSeal cx={W * 0.82} cy={H * 0.5} r={Math.min(H * 0.44, 68)} />

        {/* Horizontal scan line — gold */}
        <motion.line
          x1={0} y1={H * 0.5} x2={W} y2={H * 0.5}
          stroke="rgba(59,130,246,0.55)"
          strokeWidth="1"
          strokeDasharray="4 8"
          animate={{ opacity: [0, 0, 0.7, 0], strokeDashoffset: [0, -200] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 8, ease: "linear" }}
        />
        {/* Bottom arc — amber */}
        <motion.path
          d={`M 0,${H} Q ${W * 0.5},${H - 16} ${W},${H}`}
          fill="none" stroke="rgba(139,92,246,0.45)" strokeWidth="1.5" strokeDasharray="20 30"
          animate={{ strokeDashoffset: [0, -200] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d={`M 0,${H} Q ${W * 0.5},${H - 8} ${W},${H}`}
          fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="0.7" strokeDasharray="10 44"
          animate={{ strokeDashoffset: [0, 180] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Deep void base — warm gold glow */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background:
            "radial-gradient(ellipse 90% 100% at 80% 50%, rgba(99,102,241,0.18) 0%, transparent 55%)," +
            "radial-gradient(ellipse 60% 80% at 5% 30%, rgba(59,130,246,0.07) 0%, transparent 50%)," +
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 60%)",
        }}
      />

      {/* ── CONTENT ── */}
      <div className="flex flex-col gap-5" style={{ position: "relative", zIndex: 3 }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          {/* Left — Avatar + Title */}
          <div className="flex items-center gap-4">
            {/* AVATAR */}
            <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
              {/* Outer dashed orbit */}
              <motion.div
                style={{
                  position: "absolute", inset: "-18px", borderRadius: "50%",
                  border: "1px dashed rgba(59,130,246,0.2)",
                  zIndex: 0, pointerEvents: "none",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              {/* Gold spinning ring */}
              <motion.div
                style={{
                  position: "absolute", inset: "-10px", borderRadius: "50%",
                  borderTop: "1.5px solid rgba(59,130,246,0.8)",
                  borderRight: "1.5px solid rgba(59,130,246,0.2)",
                  borderBottom: "1.5px solid rgba(59,130,246,0.8)",
                  borderLeft: "1.5px solid rgba(59,130,246,0.2)",
                  zIndex: 0, pointerEvents: "none",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              {/* Amber fast ring */}
              <motion.div
                style={{
                  position: "absolute", inset: "-5px", borderRadius: "50%",
                  borderTop: "2px solid #3b82f6",
                  borderLeft: "2px solid rgba(59,130,246,0.3)",
                  borderBottom: "2px solid transparent",
                  borderRight: "2px solid transparent",
                  zIndex: 1, pointerEvents: "none",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              />
              {/* Counter ring */}
              <motion.div
                style={{
                  position: "absolute", inset: "-5px", borderRadius: "50%",
                  borderBottom: "1px solid rgba(139,92,246,0.9)",
                  borderRight: "1px solid rgba(139,92,246,0.3)",
                  borderTop: "1px solid transparent",
                  borderLeft: "1px solid transparent",
                  zIndex: 1, pointerEvents: "none",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
              />
              {/* Amber pulse halo */}
              <motion.div
                style={{
                  position: "absolute", inset: "-14px", borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)",
                  zIndex: 0, pointerEvents: "none", filter: "blur(4px)",
                }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.08, 0.95] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* 3 orbiting gold dots */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute", width: "3px", height: "3px",
                    borderRadius: "50%", background: "#3b82f6",
                    top: "50%", left: "50%", marginTop: "-1.5px", marginLeft: "-1.5px",
                    zIndex: 4, pointerEvents: "none",
                  }}
                  animate={{
                    x: [
                      Math.cos((angle * Math.PI) / 180) * 44,
                      Math.cos(((angle + 120) * Math.PI) / 180) * 44,
                      Math.cos(((angle + 240) * Math.PI) / 180) * 44,
                      Math.cos(((angle + 360) * Math.PI) / 180) * 44,
                    ],
                    y: [
                      Math.sin((angle * Math.PI) / 180) * 44,
                      Math.sin(((angle + 120) * Math.PI) / 180) * 44,
                      Math.sin(((angle + 240) * Math.PI) / 180) * 44,
                      Math.sin(((angle + 360) * Math.PI) / 180) * 44,
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              ))}
              <div style={{ position: "absolute", inset: "2px", borderRadius: "50%", background: "#000", zIndex: 2 }} />
              <img
                src="/arise-tracker/me.jpeg"
                alt="Karan"
                loading="lazy"
                style={{
                  position: "absolute", inset: "4px",
                  width: "calc(100% - 8px)", height: "calc(100% - 8px)",
                  borderRadius: "50%", objectFit: "cover", objectPosition: "center top",
                  zIndex: 3, filter: "brightness(0.95) contrast(1.05) sepia(0.1)",
                }}
              />
              <div
                style={{
                  position: "absolute", inset: "4px", borderRadius: "50%",
                  background: "radial-gradient(circle, transparent 55%, rgba(0,0,0,0.55) 100%)",
                  zIndex: 4, pointerEvents: "none",
                }}
              />
              {/* Online dot — gold instead of green */}
              <motion.div
                style={{
                  position: "absolute", bottom: "4px", right: "4px",
                  width: "12px", height: "12px", borderRadius: "50%",
                  background: "#3b82f6", border: "2px solid #000",
                  zIndex: 6,
                }}
                animate={{ boxShadow: ["0 0 6px #3b82f6", "0 0 14px #3b82f6", "0 0 6px #3b82f6"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Title */}
            <div>
              <motion.h1
                className="font-heading uppercase"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                  letterSpacing: "0.14em",
                  lineHeight: 1,
                  background: "linear-gradient(135deg, #93c5fd 0%, #3b82f6 40%, #8b5cf6 70%, #3b82f6 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                ARISE
              </motion.h1>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "10px",
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "#3b82f6", opacity: 0.7, marginTop: "4px",
              }}>
                SHADOW MONARCH · KARAN
              </p>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "11px",
                color: "var(--text-muted)", marginTop: "4px",
              }} className="hidden sm:block">
                {now}
              </p>
            </div>
          </div>

          {/* Right — Stats */}
          <div
            className="flex justify-between md:justify-end items-start gap-6 sm:gap-10 w-full md:w-auto"
            style={{ position: "relative", zIndex: 10 }}
          >
            {[
              { label: "STUDY QUEST",   value: Math.round(studyPercent),   color: "#3b82f6" },
              { label: "TRAINING ARC",  value: Math.round(workoutPercent), color: "#8b5cf6" },
              { label: "OVERALL",       value: Math.round(overallPercent), color: "#93c5fd", large: true },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center md:items-end"
                style={{
                  position: "relative",
                  borderLeft: i > 0 ? "1px solid rgba(59,130,246,0.15)" : "none",
                  paddingLeft: i > 0 ? "clamp(16px, 3vw, 40px)" : 0,
                }}
              >
                <div style={{
                  position: "absolute", inset: "-12px",
                  background: "radial-gradient(circle, rgba(0,0,0,0.9) 0%, transparent 70%)",
                  filter: "blur(14px)", zIndex: -1, pointerEvents: "none",
                }} />
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  color: stat.color, textTransform: "uppercase",
                  letterSpacing: "0.14em", opacity: 0.85,
                  position: "relative", zIndex: 2,
                  textShadow: "0 0 8px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,1)",
                }}>
                  {stat.label}
                </span>
                <motion.span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: stat.large ? "clamp(2.4rem, 5.5vw, 3.4rem)" : "clamp(2rem, 4.5vw, 2.8rem)",
                    color: stat.color,
                    letterSpacing: "0.06em", lineHeight: 1.1, marginTop: "4px",
                    position: "relative", zIndex: 2,
                  }}
                  animate={{
                    textShadow: [
                      `0 0 18px ${stat.color}cc, 0 2px 6px rgba(0,0,0,1)`,
                      `0 0 32px ${stat.color}, 0 2px 6px rgba(0,0,0,1)`,
                      `0 0 18px ${stat.color}cc, 0 2px 6px rgba(0,0,0,1)`,
                    ],
                  }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {stat.value}%
                </motion.span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 pt-3"
          style={{ borderTop: "1px solid rgba(59,130,246,0.15)" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2"
            style={{ border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.06)" }}
          >
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
              <Activity size={14} style={{ color: "#3b82f6" }} />
            </motion.div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", color: "#3b82f6" }}>
              SYSTEM ONLINE
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!user ? (
              <motion.button
                key="enable-sync"
                onClick={onEnableSync}
                className="inline-flex items-center gap-2 px-4 py-2 transition-all"
                style={{ border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.06)", color: "#3b82f6" }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ background: "rgba(59,130,246,0.12)" }}
                whileTap={{ scale: 0.95 }}
              >
                <CloudOff className="w-4 h-4" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em" }}>ENABLE SYNC</span>
              </motion.button>
            ) : (
              <motion.div key="synced" className="inline-flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2"
                  style={{ border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.06)" }}
                >
                  <Cloud className="w-4 h-4" style={{ color: "#3b82f6" }} />
                  {isSync && (
                    <motion.div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#3b82f6" }}
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", color: "#3b82f6" }}>
                    {isSync ? "SYNCING" : `SYNCED ${lastSync || "NOW"}`}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-2 transition-all"
                  style={{ border: "1px solid rgba(220,38,38,0.35)", background: "rgba(220,38,38,0.08)", color: "var(--accent-red)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.08)")}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em" }}>
                    DISABLE
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}