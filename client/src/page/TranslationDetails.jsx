import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════════════════
   FLOATING PARTICLES  (identical to BatchAnalysis)
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
   CYBER GRID HERO  (identical to BatchAnalysis)
══════════════════════════════════════════════════════════════ */
const CyberHero = () => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0,
    height: "60vh", zIndex: 0, pointerEvents: "none", overflow: "hidden",
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
   COUNT-UP HOOK
══════════════════════════════════════════════════════════════ */
function useCountUp(target, duration = 1300, decimals = 2, active = false) {
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
   SCORE COLOR HELPER
══════════════════════════════════════════════════════════════ */
const scoreColor = (num) =>
  num > 2.0 ? "#4ade80" : num >= 1.5 ? "#fbbf24" : "#f87171";
const scoreGlow = (num) =>
  num > 2.0 ? "rgba(74,222,128,0.45)" : num >= 1.5 ? "rgba(251,191,36,0.45)" : "rgba(248,113,113,0.45)";

/* ══════════════════════════════════════════════════════════════
   CRITERIA CARD
══════════════════════════════════════════════════════════════ */
const CriteriaCard = ({ c, index, loaded }) => {
  const [hovered, setHovered] = useState(false);
  const num = parseFloat(c.score) || 0;
  const color = scoreColor(num);
  const glow  = scoreGlow(num);
  const animScore = useCountUp(num, 1200, 2, loaded);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 22px",
        borderRadius: 14,
        background: hovered ? "rgba(22,32,60,0.85)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? color + "55" : "rgba(255,255,255,0.06)"}`,
        boxShadow: hovered ? `0 0 20px ${glow}22` : "none",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        opacity: 0,
        animation: `rowSlideUp 0.45s ease ${100 + index * 70}ms forwards`,
        cursor: "default",
      }}
    >
      <div style={{ flex: 1, paddingRight: 24 }}>
        {/* English name */}
        <p style={{ fontWeight: 600, color: "#f1f5f9", margin: "0 0 4px", fontSize: "0.92rem" }}>
          {c.name.split(".")[0]}.
        </p>
        {/* Hindi name */}
        {c.name.split(".")[1] && (
          <p style={{ color: "#4b5563", margin: "0 0 8px", fontSize: "0.85rem" }}>
            {c.name.split(".")[1]}
          </p>
        )}
        {/* Comment */}
        <p style={{
          fontSize: "0.8rem", fontStyle: "italic",
          color: c.comment && c.comment.trim() !== "" ? "#94a3b8" : "#374151",
          margin: 0,
        }}>
          {c.comment && c.comment.trim() !== ""
            ? `" ${c.comment} "`
            : "No comment"}
        </p>
      </div>

      {/* Score badge */}
      <div style={{
        minWidth: 56, textAlign: "center",
        color, fontWeight: 800, fontSize: "1.25rem",
        textShadow: hovered ? `0 0 16px ${glow}` : `0 0 8px ${glow}66`,
        fontVariantNumeric: "tabular-nums",
        transition: "text-shadow 0.25s ease",
      }}>
        {animScore.toFixed(2)}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SHIMMER SKELETON CARD
══════════════════════════════════════════════════════════════ */
const ShimmerCard = ({ height }) => (
  <div style={{
    height, borderRadius: 20, marginBottom: 20,
    background: "linear-gradient(90deg,#1f2a45 25%,#2a3a5c 50%,#1f2a45 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmerSlide 1.6s infinite linear",
  }} />
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const TranslationDetails = () => {
  const { translationId } = useParams();
  const navigate = useNavigate();

  const [data, setData]     = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/evaluator/translationDetails/${translationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const text = await res.text();
          console.error("❌ API Error:", text);
          throw new Error("Failed to fetch translation details");
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setData({ error: true });
      } finally {
        setTimeout(() => setLoaded(true), 350);
      }
    };
    fetchDetails();
  }, [translationId]);

  /* ── Loading state ── */
  if (!data) return (
    <>
      <style>{`
        @keyframes shimmerSlide {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
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
        @keyframes particleDrift {
          0%   { transform: translateY(0) rotate(0deg); }
          80%  { opacity: inherit; }
          100% { transform: translateY(-102vh) rotate(360deg); opacity:0; }
        }
      `}</style>
      <Particles />
      <CyberHero />
      <div style={{
        position: "relative", zIndex: 1, minHeight: "100vh",
        background: "#000000",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: 860, padding: "0 24px" }}>
          {[180, 120, 260].map((h, i) => <ShimmerCard key={i} height={h} />)}
        </div>
      </div>
    </>
  );

  /* ── Error state ── */
  if (data.error) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#000", color: "#f87171", fontFamily: "'DM Sans',sans-serif", fontSize: "1rem",
    }}>
      Failed to load data. Check backend route.
    </div>
  );

  const avgNum   = parseFloat(data.avgScore) || 0;
  const avgColor = scoreColor(avgNum);
  const avgGlow  = scoreGlow(avgNum);

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
        @keyframes rowSlideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes sectionSlideUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
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
        @keyframes scorePop {
          0%   { transform: scale(0.7); opacity: 0; }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 18px rgba(96,165,250,0.25), 0 0 36px rgba(96,165,250,0.08); }
          50%       { text-shadow: 0 0 40px rgba(96,165,250,0.75), 0 0 80px rgba(96,165,250,0.28); }
        }
      `}</style>

      {/* ════ FIXED PARTICLE LAYER ═════════════════════════════ */}
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
        {/* Cyber grid hero — same as BatchAnalysis */}
        <CyberHero />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "64px 24px 0" }}>

            {/* ── HEADER ─────────────────────────────────────── */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              marginBottom: 72,
              opacity: 0, animation: "sectionSlideUp 0.7s ease 0ms forwards",
            }}>
              <div>
                <h1 style={{
                  fontSize: "clamp(2.2rem,5vw,3.6rem)", fontWeight: 900,
                  color: "#60a5fa", lineHeight: 1.1, margin: 0,
                  animation: "glowPulse 4.5s ease-in-out 1.6s infinite",
                }}>
                  Translation Analysis
                </h1>
                <p style={{ marginTop: 18, color: "#94a3b8", fontSize: "1rem", maxWidth: 520 }}>
                  Detailed breakdown of scores and criteria for this translation.
                </p>
              </div>

              <button
                onClick={() => navigate(-1)}
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

            {/* ── TOP INFO CARD ─────────────────────────────── */}
            <div style={{
              background: "#080d1a",
              border: "1px solid rgba(96,165,250,0.12)",
              borderRadius: 20,
              padding: "32px 36px",
              marginBottom: 24,
              opacity: 0, animation: "sectionSlideUp 0.65s ease 130ms forwards",
              position: "relative",
            }}>
              {/* Top glow line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent 0%, rgb(96,165,250) 30%, rgb(139,92,246) 70%, transparent 100%)",
                borderRadius: "20px 20px 0 0",
              }} />

              {/* English Sentence */}
              <p style={{ color: "#4b5563", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 8px" }}>
                English Sentence
              </p>
              <p style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "1rem", lineHeight: 1.65, margin: "0 0 28px" }}>
                {data.sentence}
              </p>

              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 28 }} />

              {/* Translation */}
              <p style={{ color: "#4b5563", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 8px" }}>
                Translation
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.97rem", lineHeight: 1.7, margin: "0 0 28px" }}>
                {data.translation}
              </p>

              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 28 }} />

              {/* Translator */}
              <p style={{ color: "#4b5563", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 8px" }}>
                Translator
              </p>
              <p style={{ color: "#e2e8f0", fontWeight: 500, fontSize: "0.97rem", margin: 0 }}>
                {data.translator}
              </p>
            </div>

            {/* ── AVG SCORE CARD ────────────────────────────── */}
            <div style={{
              padding: "36px 40px", borderRadius: 20, marginBottom: 24,
              background: "#080d1a",
              border: `1px solid rgba(96,165,250,0.12)`,
              textAlign: "center",
              position: "relative",
              opacity: 0, animation: "sectionSlideUp 0.65s ease 220ms forwards",
            }}>
              {/* Top glow line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent 0%, rgb(96,165,250) 30%, rgb(139,92,246) 70%, transparent 100%)",
                borderRadius: "20px 20px 0 0",
              }} />

              <p style={{ color: "#6b7280", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                Average Score
              </p>
              <div style={{
                color: avgColor,
                fontSize: "clamp(3rem,8vw,5rem)",
                fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
                animation: "scorePop 0.6s cubic-bezier(0.34,1.56,0.64,1) 500ms both",
              }}>
                {data.avgScore}
              </div>
            </div>

            {/* ── CRITERIA BREAKDOWN ────────────────────────── */}
            <h2 style={{
              fontSize: "2rem", fontWeight: 800, color: "#fff",
              marginBottom: 8,
              opacity: 0, animation: "sectionSlideUp 0.65s ease 300ms forwards",
            }}>
              Criteria Breakdown
              <span style={{ color: "#4b5563", fontWeight: 400, fontSize: "0.9rem", marginLeft: 10 }}>
                ({data.criteria.length} criteria)
              </span>
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: 28, opacity: 0, animation: "sectionSlideUp 0.55s ease 360ms forwards" }}>
              Per-criterion scores and evaluator comments.
            </p>

            <div style={{
              background: "#080d1a",
              border: "1px solid rgba(96,165,250,0.12)",
              padding: "32px 36px", borderRadius: 20,
              marginBottom: 56,
              position: "relative",
              opacity: 0, animation: "sectionSlideUp 0.65s ease 400ms forwards",
            }}>
              {/* Top glow line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent 0%, rgb(96,165,250) 30%, rgb(139,92,246) 70%, transparent 100%)",
                borderRadius: "20px 20px 0 0",
              }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {data.criteria.map((c, i) => (
                  <CriteriaCard key={i} c={c} index={i} loaded={loaded} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TranslationDetails;