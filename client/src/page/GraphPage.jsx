import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const avg = (arr) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const getCorrelation = (points) => {
  const n = points.length;
  if (!n) return 0;
  const avgX = avg(points.map((p) => p.humanScore));
  const avgY = avg(points.map((p) => p.autoScore));
  let num = 0, denX = 0, denY = 0;
  points.forEach((p) => {
    num += (p.humanScore - avgX) * (p.autoScore - avgY);
    denX += Math.pow(p.humanScore - avgX, 2);
    denY += Math.pow(p.autoScore - avgY, 2);
  });
  return num / Math.sqrt(denX * denY);
};

const getRegression = (points) => {
  const n = points.length;
  if (!n) return [];
  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return points.map((p) => ({ x: p.x, y: slope * p.x + intercept }));
};

// ─── Fix: Plugin uses afterDatasetsDraw instead of afterDraw ──────────────
const selectedGlowPlugin = {
  id: "selectedGlow",
  afterDatasetsDraw(chart, args, options) {
    const selectedIdx = options.selectedIndex;
    if (selectedIdx == null) return;
    const meta = chart.getDatasetMeta(0);
    const el = meta.data[selectedIdx];
    if (!el) return;
    const { ctx } = chart;
    const { x, y } = el.getProps(["x", "y"]);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,255,200,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  },
};

ChartJS.register(selectedGlowPlugin);

// ─── Animated Bar ──────────────────────────────────────────────────────────

const AnimatedBar = ({ score, index, animate }) => {
  const isNaN_ = isNaN(score);
  const width = isNaN_ ? 0 : Math.min(score * 10, 100);
  const color = score >= 7 ? "#1D9E75" : score >= 5 ? "#BA7517" : "#D85A30";

  return (
    <div
      style={{
        opacity: animate ? 1 : 0,
        transform: animate ? "translateX(0)" : "translateX(12px)",
        transition: `opacity 0.35s ease ${index * 0.07}s, transform 0.35s ease ${index * 0.07}s`,
      }}
      className="mb-3"
    >
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs text-gray-300 truncate max-w-[150px]">
          {isNaN_ ? <span className="text-gray-600 italic">unnamed</span> : score}
        </p>
        {isNaN_ ? (
          <span className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full border border-gray-700">
            N/A
          </span>
        ) : (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
          >
            {score}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-1.5 rounded-full"
          style={{
            width: animate ? `${width}%` : "0%",
            background: isNaN_ ? "#333" : `linear-gradient(90deg, ${color}cc, ${color}ff)`,
            transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${index * 0.07 + 0.15}s`,
            boxShadow: isNaN_ ? "none" : `0 0 6px ${color}88`,
          }}
        />
      </div>
    </div>
  );
};

// ─── Compact Metric Card ───────────────────────────────────────────────────

const MetricCard = ({ label, value, color }) => (
  <div
    className="flex flex-col items-center justify-center bg-gray-900 border border-gray-800 rounded-lg transition-all duration-300 hover:border-gray-600"
    style={{ padding: "10px 8px" }}
  >
    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
    <p className="text-xl font-semibold tabular-nums" style={{ color }}>
      {value}
    </p>
  </div>
);

// ─── Detail Panel ─────────────────────────────────────────────────────────

const DetailPanel = ({ point, onBack }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 30);
    return () => clearTimeout(t);
  }, [point]);

  const isGood    = point.diff <= 1;
  const diffColor = point.diff <= 1 ? "#1D9E75" : point.diff <= 2 ? "#BA7517" : "#D85A30";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 group"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <div
            className="flex items-center justify-center rounded-full transition-all duration-200"
            style={{ width: 26, height: 26, border: "1.5px solid #333", background: "#1a1a1a" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none"
              viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span style={{ fontSize: 11, color: "#9ca3af", letterSpacing: "0.03em" }}>Back</span>
        </button>

        <div
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 999,
            background: `${diffColor}18`, border: `1px solid ${diffColor}44`,
          }}
        >
          <span style={{ fontSize: 10, color: "#6b7280" }}>scoring gap</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: diffColor, fontVariantNumeric: "tabular-nums" }}>
            {point.diff.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-3 flex-shrink-0">
        {[
          { label: "Human Score", value: point.humanScore.toFixed(2), color: "#378ADD" },
          { label: "Auto Score",  value: point.autoScore.toFixed(2),  color: "#1D9E75" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="flex-1 rounded-lg p-2.5 text-center"
            style={{ background: `${color}18`, border: `1px solid ${color}33` }}
          >
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-lg font-semibold tabular-nums" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "#1f2937", flexShrink: 0, marginBottom: 10 }} />

      <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 flex-shrink-0">
        Criteria Breakdown
      </p>

      <div className="flex-1 overflow-y-auto criteria-scroll pr-1" style={{ minHeight: 0 }}>
        {point.criterions?.map((c, i) => {
          const score = Number(c.score);
          return (
            <div key={i} className="mb-1">
              <p className="text-[11px] text-gray-400 mb-0.5 truncate">
                {c.name || `Criteria ${i + 1}`}
              </p>
              <AnimatedBar score={isNaN(score) ? NaN : score} index={i} animate={animate} />
            </div>
          );
        })}
      </div>

      <div
        className="mt-3 flex-shrink-0 rounded-lg px-3 py-2 text-xs flex items-center gap-2"
        style={{
          background: isGood ? "#1D9E7518" : "#D85A3018",
          border: `1px solid ${isGood ? "#1D9E7540" : "#D85A3040"}`,
          color: isGood ? "#1D9E75" : "#D85A30",
        }}
      >
        <span style={{ fontSize: 15 }}>{isGood ? "✅" : "⚠️"}</span>
        <span>{isGood ? "Model aligns well with human scoring" : "Model deviates from human scoring"}</span>
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────

const SidebarCard = ({ selectedPoint, onCollapse }) => {
  const [expanded, setExpanded]       = useState(false);
  const [showContent, setShowContent] = useState(false);
  const prevPoint = useRef(null);

  useEffect(() => {
    if (selectedPoint && selectedPoint !== prevPoint.current) {
      prevPoint.current = selectedPoint;
      setShowContent(false);
      if (!expanded) {
        setExpanded(true);
        setTimeout(() => setShowContent(true), 440);
      } else {
        setTimeout(() => setShowContent(true), 60);
      }
    }
  }, [selectedPoint]);

  const handleCollapse = () => {
    setShowContent(false);
    setTimeout(() => {
      setExpanded(false);
      prevPoint.current = null;
      if (onCollapse) onCollapse();
    }, 380);
  };

  return (
    <>
      <style>{`
        @keyframes breathe {
          0%,100% { opacity:0.28; }
          50%      { opacity:0.60; }
        }
        @keyframes panelIn {
          from { opacity:0; transform:translateY(7px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .sidebar-morph {
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: #161b22;
          border: 1.5px solid #21262d;
          box-shadow: inset -10px -10px 0 #0d1117, 4px 4px 16px rgba(0,0,0,.6);
          transition:
            width         0.44s cubic-bezier(0.22,1,0.36,1),
            height        0.44s cubic-bezier(0.22,1,0.36,1),
            border-radius 0.44s cubic-bezier(0.22,1,0.36,1),
            box-shadow    0.3s ease,
            border-color  0.3s ease;
        }
        .sidebar-morph.is-expanded {
          width: 280px;
          height: 460px;
          border-radius: 16px;
          background: #0f1117;
          border-color: #252525;
          box-shadow: 0 0 0 1px #1a1a1a, 6px 6px 28px rgba(0,0,0,.7);
        }
        .sidebar-morph.is-expanded::after {
          content: '';
          position: absolute;
          top:0; left:0; right:0;
          height: 2px;
          background: linear-gradient(90deg,#378ADD66,#1D9E7566,#BA751766);
          border-radius: 16px 16px 0 0;
          pointer-events: none;
        }
        .circle-hint {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          pointer-events: none;
          user-select: none;
          transition: opacity 0.2s ease;
        }
        .sidebar-morph.is-expanded .circle-hint { opacity: 0; }
        .hint-text {
          font-size: 8px;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          text-align: center;
          line-height: 1.5;
          animation: breathe 2.8s ease-in-out infinite;
        }
        .panel-content {
          position: absolute;
          inset: 0;
          padding: 16px 16px 14px 16px;
          opacity: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-sizing: border-box;
        }
        .panel-content.is-visible {
          opacity: 1;
          pointer-events: all;
          animation: panelIn 0.3s ease forwards;
        }
        .criteria-scroll::-webkit-scrollbar { width:3px; }
        .criteria-scroll::-webkit-scrollbar-track { background:transparent; }
        .criteria-scroll::-webkit-scrollbar-thumb { background:#2d2d2d; border-radius:3px; }
        .criteria-scroll::-webkit-scrollbar-thumb:hover { background:#444; }
      `}</style>

      <div className={`sidebar-morph ${expanded ? "is-expanded" : ""}`}>
        <div className="circle-hint">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.22 }}>
            <circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="12" cy="12" r="4"  stroke="#aaa" strokeWidth="1" />
            <circle cx="12" cy="12" r="1.6" fill="#aaa" />
          </svg>
          <div className="hint-text">click a point<br />on the graph</div>
        </div>

        <div className={`panel-content ${showContent ? "is-visible" : ""}`}>
          {selectedPoint && (
            <DetailPanel
              key={JSON.stringify(selectedPoint)}
              point={selectedPoint}
              onBack={handleCollapse}
            />
          )}
        </div>
      </div>
    </>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────

const GraphPage = () => {
  const { batchId } = useParams();
  const navigate    = useNavigate();

  const [points, setPoints]               = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // ── Fix: stable chart ref to avoid "canvas already in use" ──
  const chartRef = useRef(null);

  const handleCollapse = () => {
    setSelectedPoint(null);
    setSelectedIndex(null);
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/history/${batchId}`)
      .then((r) => r.json())
      .then((data) => {
        const graphPoints = data.map((item) => {
          const scores = item.Criterions.map((c) => Number(c.score)).filter((s) => !isNaN(s));
          const humanScore = avg(scores);
          const autoRaw    = Number(item.auto?.score);
          const autoScore  = isNaN(autoRaw) ? 0 : autoRaw * 3;
          return {
            x: humanScore, y: autoScore,
            humanScore, autoScore,
            diff: Math.abs(humanScore - autoScore),
            criterions: item.Criterions,
          };
        });
        setPoints(graphPoints);
      });
  }, [batchId]);

  // ── Fix: destroy chart on unmount to free the canvas ──
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const avgHuman    = avg(points.map((p) => p.humanScore)).toFixed(2);
  const avgAuto     = avg(points.map((p) => p.autoScore)).toFixed(2);
  const accuracy    = points.length
    ? ((points.reduce((acc, p) => acc + (1 - Math.min(p.diff, 10) / 10), 0) / points.length) * 100).toFixed(1)
    : "0";
  const correlation = getCorrelation(points).toFixed(2);
  const corrValue   = Number(correlation);

  const corrColor =
    corrValue > 0.5   ? "#4ade80"
    : corrValue > 0   ? "#facc15"
    : corrValue === 0 ? "#9ca3af"
    : "#f87171";

  const corrText =
    corrValue >= 0.8   ? "Strong positive correlation"
    : corrValue >= 0.5  ? "Moderate positive correlation"
    : corrValue > 0     ? "Weak positive correlation"
    : corrValue === 0   ? "No correlation"
    : corrValue > -0.5  ? "Weak negative correlation"
    : corrValue > -0.8  ? "Moderate negative correlation"
    : "Strong negative correlation";

  const regressionData = getRegression(points);
  const idealLine      = points.map((p) => ({ x: p.x, y: p.x }));

  return (
    <div className="relative min-h-screen bg-black text-white" style={{ padding: "28px 36px" }}>

      <div
        className="absolute top-5 left-5 z-50 cursor-pointer group"
        onClick={() => navigate(`/batch-analysis/${batchId}`)}
      >
        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-transparent transition-all duration-200 group-hover:bg-white">
          <svg xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white group-hover:text-gray-900 transition-colors duration-200"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>

      <h1
        className="text-center"
        style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 16 }}
      >
        Graph Analysis
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          maxWidth: 720,
          margin: "0 auto 12px",
        }}
      >
        <MetricCard label="Avg Human"   value={avgHuman}       color="#378ADD" />
        <MetricCard label="Avg Auto"    value={avgAuto}        color="#1D9E75" />
        <MetricCard label="Accuracy"    value={accuracy + "%"} color="#BA7517" />
        <MetricCard label="Correlation" value={correlation}    color="#c084fc" />
      </div>

      <div className="flex justify-center" style={{ marginBottom: 14 }}>
        <span
          style={{
            fontSize: 13, padding: "3px 14px", borderRadius: 999,
            color: corrColor, background: `${corrColor}18`, border: `1px solid ${corrColor}33`,
          }}
        >
          {corrText}
        </span>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>

        <div
          className="flex-1 min-w-0 bg-gray-900 border border-gray-800 rounded-xl"
          style={{ padding: "18px 20px 14px" }}
        >
          <div style={{ height: "390px" }}>
            <Scatter
              ref={chartRef}
              // ── removed key={points.length} — was destroying/recreating canvas without cleanup ──
              data={{
                datasets: [
                  {
                    label: "Scores",
                    data: points,
                    pointRadius: (ctx) => ctx.dataIndex === selectedIndex ? 9 : 7,
                    backgroundColor: (ctx) => {
                      const p = ctx?.raw;
                      if (!p) return "#888";
                      return p.diff < 1 ? "#00ffcc" : "#ff4d4d";
                    },
                  },
                  {
                    label: "Ideal",
                    data: idealLine,
                    borderColor: "#3f3f46",
                    showLine: true, pointRadius: 0, parsing: false, borderDash: [5, 4],
                  },
                  {
                    label: "Regression",
                    data: regressionData,
                    borderColor: "#00aaff",
                    showLine: true, pointRadius: 0, parsing: false,
                  },
                ],
              }}
              options={{
                onClick: (e, elements, chart) => {
                  if (elements.length > 0 && elements[0].datasetIndex === 0) {
                    const idx = elements[0].index;
                    setSelectedIndex(idx);
                    setSelectedPoint(chart.data.datasets[0].data[idx]);
                  }
                },
                plugins: {
                  legend: { labels: { color: "#9ca3af", font: { size: 11 } } },
                  selectedGlow: { selectedIndex },
                },
                scales: {
                  x: { ticks: { color: "#6b7280", font: { size: 11 } }, grid: { color: "#1f2937" } },
                  y: { ticks: { color: "#6b7280", font: { size: 11 } }, grid: { color: "#1f2937" } },
                },
              }}
            />
          </div>

          <div className="flex gap-4 mt-2 justify-end" style={{ fontSize: 11, color: "#6b7280" }}>
            <span className="flex items-center gap-1">
              <span style={{ display:"inline-block", width:9, height:9, borderRadius:"50%", background:"#00ffcc" }} />
              Aligned (diff &lt; 1)
            </span>
            <span className="flex items-center gap-1">
              <span style={{ display:"inline-block", width:9, height:9, borderRadius:"50%", background:"#ff4d4d" }} />
              Deviated
            </span>
          </div>
        </div>

        <div
          style={{
            width: 280,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "stretch",
          }}
        >
          <SidebarCard selectedPoint={selectedPoint} onCollapse={handleCollapse} />
        </div>
      </div>
    </div>
  );
};

export default GraphPage;