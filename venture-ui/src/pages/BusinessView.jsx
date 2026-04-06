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

  // 🔥 EXTRACTION (UNCHANGED)
  const extractSection = (label, fallback) => {
    const regex = new RegExp(
      `${label}:([\\s\\S]*?)(?=\\n[A-Z][a-zA-Z ]+:|$)`,
      "i"
    );
    const match = text.match(regex);
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

  // 🔥 DATA
  const summary = extractSection("Business Idea Summary", "Summary not available");
  const value = extractSection("Value Proposition", "Value proposition not available");

  const problem = extractSection("Problem Statement", "Problem varies");
  const solution = extractSection("Solution Overview", "Solution varies");

  const businessModel = extractSection("Business Model", "Not available");
  const pricing = extractSection("Pricing Strategy", "Not available");
  const usp = extractSection("Unique Selling Proposition", "Unique advantage");

  const revenue = extractList("Revenue Streams", ["No revenue data"]);
  const activities = extractList("Key Activities", ["No activities"]);

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

      {/* 🔥 COMPACT SUMMARY + VALUE */}
      <div className="space-y-4">
        <CompactCard title="📌 Business Idea Summary">
          <p>{summary}</p>
        </CompactCard>

        <CompactCard title="💎 Value Proposition">
          <p>{value}</p>
        </CompactCard>
      </div>

      {/* PROBLEM + SOLUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="🚨 Problem">
          <p>{problem}</p>
        </Card>

        <Card title="💡 Solution">
          <p>{solution}</p>
        </Card>
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* LEFT */}
        <div className="space-y-4">

          <CompactCard title="🏗️ Business Model">
            <p>{businessModel}</p>
          </CompactCard>

          <CompactCard title="🎯 Unique Selling Proposition">
            <p>{usp}</p>
          </CompactCard>

          <CompactCard title="💰 Pricing Strategy">
            <p>{pricing}</p>
          </CompactCard>

        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          <h2 className="text-xl font-semibold">📊 Revenue Streams</h2>

          {revenue.map((r, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/10 
              transition duration-300 hover:scale-[1.03] hover:border-emerald-400/30
              animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              • {r}
            </div>
          ))}

        </div>

      </div>

      {/* ACTIVITIES + RESOURCES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card title="⚙️ Key Activities">
          <ul className="space-y-2">
            {activities.map((a, i) => (
              <li key={i}>• {a}</li>
            ))}
          </ul>
        </Card>

        <Card title="🧩 Key Resources">
          <ul className="space-y-2">
            {resources.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
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

    </div>
  );
}

// 🔥 NORMAL CARD
function Card({ title, children }) {
  return (
    <div className="glass-card p-6 transition duration-300 hover:scale-[1.02] hover:border-emerald-400/30">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="text-gray-300">{children}</div>
    </div>
  );
}

// 🔥 COMPACT CARD
function CompactCard({ title, children }) {
  return (
    <div className="glass-card p-4 transition duration-300 hover:scale-[1.02] hover:border-emerald-400/30">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="text-gray-300 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

// 🔥 SWOT
function SWOT({ title, items, color }) {
  const colorMap = {
    emerald: "text-emerald-400",
    red: "text-red-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 transition hover:scale-[1.02]">
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