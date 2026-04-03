 
import React, { useState, useEffect } from "react";
 
import { useNavigate } from "react-router-dom";


import { motion } from "framer-motion";
import CurvedCarousel from "./CurvedCarousel";
import LightRays from "./LightRays";
import ElectricBorder from "./ElectricBorder";
import TextType from "./TextType";

import { Link } from "react-router-dom";
import Profile from "./Profile";

export default function Home({onGoToEvaluation}) {



  const navigate = useNavigate();
  
  // 🔗 Test Backend Connection
  useEffect(() => {
    fetch("http://localhost:5000")
      .then(res => res.text())
      .then(data => console.log("✅ Backend Connected:", data))
      .catch(err => console.log("❌ Backend Error:", err));
  }, []);

  function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // 3️⃣ Redirect to login page
  navigate("/login", { replace: true });
}


  const config = {
    footer_text:
      "TATVA makes human evaluation of translation systems faster, more accurate, and research-friendly.",
  };
  const title = "Upload Your Data";

  const [referenceFile, setReferenceFile] = useState(null);
  const [englishFile, setEnglishFile] = useState(null);
  const [translationFiles, setTranslationFiles] = useState([]);
  const [errors, setErrors] = useState({});
const [uploading, setUploading] = useState(false);
const [uploadVisible, setUploadVisible] = useState(false);


const allowedExtensions = ["xml", "json", "txt"];

function validateFile(file) {
  const ext = (file.name || "").split(".").pop().toLowerCase();
  return allowedExtensions.includes(ext);
}

function handleReferenceUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!validateFile(file)) {
    setErrors(prev => ({ ...prev, reference: "Only xml, json, txt allowed." }));
    return;
  }
  setReferenceFile(file);
  setErrors(prev => ({ ...prev, reference: null }));
}

function handleEnglishUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!validateFile(file)) {
    setErrors(prev => ({ ...prev, english: "Only xml, json, txt allowed." }));
    return;
  }
  setEnglishFile(file);
  setErrors(prev => ({ ...prev, english: null }));
}

function handleTranslationUpload(e) {
  const selected = Array.from(e.target.files || []);
  const validFiles = selected.filter(validateFile);
  const invalidFiles = selected.filter(f => !validateFile(f));
  if (invalidFiles.length > 0) {
    setErrors(prev => ({
      ...prev,
      translation: "Some files were rejected (only xml/json/txt allowed)."
    }));
  } else {
    setErrors(prev => ({ ...prev, translation: null }));
  }
  setTranslationFiles(validFiles);
}


async function handleUploadClick() {
  if (uploading) return;

  if (!referenceFile) {
    alert("Reference file is required.");
    return;
  }

  if (!englishFile) {
    alert("English file is required.");
    return;
  }

  if (translationFiles.length === 0) {
    alert("At least one translation file is required.");
    return;
  }

  const formData = new FormData();
  formData.append("reference", referenceFile);
  formData.append("english", englishFile);
  translationFiles.forEach(file => formData.append("translations", file));

  
    // 🔍 DEBUG: see exactly what is being sent
  console.log("FormData entries:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1].name);
  }

  
  setUploading(true);

  try {
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("token")}`,
      // },
      body: formData,
    });

      if (!res.ok) {
      throw new Error("Upload failed");
    }
    const data = await res.json();

    console.log("Upload response RAW:", data);
    setReferenceFile(null);
    setEnglishFile(null);
    setTranslationFiles([]);
    setUploadVisible(true);

    navigate("/translation/0");

  } catch (err) {
    alert("Upload failed");
  }finally{
    setUploading(false);
  }
}



 const tatvaLines = [
  "Watch how TATVA transforms raw translation outputs into clear, human-centred evaluation insights. First, users upload their XML or JSON file containing multiple translations for each source sentence. TATVA automatically reads and organizes the data for evaluation.",
  "Human evaluators then review each translation, scoring fluency, adequacy, and overall quality. They can compare different system outputs side-by-side and provide accurate judgments.",
  "Once all evaluations are submitted, TATVA aggregates the scores from multiple evaluators and calculates final averages. The platform generates a clean summary showing per-sentence scores, system-wise performance, and overall rankings.",
  "The final dashboard helps researchers clearly identify which translation system performs best according to human judgment. This workflow makes TATVA fast, reliable, and research-friendly for real-world evaluation needs."
];


 
  return (
    

      <div className="relative min-h-screen bg-black text-white font-inter overflow-x-hidden">
    
    

    <div className="absolute inset-0 pointer-events-none">
   
           <LightRays
      raysOrigin="top-center"
      raysColor="#ebf3f3ff"
      raysSpeed={1.5}
      followMouse={true}
      mouseInfluence={0.2}
      className="absolute inset-0 pointer-events-none"
    />
           </div>
      <div className="relative ">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
        
          <span className="text-lg font-semibold">TATVA</span>
        </div>

        <ul className="hidden md:flex space-x-8 text-gray-300">
  <li>
    <a href="#home" className="hover:text-white cursor-pointer">Home</a>
  </li>
  <li>
    <a href="#features" className="hover:text-white cursor-pointer">Features</a>
  </li>
  <li>
    <a href="#how-it-works" className="hover:text-white cursor-pointer">About Us</a>

  </li>
  <li>
    <a href="#upload" className="hover:text-white cursor-pointer">Upload</a>
  </li>
  <li>
  <Link to="/profile" className="hover:text-white cursor-pointer">
    Profile
  </Link>
</li>
</ul>


        <div className="space-x-4">
          
         <button
  onClick={handleLogout}
  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-black rounded-md transition"
>
  Logout
</button>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="text-center mt-20 relative overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Human Evaluation of <br /> Machine translation System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-400"
        >
          <span className="text-white-400 font-semibold">T</span>ranslation <span className="text-white-400 font-semibold">A</span>ssessment with <span className="text-white-400 font-semibold">T</span>rustworthy <span className="text-white-400 font-semibold">V</span>erdict and <span className="text-white-400 font-semibold">A</span>nnotation
        </motion.p>

        {/* <div className="absolute inset-0 hero-bg"></div> */}
      </section>



      {/* CAROUSEL SECTION */}
       <div id="features">
  <CurvedCarousel />
</div>



      {/* COMPARISON SECTION */}
      


     

        {/* <section className="max-w-4xl mx-auto mt-12 px-6 text-left">
  <h3 className="text-2xl md:text-3xl font-semibold mb-4">
    How TATVA Works
  </h3>

  <DecryptedText
    text={tatvaDescription}
    animateOn="view"            // 👈 auto-animate when section comes into view
    revealDirection="center"    // same style as example 3
    speed={40}
    maxIterations={20}
    className="text-base md:text-lg leading-relaxed text-gray-200"
    encryptedClassName="text-base md:text-lg leading-relaxed text-emerald-400"
  />
</section>

          <section className="px-6 py-12 max-w-3xl mx-auto flex justify-center">
        <ElectricBorder
          color="#7df9ff"
          speed={1}
          chaos={0.5}
          thickness={2}
          style={{ borderRadius: 16 }}
        >
          <div className="w-[500px] h-[300px] flex items-center justify-center">
            <video
        src="/demovideo.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

          </div>
        </ElectricBorder>
      </section>
        </div> */}
      

{/* HOW + VIDEO SIDE BY SIDE */}
<section  id="how-it-works" className="max-w-6xl mx-auto mt-12 px-6">
  <div className="grid md:grid-cols-2 gap-12 items-center">

   {/* LEFT: Text typing animation */}
    <div className="text-left">
      <h3 className="text-2xl md:text-3xl font-semibold mb-4">
        How TATVA Works
      </h3>

      <TextType
        text={tatvaLines}
        typingSpeed={90}
        pauseDuration={1500}
        showCursor={true}
        startOnVisible={true}
        cursorCharacter="|"
        className="text-base md:text-lg leading-relaxed text-gray-200"
      />
    </div>

    {/* RIGHT SIDE – Electric Border with Video */}
    <div className="flex justify-center md:justify-end">
      <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.5}
        thickness={2}
        style={{ borderRadius: 16 }}
      >
        <div className="w-[500px] h-[300px] rounded-[16px] overflow-hidden">
          <video
            src=""
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </ElectricBorder>
    </div>

  </div>
</section>

    {/* ================= UPLOAD SECTION ================= */}
{/* ================= UPLOAD SECTION ================= */}
<section id="upload" className="py-20">
  <input type="file" accept=".xml,.json,.txt" hidden id="reference-input" onChange={handleReferenceUpload} />
  <input type="file" accept=".xml,.json,.txt" hidden id="english-input" onChange={handleEnglishUpload} />
  <input type="file" accept=".xml,.json,.txt" multiple hidden id="translation-input" onChange={handleTranslationUpload} />

  <div className="max-w-5xl mx-auto px-6">

    <div className="text-center mb-14">
      <p className="text-xs uppercase tracking-[0.3em] text-indigo-400 mb-3 font-medium">Step 1</p>
      <h2 className="text-4xl font-bold text-white mb-3">Upload your data</h2>
      <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
        Provide your source, translations, and reference files to begin human evaluation
      </p>
    </div>

    <div className="group grid grid-cols-1 md:grid-cols-3 gap-5">

      {/* === Card 1: English === */}
      <div
        onClick={() => document.getElementById("english-input").click()}
        className="relative flex flex-col p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:scale-[1.03] group-hover:[&:not(:hover)]:blur-[2px] group-hover:[&:not(:hover)]:opacity-60"
        style={{
          background: englishFile ? "linear-gradient(135deg, #0f1a15 0%, #111a14 100%)" : "linear-gradient(135deg, #141414 0%, #161a16 100%)",
          border: englishFile ? "1px solid rgba(52,211,153,0.45)" : "1px solid rgba(52,211,153,0.18)",
          boxShadow: englishFile ? "0 0 28px rgba(52,211,153,0.1), inset 0 1px 0 rgba(52,211,153,0.08)" : "0 2px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg, transparent, rgba(52,211,153,0.7), transparent)" }} />

        <div className="flex items-center justify-between mb-5">
          <div style={{ width:44, height:44, borderRadius:12, background:"rgba(52,211,153,0.12)", border:"1px solid rgba(52,211,153,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(52,211,153)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
            </svg>
          </div>
          <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.15em", color:"rgba(255,255,255,0.18)" }}>01</span>
        </div>

        <p style={{ fontSize:17, fontWeight:700, color:"rgba(255,255,255,0.95)", marginBottom:6 }}>English source</p>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginBottom:20, lineHeight:1.6, minHeight:36 }}>
          {englishFile
            ? <span style={{ color:"rgba(52,211,153,0.85)" }}>✓ {englishFile.name} · {(englishFile.size/1024).toFixed(1)} KB</span>
            : "Upload your _En.xml source file"
          }
        </p>

        <div className="mt-auto mb-1">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); document.getElementById("english-input").click(); }}
            style={{ position:"relative", width:"100%", height:46, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid rgba(52,211,153,0.55)", boxShadow:"4px 4px 0px rgba(52,211,153,0.3)", backgroundColor:"rgba(52,211,153,0.1)", borderRadius:10, overflow:"hidden", transition:"all 0.3s" }}
            onMouseEnter={e => {
              e.currentTarget.querySelector(".uv-text").style.color = "transparent";
              e.currentTarget.querySelector(".uv-icon").style.width = "100%";
              e.currentTarget.querySelector(".uv-icon").style.transform = "translateX(0)";
            }}
            onMouseLeave={e => {
              e.currentTarget.querySelector(".uv-text").style.color = "#fff";
              e.currentTarget.querySelector(".uv-icon").style.width = "46px";
              e.currentTarget.querySelector(".uv-icon").style.transform = "translateX(calc(100% + 200px))";
            }}
            onMouseDown={e => { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "0px 0px rgba(52,211,153,0.3)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "4px 4px 0px rgba(52,211,153,0.3)"; }}
          >
            <span className="uv-text" style={{ color:"#fff", fontWeight:700, fontSize:13, transition:"color 0.3s", whiteSpace:"nowrap", letterSpacing:"0.06em", zIndex:1 }}>
              BROWSE FILE
            </span>
            <span className="uv-icon" style={{ position:"absolute", right:0, transform:"translateX(calc(100% + 200px))", height:"100%", width:46, backgroundColor:"rgba(52,211,153,0.22)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgb(52,211,153)">
                <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
              </svg>
            </span>
          </button>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:12, marginTop:14 }}>
          <span style={{ fontSize:11, color: englishFile ? "rgba(52,211,153,0.8)" : "rgba(255,255,255,0.25)" }}>
            {englishFile ? "1 file ready" : "No file selected"}
          </span>
        </div>
      </div>

      {/* === Card 2: Translations === */}
      <div
        onClick={() => document.getElementById("translation-input").click()}
        className="relative flex flex-col p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:scale-[1.03] group-hover:[&:not(:hover)]:blur-[2px] group-hover:[&:not(:hover)]:opacity-60"
        style={{
          background: translationFiles.length > 0 ? "linear-gradient(135deg, #13101a 0%, #16111e 100%)" : "linear-gradient(135deg, #141414 0%, #17141a 100%)",
          border: translationFiles.length > 0 ? "1px solid rgba(167,139,250,0.45)" : "1px solid rgba(167,139,250,0.18)",
          boxShadow: translationFiles.length > 0 ? "0 0 28px rgba(167,139,250,0.1), inset 0 1px 0 rgba(167,139,250,0.08)" : "0 2px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg, transparent, rgba(167,139,250,0.7), transparent)" }} />

        <div className="flex items-center justify-between mb-5">
          <div style={{ width:44, height:44, borderRadius:12, background:"rgba(167,139,250,0.12)", border:"1px solid rgba(167,139,250,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(167,139,250)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/>
              <path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/>
            </svg>
          </div>
          <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.15em", color:"rgba(255,255,255,0.18)" }}>02</span>
        </div>

        <p style={{ fontSize:17, fontWeight:700, color:"rgba(255,255,255,0.95)", marginBottom:6 }}>Translation files</p>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginBottom:20, lineHeight:1.6, minHeight:36 }}>
          {translationFiles.length > 0
            ? translationFiles.map((f, i) => (
                <div key={i} style={{ color:"rgba(167,139,250,0.85)" }}>✓ {f.name}</div>
              ))
            : "Upload one or more _Hi_*.xml files"
          }
        </div>

        <div className="mt-auto mb-1">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); document.getElementById("translation-input").click(); }}
            style={{ position:"relative", width:"100%", height:46, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid rgba(167,139,250,0.55)", boxShadow:"4px 4px 0px rgba(167,139,250,0.3)", backgroundColor:"rgba(167,139,250,0.1)", borderRadius:10, overflow:"hidden", transition:"all 0.3s" }}
            onMouseEnter={e => {
              e.currentTarget.querySelector(".uv-text").style.color = "transparent";
              e.currentTarget.querySelector(".uv-icon").style.width = "100%";
              e.currentTarget.querySelector(".uv-icon").style.transform = "translateX(0)";
            }}
            onMouseLeave={e => {
              e.currentTarget.querySelector(".uv-text").style.color = "#fff";
              e.currentTarget.querySelector(".uv-icon").style.width = "46px";
              e.currentTarget.querySelector(".uv-icon").style.transform = "translateX(calc(100% + 200px))";
            }}
            onMouseDown={e => { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "0px 0px rgba(167,139,250,0.3)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "4px 4px 0px rgba(167,139,250,0.3)"; }}
          >
            <span className="uv-text" style={{ color:"#fff", fontWeight:700, fontSize:13, transition:"color 0.3s", whiteSpace:"nowrap", letterSpacing:"0.06em", zIndex:1 }}>
              BROWSE FILES
            </span>
            <span className="uv-icon" style={{ position:"absolute", right:0, transform:"translateX(calc(100% + 200px))", height:"100%", width:46, backgroundColor:"rgba(167,139,250,0.22)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgb(167,139,250)">
                <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
              </svg>
            </span>
          </button>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:12, marginTop:14 }}>
          <span style={{ fontSize:11, color: translationFiles.length > 0 ? "rgba(167,139,250,0.8)" : "rgba(255,255,255,0.25)" }}>
            {translationFiles.length > 0 ? `${translationFiles.length} file${translationFiles.length > 1 ? "s" : ""} ready` : "No files selected"}
          </span>
        </div>
      </div>

      {/* === Card 3: Reference === */}
      <div
        onClick={() => document.getElementById("reference-input").click()}
        className="relative flex flex-col p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:scale-[1.03] group-hover:[&:not(:hover)]:blur-[2px] group-hover:[&:not(:hover)]:opacity-60"
        style={{
          background: referenceFile ? "linear-gradient(135deg, #101018 0%, #12121e 100%)" : "linear-gradient(135deg, #141414 0%, #141418 100%)",
          border: referenceFile ? "1px solid rgba(129,140,248,0.45)" : "1px solid rgba(129,140,248,0.18)",
          boxShadow: referenceFile ? "0 0 28px rgba(129,140,248,0.1), inset 0 1px 0 rgba(129,140,248,0.08)" : "0 2px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg, transparent, rgba(129,140,248,0.7), transparent)" }} />

        <div className="flex items-center justify-between mb-5">
          <div style={{ width:44, height:44, borderRadius:12, background:"rgba(129,140,248,0.12)", border:"1px solid rgba(129,140,248,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(129,140,248)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.15em", color:"rgba(255,255,255,0.18)" }}>03</span>
        </div>

        <p style={{ fontSize:17, fontWeight:700, color:"rgba(255,255,255,0.95)", marginBottom:6 }}>Reference file</p>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginBottom:20, lineHeight:1.6, minHeight:36 }}>
          {referenceFile
            ? <span style={{ color:"rgba(129,140,248,0.85)" }}>✓ {referenceFile.name} · {(referenceFile.size/1024).toFixed(1)} KB</span>
            : "Accepted formats: .xml · .json · .txt"
          }
        </p>

        <div className="mt-auto mb-1">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); document.getElementById("reference-input").click(); }}
            style={{ position:"relative", width:"100%", height:46, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid rgba(129,140,248,0.55)", boxShadow:"4px 4px 0px rgba(129,140,248,0.3)", backgroundColor:"rgba(129,140,248,0.1)", borderRadius:10, overflow:"hidden", transition:"all 0.3s" }}
            onMouseEnter={e => {
              e.currentTarget.querySelector(".uv-text").style.color = "transparent";
              e.currentTarget.querySelector(".uv-icon").style.width = "100%";
              e.currentTarget.querySelector(".uv-icon").style.transform = "translateX(0)";
            }}
            onMouseLeave={e => {
              e.currentTarget.querySelector(".uv-text").style.color = "#fff";
              e.currentTarget.querySelector(".uv-icon").style.width = "46px";
              e.currentTarget.querySelector(".uv-icon").style.transform = "translateX(calc(100% + 200px))";
            }}
            onMouseDown={e => { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "0px 0px rgba(129,140,248,0.3)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "4px 4px 0px rgba(129,140,248,0.3)"; }}
          >
            <span className="uv-text" style={{ color:"#fff", fontWeight:700, fontSize:13, transition:"color 0.3s", whiteSpace:"nowrap", letterSpacing:"0.06em", zIndex:1 }}>
              BROWSE FILE
            </span>
            <span className="uv-icon" style={{ position:"absolute", right:0, transform:"translateX(calc(100% + 200px))", height:"100%", width:46, backgroundColor:"rgba(129,140,248,0.22)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgb(129,140,248)">
                <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
              </svg>
            </span>
          </button>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:12, marginTop:14 }}>
          <span style={{ fontSize:11, color: referenceFile ? "rgba(129,140,248,0.8)" : "rgba(255,255,255,0.25)" }}>
            {referenceFile ? "1 file ready" : "No file selected"}
          </span>
        </div>
      </div>

    </div>

    {/* Bottom actions */}
    <div className="text-center mt-10">
      {((referenceFile ? 1 : 0) + (englishFile ? 1 : 0) + translationFiles.length) > 0 && (
        <p className="text-emerald-400 text-sm mb-4">
          {(referenceFile ? 1 : 0) + (englishFile ? 1 : 0) + translationFiles.length} file(s) selected
        </p>
      )}
      <button
        type="button"
        onClick={handleUploadClick}
        disabled={uploading}
        className="px-10 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm tracking-wide"
      >
        {uploading ? "Uploading..." : "Upload & continue →"}
      </button>
      {uploadVisible && <p className="text-emerald-400 text-sm mt-4">Upload successful! Redirecting...</p>}
    </div>

  </div>
</section>
{/* ================= END UPLOAD SECTION ================= */}
{/* ================= END UPLOAD SECTION ================= */}




  


      {/* Footer */}
      <footer id="contact" className="bg-[#0b0710] text-white py-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                
                <span className="text-xl font-semibold">TATVA</span>
              </div>
              <p id="footer-text" className="text-gray-300 mb-6">
                {"TATVA (h-eval) is a human-centric evaluation platform designed to assess the quality of machine translation systems across multiple languages using structured human judgments."
}
              </p>
              <p className="text-gray-400 text-sm">Contact: hevalpro5@gmail.com</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <div className="space-y-3">
                <a href="#home" className="block text-gray-300 hover:text-white">Home</a>
                <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
                <a href="#how-it-works" className="block text-gray-300 hover:text-white">About Us</a>
                <a href="#upload" className="block text-gray-300 hover:text-white">Upload</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Research</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-300 hover:text-white">Evaluation Methodology</a>
                <a href="#" className="block text-gray-300 hover:text-white">Scoring Guidelines</a>
                <a href="#https://github.com/H-eval/H_eval" className="block text-gray-300 hover:text-white"></a>
                {/* <a href="#" className="block text-gray-300 hover:text-white">License</a> */}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2025 TATVA (H-eval)</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
  );
}
  


