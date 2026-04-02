import React from "react";
import { Brain, Target, Lightbulb } from "lucide-react";

function BusinessView({ data }) {
  if (!data) {
    return (
      <div className="text-gray-400 text-center mt-10">
        Generate strategy first 🚀
      </div>
    );
  }

  const text = data?.business_model || "";

  // 🔥 SMART SECTION EXTRACTOR
  const extractSection = (label, fallback) => {
    const regex = new RegExp(label + ":(.*?)(\\n\\n|$)", "is");
    const match = text.match(regex);
    return match ? match[1].trim() : fallback;
  };

  // 🔥 EXTRACT DATA PROPERLY
  const problem = extractSection(
    "Problem Statement",
    "Users face inefficiencies in current systems."
  );

  const solution = extractSection(
    "Solution Overview",
    "AI-powered platform solving core problems."
  );

  const usp = extractSection(
    "Unique Selling Proposition",
    "Differentiated AI-driven approach with scalability."
  );

  const resources = extractSection(
    "Key Resources",
    "Technology, team, and infrastructure."
  ).split("\n");

  // 🔥 SWOT EXTRACTION
  const extractList = (label, fallback) => {
    const regex = new RegExp(label + ":(.*?)(\\n[A-Z]|$)", "is");
    const match = text.match(regex);
    if (!match) return fallback;

    return match[1]
      .split("\n")
      .map((l) => l.replace("-", "").trim())
      .filter((l) => l.length > 5);
  };

  const strengths = extractList("Strengths", ["Strong innovation"]);
  const weaknesses = extractList("Weaknesses", ["Early-stage risks"]);
  const opportunities = extractList("Opportunities", ["Growing demand"]);
  const threats = extractList("Threats", ["Market competition"]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32">

      {/* 🔥 HEADER */}
      <div className="flex items-center gap-3">
        <Brain className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Business Analysis</h1>
      </div>

      {/* 🧠 PROBLEM + SOLUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-3">🚨 Problem</h2>
          <p className="text-gray-300">{problem}</p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="text-emerald-400" />
            Solution
          </h2>
          <p className="text-gray-300">{solution}</p>
        </div>

      </div>

      {/* 📊 SWOT ANALYSIS */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">📊 SWOT Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold text-emerald-400 mb-2">Strengths</h3>
            <ul className="text-gray-300 space-y-1">
              {strengths.slice(0, 3).map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold text-red-400 mb-2">Weaknesses</h3>
            <ul className="text-gray-300 space-y-1">
              {weaknesses.slice(0, 3).map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold text-blue-400 mb-2">Opportunities</h3>
            <ul className="text-gray-300 space-y-1">
              {opportunities.slice(0, 3).map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold text-yellow-400 mb-2">Threats</h3>
            <ul className="text-gray-300 space-y-1">
              {threats.slice(0, 3).map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* 🎯 USP + RESOURCES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="text-emerald-400" />
            Unique Selling Proposition
          </h2>
          <p className="text-gray-300">{usp}</p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">
            🧩 Key Resources
          </h2>

          <ul className="text-gray-300 space-y-2">
            {resources.slice(0, 4).map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* 📄 RAW AI OUTPUT */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">
          📄 Business Model Details
        </h2>

        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {data.business_model}
        </div>
      </div>

    </div>
  );
}

export default BusinessView;