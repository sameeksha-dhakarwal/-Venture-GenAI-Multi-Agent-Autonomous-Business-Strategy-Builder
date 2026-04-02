import React from "react";
import { Brain } from "lucide-react";

function BusinessView({ data }) {
  if (!data) {
    return (
      <div className="text-gray-400 text-center mt-10">
        Generate strategy first 🚀
      </div>
    );
  }

  const text = data?.business_model || "";

  // 🔥 EXTRACTION
  const extractSection = (label, fallback) => {
    const match = text.match(new RegExp(label + ":(.*?)(\\n[A-Z]|$)", "is"));
    return match ? match[1].trim() : fallback;
  };

  const extractList = (label, fallback) => {
    const section = extractSection(label, "");
    if (!section) return fallback;

    return section
      .split("\n")
      .map((l) => l.replace("-", "").trim())
      .filter((l) => l.length > 5);
  };

  const problem = extractSection("Problem Statement", "Problem varies");
  const solution = extractSection("Solution Overview", "Solution varies");
  const usp = extractSection("Unique Selling Proposition", "Unique advantage");

  const resources = extractList("Key Resources", [
    "Technology",
    "Team",
    "Infrastructure",
  ]);

  const strengths = extractList("Strengths", ["Strong innovation"]);
  const weaknesses = extractList("Weaknesses", ["Execution risk"]);
  const opportunities = extractList("Opportunities", ["Market growth"]);
  const threats = extractList("Threats", ["Competition"]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32 animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Brain className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Business Analysis</h1>
      </div>

      <p className="text-sm text-emerald-400">
        ● Live Business Strategy Engine
      </p>

      {/* PROBLEM + SOLUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card title="🚨 Problem">
          <p>{problem}</p>
        </Card>

        <Card title="💡 Solution">
          <p>{solution}</p>
        </Card>

      </div>

      {/* SWOT */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">📊 SWOT Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <SWOT title="Strengths" items={strengths} color="emerald" />
          <SWOT title="Weaknesses" items={weaknesses} color="red" />
          <SWOT title="Opportunities" items={opportunities} color="blue" />
          <SWOT title="Threats" items={threats} color="yellow" />

        </div>
      </div>

      {/* USP + RESOURCES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card title="🎯 Unique Selling Proposition">
          <p>{usp}</p>
        </Card>

        <Card title="🧩 Key Resources">
          <ul className="space-y-2">
            {resources.slice(0, 4).map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </Card>

      </div>

      {/* RAW */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">
          📄 Business Model Details
        </h2>

        <div className="text-gray-300 whitespace-pre-wrap">
          {text}
        </div>
      </div>

    </div>
  );
}

// 🔥 CARD
function Card({ title, children }) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="text-gray-300">{children}</div>
    </div>
  );
}

// 🔥 FIXED SWOT COLORS
function SWOT({ title, items, color }) {
  const colorMap = {
    emerald: "text-emerald-400",
    red: "text-red-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <h3 className={`font-semibold ${colorMap[color]} mb-2`}>
        {title}
      </h3>
      <ul className="text-gray-300 space-y-1">
        {items.slice(0, 3).map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default BusinessView;