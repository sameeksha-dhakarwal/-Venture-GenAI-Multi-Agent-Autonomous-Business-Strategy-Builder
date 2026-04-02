import {
  Mic,
  Download,
  FileText,
} from "lucide-react";

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

  const extract = (label, fallback) => {
    const match = text.match(new RegExp(label + ":(.*?)(\\n[A-Z]|$)", "is"));
    return match ? match[1].trim() : fallback;
  };

  const problem = extract("Problem Statement", "Problem not defined");
  const solution = extract("Solution Pitch", "Solution not defined");
  const market = extract("Market Opportunity", "Market opportunity");
  const traction = extract("Traction", "Early traction stage");
  const model = extract("Business Model", "Revenue strategy");
  const ask = extract("Funding Ask", "$100,000");

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

      slide.addText(content, {
        x: 0.5,
        y: 1.5,
        fontSize: 18,
        color: "ffffff",
        w: 9,
      });
    };

    createSlide("🚨 Problem", problem);
    createSlide("💡 Solution", solution);
    createSlide("🌍 Market", market);
    createSlide("📈 Traction", traction);
    createSlide("💰 Business Model", model);
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

        <Grid items={[problem, solution, market]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="📈 Traction" content={traction} />
          <Card title="💰 Business Model" content={model} />
        </div>

        {/* 🎯 FUNDING ASK (HIGHLIGHT) */}
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">🎯 Funding Ask</h2>
          <p className="text-5xl font-bold text-emerald-400">{ask}</p>
          <p className="text-gray-400 mt-2">
            Capital required to scale operations and growth
          </p>
        </div>

        {/* FULL PITCH */}
        <Card title="📄 Full Pitch Narrative" content={text} />

      </div>
    </div>
  );
}

// 🔥 COMPONENTS

function Card({ title, content }) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function Grid({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((c, i) => (
        <div key={i} className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-3">
            {i === 0 ? "🚨 Problem" : i === 1 ? "💡 Solution" : "🌍 Market"}
          </h2>
          <p className="text-gray-300">{c}</p>
        </div>
      ))}
    </div>
  );
}