/**
 * PerfexiaPortfolio.tsx
 * Production-grade, fully responsive, strict-TypeScript React portfolio.
 *
 * Key improvements vs previous version:
 *  – All TypeScript strict-mode errors fixed (no implicit any, proper ref types,
 *    correct event-handler signatures, exhaustive return types).
 *  – Responsive layout via injected <style> global CSS + useWindowWidth hook
 *    (no @media inside CSSProperties objects).
 *  – Magnetic-button effect and cursor glow disabled on touch/mobile devices.
 *  – All duplicated JSX extracted into properly typed sub-components.
 *  – Semantic HTML (nav, main, section, footer, header, article, aside).
 *  – ARIA labels on every interactive element.
 *  – useCallback / useMemo to prevent unnecessary re-renders.
 *  – IntersectionObserver ref guard – never observes null.
 *  – counter animation uses cancelAnimationFrame for cleanup.
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  FC,
  ReactNode,
  CSSProperties,
  MouseEvent,
  KeyboardEvent,
  RefObject,
} from "react";

// ─────────────────────────────────────────────────────────────
// 1. GLOBAL CSS  (injected once – handles all media queries)
// ─────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }

  /* Typography */
  .pfx-syne  { font-family: 'Syne', sans-serif; }
  .pfx-dm    { font-family: 'DM Sans', sans-serif; }

  /* ── Nav ── */
  .pfx-nav-links  { display: flex; }
  .pfx-nav-cta    { display: flex; }
  .pfx-hamburger  { display: none; }

  /* ── Hero ── */
  .pfx-hero-inner { display: flex; align-items: center; }
  .pfx-hero-visual { display: block; }

  /* ── Grids ── */
  .pfx-about-grid      { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .pfx-cases-grid      { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  .pfx-stats-grid      { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
  .pfx-pricing-grid    { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; align-items: start; }
  .pfx-trust-grid      { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
  .pfx-testimonial-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
  .pfx-workflow-grid   { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }
  .pfx-payment-grid    { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .pfx-comp-grid       { display: grid; grid-template-columns: 1.2fr 1fr 1fr; }
  .pfx-tech-grid       { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem; }
  .pfx-services-grid   { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }

  /* ── Section padding ── */
  .pfx-section  { padding: 7rem 2.5rem; }
  .pfx-section-sm { padding: 5rem 2.5rem; }
  .pfx-container { max-width: 1160px; margin: 0 auto; }

  /* ── Founder card ── */
  .pfx-founder-card { display: flex; gap: 3rem; align-items: flex-start; }

  /* ── Footer ── */
  .pfx-footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem; }
  .pfx-footer-links { display: flex; gap: 1.25rem; flex-wrap: wrap; }

  /* ── CTA perks ── */
  .pfx-cta-perks { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; }

  /* ── Pricing scale ── */
  .pfx-plan-featured { transform: scale(1.04); }

  /* ═══════════════════════════════
     TABLET  (max 1024px)
  ═══════════════════════════════ */
  @media (max-width: 1024px) {
    .pfx-hero-visual { display: none; }
    .pfx-stats-grid  { grid-template-columns: repeat(2, 1fr); }
    .pfx-workflow-grid { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .pfx-testimonial-grid { grid-template-columns: repeat(2, 1fr); }
    .pfx-pricing-grid { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; }
    .pfx-plan-featured { transform: scale(1); }
    .pfx-payment-grid { grid-template-columns: 1fr; gap: 3rem; }
    .pfx-payment-grid > * { max-width: 400px; margin: 0 auto; }
  }

  /* ═══════════════════════════════
     MOBILE  (max 768px)
  ═══════════════════════════════ */
  @media (max-width: 768px) {
    .pfx-nav-links { display: none; }
    .pfx-nav-cta   { display: none; }
    .pfx-hamburger { display: flex; }

    .pfx-section    { padding: 4rem 1.25rem; }
    .pfx-section-sm { padding: 3.5rem 1.25rem; }

    .pfx-hero-inner  { padding: 6rem 1.25rem 3rem; flex-direction: column; min-height: auto; }
    .pfx-hero-visual { display: none; }

    .pfx-about-grid   { grid-template-columns: 1fr; gap: 2rem; }
    .pfx-cases-grid   { grid-template-columns: 1fr; }
    .pfx-stats-grid   { grid-template-columns: repeat(2, 1fr); }
    .pfx-trust-grid   { grid-template-columns: 1fr; }
    .pfx-testimonial-grid { grid-template-columns: 1fr; }
    .pfx-workflow-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .pfx-comp-grid    { grid-template-columns: 1fr 1fr; }
    .pfx-comp-label-col { display: none; }
    .pfx-founder-card { flex-direction: column; gap: 1.5rem; padding: 1.5rem !important; }
    .pfx-footer-inner { flex-direction: column; text-align: center; }
    .pfx-footer-links { justify-content: center; }
    .pfx-cta-perks { gap: 0.75rem; }
    .pfx-hero-stats { gap: 1.5rem !important; }
  }

  /* ═══════════════════════════════
     SMALL MOBILE  (max 480px)
  ═══════════════════════════════ */
  @media (max-width: 480px) {
    .pfx-stats-grid { grid-template-columns: 1fr; }
    .pfx-services-grid { grid-template-columns: 1fr; }
    .pfx-tech-grid  { grid-template-columns: 1fr 1fr; }
    .pfx-hero-actions { flex-direction: column; }
    .pfx-hero-actions > * { width: 100%; justify-content: center; }
    .pfx-cta-actions { flex-direction: column; align-items: center; }
    .pfx-cta-actions > * { width: 100%; max-width: 300px; justify-content: center; }
  }
`;

// ─────────────────────────────────────────────────────────────
// 2. COLORS  (as const for type safety)
// ─────────────────────────────────────────────────────────────

const C = {
  ink:        "#0A0F1C",      // Deep Perfexia navy
  surface:    "#FFFFFF",      // White
  surface2:   "#F7FAFC",      // Soft background

  violet:     "#6c47ff",      // Perfexia teal
  violetSoft: "#E6FFFA",      // Light teal

  teal:       "#00c49a",      // Professional blue
  tealDark:   "#1D4ED8",      // Deep blue

  muted:      "#64748B",      // Slate gray
  border:     "rgba(0,212,184,0.15)",
} as const;

// type ColorKey = keyof typeof C;

// ─────────────────────────────────────────────────────────────
// 3. INTERFACES / TYPES
// ─────────────────────────────────────────────────────────────

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

interface SectionTagProps {
  children: ReactNode;
  light?: boolean;
  center?: boolean;
}

interface CounterProps {
  target: string;
  suffix?: string;
  prefix?: string;
}

interface MagneticBtnProps {
  children: ReactNode;
  href?: string;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

interface HoverCardProps {
  children: ReactNode;
  tealBorder?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface AboutCardProps {
  icon: string;
  title: string;
  desc: string;
}

interface TagChipProps {
  label: string;
  variant?: "violet" | "teal" | "gray";
}

interface FeatureRowProps {
  text: string;
}

interface ServiceItem {
  icon: string;
  title: string;
  desc: string;
  bg: string;
  featured?: boolean;
}

interface WorkflowItem {
  icon: string;
  title: string;
  desc: string;
}

interface ComparisonItem {
  label: string;
  others: string;
  ours: string;
}

interface StatItem {
  raw: string;
  prefix: string;
  suffix: string;
  label: string;
  desc: string;
}

interface TechItem {
  icon: string;
  title: string;
  desc: string;
  bg: string;
  tags: string[];
}

interface TestimonialItem {
  text: string;
  name: string;
  role: string;
  initials: string;
}

interface PlanFeature {
  text: string;
  star?: boolean;
}

interface PlanItem {
  tier: string;
  price: string;
  sub: string;
  badge?: string;
  featured?: boolean;
  features: PlanFeature[];
  cta: string;
}

interface TrustItem {
  icon: string;
  title: string;
  desc: string;
}

interface PaymentStepItem {
  pct: string;
  title: string;
  desc: string;
  color: string;
}

interface HeroStatItem {
  val: string;
  label: string;
}

// ─────────────────────────────────────────────────────────────
// 4. STATIC DATA
// ─────────────────────────────────────────────────────────────

const HERO_STATS: HeroStatItem[] = [
  { val: "12+", label: "Projects Delivered" },
  { val: "5+",  label: "Industries Served" },
  { val: "98%", label: "Client Satisfaction" },
  { val: "24h", label: "Response Time" },
];

const TECH_BANNER_ITEMS: string[] = [
  "Flutter", "React", "Firebase", "Node.js", "Next.js", "Figma",
];

const SERVICES: ServiceItem[] = [
  { icon: "📱", title: "Mobile App Development",      desc: "High-performance cross-platform apps built with Flutter for iOS and Android — native feel, web speed.", bg: "rgba(108,71,255,0.07)" },
  { icon: "🌐", title: "Web Application Development", desc: "Scalable, secure, and modern web platforms and SaaS solutions built for growth.", bg: "rgba(0,196,154,0.07)", featured: true },
  { icon: "🎨", title: "UI / UX Design",              desc: "Intuitive, user-centric interfaces designed to enhance engagement, usability, and conversion.", bg: "rgba(108,71,255,0.07)" },
  { icon: "⚙️", title: "Custom Software Solutions",   desc: "Tailored enterprise software to streamline operations and solve complex business challenges at scale.", bg: "rgba(0,196,154,0.07)" },
  { icon: "🛟", title: "Maintenance & Support",       desc: "Ongoing technical support, performance optimization, and feature updates to keep your product sharp.", bg: "rgba(108,71,255,0.07)" },
];

const WORKFLOW: WorkflowItem[] = [
  { icon: "🔍", title: "Analysis & Planning", desc: "Requirements, market research, and strategic roadmap creation." },
  { icon: "✏️", title: "UI/UX Design",        desc: "Wireframes, interactive prototypes, and high-fidelity designs." },
  { icon: "💻", title: "Agile Development",   desc: "Iterative sprints, clean architecture, regular progress updates." },
  { icon: "🧪", title: "Testing & QA",        desc: "Rigorous testing for bugs, performance, and security." },
  { icon: "🚀", title: "Deployment & Support",desc: "Live launch plus ongoing maintenance and upgrades." },
];

const COMPARISONS: ComparisonItem[] = [
  { label: "Design",       others: "Generic templates",        ours: "Custom-engineered systems" },
  { label: "Communication",others: "Slow / inconsistent",      ours: "Transparent, daily updates" },
  { label: "Scalability",  others: "Brittle short-term code",  ours: "Future-ready architecture" },
  { label: "UX Quality",   others: "Basic interfaces",         ours: "Premium UX systems" },
  { label: "Post-launch",  others: "Disappear after delivery", ours: "Long-term partnership" },
  { label: "Code Quality", others: "Messy, hard to maintain",  ours: "Clean, modular, documented" },
];

const STATS: StatItem[] = [
  { raw: "2",  prefix: "",  suffix: "x", label: "Faster Product Launch", desc: "Agile frameworks accelerate go-to-market speed" },
  { raw: "45", prefix: "+", suffix: "%", label: "Improved Engagement",   desc: "Intuitive UI/UX keeps users active and retained" },
  { raw: "60", prefix: "-", suffix: "%", label: "Reduced Manual Effort", desc: "Automation eliminates repetitive human workflows" },
  { raw: "30", prefix: "",  suffix: "%", label: "Better Efficiency",     desc: "Robust architecture ensures business continuity" },
];

const TECH: TechItem[] = [
  { icon: "📱", title: "Flutter Development",  desc: "Cross-platform mobile with native performance.",                   bg: "rgba(108,71,255,0.08)", tags: ["Dart","Provider","GetX"] },
  { icon: "⚛️", title: "Modern Web Tech",      desc: "High-speed, responsive PWAs and web apps.",                      bg: "rgba(0,196,154,0.08)",  tags: ["React.js","Next.js","Tailwind"] },
  { icon: "🔌", title: "REST APIs & Backend",  desc: "Robust server-side logic and secure data communication.",         bg: "rgba(108,71,255,0.08)", tags: ["Node.js","Express","Python"] },
  { icon: "🔥", title: "Firebase Cloud",       desc: "Real-time database, auth, and serverless infrastructure.",        bg: "rgba(0,196,154,0.08)",  tags: ["Firestore","Auth","Functions"] },
  { icon: "🎨", title: "UI / UX Design Tools", desc: "Professional prototyping and user interface creation.",           bg: "rgba(108,71,255,0.08)", tags: ["Figma","Adobe XD","Sketch"] },
];

const TESTIMONIALS: TestimonialItem[] = [
  { text: "Perfexia delivered our Flutter app in record time. Clean code, great communication, and the UI exceeded every expectation.", name: "Arjun S.", role: "Founder, SaaS Startup",          initials: "AS" },
  { text: "Complex enterprise portal requirement handled flawlessly. They automated processes we didn't even know could be automated.",  name: "Meera R.", role: "Operations Manager, Service Firm", initials: "MR" },
  { text: "The level of professionalism is rare for this price point. They actually care about the product, not just delivering code.",   name: "Rohan K.", role: "Co-founder, E-commerce Brand",    initials: "RK" },
];

const PLANS: PlanItem[] = [
  {
    tier: "Basic", price: "From ₹15k", sub: "Simple apps & websites",
    features: [{ text: "Standard UI Design" }, { text: "Basic Functionality" }, { text: "Single Platform" }, { text: "Standard Support" }],
    cta: "Get Started",
  },
  {
    tier: "Standard", price: "₹30k – ₹50k", sub: "Full-featured apps & platforms",
    badge: "Most Chosen", featured: true,
    features: [{ text: "Custom UI/UX Design", star: true }, { text: "Cross-Platform (Flutter)" }, { text: "Backend Integration" }, { text: "Admin Dashboard" }, { text: "6 Months Support" }],
    cta: "Select Plan",
  },
  {
    tier: "Advanced", price: "₹60k+", sub: "Complex systems & integrations",
    features: [{ text: "Enterprise Scalability" }, { text: "Custom Automation" }, { text: "Advanced Analytics" }, { text: "Priority Support" }],
    cta: "Contact Sales",
  },
];

const TRUST: TrustItem[] = [
  { icon: "⏱️", title: "On-time Delivery",           desc: "Agile project management ensures milestones are met and products launch on schedule without compromising quality." },
  { icon: "💻", title: "Clean & Scalable Code",       desc: "We write maintainable, modular, and efficient code that grows seamlessly alongside your business needs." },
  { icon: "💬", title: "Transparent Communication",   desc: "Regular updates, open feedback channels, and clear reporting throughout the entire development lifecycle." },
  { icon: "🤝", title: "Long-term Support",           desc: "From post-launch maintenance to feature upgrades — we ensure your product stays robust and secure." },
];

const PAYMENT_STEPS: PaymentStepItem[] = [
  { pct: "40%", title: "Project Initiation",    desc: "Advance payment to kickstart, finalize requirements, and begin UI/UX design phase.",           color: C.teal },
  { pct: "40%", title: "Mid-Project Milestone", desc: "Payable upon design approval and core development at approximately 50% completion.",           color: C.violet },
  { pct: "20%", title: "Final Delivery",        desc: "Final payment before deployment, source code handover, and project go-live.",                  color: C.teal },
];

const NAV_ITEMS: string[] = ["about", "services", "work", "tech", "pricing"];
const FOOTER_ITEMS: string[] = ["About", "Services", "Work", "Pricing", "Contact"];
const CTA_PERKS: string[] = ["Free Consultation", "Response in 24h", "NDA on Request", "100% Satisfaction"];
const TRUST_BADGES: string[] = ["✓ 100% Client Satisfaction", "✓ Secure & NDA Protected", "✓ Delivering Excellence Across Platforms"];
const PAYMENT_MODES: string[] = ["💳 UPI / GPay / PhonePe", "🏦 Bank Transfer / NEFT", "💳 Credit / Debit Cards"];
const ABOUT_PILLS: string[] = ["High Quality", "Scalable", "Secure", "NDA Protected"];

const ABOUT_CARDS: (AboutCardProps & { delay: number })[] = [
  { icon: "🚀", title: "Visionary Development", desc: "Transforming concepts into fully functional, market-ready digital products with speed and precision.", delay: 100 },
  { icon: "⚡", title: "Scalable Solutions",    desc: "Building robust architectures that grow with your business, ensuring long-term sustainability.",    delay: 200 },
  { icon: "✏️", title: "Refined Design",        desc: "Merging aesthetic excellence with intuitive functionality for superior user experiences.",           delay: 300 },
];

// ─────────────────────────────────────────────────────────────
// 5. CUSTOM HOOKS
// ─────────────────────────────────────────────────────────────

/** Returns true once the element enters the viewport (fires once). */
function useInView(threshold = 0.1): [RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/** Returns current window inner width, updated on resize. */
function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1500
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

  return width;
}

/** Returns true when the pointer device is coarse (touch / mobile). */
function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  return isTouch;
}

// ─────────────────────────────────────────────────────────────
// 6. UTILITY COMPONENTS
// ─────────────────────────────────────────────────────────────

/** Injects global CSS once into <head>. */
const GlobalStyle: FC = () => {
  useEffect(() => {
    const id = "pfx-global-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);
  return null;
};

/** Lazy-loads Google Fonts once. */
const FontLoader: FC = () => {
  useEffect(() => {
    const id = "pfx-font-link";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
};

// ─────────────────────────────────────────────────────────────
// 7. REVEAL  (scroll-triggered fade-in)
// ─────────────────────────────────────────────────────────────

const Reveal: FC<RevealProps> = ({ children, delay = 0, className }) => {
  const [ref, visible] = useInView();

  const style: CSSProperties = useMemo(
    () => ({
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0px)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }),
    [visible, delay]
  );

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 8. MAGNETIC BUTTON
// ─────────────────────────────────────────────────────────────

const MagneticBtn: FC<MagneticBtnProps> = ({
  children,
  href,
  style,
  className,
  onClick,
  target,
  rel,
  ariaLabel,
  disabled = false,
}) => {
  const btnRef  = useRef<HTMLButtonElement>(null);
  const aRef    = useRef<HTMLAnchorElement>(null);
  const isTouch = useIsTouchDevice();

  /** Unified ref accessor – avoids casting to HTMLElement. */
  const getEl = useCallback(
    (): HTMLButtonElement | HTMLAnchorElement | null =>
      btnRef.current ?? aRef.current,
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>): void => {
      if (isTouch) return;
      const el = getEl();
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
      el.style.transform  = `translate(${x}px, ${y}px)`;
      el.style.transition = "transform 0.1s ease";
    },
    [isTouch, getEl]
  );

  const handleMouseLeave = useCallback((): void => {
    const el = getEl();
    if (!el) return;
    el.style.transform  = "translate(0px, 0px)";
    el.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
  }, [getEl]);

  if (href) {
    return (
      <a
        ref={aRef}
        href={href}
        target={target}
        rel={rel}
        style={style}
        className={className}
        aria-label={ariaLabel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={btnRef}
      type="button"
      style={style}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// 9. ANIMATED COUNTER
// ─────────────────────────────────────────────────────────────

const Counter: FC<CounterProps> = ({ target, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState<number>(0);
  const [ref, visible]    = useInView();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!visible) return;

    const num      = parseFloat(target.replace(/[^0-9.]/g, ""));
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number): void => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(num * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, target]);

  return (
    <span ref={ref} aria-live="polite" aria-atomic="true">
      {prefix}{count}{suffix}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// 10. SECTION TAG
// ─────────────────────────────────────────────────────────────

const SectionTag: FC<SectionTagProps> = ({
  children,
  light  = false,
  center = false,
}) => (
  <div
    style={{
      display:        "inline-flex",
      alignItems:     "center",
      gap:            8,
      fontSize:       "0.72rem",
      fontWeight:     700,
      letterSpacing:  "0.12em",
      textTransform:  "uppercase",
      color:          light ? C.teal : C.violet,
      marginBottom:   "0.875rem",
      justifyContent: center ? "center" : "flex-start",
      width:          center ? "100%" : "auto",
    }}
  >
    <span
      aria-hidden="true"
      style={{
        display:      "inline-block",
        width:        22,
        height:       2,
        background:   C.teal,
        borderRadius: 2,
        flexShrink:   0,
      }}
    />
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────
// 11. HOVER CARD
// ─────────────────────────────────────────────────────────────

const HoverCard: FC<HoverCardProps> = ({
  children,
  tealBorder = false,
  className,
  style,
}) => {
  const [hovered, setHovered] = useState<boolean>(false);

  const cardStyle: CSSProperties = useMemo(
    () => ({
      background:    "white",
      borderRadius:  20,
      padding:       "2rem",
      border:        `1px solid ${hovered ? (tealBorder ? C.teal : C.violet) : C.border}`,
      transform:     hovered ? "translateY(-4px)" : "translateY(0px)",
      boxShadow:     hovered ? "0 16px 40px rgba(0,0,0,0.06)" : "none",
      transition:    "all 0.25s ease",
      ...style,
    }),
    [hovered, tealBorder, style]
  );

  return (
    <div
      className={className}
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 12. ABOUT CARD
// ─────────────────────────────────────────────────────────────

const AboutCard: FC<AboutCardProps> = ({ icon, title, desc }) => {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <div
      role="article"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:  "white",
        border:      `1px solid ${hovered ? C.violet : C.border}`,
        borderRadius: 16,
        padding:     "1.25rem 1.5rem",
        display:     "flex",
        gap:         "1rem",
        alignItems:  "flex-start",
        transform:   hovered ? "translateX(6px)" : "translateX(0px)",
        transition:  "all 0.2s ease",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width:          44,
          height:         44,
          borderRadius:   12,
          background:     C.violetSoft,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       "1.2rem",
          flexShrink:     0,
        }}
      >
        {icon}
      </div>
      <div>
        <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9375rem", fontWeight: 700, color: C.ink, margin: "0 0 0.25rem 0" }}>
          {title}
        </h4>
        <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.65, margin: 0 }}>
          {desc}
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 13. TAG CHIP  (small coloured label)
// ─────────────────────────────────────────────────────────────

const TagChip: FC<TagChipProps> = ({ label, variant = "gray" }) => {
  const styles: Record<string, CSSProperties> = {
    violet: { background: C.violetSoft,            color: C.violet,  border: "1px solid rgba(108,71,255,0.2)" },
    teal:   { background: "rgba(0,196,154,0.08)",   color: C.tealDark, border: "1px solid rgba(0,196,154,0.2)" },
    gray:   { background: "#f1f5f9",               color: "#64748b",  border: "1px solid #e2e8f0" },
  };

  return (
    <span
      style={{
        padding:      "3px 11px",
        borderRadius: 100,
        fontSize:     "0.75rem",
        fontWeight:   600,
        ...styles[variant],
      }}
    >
      {label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// 14. FEATURE ROW  (bullet point inside case study)
// ─────────────────────────────────────────────────────────────

const FeatureRow: FC<FeatureRowProps> = ({ text }) => (
  <div
    style={{
      display:    "flex",
      alignItems: "center",
      gap:        8,
      fontSize:   "0.85rem",
      color:      "#475569",
      padding:    "3px 0",
    }}
  >
    <span
      aria-hidden="true"
      style={{
        width:        6,
        height:       6,
        borderRadius: "50%",
        background:   C.teal,
        flexShrink:   0,
        display:      "inline-block",
      }}
    />
    {text}
  </div>
);

// ─────────────────────────────────────────────────────────────
// 15. MOCKUP COMPONENTS (visual illustrations)
// ─────────────────────────────────────────────────────────────

const HeroDashboardMockup: FC = () => {
  const bars:     number[]  = [40, 60, 35, 75, 55, 85, 65, 90, 70, 80];
  const winDots:  string[]  = ["#ff5f57", "#febc2e", "#28c840"];
  type StatRow = [string, string, string, string];
  const statRows: StatRow[] = [
    ["Revenue", "₹2.4L",  "+18%", C.teal],
    ["Users",   "1,240",  "+32%", C.violet],
    ["Uptime",  "99.9%",  "Live", C.teal],
  ];

  return (
    <div
      role="img"
      aria-label="Dashboard preview showing revenue, user, and uptime metrics"
      style={{ position: "relative", width: 400, height: 300 }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#0f0d1a,#161230)", borderRadius: 20, border: "1px solid rgba(108,71,255,0.3)", padding: "1.25rem", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
        {/* Window dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
          {winDots.map((c) => <div key={c} aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
          <div style={{ flex: 1, height: 18, background: "rgba(255,255,255,0.06)", borderRadius: 6, marginLeft: 8 }} />
        </div>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {statRows.map(([label, value, change, color]) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 9,  color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
              <div style={{ fontSize: 10, color: color }}>{change}</div>
            </div>
          ))}
        </div>
        {/* Chart */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 75, marginBottom: 12 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0", background: i === 9 ? C.teal : i === 7 ? C.violet : "rgba(255,255,255,0.12)" }} />
          ))}
        </div>
        {/* List rows */}
        {[1, 2].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(108,71,255,0.25)" }} />
            <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4 }} />
            <div style={{ width: 40, height: 8, background: i === 1 ? "rgba(0,196,154,0.35)" : "rgba(255,255,255,0.06)", borderRadius: 4 }} />
          </div>
        ))}
      </div>

      {/* Badge bottom-left */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: -18, left: -18, background: "white", borderRadius: 14, padding: "10px 16px", boxShadow: "0 16px 40px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,196,154,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✓</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.ink }}>Project Shipped</div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>2x faster than average</div>
        </div>
      </div>

      {/* Badge top-right */}
      <div aria-hidden="true" style={{ position: "absolute", top: -14, right: -14, background: C.violet, borderRadius: 10, padding: "8px 14px", color: "white", fontSize: 11, fontWeight: 700, boxShadow: "0 8px 24px rgba(108,71,255,0.45)" }}>
        +45% Engagement
      </div>
    </div>
  );
};

const MobileMockup: FC = () => {
  const rows: number[] = [80, 60, 90, 45, 70];
  return (
    <div
      role="img"
      aria-label="Mobile app screenshot"
      style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem", height: 220 }}
    >
      <div style={{ width: 100, height: 180, background: "#1a1a2e", borderRadius: 18, border: "1.5px solid rgba(108,71,255,0.35)", overflow: "hidden", boxShadow: "0 20px 48px rgba(0,0,0,0.45)" }}>
        <div style={{ height: 28, background: `linear-gradient(135deg,${C.violet},${C.teal})`, display: "flex", alignItems: "center", padding: "0 8px", gap: 4 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
          <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.3)", borderRadius: 3 }} />
        </div>
        <div style={{ padding: 8 }}>
          {rows.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 5, marginBottom: 7, alignItems: "center" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: i % 2 === 0 ? "rgba(108,71,255,0.35)" : "rgba(0,196,154,0.35)", flexShrink: 0 }} />
              <div style={{ width: `${w}%`, height: 6, background: "rgba(255,255,255,0.12)", borderRadius: 3 }} />
            </div>
          ))}
          <div style={{ height: 30, background: `linear-gradient(90deg,rgba(108,71,255,0.25),rgba(0,196,154,0.25))`, borderRadius: 6, marginTop: 6 }} />
        </div>
      </div>
    </div>
  );
};

const WebMockup: FC = () => {
  const chartBars:   number[] = [30, 50, 40, 70, 55, 80, 60];
  const winDots:     string[] = ["#ff5f57", "#febc2e", "#28c840"];
  const sidebarBgs:  string[] = [C.violet, "rgba(255,255,255,0.1)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.1)"];
  const topCardBgs:  string[] = [C.teal,   "rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"];

  return (
    <div
      role="img"
      aria-label="Web admin dashboard screenshot"
      style={{ padding: "1.25rem", height: 220 }}
    >
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", height: "100%", overflow: "hidden" }}>
        <div style={{ height: 28, background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 10px", gap: 6 }}>
          {winDots.map((c) => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
          <div style={{ flex: 1, height: 14, background: "rgba(255,255,255,0.05)", borderRadius: 4, marginLeft: 8 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", height: "calc(100% - 28px)" }}>
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", padding: "8px 6px", display: "flex", flexDirection: "column", gap: 6 }}>
            {sidebarBgs.map((bg, i) => <div key={i} style={{ height: 22, background: bg, borderRadius: 4 }} />)}
          </div>
          <div style={{ padding: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
              {topCardBgs.map((bg, i) => <div key={i} style={{ height: 36, background: bg, borderRadius: 6, opacity: i === 0 ? 0.4 : 1 }} />)}
            </div>
            <div style={{ height: 80, background: "rgba(255,255,255,0.04)", borderRadius: 8, display: "flex", alignItems: "flex-end", padding: "0 6px 6px", gap: 3 }}>
              {chartBars.map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? C.violet : "rgba(255,255,255,0.12)", borderRadius: "3px 3px 0 0", opacity: i === 5 ? 0.85 : 1 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 16. SHARED STYLE TOKENS
// ─────────────────────────────────────────────────────────────

const T = {
  sectionTitle: {
    fontFamily:    "'Space Grotesk', sans-serif",
    fontSize:      "clamp(1.75rem,3.5vw,2.875rem)" as string,
    fontWeight:    800,
    letterSpacing: "-0.03em",
    color:         C.ink,
    margin:        "0 0 0.875rem 0",
  } satisfies CSSProperties,

  sectionLead: {
    fontSize:     "1.0625rem",
    color:        "#64748b",
    maxWidth:     540,
    fontWeight:   300,
    lineHeight:   1.8,
    margin:       "0 0 3.5rem 0",
  } satisfies CSSProperties,

  cardTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize:   "0.9375rem",
    fontWeight: 700,
    color:      C.ink,
    margin:     "0 0 0.25rem 0",
  } satisfies CSSProperties,

  cardBody: {
    fontSize:   "0.85rem",
    color:      "#64748b",
    lineHeight: 1.65,
    margin:     0,
  } satisfies CSSProperties,

  btnPrimary: {
    display:        "inline-flex",
    alignItems:     "center",
    gap:            8,
    padding:        "0.875rem 1.875rem",
    background:     C.ink,
    color:          "white",
    borderRadius:   100,
    fontSize:       "0.9375rem",
    fontWeight:     600,
    border:         "none",
    cursor:         "pointer",
    fontFamily:     "'DM Sans',sans-serif",
    textDecoration: "none",
  } satisfies CSSProperties,

  btnOutline: {
    display:        "inline-flex",
    alignItems:     "center",
    gap:            8,
    padding:        "0.875rem 1.875rem",
    border:         "1.5px solid rgba(108,71,255,0.3)",
    color:          C.ink,
    borderRadius:   100,
    fontSize:       "0.9375rem",
    fontWeight:     500,
    background:     "transparent",
    cursor:         "pointer",
    fontFamily:     "'DM Sans',sans-serif",
    textDecoration: "none",
  } satisfies CSSProperties,

  btnTeal: {
    display:        "inline-flex",
    alignItems:     "center",
    gap:            8,
    padding:        "1rem 2.25rem",
    background:     C.teal,
    color:          "white",
    borderRadius:   100,
    fontSize:       "1rem",
    fontWeight:     700,
    border:         "none",
    cursor:         "pointer",
    fontFamily:     "'DM Sans',sans-serif",
    textDecoration: "none",
  } satisfies CSSProperties,
};

// ─────────────────────────────────────────────────────────────
// 17. CASE-STUDY CARD  (extracted to avoid duplication)
// ─────────────────────────────────────────────────────────────

interface CaseStudyCardProps {
  mockup:    ReactNode;
  type:      string;
  title:     string;
  rows:      [string, string][];
  tags:      string[];
  tagVariant: "violet" | "teal";
  features:  string[];
  delay:     number;
}

const CaseStudyCard: FC<CaseStudyCardProps> = ({
  mockup, type, title, rows, tags, tagVariant, features, delay,
}) => (
  <Reveal delay={delay}>
    <article style={{ border: `1px solid ${C.border}`, borderRadius: 24, overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg,#0d0a1a,#130f2a)" }}>
        {mockup}
      </div>
      <div style={{ padding: "2rem" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.muted, marginBottom: "0.4rem" }}>
          {type}
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 800, color: C.ink, margin: "0 0 1rem 0" }}>
          {title}
        </h3>
        <dl style={{ margin: "0 0 1rem 0" }}>
          {rows.map(([label, text]) => (
            <div key={label} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0.75rem", padding: "0.625rem 0", borderBottom: `1px solid ${C.border}` }}>
              <dt style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, paddingTop: 2 }}>{label}</dt>
              <dd style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>{text}</dd>
            </div>
          ))}
        </dl>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {tags.map((t) => <TagChip key={t} label={t} variant={tagVariant} />)}
        </div>
        {features.map((f) => <FeatureRow key={f} text={f} />)}
      </div>
    </article>
  </Reveal>
);

// ─────────────────────────────────────────────────────────────
// 18. NAV BUTTON  (DRY nav item)
// ─────────────────────────────────────────────────────────────

interface NavBtnProps {
  id:       string;
  label:    string;
  active:   boolean;
  onClick:  (id: string) => void;
}

const NavBtn: FC<NavBtnProps> = ({ id, label, active, onClick }) => {
  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") onClick(id);
    },
    [id, onClick]
  );

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      onKeyDown={handleKey}
      aria-current={active ? "page" : undefined}
      style={{
        background:  "none",
        border:      "none",
        cursor:      "pointer",
        fontSize:    "0.875rem",
        fontWeight:  500,
        color:       active ? C.violet : "#64748b",
        fontFamily:  "'DM Sans',sans-serif",
        padding:     0,
        transition:  "color 0.2s ease",
      }}
    >
      {label}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// 19. MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

const PerfexiaPortfolio: FC = () => {
  const [scrolled,       setScrolled]       = useState<boolean>(false);
  const [activeNav,      setActiveNav]       = useState<string>("home");
  const [mobileOpen,     setMobileOpen]      = useState<boolean>(false);
  const [hoveredService, setHoveredService]  = useState<number | null>(null);
  const [cursorPos,      setCursorPos]       = useState<{ x: number; y: number }>({ x: -400, y: -400 });

  const isTouch = useIsTouchDevice();
  const width   = useWindowWidth();
  const isMobile = width < 768;

  // ── Scroll tracking ──
  useEffect(() => {
    const sectionIds = ["home","about","services","work","tech","pricing","contact"];

    const handleScroll = (): void => {
      setScrolled(window.scrollY > 40);
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) {
          setActiveNav(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Cursor glow (disabled on touch devices) ──
  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: globalThis.MouseEvent): void => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouch]);

  // ── Close mobile menu on resize to desktop ──
  useEffect(() => {
    if (width >= 768) setMobileOpen(false);
  }, [width]);

  const scrollTo = useCallback((id: string): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }, []);

  // ── Shared inline patterns kept minimal ──
  const gradientText: CSSProperties = {
    background:           `linear-gradient(135deg,${C.violet},${C.teal})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor:  "transparent",
    backgroundClip:       "text",
  };

  return (
    <>
      <GlobalStyle />
      <FontLoader />

      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize:   16,
          lineHeight: 1.7,
          color:      C.ink,
          background: C.surface,
          overflowX:  "hidden",
        }}
      >
        {/* Cursor glow — hidden on touch */}
        {!isTouch && (
          <div
            aria-hidden="true"
            style={{
              position:       "fixed",
              width:          500,
              height:         500,
              borderRadius:   "50%",
              background:     `radial-gradient(circle,rgba(108,71,255,0.07),transparent 70%)`,
              pointerEvents:  "none",
              zIndex:         0,
              left:           cursorPos.x - 250,
              top:            cursorPos.y - 250,
              transition:     "left 0.08s linear,top 0.08s linear",
            }}
          />
        )}

        {/* ══════════════════════════════
            NAVIGATION
        ══════════════════════════════ */}
        <header role="banner">
          <nav
            role="navigation"
            aria-label="Main navigation"
            style={{
              position:        "fixed",
              top: 0, left: 0, right: 0,
              zIndex:          100,
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "space-between",
              padding:         "0.875rem 2.5rem",
              background:      "rgba(255,255,255,0.92)",
              backdropFilter:  "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom:    `1px solid ${C.border}`,
              boxShadow:       scrolled ? "0 4px 24px rgba(0,0,0,0.07)" : "none",
              transition:      "box-shadow 0.3s ease",
            }}
          >
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollTo("home"); }}
              aria-label="Perfexia — go to homepage"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 800, color: C.ink, textDecoration: "none", letterSpacing: "-0.02em" }}
            >
              Perfexia<span style={{ color: C.teal }}>.in</span>
            </a>

            {/* Desktop links */}
            <ul className="pfx-nav-links" style={{ gap: "1.75rem", listStyle: "none", margin: 0, padding: 0 }} role="list">
              {NAV_ITEMS.map((id) => (
                <li key={id}>
                  <NavBtn
                    id={id}
                    label={id.charAt(0).toUpperCase() + id.slice(1)}
                    active={activeNav === id}
                    onClick={scrollTo}
                  />
                </li>
              ))}
            </ul>

            <MagneticBtn
              className="pfx-nav-cta"
              onClick={() => scrollTo("contact")}
              ariaLabel="Start a project with Perfexia"
              style={{ padding: "0.5rem 1.25rem", background: C.ink, color: "white", borderRadius: 100, fontSize: "0.875rem", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
            >
              Start a Project →
            </MagneticBtn>

            {/* Hamburger */}
            <button
              type="button"
              className="pfx-hamburger"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", padding: "0.25rem", lineHeight: 1 }}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </nav>

          {/* Mobile menu */}
          {mobileOpen && (
            <div
              id="mobile-menu"
              role="menu"
              aria-label="Mobile navigation"
              style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: "white", borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "1rem 1.5rem", gap: "0.25rem", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
            >
              {[...NAV_ITEMS, "contact"].map((id) => (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  onClick={() => scrollTo(id)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 500, color: C.ink, fontFamily: "'DM Sans',sans-serif", textAlign: "left", padding: "0.625rem 0", borderBottom: `1px solid ${C.border}` }}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
          )}
        </header>

        <main id="main-content">

          {/* ══════════════════════════════
              HERO
          ══════════════════════════════ */}
          <section
            id="home"
            aria-labelledby="hero-heading"
            className="pfx-hero-inner"
            style={{ minHeight: "100vh", padding: "8rem 2.5rem 5rem", position: "relative", overflow: "hidden" }}
          >
            {/* Backgrounds */}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, background: `radial-gradient(ellipse 70% 60% at 65% 50%,rgba(108,71,255,0.07) 0%,transparent 65%),radial-gradient(ellipse 50% 40% at 10% 80%,rgba(0,196,154,0.06) 0%,transparent 60%),linear-gradient(180deg,#f5f3ff 0%,#ffffff 100%)` }} />
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `radial-gradient(circle,rgba(108,71,255,0.1) 1px,transparent 1px)`, backgroundSize: "36px 36px", maskImage: "radial-gradient(ellipse 80% 80% at 55% 40%,black 20%,transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 55% 40%,black 20%,transparent 70%)" }} />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 1, maxWidth: 620, flex: "1 1 auto" }}>
              <div role="status" aria-label="Currently accepting new projects" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px 6px 8px", background: "rgba(108,71,255,0.08)", borderRadius: 100, fontSize: "0.78rem", fontWeight: 600, color: C.violet, marginBottom: "2rem", border: "1px solid rgba(108,71,255,0.18)" }}>
                <span aria-hidden="true" style={{ width: 8, height: 8, background: C.teal, borderRadius: "50%", display: "inline-block" }} />
                Currently accepting new projects · Est. 2026
              </div>

              <h1
                id="hero-heading"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.4rem,6vw,5rem)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.05, margin: "0 0 0.75rem 0", color: C.ink }}
              >
                Engineering
                <br />
                <span style={gradientText}>High-Performance</span>
                <br />
                Digital Products
              </h1>

              <p style={{ fontSize: "0.9rem", color: C.muted, fontStyle: "italic", margin: "0 0 1.25rem 0" }}>
                — Where Perfection Meets Excellence
              </p>

              <p style={{ fontSize: "1.0625rem", color: "#475569", maxWidth: 500, margin: "0 0 2.25rem 0", fontWeight: 300, lineHeight: 1.8 }}>
                We build scalable mobile apps, web platforms, and enterprise solutions for startups and businesses ready to grow fast.
              </p>

              <div className="pfx-hero-actions" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
                <MagneticBtn style={T.btnPrimary} onClick={() => scrollTo("contact")} ariaLabel="Start your project with Perfexia">
                  Start Your Project →
                </MagneticBtn>
                <MagneticBtn style={T.btnOutline} onClick={() => scrollTo("work")} ariaLabel="View Perfexia project case studies">
                  View Our Work
                </MagneticBtn>
              </div>

              <dl className="pfx-hero-stats" style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
                {HERO_STATS.map(({ val, label }) => (
                  <div key={label}>
                    <dt style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: C.ink, letterSpacing: "-0.03em" }}>{val}</dt>
                    <dd style={{ fontSize: "0.78rem", color: C.muted, margin: 0 }}>{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Dashboard visual */}
            <div
  style={{
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: width < 992 ? "1fr" : "1.1fr 0.9fr",
    gap: "4rem",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  }}
>
  <div className="hero-content">
    ...
  </div>

  <div className="pfx-hero-visual">
    <HeroDashboardMockup />
  </div>
</div>
          </section>

          {/* Tech banner */}
          <div
            aria-label="Technologies we work with"
            style={{ padding: isMobile ? "1rem 1.25rem" : "1.25rem 2.5rem", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", background: "rgba(245,243,255,0.6)" }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
              Built with industry-leading tech
            </span>
            <ul style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
              {TECH_BANNER_ITEMS.map((t) => (
                <li key={t} style={{ padding: "4px 14px", background: "white", border: `1px solid ${C.border}`, borderRadius: 100, fontSize: "0.8rem", fontWeight: 600, color: C.violet }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* ══════════════════════════════
              ABOUT
          ══════════════════════════════ */}
          <section id="about" aria-labelledby="about-heading" className="pfx-section">
            <div className="pfx-container">
              <div className="pfx-about-grid">
                <Reveal>
                  <SectionTag>About Us</SectionTag>
                  <h2 id="about-heading" style={T.sectionTitle}>
                    A Studio Built for <span style={{ color: C.teal }}>Bold Ideas</span>
                  </h2>
                  <p style={{ fontSize: "0.9375rem", color: "#475569", lineHeight: 1.8, margin: "0 0 1rem 0" }}>
                    Perfexia Freelancing is a digital solutions studio focused on building high-quality mobile apps, web platforms, and user-centric digital experiences. We help startups and businesses turn ideas into reliable, scalable, and visually refined products using cutting-edge technologies.
                  </p>
                  <p style={{ fontSize: "0.9375rem", color: "#475569", lineHeight: 1.8, margin: "0 0 1.75rem 0" }}>
                    Every project we take on is treated as our own — driven by precision, transparency, and a relentless pursuit of quality.
                  </p>
                  <ul aria-label="Key attributes" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
                    {ABOUT_PILLS.map((p) => (
                      <li key={p} style={{ padding: "5px 14px", borderRadius: 100, fontSize: "0.82rem", fontWeight: 500, background: C.violetSoft, color: C.violet, border: "1px solid rgba(108,71,255,0.2)" }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {ABOUT_CARDS.map((c) => (
                    <Reveal key={c.title} delay={c.delay}>
                      <AboutCard icon={c.icon} title={c.title} desc={c.desc} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════
              FOUNDER NOTE
          ══════════════════════════════ */}
          <section aria-label="Founder's note" className="pfx-section-sm" style={{ background: C.ink }}>
            <div className="pfx-container">
              <Reveal>
                <div
                  className="pfx-founder-card"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 24, padding: "2.5rem 3rem" }}
                >
                  <aside style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", minWidth: 110 }}>
                    <div aria-hidden="true" style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${C.violet},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "white" }}>PF</span>
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.875rem", fontWeight: 700, color: "white", textAlign: "center" }}>Perfexia Founder</span>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>Digital Studio · 2026</span>
                  </aside>

                  <blockquote cite="https://perfexia.app" style={{ flex: 1, margin: 0 }}>
                    <p aria-hidden="true" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "4rem", color: C.teal, lineHeight: 1, marginBottom: "0.5rem" }}>"</p>
                    <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.8, fontStyle: "italic", fontWeight: 300, margin: "0 0 1.25rem 0" }}>
                      I started Perfexia because I saw too many startups ship slow, brittle products — not because of lack of vision, but lack of craft. Every line of code we write is meant to outlast the sprint. We don't just build apps, we build foundations that scale with your ambition.
                    </p>
                    <footer style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
                      📍 India · Available Worldwide
                    </footer>
                  </blockquote>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ══════════════════════════════
              SERVICES
          ══════════════════════════════ */}
          <section id="services" aria-labelledby="services-heading" className="pfx-section">
            <div className="pfx-container">
              <Reveal>
                <SectionTag>Our Expertise</SectionTag>
                <h2 id="services-heading" style={T.sectionTitle}>
                  What We <span style={{ color: C.teal }}>Build</span>
                </h2>
                <p style={T.sectionLead}>End-to-end digital solutions across mobile, web, and enterprise platforms.</p>
              </Reveal>

              <ul className="pfx-services-grid" role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {SERVICES.map((s, i) => (
                  <li key={s.title}>
                    <Reveal delay={i * 80}>
                      <article
                        onMouseEnter={() => setHoveredService(i)}
                        onMouseLeave={() => setHoveredService(null)}
                        style={{
                          background:   "white",
                          border:       `1px solid ${hoveredService === i ? "rgba(108,71,255,0.4)" : C.border}`,
                          borderRadius: 20,
                          padding:      "2rem",
                          position:     "relative",
                          overflow:     "hidden",
                          transform:    hoveredService === i ? "translateY(-6px)" : "translateY(0px)",
                          boxShadow:    hoveredService === i ? "0 24px 56px rgba(108,71,255,0.1)" : "none",
                          transition:   "all 0.3s ease",
                          height:       "100%",
                        }}
                      >
                        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${C.violet},${C.teal})`, opacity: hoveredService === i ? 1 : 0, transition: "opacity 0.3s ease" }} />
                        <div aria-hidden="true" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase" }}>{String(i + 1).padStart(2, "0")}</div>
                        <div aria-hidden="true" style={{ width: 52, height: 52, borderRadius: 13, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", marginBottom: "1.125rem" }}>{s.icon}</div>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.0625rem", fontWeight: 700, color: C.ink, margin: "0 0 0.625rem 0" }}>{s.title}</h3>
                        <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                      </article>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ══════════════════════════════
              COMPARISON TABLE
          ══════════════════════════════ */}
          <section aria-labelledby="comparison-heading" className="pfx-section-sm" style={{ background: C.surface2 }}>
            <div className="pfx-container">
              <Reveal>
                <SectionTag>Why Choose Us</SectionTag>
                <h2 id="comparison-heading" style={T.sectionTitle}>
                  Perfexia vs <span style={{ color: C.teal }}>The Rest</span>
                </h2>
                <p style={T.sectionLead}>We don't just complete projects — we engineer products built to last.</p>
              </Reveal>

              <Reveal delay={150}>
                <div role="table" aria-label="Perfexia vs competitors comparison" style={{ borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", background: "white" }}>
                  <div role="row" className="pfx-comp-grid" style={{ background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
                    <div role="columnheader" className="pfx-comp-label-col" style={{ padding: "1rem 1.5rem" }} />
                    <div role="columnheader" style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }}>Others</div>
                    <div role="columnheader" style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: C.violet, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", background: "rgba(108,71,255,0.04)" }}>Perfexia ✦</div>
                  </div>
                  {COMPARISONS.map((r, i) => (
                    <div key={r.label} role="row" className="pfx-comp-grid" style={{ borderBottom: i < COMPARISONS.length - 1 ? `1px solid ${C.border}` : "none", background: i % 2 === 0 ? "rgba(108,71,255,0.015)" : "white" }}>
                      <div role="rowheader" className="pfx-comp-label-col" style={{ padding: "0.875rem 1.5rem", fontSize: "0.875rem", fontWeight: 600, color: C.ink }}>{r.label}</div>
                      <div role="cell" style={{ padding: "0.875rem 1.5rem", fontSize: "0.875rem", color: "#94a3b8", textAlign: "center" }}>
                        <span aria-hidden="true" style={{ color: "#ef4444", fontWeight: 700 }}>✗</span> {r.others}
                      </div>
                      <div role="cell" style={{ padding: "0.875rem 1.5rem", fontSize: "0.875rem", color: C.ink, textAlign: "center", background: "rgba(108,71,255,0.025)" }}>
                        <span aria-hidden="true" style={{ color: C.teal, fontWeight: 700 }}>✓</span> {r.ours}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* ══════════════════════════════
              WORKFLOW
          ══════════════════════════════ */}
          <section aria-labelledby="workflow-heading" className="pfx-section" style={{ background: C.ink }}>
            <div className="pfx-container">
              <Reveal>
                <SectionTag light>Our Workflow</SectionTag>
                <h2 id="workflow-heading" style={{ ...T.sectionTitle, color: "white" }}>
                  How We <span style={{ color: C.teal }}>Work</span>
                </h2>
                <p style={{ ...T.sectionLead, color: "rgba(255,255,255,0.45)" }}>A streamlined agile process — concept to launch.</p>
              </Reveal>

              <ol className="pfx-workflow-grid" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {WORKFLOW.map((w, i) => (
                  <li key={w.title}>
                    <Reveal delay={i * 100}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 0.5rem" }}>
                        <div aria-hidden="true" style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", marginBottom: "0.75rem", background: i === 1 ? C.teal : "rgba(255,255,255,0.05)", border: `1px solid ${i === 1 ? C.teal : "rgba(255,255,255,0.1)"}`, boxShadow: i === 1 ? "0 0 32px rgba(0,196,154,0.4)" : "none" }}>
                          {w.icon}
                        </div>
                        <span aria-hidden="true" style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: "0.5rem", display: "block" }}>0{i + 1}</span>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.875rem", fontWeight: 700, color: "white", margin: "0 0 0.5rem 0" }}>{w.title}</h3>
                        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>{w.desc}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ══════════════════════════════
              CASE STUDIES
          ══════════════════════════════ */}
          <section id="work" aria-labelledby="work-heading" className="pfx-section">
            <div className="pfx-container">
              <Reveal>
                <SectionTag>Case Studies</SectionTag>
                <h2 id="work-heading" style={T.sectionTitle}>
                  Project <span style={{ color: C.teal }}>Highlights</span>
                </h2>
                <p style={T.sectionLead}>Real challenges. Engineered solutions. Measurable outcomes.</p>
              </Reveal>

              <div className="pfx-cases-grid">
                <CaseStudyCard
                  delay={100}
                  mockup={<MobileMockup />}
                  type="Mobile Application"
                  title="Startup / Business App"
                  rows={[
                    ["Challenge", "Fast, modern, scalable mobile app to handle growing user demand."],
                    ["Solution",  "Cross-platform Flutter app with secure architecture and real-time data."],
                  ]}
                  tags={["Flutter", "Firebase", "Dart"]}
                  tagVariant="violet"
                  features={["Secure authentication", "Clean dashboard UI", "Real-time data handling"]}
                />
                <CaseStudyCard
                  delay={200}
                  mockup={<WebMockup />}
                  type="Web Platform"
                  title="Service / Enterprise Portal"
                  rows={[
                    ["Challenge", "Manual workflows and outdated systems causing operational inefficiency."],
                    ["Solution",  "Custom web app with automation pipelines and full admin control."],
                  ]}
                  tags={["React.js", "REST APIs", "Node.js"]}
                  tagVariant="teal"
                  features={["Admin dashboard with full control", "Analytics & reports", "Optimized performance"]}
                />
              </div>
            </div>
          </section>

          {/* ══════════════════════════════
              IMPACT STATS
          ══════════════════════════════ */}
          <section aria-labelledby="impact-heading" className="pfx-section-sm" style={{ background: C.surface2 }}>
            <div className="pfx-container">
              <Reveal>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                  <SectionTag center>Real Results</SectionTag>
                  <h2 id="impact-heading" style={{ ...T.sectionTitle, textAlign: "center" }}>
                    Client <span style={{ color: C.teal }}>Impact</span>
                  </h2>
                </div>
              </Reveal>

              <dl className="pfx-stats-grid">
                {STATS.map((s, i) => (
                  <Reveal key={s.label} delay={i * 80}>
                    <HoverCard>
                      <dt style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em", color: C.teal, marginBottom: "0.25rem" }}>
                        <Counter target={s.raw} prefix={s.prefix} suffix={s.suffix} />
                      </dt>
                      <dd style={{ fontSize: "0.875rem", fontWeight: 600, color: C.ink, margin: "0 0 0.5rem 0" }}>{s.label}</dd>
                      <p style={{ fontSize: "0.78rem", color: C.muted, lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                    </HoverCard>
                  </Reveal>
                ))}
              </dl>
            </div>
          </section>

          {/* ══════════════════════════════
              TECH STACK
          ══════════════════════════════ */}
          <section id="tech" aria-labelledby="tech-heading" className="pfx-section">
            <div className="pfx-container">
              <Reveal>
                <SectionTag>Tech Arsenal</SectionTag>
                <h2 id="tech-heading" style={T.sectionTitle}>
                  Technologies We <span style={{ color: C.teal }}>Use</span>
                </h2>
                <p style={T.sectionLead}>Battle-tested tools and modern frameworks to build products that scale.</p>
              </Reveal>

              <ul className="pfx-tech-grid" role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {TECH.map((t, i) => (
                  <li key={t.title}>
                    <Reveal delay={i * 70}>
                      <HoverCard tealBorder style={{ height: "100%" }}>
                        <div aria-hidden="true" style={{ width: 48, height: 48, borderRadius: 12, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", marginBottom: "1rem" }}>{t.icon}</div>
                        <h3 style={T.cardTitle}>{t.title}</h3>
                        <p style={{ ...T.cardBody, marginBottom: "1rem" }}>{t.desc}</p>
                        <ul style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
                          {t.tags.map((tag) => <li key={tag}><TagChip label={tag} /></li>)}
                        </ul>
                      </HoverCard>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ══════════════════════════════
              TESTIMONIALS
          ══════════════════════════════ */}
          <section aria-labelledby="testimonials-heading" className="pfx-section-sm" style={{ background: C.ink }}>
            <div className="pfx-container">
              <Reveal>
                <SectionTag light center>Social Proof</SectionTag>
                <h2 id="testimonials-heading" style={{ ...T.sectionTitle, color: "white", textAlign: "center", margin: "0 0 3rem 0" }}>
                  What Clients <span style={{ color: C.teal }}>Say</span>
                </h2>
              </Reveal>

              <ul className="pfx-testimonial-grid" role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {TESTIMONIALS.map((t, i) => (
                  <li key={t.name}>
                    <Reveal delay={i * 100}>
                      <article style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "2rem", height: "100%" }}>
                        <div aria-hidden="true" style={{ color: "#fbbf24", fontSize: "0.9rem", marginBottom: "1rem", letterSpacing: 2 }}>★★★★★</div>
                        <blockquote style={{ margin: 0 }}>
                          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, fontStyle: "italic", margin: "0 0 1.5rem 0" }}>"{t.text}"</p>
                          <footer style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                            <div aria-hidden="true" style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${C.violet},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
                              {t.initials}
                            </div>
                            <div>
                              <cite style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.875rem", fontWeight: 700, color: "white", fontStyle: "normal" }}>{t.name}</cite>
                              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>{t.role}</p>
                            </div>
                          </footer>
                        </blockquote>
                      </article>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ══════════════════════════════
              PRICING
          ══════════════════════════════ */}
          <section id="pricing" aria-labelledby="pricing-heading" className="pfx-section" style={{ background: C.ink }}>
            <div className="pfx-container">
              <Reveal>
                <SectionTag light center>Investment Plans</SectionTag>
                <h2 id="pricing-heading" style={{ ...T.sectionTitle, color: "white", textAlign: "center", margin: "0 0 0.875rem 0" }}>
                  Project <span style={{ color: C.teal }}>Pricing</span>
                </h2>
                <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.4)", textAlign: "center", maxWidth: 500, margin: "0 auto 3.5rem", fontWeight: 300, lineHeight: 1.8 }}>
                  Flexible plans for every stage. Projects starting from ₹15k — custom quote based on scope.
                </p>
              </Reveal>

              <div className="pfx-pricing-grid">
                {PLANS.map((p, i) => (
                  <Reveal key={p.tier} delay={i * 100}>
                    <article
                      className={p.featured ? "pfx-plan-featured" : undefined}
                      aria-label={`${p.tier} plan${p.featured ? " — most popular" : ""}`}
                      style={{
                        borderRadius: 24,
                        padding:     "2.5rem 2rem",
                        border:      p.featured ? "1px solid white" : "1px solid rgba(255,255,255,0.09)",
                        background:  p.featured ? "white" : "rgba(255,255,255,0.04)",
                        boxShadow:   p.featured ? "0 32px 64px rgba(0,0,0,0.35)" : "none",
                      }}
                    >
                      {p.badge && (
                        <div aria-label={`Badge: ${p.badge}`} style={{ display: "inline-flex", padding: "4px 14px", background: C.teal, color: "white", borderRadius: 100, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.125rem" }}>
                          {p.badge}
                        </div>
                      )}
                      <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: p.featured ? "#6b7280" : "rgba(255,255,255,0.4)", margin: "0 0 0.625rem 0" }}>{p.tier}</h3>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.875rem", fontWeight: 800, color: p.featured ? C.ink : "white", letterSpacing: "-0.03em", lineHeight: 1, margin: "0 0 0.25rem 0" }}>{p.price}</p>
                      <p style={{ fontSize: "0.8rem", color: p.featured ? "#6b7280" : "rgba(255,255,255,0.35)", margin: "0 0 1.5rem 0" }}>{p.sub}</p>
                      <div style={{ height: 1, background: p.featured ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.09)", marginBottom: "1.25rem" }} />
                      <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {p.features.map((f) => (
                          <li key={f.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: p.featured ? "#374151" : "rgba(255,255,255,0.65)", padding: "5px 0" }}>
                            <span aria-hidden="true" style={{ width: 18, height: 18, borderRadius: "50%", background: f.star ? "rgba(108,71,255,0.2)" : "rgba(0,196,154,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: f.star ? "#a78bfa" : C.teal, flexShrink: 0 }}>
                              {f.star ? "★" : "✓"}
                            </span>
                            {f.text}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => scrollTo("contact")}
                        aria-label={`${p.cta} — ${p.tier} plan`}
                        style={{ display: "block", width: "100%", textAlign: "center", padding: "0.875rem", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", fontWeight: 600, marginTop: "1.75rem", cursor: "pointer", background: p.featured ? C.ink : "transparent", color: "white", border: p.featured ? "none" : "1.5px solid rgba(255,255,255,0.2)", transition: "opacity 0.2s ease" }}
                      >
                        {p.cta}
                      </button>
                    </article>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={200}>
                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)", marginTop: "2rem" }}>
                  Final pricing depends on specific features, project complexity, and scope requirements.
                </p>
              </Reveal>
            </div>
          </section>

          {/* ══════════════════════════════
              PAYMENT STRUCTURE
          ══════════════════════════════ */}
          <section aria-labelledby="payment-heading" className="pfx-section">
            <div className="pfx-container">
              <Reveal>
                <SectionTag>Terms & Conditions</SectionTag>
                <h2 id="payment-heading" style={T.sectionTitle}>
                  Payment <span style={{ color: C.teal }}>Structure</span>
                </h2>
                <p style={T.sectionLead}>Transparent milestone-based terms for smooth project delivery.</p>
              </Reveal>

              <ol className="pfx-payment-grid" style={{ listStyle: "none", margin: "0 0 3rem 0", padding: 0 }}>
                {PAYMENT_STEPS.map((s, i) => (
                  <li key={s.title}>
                    <Reveal delay={i * 120}>
                      <div style={{ textAlign: "center", padding: "0 1rem" }}>
                        <div aria-hidden="true" style={{ width: 80, height: 80, borderRadius: "50%", border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 800, color: s.color, margin: "0 auto 1.5rem" }}>
                          {s.pct}
                        </div>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.0625rem", fontWeight: 700, color: C.ink, margin: "0 0 0.5rem 0" }}>{s.title}</h3>
                        <p style={{ fontSize: "0.875rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>

              <Reveal delay={200}>
                <ul aria-label="Accepted payment methods" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", listStyle: "none", margin: 0, padding: 0 }}>
                  {PAYMENT_MODES.map((m) => (
                    <li key={m} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.55rem 1.25rem", background: "white", border: `1px solid ${C.border}`, borderRadius: 100, fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>
                      {m}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* ══════════════════════════════
              TRUST / WHY US
          ══════════════════════════════ */}
          <section aria-labelledby="trust-heading" className="pfx-section-sm" style={{ background: C.surface2 }}>
            <div className="pfx-container">
              <Reveal>
                <SectionTag center>Why Choose Us</SectionTag>
                <h2 id="trust-heading" style={{ ...T.sectionTitle, textAlign: "center", margin: "0 0 3rem 0" }}>
                  Why Clients <span style={{ color: C.teal }}>Trust Us</span>
                </h2>
              </Reveal>

              <ul className="pfx-trust-grid" role="list" style={{ listStyle: "none", margin: "0 0 2.5rem 0", padding: 0 }}>
                {TRUST.map((t, i) => (
                  <li key={t.title}>
                    <Reveal delay={i * 80}>
                      <HoverCard tealBorder style={{ height: "100%" }}>
                        <div aria-hidden="true" style={{ width: 48, height: 48, borderRadius: 12, background: C.violetSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", marginBottom: "1.125rem" }}>{t.icon}</div>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.125rem", fontWeight: 700, color: C.ink, margin: "0 0 0.75rem 0" }}>{t.title}</h3>
                        <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
                      </HoverCard>
                    </Reveal>
                  </li>
                ))}
              </ul>

              <Reveal delay={200}>
                <ul aria-label="Trust certifications" style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center", listStyle: "none", margin: 0, padding: 0 }}>
                  {TRUST_BADGES.map((b) => (
                    <li key={b} style={{ fontSize: "0.875rem", fontWeight: 500, color: C.muted }}>{b}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* ══════════════════════════════
              CTA / CONTACT
          ══════════════════════════════ */}
          <section
            id="contact"
            aria-labelledby="contact-heading"
            style={{ background: "linear-gradient(135deg,#06050e 0%,#160d2a 50%,#061515 100%)", padding: "8rem 2.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}
          >
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 50%,rgba(108,71,255,0.1) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 80% 20%,rgba(0,196,154,0.07) 0%,transparent 60%)` }} />

            <div className="pfx-container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <Reveal>
                <div style={{ display: "inline-block", padding: "5px 16px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  Accepting New Projects
                </div>

                <h2 id="contact-heading" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem,5vw,3.75rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", margin: "0 0 1rem 0", lineHeight: 1.15 }}>
                  Let's Build Something
                  <br />
                  <span style={{ color: C.teal }}>Great Together</span>
                </h2>

                <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem", maxWidth: 460, marginLeft: "auto", marginRight: "auto", fontWeight: 300, lineHeight: 1.8 }}>
                  Have an idea? We help startups and businesses turn visions into polished, scalable digital products.
                </p>

                <div className="pfx-cta-actions" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
                  <MagneticBtn
                    href="mailto:perfexiafreelancing@gmail.com"
                    style={T.btnTeal}
                    ariaLabel="Email Perfexia to start your project"
                  >
                    Start with Perfexia →
                  </MagneticBtn>
                  <MagneticBtn
                    href="https://linkedin.com/in/perfexia-freelancing"
                    target="_blank"
                    rel="noopener noreferrer"
                    ariaLabel="Connect with Perfexia on LinkedIn (opens in new tab)"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "1rem 2.25rem", border: "1.5px solid rgba(255,255,255,0.2)", color: "white", borderRadius: 100, fontSize: "1rem", fontWeight: 500, background: "transparent", textDecoration: "none" }}
                  >
                    Connect on LinkedIn
                  </MagneticBtn>
                </div>

                <ul className="pfx-cta-perks" role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {CTA_PERKS.map((p) => (
                    <li key={p} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", display: "flex", gap: 5, alignItems: "center" }}>
                      <span aria-hidden="true" style={{ color: C.teal, fontWeight: 700 }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={200}>
                <address style={{ marginTop: "3.5rem", paddingTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", fontStyle: "normal" }}>
                  <a href="mailto:perfexiafreelancing@gmail.com" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                    ✉ perfexiafreelancing@gmail.com
                  </a>
                  <a href="https://linkedin.com/in/perfexia-freelancing" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                    in Perfexia Freelancing
                  </a>
                </address>
              </Reveal>
            </div>
          </section>

        </main>

        {/* ══════════════════════════════
            FOOTER
        ══════════════════════════════ */}
        <footer role="contentinfo" style={{ background: "#030208", padding: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="pfx-container">
            <div className="pfx-footer-inner">
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("home"); }} aria-label="Perfexia — back to top" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "white", textDecoration: "none" }}>
                Perfexia<span style={{ color: C.teal }}>.in</span>
              </a>

              <nav aria-label="Footer navigation">
                <ul className="pfx-footer-links" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {FOOTER_ITEMS.map((l) => (
                    <li key={l}>
                      <button
                        type="button"
                        onClick={() => scrollTo(l.toLowerCase())}
                        aria-label={`Navigate to ${l} section`}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif", transition: "color 0.2s ease" }}
                      >
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <small style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.2)" }}>
                © 2026 Perfexia Freelancing. All rights reserved.
              </small>
            </div>
          </div>
        </footer>

        {/* Floating CTA */}
        <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 200 }}>
          <MagneticBtn
            onClick={() => scrollTo("contact")}
            ariaLabel="Book a free consultation with Perfexia"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0.75rem 1.5rem", background: `linear-gradient(135deg,${C.violet},${C.teal})`, color: "white", borderRadius: 100, fontSize: "0.875rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 8px 28px rgba(108,71,255,0.4)", whiteSpace: "nowrap" }}
          >
            📞 Free Consultation
          </MagneticBtn>
        </div>
      </div>
    </>
  );
};

export default PerfexiaPortfolio;