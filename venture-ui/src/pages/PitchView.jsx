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

  const points =
    data.pitch_deck?.split(".").filter((p) => p.trim().length > 20) || [];

  // ================= PDF EXPORT =================
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

  // ================= PPT EXPORT (PRO VERSION) =================
  const downloadPPT = () => {
    const pptx = new PptxGenJS();

    const bgColor = "0f172a";
    const titleColor = "10b981";
    const textColor = "ffffff";

    const revenueData = [
      { name: "2021", value: 10 },
      { name: "2022", value: 25 },
      { name: "2023", value: 40 },
      { name: "2024", value: 70 },
      { name: "2025", value: 120 },
    ];

    const createSlide = (title, content) => {
      const slide = pptx.addSlide();
      slide.background = { fill: bgColor };

      slide.addText(title, {
        x: 0.5,
        y: 0.5,
        fontSize: 32,
        bold: true,
        color: titleColor,
      });

      slide.addText(content, {
        x: 0.5,
        y: 1.5,
        fontSize: 18,
        color: textColor,
        w: 9,
      });

      return slide;
    };

    // 🚀 TITLE
    let slide = pptx.addSlide();
    slide.background = { fill: bgColor };

    slide.addText("🚀 Venture GenAI", {
      x: 1,
      y: 1.5,
      fontSize: 36,
      bold: true,
      color: titleColor,
    });

    slide.addText("AI Startup Strategy Builder", {
      x: 1,
      y: 2.5,
      fontSize: 20,
      color: textColor,
    });

    // Slides
    createSlide("🚨 Problem", points[0] || "Problem");
    createSlide("💡 Solution", points[1] || "Solution");
    createSlide("🌍 Market", points[2] || "Market");

    // 📈 Chart slide
    slide = pptx.addSlide();
    slide.background = { fill: bgColor };

    slide.addText("📈 Revenue Growth", {
      x: 0.5,
      y: 0.5,
      fontSize: 28,
      bold: true,
      color: titleColor,
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
      {
        x: 1,
        y: 1.5,
        w: 8,
        h: 4,
        chartColors: ["10b981"],
      }
    );

    createSlide("📈 Traction", points.slice(3, 6).join("\n• "));
    createSlide("💰 Business Model", points.slice(6, 9).join("\n• "));

    // 🎯 ASK
    slide = pptx.addSlide();
    slide.background = { fill: bgColor };

    slide.addText("🎯 Funding Ask", {
      x: 1,
      y: 1,
      fontSize: 32,
      bold: true,
      color: titleColor,
    });

    slide.addText("$500,000", {
      x: 1,
      y: 2,
      fontSize: 40,
      bold: true,
      color: "22c55e",
    });

    // 📄 FULL
    createSlide("📄 Full Pitch", data.pitch_deck);

    pptx.writeFile({ fileName: "Startup_Pitch_Pro.pptx" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">

      {/* 🔥 HEADER + BUTTONS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic className="text-emerald-400" />
          <h1 className="text-3xl font-bold">Pitch Deck</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            <FileText size={16} />
            PDF
          </button>

          <button
            onClick={downloadPPT}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500"
          >
            <Download size={16} />
            PPT
          </button>
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div id="pitch-content" className="space-y-6">

        {/* 📊 PROGRESS */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-2">Deck Completion</h2>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div className="bg-emerald-500 h-3 rounded-full w-[75%]" />
          </div>
          <p className="text-sm text-gray-400 mt-2">75% Complete</p>
        </div>

        {/* 🧠 STORY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Problem", "Solution", "Market"].map((title, i) => (
            <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-xl font-semibold mb-3">{
                i === 0 ? "🚨 Problem" :
                i === 1 ? "💡 Solution" :
                "🌍 Market"
              }</h2>
              <p className="text-gray-300">
                {points[i] || "Content unavailable"}
              </p>
            </div>
          ))}
        </div>

        {/* 📈 TRACTION + MODEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-emerald-400" />
              Traction
            </h2>
            <ul className="text-gray-300">
              {points.slice(3, 6).map((p, i) => (
                <li key={i}>• {p}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="text-emerald-400" />
              Business Model
            </h2>
            <ul className="text-gray-300">
              {points.slice(6, 9).map((p, i) => (
                <li key={i}>• {p}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 🎯 ASK */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
            <Target className="text-emerald-400" />
            The Ask
          </h2>
          <p className="text-4xl font-bold text-emerald-400">$500K</p>
        </div>

        {/* 📄 FULL */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Full Pitch</h2>
          <div className="text-gray-300 whitespace-pre-wrap">
            {data.pitch_deck}
          </div>
        </div>

      </div>
    </div>
  );
}