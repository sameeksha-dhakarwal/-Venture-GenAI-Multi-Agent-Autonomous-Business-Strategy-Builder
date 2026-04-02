import {
  Mic,
  Target,
  TrendingUp,
  DollarSign,
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

  // 🔥 SMART EXTRACTOR
  const extract = (label, fallback) => {
    const regex = new RegExp(label + ":(.*?)(\\n\\n|$)", "is");
    const match = text.match(regex);
    return match ? match[1].trim() : fallback;
  };

  const problem = extract("Problem", "Problem not defined");
  const solution = extract("Solution", "Solution not defined");
  const market = extract("Market", "Market opportunity");
  const traction = extract("Traction", "Early traction stage");
  const model = extract("Business Model", "Revenue strategy");
  const ask = extract("Ask", "$100,000");

  // 🔥 DYNAMIC REVENUE (based on idea)
  const seed = text.length || 50;

  const revenueData = [
    { name: "2021", value: seed * 5 },
    { name: "2022", value: seed * 10 },
    { name: "2023", value: seed * 20 },
    { name: "2024", value: seed * 35 },
    { name: "2025", value: seed * 60 },
  ];

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

    // TITLE
    let slide = pptx.addSlide();
    slide.background = { fill: "0f172a" };

    slide.addText("🚀 Venture GenAI", {
      x: 1,
      y: 1.5,
      fontSize: 36,
      bold: true,
      color: "10b981",
    });

    slide.addText("AI Startup Strategy Builder", {
      x: 1,
      y: 2.5,
      fontSize: 20,
      color: "ffffff",
    });

    createSlide("🚨 Problem", problem);
    createSlide("💡 Solution", solution);
    createSlide("🌍 Market", market);

    // 📈 CHART
    slide = pptx.addSlide();
    slide.background = { fill: "0f172a" };

    slide.addText("📈 Revenue Growth", {
      x: 0.5,
      y: 0.5,
      fontSize: 28,
      bold: true,
      color: "10b981",
    });

    slide.addChart(
      pptx.ChartType.line,
      [
        {
          name: "Revenue",
          labels: revenueData.map((d) => d.name),
          values: revenueData.map((d) => d.value),
        },
      ],
      { x: 1, y: 1.5, w: 8, h: 4 }
    );

    createSlide("📈 Traction", traction);
    createSlide("💰 Business Model", model);

    // 🎯 ASK
    slide = pptx.addSlide();
    slide.background = { fill: "0f172a" };

    slide.addText("🎯 Funding Ask", {
      x: 1,
      y: 1,
      fontSize: 32,
      bold: true,
      color: "10b981",
    });

    slide.addText(ask, {
      x: 1,
      y: 2,
      fontSize: 40,
      bold: true,
      color: "22c55e",
    });

    createSlide("📄 Full Pitch", text);

    pptx.writeFile({ fileName: "Startup_Pitch.pptx" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic className="text-emerald-400" />
          <h1 className="text-3xl font-bold">Pitch Deck</h1>
        </div>

        <div className="flex gap-3">
          <button onClick={downloadPDF} className="px-4 py-2 bg-gray-700 rounded-lg">
            <FileText size={16} /> PDF
          </button>
          <button onClick={downloadPPT} className="px-4 py-2 bg-emerald-600 rounded-lg">
            <Download size={16} /> PPT
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div id="pitch-content" className="space-y-6">

        {/* STORY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[problem, solution, market].map((content, i) => (
            <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">
                {i === 0 ? "🚨 Problem" : i === 1 ? "💡 Solution" : "🌍 Market"}
              </h2>
              <p className="text-gray-300">{content}</p>
            </div>
          ))}
        </div>

        {/* TRACTION + MODEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-emerald-400" />
              Traction
            </h2>
            <p className="text-gray-300">{traction}</p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="text-emerald-400" />
              Business Model
            </h2>
            <p className="text-gray-300">{model}</p>
          </div>
        </div>

        {/* ASK */}
        <div className="p-6 bg-white/5 border border-white/10 text-center rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex justify-center gap-2">
            <Target className="text-emerald-400" />
            The Ask
          </h2>
          <p className="text-4xl font-bold text-emerald-400">{ask}</p>
        </div>

        {/* FULL */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Full Pitch</h2>
          <div className="text-gray-300 whitespace-pre-wrap">
            {text}
          </div>
        </div>

      </div>
    </div>
  );
}