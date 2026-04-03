// src/pages/EvaluationPage.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const EvaluationPage = () => {
  const { sentenceId, translationId, index } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const translations = location.state?.translations || [];
  const sentence = location.state?.sentence || "";
  const currentTranslation = location.state?.currentTranslation || {};

  const currentTIndex = translations.findIndex(
    (t) => (t.T_ID || t._id) === translationId
  );
  const hasNext = currentTIndex < translations.length - 1;

  const [criteria, setCriteria] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [hoveredScore, setHoveredScore] = useState(null);
  const [animatingButton, setAnimatingButton] = useState(null);
  const [liveAverage, setLiveAverage] = useState(0);
  const [averagePulse, setAveragePulse] = useState(false);
  const [focusedCriterion, setFocusedCriterion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setSubmitted(false);
    setRatings({});
    setComments({});
    setFocusedCriterion(null);
    setError(null);
  }, [translationId]);

  const scores = [
    { value: 4,    label: '4',  color: 'bg-green-600',  tooltip: 'Ideal / अति उत्तम' },
    { value: 3,    label: '3',  color: 'bg-blue-600',   tooltip: 'Perfect / उत्तम' },
    { value: 2,    label: '2',  color: 'bg-yellow-600', tooltip: 'Acceptable / मान्य' },
    { value: 1,    label: '1',  color: 'bg-orange-600', tooltip: 'Partially Acceptable / बुरा किन्तु मान्य' },
    { value: 0,    label: '0',  color: 'bg-red-600',    tooltip: 'Not Acceptable / अमान्य' },
    { value: 'NA', label: 'NA', color: 'bg-gray-600',   tooltip: 'Not Applicable / लागू नहीं' },
  ];

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/ranks/criteria');
        if (!response.ok) throw new Error('Failed to fetch criteria');
        const data = await response.json();
        const sortedData = data.sort((a, b) => {
          const numA = parseInt(a.CId.replace('C', ''));
          const numB = parseInt(b.CId.replace('C', ''));
          return numA - numB;
        });
        setCriteria(sortedData);
        setError(null);
      } catch (err) {
        setError('Failed to load evaluation criteria. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCriteria();
  }, []);

  const calculateAverage = () => {
    const numericRatings = Object.values(ratings).filter(r => r !== 'NA' && typeof r === 'number');
    if (numericRatings.length === 0) return 0;
    return numericRatings.reduce((a, b) => a + b, 0) / numericRatings.length;
  };

  useEffect(() => {
    const newAverage = calculateAverage();
    if (newAverage !== liveAverage) {
      setAveragePulse(true);
      setLiveAverage(newAverage);
      setTimeout(() => setAveragePulse(false), 600);
    }
  }, [ratings, liveAverage]);

  const handleNewEvaluation = () => {
    setSubmitted(false);
    setRatings({});
    setComments({});
    setFocusedCriterion(null);
    setError(null);
  };

  const handleBackToViewer = () => navigate(`/translation/${index}`);

  const handleNextTranslation = () => {
    if (!hasNext) return;
    const nextT = translations[currentTIndex + 1];
    navigate(`/evaluate/${sentenceId}/${nextT.T_ID || nextT._id}/${index}`, {
      state: { translations, sentence: location.state?.sentence, currentTranslation: nextT },
    });
  };

  const handleRating = (criterionId, score) => {
    setAnimatingButton(`${criterionId}-${score}`);
    setRatings({ ...ratings, [criterionId]: score });
    setFocusedCriterion(criterionId);
    setTimeout(() => setAnimatingButton(null), 600);
  };

  const handleComment = (criterionId, comment) => {
    setComments({ ...comments, [criterionId]: comment });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const criterionsArray = criteria.map(criterion => ({
        name: criterion.CName,
        score: ratings[criterion._id]?.toString() || 'NA',
        comment: comments[criterion._id] || '',
      }));
      const payload = { SID: sentenceId, TID: translationId, Criterions: criterionsArray };
      const response = await fetch("http://localhost:5000/api/ranks/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit ranking');
      setSubmitted(true);
      setTimeout(() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }, 100);
    } catch (err) {
      setError(err.message || 'Failed to submit ranking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (submitted) {
      setSubmitted(false); setRatings({}); setComments({});
      setFocusedCriterion(null); setError(null);
    } else {
      navigate(`/translation/${index}`);
    }
  };

  const ratedCount = Object.keys(ratings).length;
  const progressPercentage = (ratedCount / criteria.length) * 100;

  const getScoreColor = (value) => {
    const map = { 4: 'bg-green-600', 3: 'bg-blue-600', 2: 'bg-yellow-600', 1: 'bg-orange-600', 0: 'bg-red-600', 'NA': 'bg-gray-600' };
    return map[value] || 'bg-gray-600';
  };

  const getScoreInfo = (value) => scores.find(s => s.value === value);
  const isScoreSelected = (criterionId, scoreValue) => ratings[criterionId] === scoreValue;
  const isScoreBeforeSelected = (criterionId, scoreValue) => {
    const currentRating = ratings[criterionId];
    if (currentRating === undefined || currentRating === 'NA' || scoreValue === 'NA') return false;
    return scores.findIndex(s => s.value === scoreValue) < scores.findIndex(s => s.value === currentRating);
  };
  const isRated = (criterionId) => ratings[criterionId] !== undefined;
  const isFocused = (criterionId) => focusedCriterion === criterionId;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading evaluation criteria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <style>{`
        @keyframes pulse-scale    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes number-update  { 0%{transform:scale(1);color:#fff} 50%{transform:scale(1.2);color:#60a5fa} 100%{transform:scale(1);color:#fff} }
        @keyframes fade-in        { from{opacity:0} to{opacity:1} }
        @keyframes fade-in-up     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slide-up       { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ripple         { 0%{transform:scale(0.8);opacity:0.6} 100%{transform:scale(2.5);opacity:0} }
        @keyframes bounce-scale   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes ping-once      { 0%{transform:scale(1)} 50%{transform:scale(1.15)} 100%{transform:scale(1)} }
        @keyframes gentle-pulse   { 0%,100%{box-shadow:0 10px 15px -3px rgba(59,130,246,0.3)} 50%{box-shadow:0 20px 25px -5px rgba(59,130,246,0.5)} }
        @keyframes scale-in       { from{transform:scale(0.82);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes checkmark-pop  { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.2) rotate(4deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }

        .animate-pulse-scale   { animation:pulse-scale 0.6s ease-in-out }
        .animate-number-update { animation:number-update 0.6s ease-out }
        .animate-fade-in       { animation:fade-in 0.3s ease-out }
        .animate-fade-in-up    { animation:fade-in-up 0.3s ease-out }
        .animate-slide-up      { animation:slide-up 0.6s ease-out }
        .animate-ripple        { animation:ripple 0.6s ease-out }
        .animate-bounce        { animation:bounce-scale 0.3s ease-in-out }
        .animate-ping          { animation:ping-once 0.4s ease-out }
        .animate-gentle-pulse  { animation:gentle-pulse 2s ease-in-out infinite }
        .animate-scale-in      { animation:scale-in 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards }
        .checkmark-pop         { animation:checkmark-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards }

        /* ── Instagram Checkbox ── */
        .insta-label {
          display: flex;
          justify-content: center;
          position: relative;
          cursor: default;
          margin: 0 auto 14px;
          padding: 10px;
          overflow: visible;
        }
        .insta-label input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        .insta-checkmark {
          position: relative;
          width: 54px;
          height: 54px;
          background: #111;
          border-radius: 50%;
          transition: box-shadow 0.7s;
          --spread: 9px;
          box-shadow:
            -6px -6px var(--spread) 0px rgba(91,81,216,0.6),
            0   -6px var(--spread) 0px rgba(131,58,180,0.6),
            6px -6px var(--spread) 0px rgba(225,48,108,0.6),
            6px  0   var(--spread) 0px rgba(253,29,29,0.55),
            6px  6px var(--spread) 0px rgba(247,119,55,0.6),
            0    6px var(--spread) 0px rgba(252,175,69,0.6),
            -6px 6px var(--spread) 0px rgba(255,220,128,0.55);
        }
        .insta-checkmark::after {
          content: "";
          position: absolute;
          display: block;
          left: 50%;
          top: 47%;
          width: 11px;
          height: 19px;
          border: solid #f0f0f0;
          border-width: 0 2.5px 2.5px 0;
          transform: translate(-50%, -50%) rotate(45deg);
        }

        /* ── Modal card ── */
        .modal-card {
          width: 310px;
          background: linear-gradient(160deg, #0f172a 0%, #0d1424 60%, #120d1e 100%);
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(99,102,241,0.25);
          box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
        }

        .modal-header-band {
          padding: 28px 24px 22px;
          text-align: center;
          background: linear-gradient(180deg, rgba(16,185,129,0.08) 0%, transparent 100%);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .modal-title {
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.3px;
          line-height: 1.35;
          margin: 0;
        }
        .modal-subtitle {
          font-size: 12px;
          color: rgba(148,163,184,0.8);
          margin: 5px 0 0;
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          padding: 8px 0;
        }
        .modal-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 20px;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          transition: background 0.2s ease, transform 0.15s ease;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }
        .modal-row:last-child { border-bottom: none; }
        .modal-row:hover { transform: translateX(3px); }
        .modal-row:active { transform: scale(0.98); }

        .modal-icon-bubble {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .modal-icon-bubble svg { width: 17px; height: 17px; }

        .modal-row-label {
          font-size: 14px; font-weight: 700; letter-spacing: 0.2px;
        }
        .modal-row-desc {
          font-size: 11px; font-weight: 500; margin-top: 1px; opacity: 0.65;
        }

        .row-reevaluate .modal-icon-bubble { background: rgba(139,92,246,0.18); }
        .row-reevaluate .modal-icon-bubble svg { stroke: #a78bfa; }
        .row-reevaluate .modal-row-label { color: #c4b5fd; }
        .row-reevaluate .modal-row-desc  { color: #a78bfa; }
        .row-reevaluate:hover { background: rgba(139,92,246,0.12); }
        .row-reevaluate:hover .modal-icon-bubble { background: rgba(139,92,246,0.3); }
        .row-reevaluate:hover .modal-icon-bubble svg { stroke: #ede9fe; }
        .row-reevaluate:hover .modal-row-label { color: #ede9fe; }

        .row-back .modal-icon-bubble { background: rgba(59,130,246,0.15); }
        .row-back .modal-icon-bubble svg { stroke: #60a5fa; }
        .row-back .modal-row-label { color: #93c5fd; }
        .row-back .modal-row-desc  { color: #60a5fa; }
        .row-back:hover { background: rgba(59,130,246,0.1); }
        .row-back:hover .modal-icon-bubble { background: rgba(59,130,246,0.28); }
        .row-back:hover .modal-icon-bubble svg { stroke: #dbeafe; }
        .row-back:hover .modal-row-label { color: #dbeafe; }

        .row-next .modal-icon-bubble { background: rgba(16,185,129,0.15); }
        .row-next .modal-icon-bubble svg { stroke: #34d399; }
        .row-next .modal-row-label { color: #6ee7b7; }
        .row-next .modal-row-desc  { color: #34d399; }
        .row-next:hover { background: rgba(16,185,129,0.1); }
        .row-next:hover .modal-icon-bubble { background: rgba(16,185,129,0.28); }
        .row-next:hover .modal-icon-bubble svg { stroke: #d1fae5; }
        .row-next:hover .modal-row-label { color: #d1fae5; }

        .modal-row-arrow {
          margin-left: auto;
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
          color: rgba(255,255,255,0.3);
          font-size: 16px;
        }
        .modal-row:hover .modal-row-arrow {
          opacity: 1;
          transform: translateX(3px);
        }
      `}</style>

      {/* ── Header ── */}
      <div className="sticky top-0 z-50 bg-gray-800 bg-opacity-95 backdrop-blur-sm border-b border-gray-700 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Translation Evaluation</h1>
              <p className="text-gray-400 text-xs mt-0.5">Quality Assessment Platform • {criteria.length} Criteria</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{ratedCount}/{criteria.length}</span>
                <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg ${averagePulse ? 'animate-pulse-scale' : ''}`}>
                <span className="text-xs text-blue-200 font-medium mr-2">Live Avg:</span>
                <span className={`text-xl font-bold ${averagePulse ? 'animate-number-update' : ''}`}>{liveAverage.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all border border-gray-600 hover:scale-105">
              <ChevronLeft className="w-4 h-4" />
              {submitted ? 'New Evaluation' : 'Back'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-20">

        {/* Sentence + Translation Info */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <p className="text-gray-400 text-sm mb-1">English Sentence</p>
          <p className="text-white mb-4 font-medium">{sentence}</p>
          <p className="text-gray-400 text-sm mb-1">Translation</p>
          <p className="text-blue-300 mb-4 font-medium">
            {currentTranslation?.translatedText || currentTranslation?.Indian_Translation}
          </p>
          <p className="text-gray-400 text-sm mb-1">Translator</p>
          <p className="text-green-400 font-medium">
            {currentTranslation?.translator || currentTranslation?.T_ID}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-200 font-semibold">Error</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Warning */}
        {!loading && !error && criteria.length !== 11 && (
          <div className="mb-6 bg-yellow-900 border border-yellow-700 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-200 font-semibold">Warning</p>
              <p className="text-yellow-300 text-sm mt-1">Expected 11 criteria but only {criteria.length} were loaded.</p>
            </div>
          </div>
        )}

        {/* Criteria Cards */}
        {!submitted && (
          <div className="space-y-4 mb-8 animate-slide-up">
            {criteria.map((criterion) => {
              const rated   = isRated(criterion._id);
              const focused = isFocused(criterion._id);
              const selectedScore = ratings[criterion._id];
              const scoreInfo = selectedScore !== undefined ? getScoreInfo(selectedScore) : null;

              return (
                <div
                  key={criterion._id}
                  className={`rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                    focused ? 'bg-gray-800 ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20'
                    : rated  ? 'bg-gray-800 border-l-4 shadow-lg'
                    : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setFocusedCriterion(criterion._id)}
                >
                  <div className="bg-gray-900 px-5 py-3 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-base font-bold text-blue-400">{criterion.CId}: {criterion.CName}</h3>
                    {rated && !focused && <CheckCircle className="w-5 h-5 text-green-500 animate-fade-in" />}
                  </div>

                  <div className="p-5">
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                        Rate this criterion (Weight: {criterion.CWeight})
                      </label>
                      <div className="relative mb-3">
                        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-700" />
                        <div
                          className="absolute top-6 left-6 h-0.5 bg-blue-500 transition-all duration-500"
                          style={{
                            width: ratings[criterion._id] !== undefined
                              ? `calc(${(scores.findIndex(s => s.value === ratings[criterion._id]) / (scores.length - 1)) * 100}% - 24px)`
                              : '0%',
                          }}
                        />
                        <div className="flex justify-between items-center relative">
                          {scores.map((score) => {
                            const isSelected  = isScoreSelected(criterion._id, score.value);
                            const isBefore    = isScoreBeforeSelected(criterion._id, score.value);
                            const isAnimating = animatingButton === `${criterion._id}-${score.value}`;
                            return (
                              <div key={score.value} className="relative flex flex-col items-center">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleRating(criterion._id, score.value); }}
                                  onMouseEnter={() => setHoveredScore(`${criterion._id}-${score.value}`)}
                                  onMouseLeave={() => setHoveredScore(null)}
                                  className={`w-12 h-12 rounded-full font-bold text-white transition-all duration-300 relative z-10 ${
                                    isSelected
                                      ? `${getScoreColor(score.value)} ring-4 ring-blue-400 ring-offset-2 ring-offset-gray-800 scale-125 shadow-lg`
                                      : isBefore ? `${getScoreColor(score.value)} scale-90`
                                      : 'bg-gray-700 hover:bg-gray-600 scale-90'
                                  } ${isAnimating ? 'animate-ping' : ''}`}
                                >
                                  <span className={isAnimating ? 'animate-bounce' : ''}>{score.label}</span>
                                  {isAnimating && <span className="absolute inset-0 rounded-full bg-white opacity-30 animate-ripple" />}
                                </button>
                                <span className={`mt-2 text-xs transition-all ${isSelected ? 'text-blue-400 font-semibold' : 'text-gray-500'}`}>
                                  {score.label}
                                </span>
                                {hoveredScore === `${criterion._id}-${score.value}` && (
                                  <div className="absolute bottom-full mb-16 px-3 py-2 bg-black text-white text-xs rounded shadow-xl z-20 whitespace-nowrap border border-gray-700 animate-fade-in-up">
                                    {score.tooltip}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {selectedScore !== undefined && (
                        <div className="text-sm text-gray-400 animate-fade-in-up pl-1">{scoreInfo?.tooltip}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Comments (Optional)</label>
                      <textarea
                        value={comments[criterion._id] || ''}
                        onChange={(e) => { e.stopPropagation(); handleComment(criterion._id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Add your comments here..."
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-200 placeholder-gray-600 text-sm shadow-inner"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submit */}
        {!submitted && (
          <div className="flex justify-center mb-12">
            <button
              onClick={handleSubmit}
              disabled={ratedCount === 0 || submitting}
              className={`px-12 py-4 rounded-lg font-bold text-lg text-white transition-all duration-300 ${
                ratedCount === 0 || submitting
                  ? 'bg-gray-700 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-lg hover:shadow-blue-500/50 animate-gentle-pulse'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}

        {/* ── Success Modal ── */}
        {submitted && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={() => setSubmitted(false)}
          >
            <div className="modal-card animate-scale-in" onClick={(e) => e.stopPropagation()}>

              {/* Header */}
              <div className="modal-header-band">
                <label className="insta-label">
                  <input type="checkbox" defaultChecked readOnly />
                  <div className="insta-checkmark checkmark-pop" />
                </label>
                <p className="modal-title">Evaluation Submitted<br />Successfully</p>
                <p className="modal-subtitle">Your review has been recorded</p>
              </div>

              {/* Actions */}
              <div className="modal-actions">

                {/* Re-evaluate */}
                <button className="modal-row row-reevaluate" onClick={handleNewEvaluation}>
                  <div className="modal-icon-bubble">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </div>
                  <div>
                    <div className="modal-row-label">Re-evaluate</div>
                    <div className="modal-row-desc">Start a fresh evaluation</div>
                  </div>
                  <span className="modal-row-arrow">›</span>
                </button>

                {/* Back to Viewer */}
                <button className="modal-row row-back" onClick={handleBackToViewer}>
                  <div className="modal-icon-bubble">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                  </div>
                  <div>
                    <div className="modal-row-label">Back to Viewer</div>
                    <div className="modal-row-desc">Return to translation list</div>
                  </div>
                  <span className="modal-row-arrow">›</span>
                </button>

                {/* Next Translation */}
                {hasNext && (
                  <button className="modal-row row-next" onClick={handleNextTranslation}>
                    <div className="modal-icon-bubble">
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="modal-row-label">Next Translation</div>
                      <div className="modal-row-desc">Evaluate the next entry</div>
                    </div>
                    <span className="modal-row-arrow">›</span>
                  </button>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EvaluationPage;