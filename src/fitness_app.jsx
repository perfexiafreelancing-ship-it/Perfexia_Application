import React, { useState, useEffect, useMemo } from "react";
import {
  Home, Dumbbell, UtensilsCrossed, TrendingUp, User, Search, Bell, Droplet,
  Moon, Sun, Heart, Flame, Play, Pause, ChevronLeft, ChevronRight, Bookmark,
  Share2, Star, Plus, Settings as SettingsIcon, LogOut, Award, Check,
  ArrowRight, Mail, Lock, Eye, EyeOff, Clock, Zap, Activity, Target,
  Trophy, ChevronDown, Filter, Mic, Camera, Apple,
  Footprints, BedDouble, Gauge, ArrowUpRight, X, MoreHorizontal
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, LineChart, Line, CartesianGrid, Area, AreaChart
} from "recharts";

/* ---------------------------------------------------------------
   DESIGN TOKENS — taken directly from the brief
---------------------------------------------------------------- */
const C = {
  primary: "#6C63FF",
  primaryDark: "#5A52E0",
  secondary: "#00D4AA",
  accent: "#FF6B6B",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  darkBg: "#0F172A",
  lightBg: "#F8FAFC",
  card: "#FFFFFF",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  gradPurpleBlue: "linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)",
  gradOrangePink: "linear-gradient(135deg, #FF8A00 0%, #FF4D6D 100%)",
  gradGreenCyan: "linear-gradient(135deg, #22C55E 0%, #06B6D4 100%)",
};

/* ---------------------------------------------------------------
   GLOBAL STYLE INJECTION (fonts + keyframes + scrollbar reset)
---------------------------------------------------------------- */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    .fa-root { font-family: 'Inter', sans-serif; }
    .fa-heading { font-family: 'Poppins', sans-serif; }
    .fa-numeric { font-family: 'Inter', sans-serif; font-variant-numeric: tabular-nums; }

    .fa-scroll::-webkit-scrollbar { display: none; }
    .fa-scroll { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes fa-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fa-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fa-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(108,99,255,0.45); } 70% { box-shadow: 0 0 0 14px rgba(108,99,255,0); } 100% { box-shadow: 0 0 0 0 rgba(108,99,255,0); } }
    @keyframes fa-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes fa-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes fa-shimmer { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }
    @keyframes fa-pop { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.06); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes fa-ripple { 0% { transform: scale(0); opacity: 0.4; } 100% { transform: scale(2.2); opacity: 0; } }

    .fa-anim-in { animation: fa-fade-up 0.5s cubic-bezier(.22,.9,.32,1) both; }
    .fa-anim-in-fast { animation: fa-fade-in 0.35s ease both; }
    .fa-skeleton { background: linear-gradient(90deg, #E5E9F2 25%, #EEF1F7 37%, #E5E9F2 63%); background-size: 400px 100%; animation: fa-shimmer 1.4s ease-in-out infinite; }
    .fa-skeleton-dark { background: linear-gradient(90deg, #1E293B 25%, #263248 37%, #1E293B 63%); background-size: 400px 100%; animation: fa-shimmer 1.4s ease-in-out infinite; }

    .fa-press { transition: transform 0.15s ease, box-shadow 0.15s ease; }
    .fa-press:active { transform: scale(0.96); }

    .fa-tap-highlight { -webkit-tap-highlight-color: transparent; }
  `}</style>
);

/* ---------------------------------------------------------------
   THEME HOOK — light / dark tokens
---------------------------------------------------------------- */
function useThemeTokens(dark) {
  return useMemo(() => ({
    bg: dark ? C.darkBg : C.lightBg,
    cardBg: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.75)",
    cardSolid: dark ? "#182238" : C.card,
    border: dark ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.06)",
    text: dark ? "#F1F5F9" : C.textPrimary,
    textSub: dark ? "#94A3B8" : C.textSecondary,
    inputBg: dark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
    navBg: dark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.85)",
  }), [dark]);
}

/* ---------------------------------------------------------------
   SMALL SHARED PRIMITIVES
---------------------------------------------------------------- */
const GlassCard = ({ t, children, style, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`fa-anim-in ${className}`}
    style={{
      background: t.cardBg,
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: `1px solid ${t.border}`,
      borderRadius: 24,
      boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

const RingProgress = ({ pct, size = 92, stroke = 9, colorFrom = "#6C63FF", colorTo = "#3B82F6", track = "rgba(148,163,184,0.18)", children, gradId }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(pct, 100) / 100) * c;
  const gid = gradId || `grad-${colorFrom.replace("#", "")}`;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={`url(#${gid})`} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,.9,.32,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
};

const Chip = ({ active, children, onClick, t }) => (
  <button
    onClick={onClick}
    className="fa-press fa-tap-highlight"
    style={{
      padding: "9px 17px",
      borderRadius: 100,
      fontSize: 13.5,
      fontWeight: 600,
      whiteSpace: "nowrap",
      border: active ? "none" : `1px solid ${t.border}`,
      background: active ? C.gradPurpleBlue : "transparent",
      color: active ? "#fff" : t.textSub,
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    {children}
  </button>
);

const IconBtn = ({ icon, t, onClick, active, size = 40 }) => (
  <button
    onClick={onClick}
    className="fa-press fa-tap-highlight"
    style={{
      width: size, height: size, borderRadius: size / 2.6,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: active ? C.gradPurpleBlue : t.cardBg,
      border: active ? "none" : `1px solid ${t.border}`,
      color: active ? "#fff" : t.text,
      cursor: "pointer",
    }}
  >
    {icon}
  </button>
);

const SectionTitle = ({ t, title, action, onAction }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "22px 2px 12px" }}>
    <h3 className="fa-heading" style={{ fontSize: 16.5, fontWeight: 700, color: t.text, margin: 0 }}>{title}</h3>
    {action && (
      <button onClick={onAction} className="fa-tap-highlight" style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 2, cursor: "pointer" }}>
        {action} <ChevronRight size={14} />
      </button>
    )}
  </div>
);

const PrimaryButton = ({ children, onClick, style, icon }) => (
  <button
    onClick={onClick}
    className="fa-press fa-tap-highlight"
    style={{
      width: "100%", padding: "16px 20px", borderRadius: 20, border: "none",
      background: C.gradPurpleBlue, color: "#fff", fontWeight: 700, fontSize: 15.5,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      boxShadow: "0 10px 24px rgba(108,99,255,0.35)", cursor: "pointer",
      fontFamily: "'Poppins', sans-serif",
      ...style,
    }}
  >
    {children} {icon}
  </button>
);

const Input = ({ t, icon, placeholder, type = "text", value, onChange, right }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10, padding: "14px 16px",
    borderRadius: 16, background: t.inputBg, border: `1px solid ${t.border}`, marginBottom: 14,
  }}>
    <span style={{ color: t.textSub, display: "flex" }}>{icon}</span>
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 14.5, fontFamily: "'Inter', sans-serif" }}
    />
    {right}
  </div>
);

const StatusBar = ({ t }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 26px 6px", fontSize: 13, fontWeight: 600, color: t.text }}>
    <span>9:41</span>
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <Activity size={13} /><Gauge size={13} /><span style={{ fontSize: 11 }}>100%</span>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   BOTTOM NAVIGATION
---------------------------------------------------------------- */
const BOTTOM_TABS = [
  { key: "dashboard", icon: Home, label: "Home" },
  { key: "library", icon: Dumbbell, label: "Train" },
  { key: "nutrition", icon: UtensilsCrossed, label: "Nutrition" },
  { key: "progress", icon: TrendingUp, label: "Progress" },
  { key: "profile", icon: User, label: "Profile" },
];

const BottomNav = ({ t, screen, setScreen }) => (
  <div style={{
    position: "absolute", left: 0, right: 0, bottom: 0,
    background: t.navBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    borderTop: `1px solid ${t.border}`, display: "flex", padding: "10px 6px 22px",
    borderRadius: "0 0 40px 40px",
  }}>
    {BOTTOM_TABS.map(tab => {
      const activeTab = screen === tab.key;
      const Icon = tab.icon;
      return (
        <button
          key={tab.key}
          onClick={() => setScreen(tab.key)}
          className="fa-tap-highlight"
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
        >
          <div style={{
            width: 40, height: 28, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
            background: activeTab ? "rgba(108,99,255,0.15)" : "transparent", transition: "background 0.25s",
          }}>
            <Icon size={19} strokeWidth={2.3} color={activeTab ? C.primary : t.textSub} />
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: activeTab ? C.primary : t.textSub }}>{tab.label}</span>
        </button>
      );
    })}
  </div>
);

/* ---------------------------------------------------------------
   MOCK DATA
---------------------------------------------------------------- */
const CATEGORIES = [
  { name: "Strength", icon: Dumbbell, grad: C.gradPurpleBlue },
  { name: "Yoga", icon: Activity, grad: C.gradGreenCyan },
  { name: "HIIT", icon: Zap, grad: C.gradOrangePink },
  { name: "Cardio", icon: Heart, grad: "linear-gradient(135deg,#FF6B6B,#F59E0B)" },
  { name: "Pilates", icon: Target, grad: "linear-gradient(135deg,#00D4AA,#6C63FF)" },
  { name: "CrossFit", icon: Flame, grad: "linear-gradient(135deg,#3B82F6,#00D4AA)" },
];

const WORKOUTS = [
  { id: 1, title: "Full Body Burn", trainer: "Maya Chen", level: "Intermediate", duration: "32 min", cal: 320, grad: C.gradPurpleBlue, tag: "Strength" },
  { id: 2, title: "Morning Flow Yoga", trainer: "Aiko Tan", level: "Beginner", duration: "24 min", cal: 140, grad: C.gradGreenCyan, tag: "Yoga" },
  { id: 3, title: "HIIT Sprint 20", trainer: "Diego Fuentes", level: "Advanced", duration: "20 min", cal: 280, grad: C.gradOrangePink, tag: "HIIT" },
  { id: 4, title: "Core Sculpt", trainer: "Maya Chen", level: "Intermediate", duration: "18 min", cal: 190, grad: "linear-gradient(135deg,#00D4AA,#6C63FF)", tag: "Pilates" },
];

const MACROS = [
  { name: "Protein", value: 92, fill: "#6C63FF" },
  { name: "Carbs", value: 210, fill: "#00D4AA" },
  { name: "Fat", value: 58, fill: "#FF6B6B" },
];

const WEEK_ACTIVITY = [
  { day: "Mon", cal: 320 }, { day: "Tue", cal: 480 }, { day: "Wed", cal: 260 },
  { day: "Thu", cal: 540 }, { day: "Fri", cal: 410 }, { day: "Sat", cal: 610 }, { day: "Sun", cal: 190 },
];

const WEIGHT_TREND = [
  { w: "W1", kg: 74.2 }, { w: "W2", kg: 73.6 }, { w: "W3", kg: 73.1 },
  { w: "W4", kg: 72.4 }, { w: "W5", kg: 71.9 }, { w: "W6", kg: 71.2 },
];

/* ---------------------------------------------------------------
   SCREEN: SPLASH
---------------------------------------------------------------- */
const SplashScreen = ({ onDone }) => {
  useEffect(() => { const tm = setTimeout(onDone, 2200); return () => clearTimeout(tm); }, [onDone]);
  return (
    <div style={{
      height: "100%", background: C.gradPurpleBlue, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", color: "#fff", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.08)", top: -80, right: -60 }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", bottom: -60, left: -60 }} />
      <div style={{
        width: 88, height: 88, borderRadius: 28, background: "rgba(255,255,255,0.18)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22,
        animation: "fa-float 2.4s ease-in-out infinite",
      }}>
        <Flame size={42} color="#fff" strokeWidth={2.4} />
      </div>
      <h1 className="fa-heading" style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: 0.3 }}>PULSE</h1>
      <p style={{ fontSize: 13.5, opacity: 0.85, marginTop: 6, letterSpacing: 1.5 }}>FITNESS · REDEFINED</p>
      <div style={{ position: "absolute", bottom: 70, display: "flex", gap: 6 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", opacity: 0.9, animation: `fa-float ${1 + i * 0.2}s ease-in-out infinite` }} />
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   SCREEN: WELCOME
---------------------------------------------------------------- */
const WelcomeScreen = ({ t, goto }) => {
  const [slide, setSlide] = useState(0);
  const slides = [
    { title: "Train smarter,\nnot harder", sub: "Personalized workouts crafted around your goals and schedule.", grad: C.gradPurpleBlue },
    { title: "Track every\nmetric that matters", sub: "Calories, sleep, water and heart rate — all in one clean view.", grad: C.gradGreenCyan },
    { title: "Join a community\nthat pushes you", sub: "Challenges, leaderboards and coaches cheering you on.", grad: C.gradOrangePink },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: t.bg }}>
      <div style={{ flex: 1, background: slides[slide].grad, borderRadius: "0 0 36px 36px", position: "relative", display: "flex", alignItems: "flex-end", padding: 28, minHeight: 300 }}>
        <div style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.14)", animation: "fa-float 3s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: 90, left: "50%", transform: "translateX(-50%)", width: 92, height: 92, borderRadius: 28, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Dumbbell size={38} color="#fff" />
        </div>
      </div>
      <div style={{ padding: "28px 26px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h1 className="fa-heading fa-anim-in" key={slide} style={{ fontSize: 25, fontWeight: 800, color: t.text, whiteSpace: "pre-line", lineHeight: 1.28, margin: "0 0 10px" }}>{slides[slide].title}</h1>
        <p style={{ fontSize: 14, color: t.textSub, lineHeight: 1.6, margin: 0 }}>{slides[slide].sub}</p>
        <div style={{ display: "flex", gap: 6, margin: "22px 0" }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: slide === i ? 22 : 7, height: 7, borderRadius: 4, border: "none", background: slide === i ? C.primary : t.border, cursor: "pointer", transition: "width 0.3s" }} />
          ))}
        </div>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          <PrimaryButton onClick={() => goto("register")} icon={<ArrowRight size={18} />}>Get started</PrimaryButton>
          <button onClick={() => goto("login")} className="fa-tap-highlight" style={{ background: "none", border: "none", color: t.text, fontWeight: 600, fontSize: 14.5, padding: 8, cursor: "pointer" }}>
            Already have an account? <span style={{ color: C.primary }}>Log in</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   SCREEN: LOGIN
---------------------------------------------------------------- */
const LoginScreen = ({ t, goto }) => {
  const [showPw, setShowPw] = useState(false);
  return (
    <div style={{ height: "100%", background: t.bg, padding: "20px 26px", overflowY: "auto" }} className="fa-scroll">
      <button onClick={() => goto("welcome")} className="fa-tap-highlight" style={{ background: t.cardBg, border: `1px solid ${t.border}`, width: 40, height: 40, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 26, cursor: "pointer" }}>
        <ChevronLeft size={19} color={t.text} />
      </button>
      <h1 className="fa-heading" style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: "0 0 6px" }}>Welcome back</h1>
      <p style={{ fontSize: 14, color: t.textSub, margin: "0 0 28px" }}>Log in to keep your streak alive</p>

      <Input t={t} icon={<Mail size={17} />} placeholder="Email address" />
      <Input t={t} icon={<Lock size={17} />} placeholder="Password" type={showPw ? "text" : "password"}
        right={<button onClick={() => setShowPw(s => !s)} style={{ background: "none", border: "none", color: t.textSub, cursor: "pointer", display: "flex" }}>{showPw ? <EyeOff size={17} /> : <Eye size={17} />}</button>} />

      <div style={{ textAlign: "right", marginBottom: 22 }}>
        <button style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Forgot password?</button>
      </div>

      <PrimaryButton onClick={() => goto("dashboard")}>Log in</PrimaryButton>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "26px 0" }}>
        <div style={{ flex: 1, height: 1, background: t.border }} /><span style={{ fontSize: 12, color: t.textSub }}>or continue with</span><div style={{ flex: 1, height: 1, background: t.border }} />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 26 }}>
        {[Chrome, Apple, Facebook].map((Icon, i) => (
          <button key={i} className="fa-press fa-tap-highlight" style={{ flex: 1, height: 52, borderRadius: 16, border: `1px solid ${t.border}`, background: t.cardBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon size={19} color={t.text} />
          </button>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 13.5, color: t.textSub }}>
        Don't have an account? <button onClick={() => goto("register")} style={{ background: "none", border: "none", color: C.primary, fontWeight: 700, cursor: "pointer", fontSize: 13.5 }}>Sign up</button>
      </p>
    </div>
  );
};

/* ---------------------------------------------------------------
   SCREEN: REGISTER
---------------------------------------------------------------- */
const RegisterScreen = ({ t, goto }) => {
  const goals = ["Lose weight", "Build muscle", "Stay fit", "Improve endurance"];
  const [goal, setGoal] = useState(0);
  return (
    <div style={{ height: "100%", background: t.bg, padding: "20px 26px", overflowY: "auto" }} className="fa-scroll">
      <button onClick={() => goto("welcome")} className="fa-tap-highlight" style={{ background: t.cardBg, border: `1px solid ${t.border}`, width: 40, height: 40, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22, cursor: "pointer" }}>
        <ChevronLeft size={19} color={t.text} />
      </button>
      <h1 className="fa-heading" style={{ fontSize: 25, fontWeight: 800, color: t.text, margin: "0 0 6px" }}>Create your account</h1>
      <p style={{ fontSize: 14, color: t.textSub, margin: "0 0 22px" }}>Tell us a bit about yourself</p>

      <Input t={t} icon={<User size={17} />} placeholder="Full name" />
      <Input t={t} icon={<Mail size={17} />} placeholder="Email address" />
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}><Input t={t} icon={<Clock size={17} />} placeholder="Age" /></div>
        <div style={{ flex: 1 }}><Input t={t} icon={<Activity size={17} />} placeholder="Height (cm)" /></div>
      </div>
      <Input t={t} icon={<Gauge size={17} />} placeholder="Weight (kg)" />

      <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "10px 0 10px" }}>What's your fitness goal?</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 26 }}>
        {goals.map((g, i) => <Chip key={g} t={t} active={goal === i} onClick={() => setGoal(i)}>{g}</Chip>)}
      </div>

      <PrimaryButton onClick={() => goto("otp")} icon={<ArrowRight size={18} />}>Continue</PrimaryButton>
    </div>
  );
};

/* ---------------------------------------------------------------
   SCREEN: OTP
---------------------------------------------------------------- */
const OtpScreen = ({ t, goto }) => {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(28);
  useEffect(() => { if (timer > 0) { const id = setTimeout(() => setTimer(s => s - 1), 1000); return () => clearTimeout(id); } }, [timer]);
  return (
    <div style={{ height: "100%", background: t.bg, padding: "20px 26px", display: "flex", flexDirection: "column" }}>
      <button onClick={() => goto("register")} className="fa-tap-highlight" style={{ background: t.cardBg, border: `1px solid ${t.border}`, width: 40, height: 40, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 26, cursor: "pointer" }}>
        <ChevronLeft size={19} color={t.text} />
      </button>
      <h1 className="fa-heading" style={{ fontSize: 25, fontWeight: 800, color: t.text, margin: "0 0 6px" }}>Verify it's you</h1>
      <p style={{ fontSize: 14, color: t.textSub, margin: "0 0 30px" }}>Enter the 4-digit code sent to your email</p>

      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 26 }}>
        {digits.map((d, i) => (
          <input
            key={i} value={d} maxLength={1}
            onChange={e => { const v = e.target.value.replace(/\D/g, ""); const nd = [...digits]; nd[i] = v; setDigits(nd); }}
            style={{
              width: 52, height: 60, borderRadius: 16, textAlign: "center", fontSize: 22, fontWeight: 700,
              border: `1.5px solid ${d ? C.primary : t.border}`, background: t.inputBg, color: t.text, outline: "none",
            }}
          />
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: t.textSub, marginBottom: 30 }}>
        {timer > 0 ? <>Resend code in <span style={{ color: C.primary, fontWeight: 700 }}>{timer}s</span></> : <button onClick={() => setTimer(28)} style={{ background: "none", border: "none", color: C.primary, fontWeight: 700, cursor: "pointer" }}>Resend code</button>}
      </p>

      <div style={{ marginTop: "auto" }}>
        <PrimaryButton onClick={() => goto("dashboard")}>Verify & continue</PrimaryButton>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   SCREEN: DASHBOARD
---------------------------------------------------------------- */
const DashboardScreen = ({ t, dark, setDark, goto }) => (
  <div style={{ height: "100%", overflowY: "auto", padding: "8px 22px 100px", background: t.bg }} className="fa-scroll">
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
      <div>
        <p style={{ fontSize: 12.5, color: t.textSub, margin: 0 }}>Good morning 👋</p>
        <h2 className="fa-heading" style={{ fontSize: 19, fontWeight: 700, color: t.text, margin: "2px 0 0" }}>Alex Rivera</h2>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <IconBtn t={t} icon={dark ? <Sun size={17} /> : <Moon size={17} />} onClick={() => setDark(d => !d)} />
        <IconBtn t={t} icon={<Bell size={17} />} onClick={() => goto("notifications")} />
      </div>
    </div>

    <GlassCard t={t} style={{ padding: 20, background: C.gradPurpleBlue, border: "none" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#fff" }}>
          <p style={{ fontSize: 12.5, opacity: 0.85, margin: 0 }}>Today's calories burned</p>
          <p className="fa-numeric" style={{ fontSize: 32, fontWeight: 800, margin: "4px 0" }}>486 <span style={{ fontSize: 14, opacity: 0.8, fontWeight: 500 }}>kcal</span></p>
          <p style={{ fontSize: 12, opacity: 0.85, margin: 0 }}>Goal: 650 kcal · 74%</p>
        </div>
        <RingProgress pct={74} size={78} stroke={7} colorFrom="#fff" colorTo="#E0E7FF" track="rgba(255,255,255,0.25)">
          <Flame size={26} color="#fff" />
        </RingProgress>
      </div>
    </GlassCard>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
      <GlassCard t={t} style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,212,170,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Droplet size={16} color={C.secondary} /></div>
          <span style={{ fontSize: 12.5, color: t.textSub, fontWeight: 600 }}>Water</span>
        </div>
        <p className="fa-numeric" style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: 0 }}>1.8 <span style={{ fontSize: 12, fontWeight: 500, color: t.textSub }}>/ 2.5 L</span></p>
        <div style={{ height: 6, borderRadius: 4, background: t.border, marginTop: 10, overflow: "hidden" }}>
          <div style={{ width: "72%", height: "100%", background: C.secondary, borderRadius: 4 }} />
        </div>
      </GlassCard>

      <GlassCard t={t} style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,107,107,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Heart size={16} color={C.accent} /></div>
          <span style={{ fontSize: 12.5, color: t.textSub, fontWeight: 600 }}>Heart rate</span>
        </div>
        <p className="fa-numeric" style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: 0 }}>78 <span style={{ fontSize: 12, fontWeight: 500, color: t.textSub }}>bpm</span></p>
        <p style={{ fontSize: 11.5, color: C.success, marginTop: 10, fontWeight: 600 }}>Resting · healthy zone</p>
      </GlassCard>

      <GlassCard t={t} style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(108,99,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><BedDouble size={16} color={C.primary} /></div>
          <span style={{ fontSize: 12.5, color: t.textSub, fontWeight: 600 }}>Sleep score</span>
        </div>
        <p className="fa-numeric" style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: 0 }}>86<span style={{ fontSize: 12, fontWeight: 500, color: t.textSub }}> /100</span></p>
        <p style={{ fontSize: 11.5, color: t.textSub, marginTop: 10 }}>7h 42m last night</p>
      </GlassCard>

      <GlassCard t={t} style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Footprints size={16} color={C.warning} /></div>
          <span style={{ fontSize: 12.5, color: t.textSub, fontWeight: 600 }}>Steps</span>
        </div>
        <p className="fa-numeric" style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: 0 }}>7,240</p>
        <p style={{ fontSize: 11.5, color: t.textSub, marginTop: 10 }}>Goal 10,000</p>
      </GlassCard>
    </div>

    <SectionTitle t={t} title="Today's workout" />
    <GlassCard t={t} onClick={() => goto("workoutDetails")} className="fa-press" style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}>
      <div style={{ background: C.gradPurpleBlue, padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#fff" }}>
          <p style={{ fontSize: 11, opacity: 0.85, margin: 0, fontWeight: 600 }}>STRENGTH · 32 MIN</p>
          <p className="fa-heading" style={{ fontSize: 17, fontWeight: 700, margin: "4px 0 0" }}>Full Body Burn</p>
        </div>
        <div style={{ width: 46, height: 46, borderRadius: 16, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Play size={20} color="#fff" fill="#fff" />
        </div>
      </div>
    </GlassCard>

    <SectionTitle t={t} title="Recommended for you" action="See all" onAction={() => goto("library")} />
    <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 6 }} className="fa-scroll">
      {WORKOUTS.slice(0, 3).map(w => (
        <div key={w.id} onClick={() => goto("workoutDetails")} className="fa-press" style={{ minWidth: 168, cursor: "pointer" }}>
          <div style={{ height: 100, borderRadius: 20, background: w.grad, marginBottom: 10, display: "flex", alignItems: "flex-end", padding: 10 }}>
            <span style={{ background: "rgba(0,0,0,0.28)", color: "#fff", fontSize: 10.5, fontWeight: 700, padding: "4px 9px", borderRadius: 8 }}>{w.duration}</span>
          </div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: t.text, margin: "0 0 2px" }}>{w.title}</p>
          <p style={{ fontSize: 11.5, color: t.textSub, margin: 0 }}>{w.trainer} · {w.cal} kcal</p>
        </div>
      ))}
    </div>

    <SectionTitle t={t} title="Quick actions" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
      {[
        { icon: Droplet, label: "Water", c: C.secondary },
        { icon: UtensilsCrossed, label: "Meal", c: C.accent },
        { icon: Trophy, label: "Challenge", c: C.warning },
        { icon: Mic, label: "AI Coach", c: C.primary },
      ].map(a => (
        <button key={a.label} className="fa-press fa-tap-highlight" style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: t.cardBg, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <a.icon size={19} color={a.c} />
          </div>
          <span style={{ fontSize: 10.5, color: t.textSub, fontWeight: 600 }}>{a.label}</span>
        </button>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------
   SCREEN: WORKOUT LIBRARY
---------------------------------------------------------------- */
const LibraryScreen = ({ t, goto }) => {
  const [cat, setCat] = useState("Strength");
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "8px 22px 100px", background: t.bg }} className="fa-scroll">
      <h2 className="fa-heading" style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: "6px 0 16px" }}>Workout library</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", borderRadius: 16, background: t.inputBg, border: `1px solid ${t.border}` }}>
          <Search size={17} color={t.textSub} />
          <input placeholder="Search workouts, trainers..." style={{ border: "none", outline: "none", background: "transparent", flex: 1, color: t.text, fontSize: 13.5 }} />
        </div>
        <IconBtn t={t} icon={<Filter size={17} />} />
      </div>

      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 6, marginBottom: 10 }} className="fa-scroll">
        {CATEGORIES.map(c => {
          const Icon = c.icon;
          const activeCat = cat === c.name;
          return (
            <button key={c.name} onClick={() => setCat(c.name)} className="fa-press fa-tap-highlight" style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", minWidth: 62 }}>
              <div style={{ width: 54, height: 54, borderRadius: 18, background: c.grad, display: "flex", alignItems: "center", justifyContent: "center", opacity: activeCat ? 1 : 0.55, boxShadow: activeCat ? "0 8px 18px rgba(108,99,255,0.28)" : "none" }}>
                <Icon size={22} color="#fff" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: activeCat ? t.text : t.textSub }}>{c.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["Difficulty", "Duration", "Trainer"].map(f => (
          <button key={f} className="fa-press" style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.cardBg, color: t.textSub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {f} <ChevronDown size={13} />
          </button>
        ))}
      </div>

      <SectionTitle t={t} title={`${cat} workouts`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {WORKOUTS.map(w => (
          <GlassCard key={w.id} t={t} onClick={() => goto("workoutDetails")} className="fa-press" style={{ padding: 14, display: "flex", gap: 14, cursor: "pointer" }}>
            <div style={{ width: 74, height: 74, borderRadius: 16, background: w.grad, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Play size={20} color="#fff" fill="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: 14.5, fontWeight: 700, color: t.text, margin: 0 }}>{w.title}</p>
                <Bookmark size={16} color={t.textSub} />
              </div>
              <p style={{ fontSize: 12, color: t.textSub, margin: "3px 0 8px" }}>{w.trainer}</p>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 11, color: t.textSub, display: "flex", alignItems: "center", gap: 3 }}><Clock size={12} />{w.duration}</span>
                <span style={{ fontSize: 11, color: t.textSub, display: "flex", alignItems: "center", gap: 3 }}><Flame size={12} />{w.cal} kcal</span>
                <span style={{ fontSize: 11, color: C.primary, fontWeight: 700 }}>{w.level}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   SCREEN: WORKOUT DETAILS
---------------------------------------------------------------- */
const WorkoutDetailsScreen = ({ t, goto }) => (
  <div style={{ height: "100%", overflowY: "auto", background: t.bg, paddingBottom: 110 }} className="fa-scroll">
    <div style={{ height: 240, background: C.gradPurpleBlue, position: "relative", borderRadius: "0 0 32px 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button onClick={() => goto("library")} className="fa-tap-highlight" style={{ position: "absolute", top: 18, left: 20, width: 38, height: 38, borderRadius: 13, background: "rgba(255,255,255,0.22)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <ChevronLeft size={18} color="#fff" />
      </button>
      <div style={{ position: "absolute", top: 18, right: 20, display: "flex", gap: 8 }}>
        <button className="fa-tap-highlight" style={{ width: 38, height: 38, borderRadius: 13, background: "rgba(255,255,255,0.22)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Bookmark size={16} color="#fff" /></button>
        <button className="fa-tap-highlight" style={{ width: 38, height: 38, borderRadius: 13, background: "rgba(255,255,255,0.22)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Share2 size={16} color="#fff" /></button>
      </div>
      <div style={{ width: 76, height: 76, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fa-pulse-ring 2.2s infinite" }}>
        <Play size={30} fill="#fff" color="#fff" />
      </div>
    </div>

    <div style={{ padding: "22px 24px" }}>
      <p style={{ fontSize: 11.5, fontWeight: 700, color: C.primary, letterSpacing: 0.5, margin: "0 0 4px" }}>STRENGTH TRAINING</p>
      <h1 className="fa-heading" style={{ fontSize: 23, fontWeight: 800, color: t.text, margin: "0 0 14px" }}>Full Body Burn</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.gradGreenCyan, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>MC</div>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: t.text, margin: 0 }}>Maya Chen</p>
          <p style={{ fontSize: 11.5, color: t.textSub, margin: 0, display: "flex", alignItems: "center", gap: 3 }}><Star size={11} fill={C.warning} color={C.warning} /> 4.9 · Certified trainer</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
        {[{ icon: Clock, v: "32 min", l: "Duration" }, { icon: Flame, v: "320", l: "Calories" }, { icon: Gauge, v: "Inter.", l: "Level" }].map((s, i) => (
          <GlassCard key={i} t={t} style={{ padding: 14, textAlign: "center" }}>
            <s.icon size={18} color={C.primary} style={{ marginBottom: 6 }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: 0 }}>{s.v}</p>
            <p style={{ fontSize: 10.5, color: t.textSub, margin: "2px 0 0" }}>{s.l}</p>
          </GlassCard>
        ))}
      </div>

      <SectionTitle t={t} title="Equipment needed" />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
        {["Dumbbells", "Yoga mat", "Resistance band"].map(e => <Chip key={e} t={t} active={false}>{e}</Chip>)}
      </div>

      <SectionTitle t={t} title="Instructions" />
      {["Warm up — 5 min dynamic stretching", "Circuit 1 — squats, push-ups, lunges", "Circuit 2 — plank rows, burpees", "Cool down — full body stretch"].map((step, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(108,99,255,0.14)", color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
          <p style={{ fontSize: 13.5, color: t.textSub, margin: "3px 0 0", lineHeight: 1.5 }}>{step}</p>
        </div>
      ))}

      <SectionTitle t={t} title="Reviews" action="See all" />
      <GlassCard t={t} style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>{[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill={C.warning} color={C.warning} />)}</div>
        <p style={{ fontSize: 13, color: t.textSub, margin: 0, lineHeight: 1.5 }}>Left me sweating in the best way — the pacing between circuits is perfect.</p>
        <p style={{ fontSize: 11.5, color: t.text, fontWeight: 700, marginTop: 8 }}>— Priya S.</p>
      </GlassCard>
    </div>

    <div style={{ position: "fixed", maxWidth: 390, width: "calc(100% - 48px)", bottom: 26, left: "50%", transform: "translateX(-50%)" }}>
      <PrimaryButton onClick={() => goto("liveWorkout")} icon={<Play size={17} fill="#fff" />}>Start workout</PrimaryButton>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   SCREEN: LIVE WORKOUT
---------------------------------------------------------------- */
const LiveWorkoutScreen = ({ t, goto }) => {
  const [playing, setPlaying] = useState(true);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => { if (!playing) return; const id = setInterval(() => setSeconds(s => s + 1), 1000); return () => clearInterval(id); }, [playing]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div style={{ height: "100%", background: C.darkBg, display: "flex", flexDirection: "column", padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={() => goto("workoutDetails")} className="fa-tap-highlight" style={{ width: 38, height: 38, borderRadius: 13, background: "rgba(255,255,255,0.08)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={18} color="#fff" />
        </button>
        <span style={{ color: "#94A3B8", fontSize: 12.5, fontWeight: 600 }}>EXERCISE 3 OF 8</span>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <RingProgress pct={playing ? 62 : 62} size={220} stroke={12} colorFrom="#6C63FF" colorTo="#00D4AA" track="rgba(255,255,255,0.08)">
          <div style={{ textAlign: "center" }}>
            <p className="fa-numeric" style={{ fontSize: 40, fontWeight: 800, color: "#fff", margin: 0 }}>{mm}:{ss}</p>
            <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 0" }}>Push-ups · Set 2</p>
          </div>
        </RingProgress>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, width: "100%", marginTop: 34 }}>
          {[{ icon: Heart, v: "142", l: "bpm", c: C.accent }, { icon: Flame, v: "186", l: "kcal", c: C.warning }, { icon: Target, v: "12/15", l: "reps", c: C.secondary }].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 14, textAlign: "center" }}>
              <s.icon size={17} color={s.c} style={{ marginBottom: 6 }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{s.v}</p>
              <p style={{ fontSize: 10, color: "#94A3B8", margin: "2px 0 0" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, marginBottom: 10 }}>
        <button className="fa-press fa-tap-highlight" style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Mic size={19} color="#fff" />
        </button>
        <button onClick={() => setPlaying(p => !p)} className="fa-press fa-tap-highlight" style={{ width: 74, height: 74, borderRadius: "50%", background: C.gradPurpleBlue, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 26px rgba(108,99,255,0.4)" }}>
          {playing ? <Pause size={26} color="#fff" fill="#fff" /> : <Play size={26} color="#fff" fill="#fff" />}
        </button>
        <button onClick={() => goto("dashboard")} className="fa-press fa-tap-highlight" style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={19} color="#fff" />
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   SCREEN: NUTRITION
---------------------------------------------------------------- */
const NutritionScreen = ({ t }) => {
  const totalCal = MACROS.reduce((s, m) => s + m.value, 0);
  const meals = [
    { name: "Breakfast", food: "Oats, banana, almond butter", cal: 420, time: "8:10 AM" },
    { name: "Lunch", food: "Grilled chicken, quinoa, greens", cal: 560, time: "12:45 PM" },
    { name: "Dinner", food: "Salmon, sweet potato, broccoli", cal: 480, time: "—" },
    { name: "Snack", food: "Greek yogurt, berries", cal: 180, time: "—" },
  ];
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "8px 22px 100px", background: t.bg }} className="fa-scroll">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 className="fa-heading" style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: 0 }}>Nutrition</h2>
        <IconBtn t={t} icon={<Camera size={17} />} />
      </div>

      <GlassCard t={t} style={{ padding: 20, display: "flex", alignItems: "center", gap: 18 }}>
        <RingProgress pct={68} size={100} stroke={9} colorFrom="#FF8A00" colorTo="#FF4D6D">
          <div style={{ textAlign: "center" }}>
            <p className="fa-numeric" style={{ fontSize: 18, fontWeight: 800, color: t.text, margin: 0 }}>1,640</p>
            <p style={{ fontSize: 9.5, color: t.textSub, margin: 0 }}>/ 2,400 kcal</p>
          </div>
        </RingProgress>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {MACROS.map(m => (
            <div key={m.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 11.5, color: t.textSub, fontWeight: 600 }}>{m.name}</span>
                <span style={{ fontSize: 11.5, color: t.text, fontWeight: 700 }}>{m.value}g</span>
              </div>
              <div style={{ height: 5, borderRadius: 4, background: t.border }}>
                <div style={{ width: `${(m.value / totalCal) * 100 * 1.4}%`, maxWidth: "100%", height: "100%", borderRadius: 4, background: m.fill }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <SectionTitle t={t} title="Today's meals" action="+ Add barcode" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {meals.map(m => (
          <GlassCard key={m.name} t={t} style={{ padding: 14, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(108,99,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <UtensilsCrossed size={18} color={C.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: t.text, margin: 0 }}>{m.name}</p>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: t.text, margin: 0 }}>{m.cal} kcal</p>
              </div>
              <p style={{ fontSize: 11.5, color: t.textSub, margin: "3px 0 0" }}>{m.food}</p>
            </div>
            <button className="fa-tap-highlight" style={{ width: 30, height: 30, borderRadius: 10, border: `1px solid ${t.border}`, background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Plus size={14} color={t.textSub} />
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   SCREEN: PROGRESS
---------------------------------------------------------------- */
const ProgressScreen = ({ t, dark }) => (
  <div style={{ height: "100%", overflowY: "auto", padding: "8px 22px 100px", background: t.bg }} className="fa-scroll">
    <h2 className="fa-heading" style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: "6px 0 18px" }}>Your progress</h2>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 6 }}>
      {[{ l: "Weight", v: "71.2", u: "kg" }, { l: "BMI", v: "22.4", u: "" }, { l: "Body fat", v: "16.8", u: "%" }].map(s => (
        <GlassCard key={s.l} t={t} style={{ padding: 14, textAlign: "center" }}>
          <p style={{ fontSize: 10.5, color: t.textSub, margin: 0, fontWeight: 600 }}>{s.l}</p>
          <p className="fa-numeric" style={{ fontSize: 18, fontWeight: 800, color: t.text, margin: "4px 0 0" }}>{s.v}<span style={{ fontSize: 11 }}>{s.u}</span></p>
        </GlassCard>
      ))}
    </div>

    <SectionTitle t={t} title="Weekly activity" />
    <GlassCard t={t} style={{ padding: "18px 10px 6px" }}>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={WEEK_ACTIVITY} barCategoryGap="28%">
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: dark ? "#1E293B" : "#fff", border: "none", borderRadius: 12, fontSize: 12 }} />
          <Bar dataKey="cal" radius={[8, 8, 8, 8]}>
            {WEEK_ACTIVITY.map((_, i) => <Cell key={i} fill={i === 5 ? C.primary : "rgba(108,99,255,0.28)"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>

    <SectionTitle t={t} title="Weight trend" />
    <GlassCard t={t} style={{ padding: "18px 10px 6px" }}>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={WEIGHT_TREND}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.secondary} stopOpacity={0.4} />
              <stop offset="100%" stopColor={C.secondary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="w" tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} />
          <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
          <Tooltip contentStyle={{ background: dark ? "#1E293B" : "#fff", border: "none", borderRadius: 12, fontSize: 12 }} />
          <Area type="monotone" dataKey="kg" stroke={C.secondary} strokeWidth={2.5} fill="url(#weightGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>

    <SectionTitle t={t} title="Achievements" action="See all" />
    <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 6 }} className="fa-scroll">
      {[{ icon: Trophy, l: "7-day streak", c: C.warning }, { icon: Award, l: "10 workouts", c: C.primary }, { icon: Target, l: "Goal crusher", c: C.success }, { icon: Zap, l: "Early bird", c: C.accent }].map(b => (
        <div key={b.l} style={{ minWidth: 88, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 62, height: 62, borderRadius: 20, background: `${b.c}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <b.icon size={24} color={b.c} />
          </div>
          <span style={{ fontSize: 10.5, color: t.textSub, fontWeight: 600, textAlign: "center" }}>{b.l}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------
   SCREEN: PROFILE
---------------------------------------------------------------- */
const ProfileScreen = ({ t, goto }) => (
  <div style={{ height: "100%", overflowY: "auto", padding: "8px 22px 100px", background: t.bg }} className="fa-scroll">
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "10px 0 20px" }}>
      <div style={{ width: 68, height: 68, borderRadius: "50%", background: C.gradPurpleBlue, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>AR</div>
      <div>
        <h2 className="fa-heading" style={{ fontSize: 18, fontWeight: 800, color: t.text, margin: 0 }}>Alex Rivera</h2>
        <p style={{ fontSize: 12.5, color: t.textSub, margin: "3px 0 0" }}>Member since Jan 2025</p>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
      {[{ v: "128", l: "Workouts" }, { v: "42h", l: "Trained" }, { v: "9", l: "Badges" }].map(s => (
        <GlassCard key={s.l} t={t} style={{ padding: 14, textAlign: "center" }}>
          <p className="fa-numeric" style={{ fontSize: 17, fontWeight: 800, color: t.text, margin: 0 }}>{s.v}</p>
          <p style={{ fontSize: 10.5, color: t.textSub, margin: "3px 0 0" }}>{s.l}</p>
        </GlassCard>
      ))}
    </div>

    <GlassCard t={t} style={{ padding: 16, marginBottom: 18, background: C.gradGreenCyan, border: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
        <div>
          <p style={{ fontSize: 12.5, opacity: 0.9, margin: 0, fontWeight: 600 }}>Pro membership</p>
          <p style={{ fontSize: 15, fontWeight: 800, margin: "3px 0 0" }}>Renews May 12</p>
        </div>
        <button onClick={() => goto("membership")} className="fa-tap-highlight" style={{ background: "rgba(255,255,255,0.25)", border: "none", padding: "9px 16px", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>Manage</button>
      </div>
    </GlassCard>

    {[
      { icon: Target, l: "Goals & activity level" },
      { icon: Trophy, l: "Achievements" },
      { icon: SettingsIcon, l: "Settings", nav: "settings" },
      { icon: Bell, l: "Notifications", nav: "notifications" },
      { icon: Star, l: "Help center" },
    ].map(row => (
      <button key={row.l} onClick={() => row.nav && goto(row.nav)} className="fa-tap-highlight" style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "15px 4px", background: "none", border: "none", borderBottom: `1px solid ${t.border}`, cursor: "pointer" }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: t.cardBg, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <row.icon size={16} color={t.text} />
        </div>
        <span style={{ flex: 1, textAlign: "left", fontSize: 13.5, fontWeight: 600, color: t.text }}>{row.l}</span>
        <ChevronRight size={16} color={t.textSub} />
      </button>
    ))}

    <button className="fa-tap-highlight" style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "18px 4px", background: "none", border: "none", cursor: "pointer" }}>
      <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LogOut size={16} color={C.danger} />
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.danger }}>Log out</span>
    </button>
  </div>
);

/* ---------------------------------------------------------------
   SCREEN: SETTINGS
---------------------------------------------------------------- */
const SettingsScreen = ({ t, dark, setDark, goto }) => {
  const [toggles, setToggles] = useState({ notif: true, water: true, email: false });
  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} className="fa-tap-highlight" style={{ width: 46, height: 27, borderRadius: 14, background: on ? C.gradPurpleBlue : t.border, border: "none", position: "relative", cursor: "pointer", transition: "background 0.25s" }}>
      <div style={{ width: 21, height: 21, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 22 : 3, transition: "left 0.25s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
    </button>
  );
  const rows = [
    { l: "Dark mode", sub: "Easier on the eyes at night", val: dark, set: () => setDark(d => !d) },
    { l: "Workout reminders", sub: "Daily nudge to keep your streak", val: toggles.notif, set: () => setToggles(s => ({ ...s, notif: !s.notif })) },
    { l: "Water reminders", sub: "Every 2 hours during the day", val: toggles.water, set: () => setToggles(s => ({ ...s, water: !s.water })) },
    { l: "Marketing emails", sub: "Offers and product news", val: toggles.email, set: () => setToggles(s => ({ ...s, email: !s.email })) },
  ];
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "8px 22px 100px", background: t.bg }} className="fa-scroll">
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "10px 0 22px" }}>
        <button onClick={() => goto("profile")} className="fa-tap-highlight" style={{ width: 38, height: 38, borderRadius: 13, background: t.cardBg, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={17} color={t.text} />
        </button>
        <h2 className="fa-heading" style={{ fontSize: 19, fontWeight: 800, color: t.text, margin: 0 }}>Settings</h2>
      </div>

      {rows.map(r => (
        <GlassCard key={r.l} t={t} style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: t.text, margin: 0 }}>{r.l}</p>
            <p style={{ fontSize: 11.5, color: t.textSub, margin: "3px 0 0" }}>{r.sub}</p>
          </div>
          <Toggle on={r.val} onClick={r.set} />
        </GlassCard>
      ))}

      <SectionTitle t={t} title="More" />
      {["Language · English", "Units · Metric", "Privacy & security", "Delete account"].map((l, i) => (
        <button key={l} className="fa-tap-highlight" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 4px", background: "none", border: "none", borderBottom: `1px solid ${t.border}`, cursor: "pointer" }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: i === 3 ? C.danger : t.text }}>{l}</span>
          <ChevronRight size={15} color={t.textSub} />
        </button>
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------
   ROOT APP
---------------------------------------------------------------- */
export default function FitnessApp() {
  const [screen, setScreen] = useState("splash");
  const [dark, setDark] = useState(false);
  const t = useThemeTokens(dark);

  const showNav = ["dashboard", "library", "nutrition", "progress", "profile"].includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case "splash": return <SplashScreen onDone={() => setScreen("welcome")} />;
      case "welcome": return <WelcomeScreen t={t} goto={setScreen} />;
      case "login": return <LoginScreen t={t} goto={setScreen} />;
      case "register": return <RegisterScreen t={t} goto={setScreen} />;
      case "otp": return <OtpScreen t={t} goto={setScreen} />;
      case "dashboard": return <DashboardScreen t={t} dark={dark} setDark={setDark} goto={setScreen} />;
      case "library": return <LibraryScreen t={t} goto={setScreen} />;
      case "workoutDetails": return <WorkoutDetailsScreen t={t} goto={setScreen} />;
      case "liveWorkout": return <LiveWorkoutScreen t={t} goto={setScreen} />;
      case "nutrition": return <NutritionScreen t={t} />;
      case "progress": return <ProgressScreen t={t} dark={dark} />;
      case "profile": return <ProfileScreen t={t} goto={setScreen} />;
      case "settings": return <SettingsScreen t={t} dark={dark} setDark={setDark} goto={setScreen} />;
      case "notifications": return <ProfileScreen t={t} goto={setScreen} />;
      case "membership": return <ProfileScreen t={t} goto={setScreen} />;
      default: return <DashboardScreen t={t} dark={dark} setDark={setDark} goto={setScreen} />;
    }
  };

  return (
    <div className="fa-root" style={{ display: "flex", justifyContent: "center", padding: "24px 0", background: dark ? "#05070D" : "#EEF1F8", minHeight: 780 }}>
      <GlobalStyle />
      <div style={{
        width: 390, height: 780, borderRadius: 46, overflow: "hidden", position: "relative",
        boxShadow: "0 30px 70px rgba(15,23,42,0.25)", border: "8px solid #0F172A", background: t.bg,
      }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 26, background: "#0F172A", borderRadius: "0 0 16px 16px", zIndex: 50 }} />
        {screen !== "splash" && screen !== "liveWorkout" && <StatusBar t={t} />}
        <div style={{ height: screen !== "splash" && screen !== "liveWorkout" ? "calc(100% - 34px)" : "100%", position: "relative" }}>
          {renderScreen()}
        </div>
        {showNav && <BottomNav t={t} screen={screen} setScreen={setScreen} />}
      </div>
    </div>
  );
}