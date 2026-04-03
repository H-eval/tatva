// src/pages/LineViewer.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import WebName from "../components/WebName";
import Stepper, { Step } from '../components/Stepper';
import BackgroundWords from "../componets/BackgroundWords";
import BackButton from "../components/Button"; 
  

const LineViewer = () => {
  
  const { index } = useParams();
  const [lines, setLines] = useState([]);
  const [currentIndex, setCurrentIndex] =  useState(Number(index) || 0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posTags, setPosTags] = useState([]);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/Home");
  };
   
  useEffect(() => {
    if (index !== undefined) {
      setCurrentIndex(Number(index));
    }
  }, [index]);

  // Call Python NLP service for POS tags
  const getPOSTags = async (sentence) => {
    try {
      const res = await fetch("http://127.0.0.1:5001/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sentence }),
      });

      if (!res.ok) throw new Error("Failed to fetch POS tags");

      const data = await res.json();
      return data.tokens || []; 
    } catch (err) {
      console.error("NLP service error:", err);
      return [];
    }
  };

  const posColorMap = {
     NOUN: "bg-blue-600",
    VERB: "bg-red-600",
    ADJ: "bg-purple-600",
    ADV: "bg-pink-600",
    PRON: "bg-green-600",
    DET: "bg-yellow-600",
    ADP: "bg-indigo-600",
    CCONJ: "bg-teal-600",
    PROPN: "bg-orange-600",
    PUNCT: "bg-gray-600",
  };

  // 🔥 Fetch MOST RECENT file (backend already handles this)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/translations/sequences"
        );
        const data = await res.json();
        setLines(data || []);
      } catch {
        setError("Could not load translations");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch POS tags whenever the current English line changes
  useEffect(() => {
    setPosTags([]);
    if (lines.length > 0 && lines[currentIndex]) {
      const sentence = lines[currentIndex].text;
      getPOSTags(sentence).then((tags) => setPosTags(tags));
    } else {
      setPosTags([]);
    }
  }, [currentIndex, lines]);

   if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-red-400 font-semibold">{error}</p>
      </div>
    );

  if (!lines.length)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-gray-400">No lines found.</p>
      </div>
    );
  const currentLine = lines[currentIndex] || { text: "", translations: [] };
 
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  }; 
   
  return (
  <div className="relative min-h-screen bg-gray-900 text-white flex justify-center items-center p-6 overflow-hidden">
    {/* 🔥 Back Button Top Left */}
     {/* 🔥 Back Button Top Left */}
    <div
      className="absolute top-6 left-6 z-50 cursor-pointer group"
      onClick={goToHome}
    >
      <div className="
        w-11 h-11 
        rounded-full 
        border-2 border-white 
        flex items-center justify-center 
        bg-transparent
        transition-all duration-200
        group-hover:bg-white group-hover:border-white
      ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white group-hover:text-gray-900 transition-colors duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
    </div>

    <BackgroundWords />
    <div className=" 
                    w-full max-w-11xl 
                    min-h-[75vh] max-h-[85vh] 
                    flex flex-col justify-between">  
    <Stepper
      key={index}
      initialStep={(Number(index) || 0) + 1}
      onStepChange={(step) => {
        setCurrentIndex(step - 1); 
        console.log(step);
      }}
    >
      {lines.map((line, idx) => (
        <Step key={line.sentenceId || idx}className="bg-transparent">
          <div className="h-auto pr-2">

            {/* English Line with colored POS words */}
            <div className="mb-4">
              <div className="text-lg font-semibold text-white flex flex-wrap gap-2">
                <span className="text-gray-400">English:</span>
                {idx === currentIndex && posTags.length > 0 ? (
                  posTags.map((token, i) => {
                    const color = posColorMap[token.upos] || "bg-gray-700";
                    return (
                      <span
                        key={i}
                        className={`relative group px-2 py-1 rounded ${color} text-white`}
                      >
                        {token.text}
                        {/* Tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-20 whitespace-nowrap">
                          <div>
                            <strong>Lemma:</strong> {token.lemma}
                          </div>
                          <div>
                            <strong>POS:</strong> {token.upos}
                          </div>
                          {token.ner && (
                            <div>
                              <strong>NER:</strong> {token.ner}
                            </div>
                          )}
                        </div>   
                      </span>
                    );
                  })
                ) : (
                  <span className="ml-2 text-gray-400">{line.text}</span>
              )}

              </div>
            </div>

            {/* Legend Block */}
            <div className="mt-6 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <h4 className="text-gray-300 text-sm mb-2">Legend</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                {Object.entries(posColorMap).map(([pos, color], idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${color}`}></div>
                    <span>{pos}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hindi Translations */}
            <div className="space-y-3 mt-4">
              {line.translations.map((t) => (
                <div
                  key={t._id}
                  className="bg-gray-800 p-3 rounded border border-gray-700"
                >
                  <p>
                    <span className="text-blue-400 font-semibold">
                      {t.translator}:
                    </span>{" "}
                    {t.translatedText}
                  </p>

                  {/* 🔥 EVALUATE BUTTON */}
                  <button
                    className="mt-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                     onClick={() =>
                      navigate(`/evaluate/${line.sentenceId}/${t.T_ID || t._id}/${currentIndex}`, {
                        state: {
                          translations: line.translations,
                          sentence: line.text,
                          currentTranslation: t
                        }
                      })
                    }
                  >
                    Evaluate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Step>
     ))} 
    </Stepper>
  </div>
  </div>
);

};

export default LineViewer;