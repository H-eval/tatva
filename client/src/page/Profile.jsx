import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════════════════
   FLOATING PARTICLES  — tiny data-pixel squares drifting upward
══════════════════════════════════════════════════════════════ */
const Particles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${6 + Math.random() * 88}%`,
      size: Math.random() * 3 + 1.5,
      delay: Math.random() * 9,
      duration: Math.random() * 10 + 13,
      opacity: Math.random() * 0.22 + 0.05,
    })), []
  );

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position: "absolute",
          bottom: "-12px",
          left: p.left,
          width: p.size,
          height: p.size,
          background: "rgba(139,92,246,0.85)",
          boxShadow: "0 0 4px rgba(139,92,246,0.5)",
          borderRadius: 1,
          opacity: p.opacity,
          animation: `particleDrift ${p.duration}s ${p.delay}s infinite linear`,
        }} />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   CYBER GRID HERO — vivid grid top half, seamless blend below
══════════════════════════════════════════════════════════════ */
const CyberHero = () => (
  <div style={{
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "80vh",
    zIndex: 0,
    pointerEvents: "none",
    overflow: "hidden",
  }}>
    {/* The animated cyber grid — full opacity, page bg color */}
    <div className="cyber-pattern" style={{ position: "absolute", inset: 0 }} />

    {/* 
      PRIMARY BLEND: strong bottom fade using exact page bg colors.
      Starts transparent, goes fully opaque by 75% so the grid is
      completely gone before the Personal Info card ends.
    */}
    <div style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(
        to bottom,
        transparent          0%,
        transparent          15%,
        rgba(0,0,0,0.25)     35%,
        rgba(0,0,0,0.65)     52%,
        rgba(0,0,0,0.88)     63%,
        #000000              75%,
        #000000              100%
      )`,
    }} />

    {/* SIDE VIGNETTES: darken left/right edges so grid doesn't hit the viewport border hard */}
    <div style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(
        to right,
        #000 0%,
        transparent 12%,
        transparent 88%,
        #000 100%
      )`,
    }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════
   NEBULA BLOBS  — slow aurora drifting behind all content
══════════════════════════════════════════════════════════════ */
const NebulaBackground = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
    <div style={{
      position: "absolute", top: "-20%", left: "-15%",
      width: 700, height: 700, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(88,28,220,0.16) 0%, transparent 70%)",
      filter: "blur(80px)",
      animation: "nebula1 22s ease-in-out infinite alternate",
      willChange: "transform",
    }} />
    <div style={{
      position: "absolute", bottom: "-25%", right: "-10%",
      width: 820, height: 820, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(29,78,216,0.13) 0%, transparent 70%)",
      filter: "blur(90px)",
      animation: "nebula2 28s ease-in-out infinite alternate",
      willChange: "transform",
    }} />
    <div style={{
      position: "absolute", top: "40%", left: "35%",
      width: 500, height: 500, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)",
      filter: "blur(70px)",
      animation: "nebula3 18s ease-in-out infinite alternate",
      willChange: "transform",
    }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════
   SHIMMER SKELETON
══════════════════════════════════════════════════════════════ */
const ShimmerRow = ({ index }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 165px",
    alignItems: "center", padding: "18px 20px",
    borderRadius: 12, marginBottom: 12, background: "#1a1a2e",
    border: "1px solid rgba(255,255,255,0.05)",
    opacity: 0,
    animation: `shimmerFadeIn 0.4s ease ${index * 80}ms forwards`,
  }}>
    {[...Array(5)].map((_, i) => (
      <div key={i} style={{
        height: i === 4 ? 34 : 18,
        width: i === 4 ? 110 : "65%",
        borderRadius: 7,
        background: "linear-gradient(90deg,#1f2a45 25%,#2a3a5c 50%,#1f2a45 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmerSlide 1.6s infinite linear",
      }} />
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   COUNT-UP HOOK
══════════════════════════════════════════════════════════════ */
function useCountUp(target, duration = 1500, decimals = 2, active = false) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!active) return;
    const n = parseFloat(target) || 0;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(parseFloat((e * n).toFixed(decimals)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, active, duration, decimals]);
  return val;
}

/* ══════════════════════════════════════════════════════════════
   STAT CARD  — corner expand animation (uiverse eslam-hany style)
══════════════════════════════════════════════════════════════ */
const StatCard = ({ label, value, accentColor, decimals = 0, delay = 0, loaded }) => {
  const animated = useCountUp(value, 1400, decimals, loaded);

  return (
    <div style={{
      position: "relative",
      padding: "26px 28px",
      borderRadius: 15,
      background: `rgba(${accentColor.match(/\d+/g).join(",")},0.07)`,
      border: "1px solid rgba(255,255,255,0.06)",
      overflow: "hidden",
      opacity: 0,
      animation: `sectionSlideUp 0.6s ease ${delay}ms forwards`,
      cursor: "default",
      minHeight: 120,
    }}
    className="stat-card"
    >
      <span className="stat-corner stat-corner--tr" style={{ "--accent": accentColor }} />
      <span className="stat-corner stat-corner--bl" style={{ "--accent": accentColor }} />

      <p style={{
        position: "relative", zIndex: 2,
        color: "#6b7280", fontSize: "0.75rem", margin: "0 0 12px",
        textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700,
      }}>
        {label}
      </p>
      <p style={{
        position: "relative", zIndex: 2,
        color: accentColor, fontSize: "2.4rem", fontWeight: 800, margin: 0,
        fontVariantNumeric: "tabular-nums",
      }}>
        {decimals > 0 ? animated.toFixed(decimals) : Math.round(animated)}
      </p>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   AVG SCORE CELL
══════════════════════════════════════════════════════════════ */
const AvgScoreCell = ({ score, inView }) => {
  const num = parseFloat(score) || 0;
  const animated = useCountUp(num, 1500, 2, inView);
  const color = num > 2.0 ? "#4ade80" : num >= 1.5 ? "#fbbf24" : "#f87171";
  const glow  = num > 2.0 ? "rgba(74,222,128,0.4)" : num >= 1.5 ? "rgba(251,191,36,0.4)" : "rgba(248,113,113,0.4)";
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span style={{ color, fontWeight: 700, fontSize: "1.1rem", fontVariantNumeric: "tabular-nums" }}>
        {score != null ? animated.toFixed(2) : "N/A"}
      </span>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SENTENCES PROGRESS PILL
══════════════════════════════════════════════════════════════ */
const SentencesPill = ({ count, max }) => {
  const pct = max > 0 ? Math.min((count / max) * 100, 100) : 0;
  return (
    <div>
      <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{count}</span>
      <div style={{ marginTop: 6, height: 5, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden", width: 80 }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: "linear-gradient(90deg,#a855f7,#3b82f6)", transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   HISTORY ROW
══════════════════════════════════════════════════════════════ */
const HistoryRow = ({ item, index, maxEvals, navigate }) => {
  const rowRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 165px",
        alignItems: "center", padding: "18px 20px",
        borderRadius: 12, marginBottom: 12,
        background: hovered ? "#1e2540" : "#1a1a2e",
        border: `1px solid ${hovered ? "rgba(96,165,250,0.3)" : "rgba(255,255,255,0.06)"}`,
        transform: hovered ? "scale(1.008)" : "scale(1)",
        boxShadow: hovered ? "0 8px 32px rgba(96,165,250,0.1)" : "0 2px 8px rgba(0,0,0,0.3)",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
        opacity: 0,
        animation: `rowSlideUp 0.5s ease ${index * 100}ms forwards`,
        cursor: "default",
      }}
    >
      <div>
        <p style={{ color: "#f1f5f9", fontWeight: 600, marginBottom: 3, fontSize: "0.95rem" }}>Translation Batch</p>
        <p style={{ color: "rgba(148,163,184,0.6)", fontSize: "0.78rem", fontFamily: "monospace" }}>{item.batchId.slice(0, 8)}…</p>
      </div>
      <SentencesPill count={item.totalEvaluations} max={maxEvals} />
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>{new Date(item.lastEvaluation).toLocaleDateString()}</p>
      </div>
      <AvgScoreCell score={item.avgScore} inView={inView} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="cssbuttons-io-button"
          onClick={() => navigate(`/batch-analysis/${item.batchId}`)}
        >
          View Analysis
          <span className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN PROFILE COMPONENT
══════════════════════════════════════════════════════════════ */
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser]     = useState(null);
  const [stats, setStats]   = useState({ totalEvaluations: 0, bestScore: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded]   = useState(false);
  const headerRef = useRef(null);
  const [headerStuck, setHeaderStuck] = useState(false);

  /* Sticky header sentinel */
  useEffect(() => {
    const sentinel = document.getElementById("table-sentinel");
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([e]) => setHeaderStuck(!e.isIntersecting),
      { threshold: 1 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [loading]);

  /* Data fetch — consolidated Promise.all */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("http://localhost:5000/api/auth/me",           { headers: h }).then(r => r.json()),
      fetch("http://localhost:5000/api/evaluator/stats",   { headers: h }).then(r => r.json()),
      fetch("http://localhost:5000/api/evaluator/history", { headers: h }).then(r => r.json()),
    ])
      .then(([u, s, hist]) => {
        setUser(u);
        setStats(s);
        setHistory(Array.isArray(hist) ? hist : []);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setTimeout(() => setLoaded(true), 350);
      });
  }, []);

  const maxEvals = history.length ? Math.max(...history.map(h => h.totalEvaluations)) : 1;

  return (
    <>
      {/* ════ GLOBAL STYLES ════════════════════════════════════ */}
      <style>{`
        /* ── Cyber Grid Pattern ─────────────────────────────── */
        .cyber-pattern {
          width: 100%;
          height: 100%;
          /* Match the page background exactly so blending is seamless */
          background-color: #000000;
          background-image:
            /* NO radial vignette here — we handle blending with separate overlay divs */
            /* Large cyan grid */
            linear-gradient(rgba(3,233,244,0.28) 1px, transparent 1px),
            linear-gradient(90deg, rgba(3,233,244,0.28) 1px, transparent 1px),
            /* Small magenta grid */
            linear-gradient(rgba(217,3,244,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217,3,244,0.12) 1px, transparent 1px);
          background-size:
            60px 60px,
            60px 60px,
            20px 20px,
            20px 20px;
          animation: cyber-move 10s linear infinite;
        }

        @keyframes cyber-move {
          0% {
            background-position: 0 0, 0 0, 0 0, 0 0;
          }
          100% {
            background-position: 60px 60px, 60px 60px, 40px 40px, 40px 40px;
          }
        }

        /* ── Existing keyframes ─────────────────────────────── */
        @keyframes shimmerSlide {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes shimmerFadeIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes rowSlideUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes sectionSlideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes nebula1 {
          0%   { transform: translate(0px,0px) scale(1); }
          100% { transform: translate(80px,60px) scale(1.15); }
        }
        @keyframes nebula2 {
          0%   { transform: translate(0px,0px) scale(1); }
          100% { transform: translate(-60px,-80px) scale(1.1); }
        }
        @keyframes nebula3 {
          0%   { transform: translate(0px,0px) scale(1); }
          100% { transform: translate(40px,50px) scale(0.9); }
        }
        /* ── Stat Card Corner Expand ────────────────────────── */
        .stat-corner {
          position: absolute;
          content: "";
          width: 28%;
          height: 45%;
          background-color: var(--accent);
          transition: all 0.5s ease-in-out;
          opacity: 0.18;
          z-index: 1;
        }
        .stat-corner--tr {
          top: 0; right: 0;
          border-radius: 0 15px 0 100%;
        }
        .stat-corner--bl {
          bottom: 0; left: 0;
          border-radius: 0 100% 0 15px;
        }
        .stat-card:hover .stat-corner {
          width: 100%;
          height: 100%;
          border-radius: 15px;
          opacity: 0.12;
        }


        .cssbuttons-io-button {
          background: #1a1f3a;
          color: #e2e8f0;
          font-family: 'DM Sans', inherit;
          padding: 0.35em;
          padding-left: 1.2em;
          font-size: 14px;
          font-weight: 500;
          border-radius: 0.9em;
          border: 1px solid rgba(96,165,250,0.2);
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          box-shadow: inset 0 0 1.6em -0.6em rgba(96,165,250,0.25);
          overflow: hidden;
          position: relative;
          height: 2.8em;
          padding-right: 3.3em;
          cursor: pointer;
          transition: border-color 0.3s, box-shadow 0.3s, color 0.3s;
          white-space: nowrap;
        }
        .cssbuttons-io-button:hover {
          border-color: rgba(96,165,250,0.5);
          box-shadow: inset 0 0 1.6em -0.6em rgba(96,165,250,0.45), 0 0 14px rgba(96,165,250,0.12);
          color: transparent;
        }
        .cssbuttons-io-button .icon {
          background: rgb(96,165,250);
          margin-left: 1em;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 2.2em;
          width: 2.2em;
          border-radius: 0.7em;
          box-shadow: 0.1em 0.1em 0.6em 0.2em rgba(96,165,250,0.3);
          right: 0.3em;
          transition: all 0.3s;
        }
        .cssbuttons-io-button:hover .icon {
          width: calc(100% - 0.6em);
          background: rgb(96,165,250);
        }
        .cssbuttons-io-button .icon svg {
          width: 1.1em;
          transition: transform 0.3s;
          color: #1a1f3a;
        }
        .cssbuttons-io-button:hover .icon svg {
          transform: translateX(0.1em);
          color: #1a1f3a;
        }
        .cssbuttons-io-button:active .icon {
          transform: scale(0.95);
        }
        .cssbuttons-io-button:focus { outline: none; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0px) rotate(0deg); }
          80%  { opacity: inherit; }
          100% { transform: translateY(-102vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* ════ FIXED BACKGROUND LAYERS ══════════════════════════ */}
      <NebulaBackground />
      <Particles />

      {/* ════ PAGE SHELL ═══════════════════════════════════════ */}
      <div style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        background: "#000000",
        color: "#fff",
        paddingBottom: 80,
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}>

        {/* ── CYBER GRID HERO (top-half background) ─────────── */}
        <CyberHero />

        {/* ── CONTENT (sits above the grid) ─────────────────── */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 0" }}>

            {/* ── HEADER ─────────────────────────────────────── */}
            <div style={{
              marginBottom: 72,
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              opacity: 0,
              animation: "sectionSlideUp 0.7s ease 0ms forwards",
            }}>
              <div>
                <h1 style={{
                  fontSize: "clamp(2.5rem,5vw,3.8rem)", fontWeight: 900,
                  color: "#60a5fa", lineHeight: 1.1, margin: 0,
                }}>
                  Your Evaluator
                </h1>
                <h1 style={{
                  fontSize: "clamp(2.5rem,5vw,3.8rem)", fontWeight: 900,
                  color: "rgba(255,255,255,0.92)", lineHeight: 1.1, margin: 0,
                }}>
                  Dashboard
                </h1>
                <p style={{ marginTop: 20, color: "#94a3b8", fontSize: "1.05rem", maxWidth: 520 }}>
                  Monitor your evaluation activity, contribution insights, and overall performance within TATVA.
                </p>
              </div>

              {/* Floating Home Button */}
              <button
                onClick={() => navigate("/Home")}
                style={{
                  padding: "9px 20px", borderRadius: 10,
                  background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                  color: "#fff", fontSize: "0.85rem", fontWeight: 600,
                  border: "none", cursor: "pointer",
                  animation: "floatY 3s ease-in-out infinite",
                  boxShadow: "0 4px 22px rgba(124,58,237,0.38)",
                  transition: "box-shadow 0.22s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 32px rgba(124,58,237,0.65)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 22px rgba(124,58,237,0.38)"}
              >
                ⬅ Home
              </button>
            </div>

            {/* ── PERSONAL INFORMATION ───────────────────────── */}
            <div style={{ opacity: 0, animation: "sectionSlideUp 0.65s ease 130ms forwards", marginBottom: 56 }}>
              <style>{`
                .profile-card {
                  position: relative;
                  width: 100%;
                  border-radius: 20px;
                  overflow: hidden;
                  background: #080d1a;
                  border: 1px solid rgba(96,165,250,0.15);
                  box-shadow: 0 8px 50px rgba(0,0,0,0.55);
                }
                .profile-banner {
                  position: absolute;
                  top: 0; left: 0; right: 0;
                  height: 0;
                  background: linear-gradient(135deg, #0d2248 0%, #0a1a35 50%, #060d1f 100%);
                  transition: height 0.45s ease-in-out;
                  z-index: 0;
                  overflow: hidden;
                }
                .profile-card:hover .profile-banner { height: 132px; }
                .profile-avatar {
                  position: relative;
                  z-index: 2;
                  width: 76px; height: 76px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #2563eb, #7c3aed);
                  border: 3px solid #080d1a;
                  display: flex; align-items: center; justify-content: center;
                  font-size: 1.9rem; font-weight: 700; color: #fff;
                  flex-shrink: 0;
                  transition: transform 0.45s ease-in-out;
                  box-shadow: 0 0 0 3px rgba(96,165,250,0.2), 0 8px 24px rgba(96,165,250,0.15);
                }
                .profile-card:hover .profile-avatar { transform: scale(1.06); }
                .profile-name {
                  font-size: 1.3rem; font-weight: 700; color: #f1f5f9; margin: 0;
                  transition: color 0.3s ease-in-out;
                }
                .profile-role {
                  color: rgb(96,165,250); font-size: 0.78rem; margin: 4px 0 0;
                  font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
                }
                .profile-fields { position: relative; z-index: 2; }
                .profile-divider {
                  height: 1px;
                  background: linear-gradient(90deg, rgba(96,165,250,0.35), transparent);
                  margin-bottom: 24px;
                  position: relative;
                  z-index: 2;
                }
              `}</style>

              <div className="profile-card">
                {/* Banner: hidden at rest, expands to divider on hover */}
                <div className="profile-banner">
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: "linear-gradient(90deg, transparent 0%, rgb(96,165,250) 30%, rgb(139,92,246) 70%, transparent 100%)",
                  }} />
                </div>

                <div style={{ position: "relative", zIndex: 2, padding: "28px 36px 0" }}>
                  {/* Avatar + name — total height from top: 28 + 76 + ~16 gap + name ~20 + role ~16 = ~156px, then 12px margin-bottom = 168px to divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                    <div className="profile-avatar">
                      {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="profile-name">
                        {user?.firstName ? `${user.firstName} ${user.middleName || ""} ${user.lastName || ""}`.trim() : "Not Provided"}
                      </p>
                      <p className="profile-role">{user?.education || "TATVA Evaluator"}</p>
                    </div>
                  </div>
                </div>

                {/* Divider — sits exactly at the 168px mark where the banner stops */}
                <div className="profile-divider" style={{ margin: "0 36px 24px" }} />

                {/* Info fields — below the divider, unaffected by banner */}
                <div className="profile-fields" style={{
                  padding: "0 36px 32px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                  gap: "20px 36px",
                }}>
                  {[
                    { label: "Email",         value: user?.email || "Not Available" },
                    { label: "Languages",     value: user?.languages?.length ? user.languages.join(", ") : "Not Specified" },
                    { label: "Registered On", value: user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : "Not Available" },
                    { label: "Gender",        value: user?.gender || "Not Provided" },
                    { label: "Age",           value: user?.age ?? "Not Provided" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ color: "rgba(96,165,250,0.65)", fontSize: "0.72rem", fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
                      <p style={{ color: "#e2e8f0", fontWeight: 600, margin: 0, fontSize: "0.95rem" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 
              ╔══════════════════════════════════════════════════╗
              ║  BLEND TRANSITION ZONE                          ║
              ║  Below this point the grid has faded away and   ║
              ║  the dark nebula is all that remains.           ║
              ╚══════════════════════════════════════════════════╝
            */}

            {/* ── CONTRIBUTION OVERVIEW ──────────────────────── */}
            <h2 style={{
              fontSize: "2rem", fontWeight: 800, color: "#fff",
              marginBottom: 24, marginTop: 48,
              opacity: 0, animation: "sectionSlideUp 0.65s ease 220ms forwards",
            }}>
              Contribution Overview
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 56 }}>
              <StatCard label="Total Evaluations" value={stats.totalEvaluations} accentColor="rgb(167,139,250)"  decimals={0} delay={320} loaded={loaded} />
              <StatCard label="Batches Evaluated"  value={history.length}         accentColor="rgb(74,222,128)"   decimals={0} delay={440} loaded={loaded} />
              <StatCard label="Best Score Given"   value={stats.bestScore}        accentColor="rgb(244,114,182)"  decimals={2} delay={560} loaded={loaded} />
            </div>

            {/* ── EVALUATION HISTORY ─────────────────────────── */}
            <h2 style={{
              fontSize: "2rem", fontWeight: 800, color: "#fff",
              marginBottom: 6, marginTop: 48,
              opacity: 0, animation: "sectionSlideUp 0.65s ease 300ms forwards",
            }}>
              Evaluation History
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: 28, fontSize: "0.95rem", opacity: 0, animation: "sectionSlideUp 0.55s ease 370ms forwards" }}>
              List of translation batches you have evaluated.
            </p>

            {/* Sentinel for sticky detection */}
            <div id="table-sentinel" style={{ height: 1 }} />

            {/* Sticky column header */}
            <div
              ref={headerRef}
              style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 165px",
                padding: "12px 20px", marginBottom: 12,
                borderRadius: headerStuck ? 0 : 10,
                background: headerStuck ? "rgba(8,12,24,0.97)" : "rgba(255,255,255,0.04)",
                backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.07)",
                position: "sticky", top: 0, zIndex: 10,
                boxShadow: headerStuck ? "0 4px 30px rgba(0,0,0,0.6)" : "none",
                transition: "all 0.25s ease",
              }}
            >
              {["Dataset","Sentences Evaluated","Last Evaluation","Avg Score","Action"].map((col, i) => (
                <p key={col} style={{
                  margin: 0, fontSize: "0.73rem", fontWeight: 700,
                  color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.09em",
                  textAlign: i === 2 || i === 3 ? "center" : i === 4 ? "right" : "left",
                }}>
                  {col}
                </p>
              ))}
            </div>

            {/* Table rows / shimmer / empty state */}
            {loading ? (
              [...Array(4)].map((_, i) => <ShimmerRow key={i} index={i} />)
            ) : history.length === 0 ? (
              <p style={{ color: "#4b5563", fontSize: "1.05rem", padding: "32px 0" }}>
                No evaluation history available yet.
              </p>
            ) : (
              history.map((item, index) => (
                <HistoryRow key={index} item={item} index={index} maxEvals={maxEvals} navigate={navigate} />
              ))
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;