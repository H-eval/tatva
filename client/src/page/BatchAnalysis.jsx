import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════════════════
   FLOATING PARTICLES
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
          position: "absolute", bottom: "-12px", left: p.left,
          width: p.size, height: p.size,
          background: "rgba(139,92,246,0.85)",
          boxShadow: "0 0 4px rgba(139,92,246,0.5)",
          borderRadius: 1, opacity: p.opacity,
          animation: `particleDrift ${p.duration}s ${p.delay}s infinite linear`,
        }} />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   CYBER GRID HERO
══════════════════════════════════════════════════════════════ */
const CyberHero = () => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0,
    height: "80vh", zIndex: 0, pointerEvents: "none", overflow: "hidden",
  }}>
    <div className="cyber-pattern" style={{ position: "absolute", inset: 0 }} />
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(
        to bottom,
        transparent 0%, transparent 15%,
        rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.65) 52%,
        rgba(0,0,0,0.88) 63%, #000000 75%, #000000 100%
      )`,
    }} />
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(to right, #000 0%, transparent 12%, transparent 88%, #000 100%)`,
    }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════
   NEBULA BLOBS
══════════════════════════════════════════════════════════════ */
const NebulaBackground = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
    <div style={{
      position: "absolute", top: "-20%", left: "-15%",
      width: 700, height: 700, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(88,28,220,0.16) 0%, transparent 70%)",
      filter: "blur(80px)", animation: "nebula1 22s ease-in-out infinite alternate", willChange: "transform",
    }} />
    <div style={{
      position: "absolute", bottom: "-25%", right: "-10%",
      width: 820, height: 820, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(29,78,216,0.13) 0%, transparent 70%)",
      filter: "blur(90px)", animation: "nebula2 28s ease-in-out infinite alternate", willChange: "transform",
    }} />
    <div style={{
      position: "absolute", top: "40%", left: "35%",
      width: 500, height: 500, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)",
      filter: "blur(70px)", animation: "nebula3 18s ease-in-out infinite alternate", willChange: "transform",
    }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════
   SHIMMER SKELETON
══════════════════════════════════════════════════════════════ */
const ShimmerTableRow = ({ index, cols = 5 }) => (
  <tr style={{ opacity: 0, animation: `shimmerFadeIn 0.4s ease ${index * 70}ms forwards` }}>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} style={{ padding: "16px 12px" }}>
        <div style={{
          height: 16, width: i === 0 ? "80%" : i === cols - 1 ? 70 : "60%",
          borderRadius: 6,
          background: "linear-gradient(90deg,#1f2a45 25%,#2a3a5c 50%,#1f2a45 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmerSlide 1.6s infinite linear",
        }} />
      </td>
    ))}
  </tr>
);

/* ══════════════════════════════════════════════════════════════
   COUNT-UP HOOK
══════════════════════════════════════════════════════════════ */
function useCountUp(target, duration = 1200, decimals = 0, active = false) {
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
   ACCORDION STAT CARD
══════════════════════════════════════════════════════════════ */
const AccordionStatCard = ({ label, value, color, suffix = "" }) => {
  const [hovered, setHovered] = useState(false);
  const rgb = color.match(/\d+/g).join(",");

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: hovered ? 4 : 1,
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: 10,
        transition: "flex 0.55s cubic-bezier(0.4,0,0.2,1), background 0.4s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: hovered ? `rgba(${rgb},0.14)` : `rgba(${rgb},0.08)`,
        border: `1px solid rgba(${rgb},0.18)`,
        minWidth: 0,
      }}
    >
      {/* Corner expand accent */}
      <span style={{
        position: "absolute", top: 0, right: 0,
        width: hovered ? "100%" : "28%",
        height: hovered ? "100%" : "45%",
        background: color,
        borderRadius: hovered ? 10 : "0 10px 0 100%",
        opacity: hovered ? 0.1 : 0.18,
        transition: "all 0.5s ease-in-out",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      <span style={{
        position: "absolute", bottom: 0, left: 0,
        width: hovered ? "100%" : "28%",
        height: hovered ? "100%" : "45%",
        background: color,
        borderRadius: hovered ? 10 : "0 100% 0 10px",
        opacity: hovered ? 0.1 : 0.18,
        transition: "all 0.5s ease-in-out",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Collapsed: word-per-line label */}
      <div style={{
        opacity: hovered ? 0 : 1,
        transition: "opacity 0.25s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        position: hovered ? "absolute" : "relative",
        pointerEvents: hovered ? "none" : "auto",
        zIndex: 2,
        padding: "0 4px",
      }}>
        {label.split(" ").map((word, idx) => (
          <span key={idx} style={{
            fontSize: "0.62rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color,
            lineHeight: 1.2,
            textAlign: "center",
            fontFamily: "'DM Sans','Segoe UI',sans-serif",
          }}>
            {word}
          </span>
        ))}
        <span style={{ fontSize: 8, color, opacity: 0.4, marginTop: 2 }}>◆</span>
      </div>

      {/* Expanded: label + value */}
      <div style={{
        position: "absolute",
        opacity: hovered ? 1 : 0,
        pointerEvents: hovered ? "auto" : "none",
        transition: "opacity 0.35s ease 0.18s",
        padding: "20px 22px",
        width: "100%",
        boxSizing: "border-box",
        zIndex: 2,
      }}>
        <p style={{
          fontSize: "0.7rem", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "#6b7280", margin: "0 0 10px",
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
        }}>
          {label}
        </p>
        <p style={{
          fontSize: "2.4rem", fontWeight: 800,
          color, margin: 0,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
        }}>
          {value}{suffix}
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SCORE BADGE
══════════════════════════════════════════════════════════════ */
const ScoreBadge = ({ score }) => {
  const num = parseFloat(score) || 0;
  const color = num > 2.0 ? "#4ade80" : num >= 1.5 ? "#fbbf24" : "#f87171";
  return (
    <span style={{ color, fontWeight: 700, fontSize: "1rem", fontVariantNumeric: "tabular-nums" }}>
      {score ?? "N/A"}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════
   SENTENCE GROUP — shared hover state across all translation rows
══════════════════════════════════════════════════════════════ */
const SentenceGroup = ({ item, globalStartIndex, navigate }) => {
  const [groupHovered, setGroupHovered] = useState(false);
  const groupBorder = "1px solid rgba(255,255,255,0.1)";
  const subBorder   = "1px solid rgba(255,255,255,0.04)";

  const cellBg = {
    background: groupHovered ? "rgba(22,32,60,0.85)" : "transparent",
    transition: "background 0.22s ease",
  };

  return (
    <>
      {item.translations.map((t, j) => {
        const isLastInGroup = j === item.translations.length - 1;
        const borderBottom  = isLastInGroup ? groupBorder : subBorder;
        const idx           = globalStartIndex + j;

        return (
          <tr
            key={j}
            onMouseEnter={() => setGroupHovered(true)}
            onMouseLeave={() => setGroupHovered(false)}
            style={{ opacity: 0, animation: `rowSlideUp 0.45s ease ${idx * 65}ms forwards` }}
          >
            {/* English sentence — only on first row, spans all translations */}
            {j === 0 && (
              <td rowSpan={item.translations.length} style={{
                ...cellBg,
                padding: "22px 22px",
                verticalAlign: "middle",
                /* subtle blue — visible in both rest and hover states */
                color: groupHovered ? "#93c5fd" : "#7db4e8",
                fontWeight: 600,
                fontSize: "0.88rem",
                lineHeight: 1.7,
                borderBottom: groupBorder,
                width: "28%",
                borderLeft: groupHovered
                  ? "3px solid rgba(96,165,250,0.6)"
                  : "3px solid rgba(96,165,250,0.18)",
                transition: "background 0.22s ease, border-left 0.22s ease, color 0.22s ease",
              }}>
                {item.sentence}
              </td>
            )}

            {/* Translation text */}
            <td style={{
              ...cellBg,
              padding: "18px 18px",
              color: "#94a3b8",
              fontSize: "0.87rem",
              lineHeight: 1.65,
              borderBottom,
              width: "33%",
              verticalAlign: "middle",
            }}>
              {t.translationText}
            </td>

            {/* Translator */}
            <td style={{
              ...cellBg,
              padding: "18px 14px",
              textAlign: "center",
              color: "#64748b",
              fontSize: "0.81rem",
              borderBottom,
              verticalAlign: "middle",
              whiteSpace: "nowrap",
            }}>
              {t.translator}
            </td>

            {/* Score */}
            <td style={{
              ...cellBg,
              padding: "18px 14px",
              textAlign: "center",
              borderBottom,
              verticalAlign: "middle",
            }}>
              <ScoreBadge score={t.avgScore} />
            </td>

            {/* Action */}
            <td style={{
              ...cellBg,
              padding: "18px 16px",
              textAlign: "center",
              borderBottom,
              verticalAlign: "middle",
            }}>
              <button
                onClick={() => navigate(`/translationDetails/${t.translationId}`)}
                className="cssbuttons-io-button"
                style={{ fontSize: 12, height: "2.2em", paddingLeft: "0.9em", paddingRight: "2.6em", margin: "0 auto" }}
              >
                View
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const BatchAnalysis = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalSentences: 0, evaluatedSentences: 0,
    averageScore: 0, lastEvaluation: null, criteriaUsed: [],
  });
  const [sentenceData, setSentenceData] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [loaded, setLoaded]     = useState(false);
  const [headerStuck, setHeaderStuck] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("table-sentinel");
    if (!sentinel) return;
    const obs = new IntersectionObserver(([e]) => setHeaderStuck(!e.isIntersecting), { threshold: 1 });
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [loading]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`http://localhost:5000/api/evaluator/batchStats/${batchId}`,          { headers: h }).then(r => r.json()),
      fetch(`http://localhost:5000/api/evaluator/sentenceEvaluations/${batchId}`, { headers: h }).then(r => r.json()),
    ])
      .then(([s, sd]) => { setStats(s); setSentenceData(Array.isArray(sd) ? sd : []); })
      .catch(console.error)
      .finally(() => { setLoading(false); setTimeout(() => setLoaded(true), 300); });
  }, [batchId]);

  const progressPct = stats.totalSentences > 0
    ? Math.max((stats.evaluatedSentences / stats.totalSentences) * 100, 1) : 0;

  // Animated values for progress bar label
  const animEvaluated = useCountUp(stats.evaluatedSentences, 1200, 0, loaded);
  const animTotal     = useCountUp(stats.totalSentences,     1200, 0, loaded);

  let globalRowIndex = 0;

  return (
    <>
      {/* ════ GLOBAL STYLES ════════════════════════════════════ */}
      <style>{`
        .cyber-pattern {
          width: 100%; height: 100%;
          background-color: #000000;
          background-image:
            linear-gradient(rgba(3,233,244,0.28) 1px, transparent 1px),
            linear-gradient(90deg, rgba(3,233,244,0.28) 1px, transparent 1px),
            linear-gradient(rgba(217,3,244,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217,3,244,0.12) 1px, transparent 1px);
          background-size: 60px 60px, 60px 60px, 20px 20px, 20px 20px;
          animation: cyber-move 10s linear infinite;
        }
        @keyframes cyber-move {
          0%   { background-position: 0 0, 0 0, 0 0, 0 0; }
          100% { background-position: 60px 60px, 60px 60px, 40px 40px, 40px 40px; }
        }
        @keyframes shimmerSlide {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes shimmerFadeIn {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes rowSlideUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes sectionSlideUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes nebula1 {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(80px,60px) scale(1.15); }
        }
        @keyframes nebula2 {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(-60px,-80px) scale(1.1); }
        }
        @keyframes nebula3 {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(40px,50px) scale(0.9); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0) rotate(0deg); }
          80%  { opacity: inherit; }
          100% { transform: translateY(-102vh) rotate(360deg); opacity:0; }
        }

        /* ── View button ── */
        .cssbuttons-io-button {
          background: #1a1f3a;
          color: #e2e8f0;
          font-family: 'DM Sans', inherit;
          padding: 0.35em; padding-left: 1.2em;
          font-size: 14px; font-weight: 500;
          border-radius: 0.9em;
          border: 1px solid rgba(96,165,250,0.2);
          letter-spacing: 0.04em;
          display: flex; align-items: center;
          box-shadow: inset 0 0 1.6em -0.6em rgba(96,165,250,0.25);
          overflow: hidden; position: relative;
          height: 2.8em; padding-right: 3.3em;
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
          margin-left: 1em; position: absolute;
          display: flex; align-items: center; justify-content: center;
          height: 2.2em; width: 2.2em; border-radius: 0.7em;
          box-shadow: 0.1em 0.1em 0.6em 0.2em rgba(96,165,250,0.3);
          right: 0.3em; transition: all 0.3s;
        }
        .cssbuttons-io-button:hover .icon { width: calc(100% - 0.6em); background: rgb(96,165,250); }
        .cssbuttons-io-button .icon svg { width: 1.1em; transition: transform 0.3s; color: #1a1f3a; }
        .cssbuttons-io-button:hover .icon svg { transform: translateX(0.1em); color: #1a1f3a; }
        .cssbuttons-io-button:active .icon { transform: scale(0.95); }
        .cssbuttons-io-button:focus { outline: none; }

        /* ── 3D Spinner (uiverse AqFox — enhanced) ──────────── */
        .spinner {
          width: 64px; height: 64px;
          animation: spinner-y0fdc1 2.4s infinite ease;
          transform-style: preserve-3d;
        }
        .spinner > div {
          height: 100%; position: absolute;
          width: 100%;
          border: 2px solid rgba(120,180,255,0.9);
        }
        /* back  */ .spinner div:nth-of-type(1) {
          transform: translateZ(-32px) rotateY(180deg);
          background: rgba(59,130,246,0.15);
          border-color: rgba(96,165,250,0.7);
        }
        /* right */ .spinner div:nth-of-type(2) {
          transform: rotateY(-270deg) translateX(50%);
          transform-origin: top right;
          background: rgba(124,58,237,0.18);
          border-color: rgba(167,139,250,0.8);
        }
        /* left  */ .spinner div:nth-of-type(3) {
          transform: rotateY(270deg) translateX(-50%);
          transform-origin: center left;
          background: rgba(6,182,212,0.15);
          border-color: rgba(34,211,238,0.7);
        }
        /* top   */ .spinner div:nth-of-type(4) {
          transform: rotateX(90deg) translateY(-50%);
          transform-origin: top center;
          background: rgba(96,165,250,0.22);
          border-color: rgba(147,197,253,0.9);
        }
        /* bottom*/ .spinner div:nth-of-type(5) {
          transform: rotateX(-90deg) translateY(50%);
          transform-origin: bottom center;
          background: rgba(139,92,246,0.15);
          border-color: rgba(196,181,253,0.7);
        }
        /* front */ .spinner div:nth-of-type(6) {
          transform: translateZ(32px);
          background: rgba(37,99,235,0.25);
          border-color: rgba(147,197,253,1);
          box-shadow: inset 0 0 18px rgba(96,165,250,0.3);
        }
        @keyframes spinner-y0fdc1 {
          0%   { transform: rotate(45deg) rotateX(-25deg) rotateY(25deg); }
          50%  { transform: rotate(45deg) rotateX(-385deg) rotateY(25deg); }
          100% { transform: rotate(45deg) rotateX(-385deg) rotateY(385deg); }
        }
      `}</style>

      {/* ════ FIXED BACKGROUND LAYERS ══════════════════════════ */}
      <NebulaBackground />
      <Particles />

      {/* ════ PAGE SHELL ═══════════════════════════════════════ */}
      <div style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh",
        background: "#000000",
        color: "#fff",
        paddingBottom: 80,
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}>
        <CyberHero />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 0" }}>

            {/* ── HEADER ─────────────────────────────────────── */}
            <div style={{
              marginBottom: 72,
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              opacity: 0, animation: "sectionSlideUp 0.7s ease 0ms forwards",
            }}>
              <div>
                <h1 style={{
                  fontSize: "clamp(2.2rem,5vw,3.6rem)", fontWeight: 900,
                  color: "#60a5fa", lineHeight: 1.1, margin: 0,
                }}>
                  Evaluation Analysis
                </h1>
                <p style={{ marginTop: 18, color: "#94a3b8", fontSize: "1rem", maxWidth: 520 }}>
                  Explore evaluation insights and analytics for this translation batch.
                </p>
              </div>

              <button
                onClick={() => navigate("/profile")}
                style={{
                  padding: "9px 20px", borderRadius: 10,
                  background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                  color: "#fff", fontSize: "0.85rem", fontWeight: 600,
                  border: "none", cursor: "pointer", flexShrink: 0,
                  animation: "floatY 3s ease-in-out infinite",
                  boxShadow: "0 4px 22px rgba(124,58,237,0.38)",
                  transition: "box-shadow 0.22s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 32px rgba(124,58,237,0.65)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 22px rgba(124,58,237,0.38)"}
              >
                ⬅ Back
              </button>
            </div>

            {/* ── EVALUATION INFORMATION ─────────────────────── */}
            <div style={{
              background: "#080d1a",
              border: "1px solid rgba(96,165,250,0.12)",
              borderRadius: 20,
              padding: "32px 36px",
              marginBottom: 56,
              opacity: 0, animation: "sectionSlideUp 0.65s ease 120ms forwards",
            }}>
              {/* Top glow line */}
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", top: -32, left: -36, right: -36, height: 2,
                  background: "linear-gradient(90deg, transparent 0%, rgb(96,165,250) 30%, rgb(139,92,246) 70%, transparent 100%)",
                  borderRadius: "20px 20px 0 0",
                }} />
              </div>

              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", margin: "0 0 28px" }}>
                Evaluation Information
              </h2>

              {/* ── ACCORDION STAT CARDS ── */}
              <div style={{
                display: "flex",
                gap: 6,
                padding: 6,
                background: "rgba(255,255,255,0.02)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.05)",
                height: 160,
                marginBottom: 28,
              }}>
                <AccordionStatCard
                  label="Total Sentences"
                  value={stats.totalSentences}
                  color="rgb(167,139,250)"
                />
                <AccordionStatCard
                  label="Sentences Evaluated"
                  value={stats.evaluatedSentences}
                  color="rgb(74,222,128)"
                />
                <AccordionStatCard
                  label="Evaluation Progress"
                  value={
                    stats.totalSentences > 0
                      ? ((stats.evaluatedSentences / stats.totalSentences) * 100).toFixed(1)
                      : "0.0"
                  }
                  color="rgb(96,165,250)"
                  suffix="%"
                />
              </div>

              {/* Progress bar */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ color: "#6b7280", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                    Completion
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: 0 }}>
                    {stats.totalSentences > 0
                      ? `${Math.round(animEvaluated)} / ${Math.round(animTotal)} sentences`
                      : "0 sentences"}
                  </p>
                </div>
                <div style={{ width: "100%", height: 8, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 999,
                    background: "linear-gradient(90deg, #7c3aed, #3b82f6)",
                    width: loaded ? `${progressPct.toFixed(1)}%` : "0%",
                    transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                  }} />
                </div>
              </div>
            </div>

            {/* ── SENTENCE EVALUATION SUMMARY ────────────────── */}
            <h2 style={{
              fontSize: "2rem", fontWeight: 800, color: "#fff",
              marginBottom: 8,
              opacity: 0, animation: "sectionSlideUp 0.65s ease 300ms forwards",
            }}>
              Sentence Evaluation Summary
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: 28, opacity: 0, animation: "sectionSlideUp 0.55s ease 370ms forwards" }}>
              Per-sentence breakdown of translations and scores in this batch.
            </p>

            <div id="table-sentinel" style={{ height: 1 }} />

            {/* Sticky column header */}
            <div style={{
              display: "grid", gridTemplateColumns: "28fr 33fr 14fr 12fr 13fr",
              padding: "12px 20px", marginBottom: 0,
              borderRadius: headerStuck ? 0 : "10px 10px 0 0",
              background: headerStuck ? "rgba(8,12,24,0.97)" : "rgba(255,255,255,0.04)",
              backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderBottom: "none",
              position: "sticky", top: 0, zIndex: 10,
              boxShadow: headerStuck ? "0 4px 30px rgba(0,0,0,0.6)" : "none",
              transition: "all 0.25s ease",
            }}>
              {["English Sentence", "Translation", "Translator", "Score", "Action"].map((col, i) => (
                <p key={col} style={{
                  margin: 0, fontSize: "0.73rem", fontWeight: 700,
                  color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.09em",
                  textAlign: i >= 2 ? "center" : "left",
                }}>
                  {col}
                </p>
              ))}
            </div>

            {/* Table */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
              borderRadius: "0 0 16px 16px",
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: "none",
              overflow: "hidden",
              marginBottom: 56,
              opacity: 0, animation: "sectionSlideUp 0.6s ease 400ms forwards",
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                  <tbody>
                    {loading ? (
                      [...Array(6)].map((_, i) => <ShimmerTableRow key={i} index={i} cols={5} />)
                    ) : sentenceData.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px 0", textAlign: "center", color: "#6b7280", fontSize: "1rem" }}>
                          No sentence evaluations found for this batch.
                        </td>
                      </tr>
                    ) : (
                      sentenceData.map((item, i) => {
                        const startIdx = globalRowIndex;
                        globalRowIndex += item.translations.length;
                        return (
                          <SentenceGroup
                            key={i}
                            item={item}
                            globalStartIndex={startIdx}
                            navigate={navigate}
                          />
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── EVALUATION INSIGHTS ────────────────────────── */}
            <h2 style={{
              fontSize: "2rem", fontWeight: 800, color: "#fff",
              marginBottom: 24,
              opacity: 0, animation: "sectionSlideUp 0.65s ease 460ms forwards",
            }}>
              Evaluation Insights
            </h2>

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: 220,
              background: "#0d1117",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 15,
              padding: "48px 32px",
              opacity: 0, animation: "sectionSlideUp 0.6s ease 520ms forwards",
            }}>
              {/* Centered group: spinner + text + button */}
              <div style={{ display: "flex", alignItems: "center", gap: 44 }}>

                {/* 3D spinner */}
                <div style={{ flexShrink: 0 }}>
                  <div className="spinner">
                    <div /><div /><div /><div /><div /><div />
                  </div>
                </div>

                {/* Text + button */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
                  <p style={{
                    color: "#94a3b8", fontSize: "0.95rem", margin: 0,
                    maxWidth: 400, lineHeight: 1.6, textAlign: "left",
                  }}>
                    Detailed evaluation graphs and correlation analysis are available for this batch.
                  </p>
                  <button
                    onClick={() => navigate(`/analysis/${batchId}`)}
                    style={{
                      padding: "11px 28px", borderRadius: 10,
                      background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                      color: "#fff", fontSize: "0.88rem", fontWeight: 700,
                      border: "none", cursor: "pointer",
                      letterSpacing: "0.05em",
                      boxShadow: "0 4px 22px rgba(124,58,237,0.38)",
                      transition: "transform 0.18s ease, box-shadow 0.18s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 6px 32px rgba(124,58,237,0.65)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 22px rgba(124,58,237,0.38)";
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1.05)"}
                  >
                    VIEW GRAPH ANALYSIS
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default BatchAnalysis;