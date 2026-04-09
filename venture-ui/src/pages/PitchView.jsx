import {
  Mic,
  MicOff,
  Download,
  FileText,
} from "lucide-react";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PptxGenJS from "pptxgenjs";

export default function PitchView({ data }) {
  if (!data) {
    return (
      <div className="text-gray-400 text-center mt-10">
        Generate strategy first 🚀
      </div>
    );
  }

  const text = data?.pitch_deck || "";

  // =========================
  // 🔥 SMART PARSER
  // =========================
  const extractNumberedSections = () => {
    const regex = /(\d+)\.\s([A-Za-z ]+):([\s\S]*?)(?=\n\d+\.|$)/g;

    const sections = {};
    let match;

    while ((match = regex.exec(text)) !== null) {
      const title = match[2].toLowerCase().trim();
      const content = match[3].trim();
      sections[title] = content;
    }

    return sections;
  };

  const parsed = extractNumberedSections();

  // =========================
  // 🎯 MARKET STRUCTURE
  // =========================
  const marketSections = {
    market: parsed["market opportunity"] || "",
    segments: parsed["customer segments"] || "",
    behavior: parsed["buying behavior"] || "",
    trends: parsed["market trends"] || "",
    competition: parsed["competitive landscape"] || "",
    barriers: parsed["entry barriers"] || "",
    risks: parsed["market risks"] || "",
  };

  // =========================
  // 💰 DYNAMIC FUNDING ASK
  // =========================
  const extractFunding = () => {
    const regex = /Funding Ask:([\s\S]*?)(?=\n[A-Z]|$)/i;
    const match = text.match(regex);

    if (!match) return "$100,000";

    const moneyMatch = match[1].match(/\$[0-9,]+/);
    return moneyMatch ? moneyMatch[0] : "$100,000";
  };

  const ask = extractFunding();

  // =========================
  // 🎤 SPEECH
  // =========================
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakNarrative = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;

    speech.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  };

  // ================= PDF =================
  const downloadPDF = async () => {
    const element = document.getElementById("pitch-content");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("pitch-deck.pdf");
  };

  // ================= PPT =================
  const downloadPPT = () => {
    const pptx = new PptxGenJS();

    const createSlide = (title, content) => {
      const slide = pptx.addSlide();
      slide.background = { fill: "0f172a" };

      slide.addText(title, {
        x: 0.5,
        y: 0.5,
        fontSize: 30,
        bold: true,
        color: "10b981",
      });

      slide.addText(content || "N/A", {
        x: 0.5,
        y: 1.5,
        fontSize: 18,
        color: "ffffff",
        w: 9,
      });
    };

    createSlide("🌍 Market", marketSections.market);
    createSlide("👥 Customer Segments", marketSections.segments);
    createSlide("🛒 Buying Behaviour", marketSections.behavior);
    createSlide("📈 Market Trends", marketSections.trends);
    createSlide("🏁 Competitive Landscape", marketSections.competition);
    createSlide("🚧 Entry Barriers", marketSections.barriers);
    createSlide("⚠ Market Risks", marketSections.risks);
    createSlide("🎯 Funding Ask", ask);

    pptx.writeFile({ fileName: "Startup_Pitch.pptx" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32 animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic className="text-emerald-400" />
          <h1 className="text-3xl font-bold">Pitch Deck</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition"
          >
            <FileText size={16} /> PDF
          </button>

          <button
            onClick={downloadPPT}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition hover:scale-105"
          >
            <Download size={16} /> PPT
          </button>
        </div>
      </div>

      <p className="text-sm text-emerald-400">
        ● Live Pitch Generation Engine
      </p>

      {/* CONTENT */}
      <div id="pitch-content" className="space-y-6">

        {/* 🎨 COLORED MARKET GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card title="🌍 Market" content={marketSections.market} color="emerald" />
          <Card title="👥 Customer Segments" content={marketSections.segments} color="blue" />
          <Card title="🛒 Buying Behaviour" content={marketSections.behavior} color="purple" />
          <Card title="📈 Market Trends" content={marketSections.trends} color="orange" />
          <Card title="🏁 Competitive Landscape" content={marketSections.competition} color="emerald" />
          <Card title="🚧 Entry Barriers" content={marketSections.barriers} color="blue" />
          <Card title="⚠ Market Risks" content={marketSections.risks} color="red" />

        </div>

        {/* 💰 FUNDING ASK */}
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">🎯 Funding Ask</h2>
          <p className="text-5xl font-bold text-emerald-400">{ask}</p>
          <p className="text-gray-400 mt-2">
            Capital required to scale operations and growth
          </p>
        </div>

        {/* 🎤 FULL PITCH WITH MIC */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">📄 Full Pitch Narrative</h2>

            <button
              onClick={speakNarrative}
              className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              {isSpeaking ? <MicOff size={16} /> : <Mic size={16} />}
              {isSpeaking ? "Stop" : "Listen"}
            </button>
          </div>

          <p className="text-gray-300 whitespace-pre-wrap">
            {text}
          </p>
        </div>

      </div>
    </div>
  );
}

// 🎨 CARD COMPONENT
function Card({ title, content, color = "emerald" }) {
  const styles = {
    emerald: "bg-emerald-500/10 border-emerald-400",
    blue: "bg-blue-500/10 border-blue-400",
    purple: "bg-purple-500/10 border-purple-400",
    orange: "bg-orange-500/10 border-orange-400",
    red: "bg-red-500/10 border-red-400",
  };

  return (
    <div className={`glass-card p-6 border-l-4 ${styles[color]}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-300 whitespace-pre-wrap">
        {content || "Not available"}
      </p>
    </div>
  );
}