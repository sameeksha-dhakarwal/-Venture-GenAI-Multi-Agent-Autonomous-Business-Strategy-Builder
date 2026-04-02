import { Globe } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function MarketView({ data }) {
  if (!data) {
    return (
      <div className="text-gray-400 text-center mt-10">
        Generate strategy first 🚀
      </div>
    );
  }

  const text = data?.market || "";

  // 🔥 EXTRACTION HELPERS
  const getLine = (label, fallback) => {
    const match = text.match(new RegExp(label + ".*?:\\s*(.*)", "i"));
    return match ? match[1] : fallback;
  };

  const extractNumber = (label, fallback) => {
    const match = text.match(new RegExp(label + ".*?(\\d+)", "i"));
    return match ? parseInt(match[1]) : fallback;
  };

  // 🔥 PERSONA
  const persona = {
    name: getLine("Personas", "Target users"),
    pain: getLine("Problem", "User pain points"),
    behavior: getLine("Behavior", "Digital-first"),
  };

  // 🔥 GROWTH DATA
  const growth = extractNumber("Growth", 20);

  const trendData = [
    { year: "Year 1", value: growth },
    { year: "Year 2", value: growth + 10 },
    { year: "Year 3", value: growth + 20 },
    { year: "Year 4", value: growth + 30 },
  ];

  // 🔥 MARKET METRICS (REPLACES RADAR)
  const marketMetrics = [
    { name: "Demand", value: extractNumber("Demand", 80) },
    { name: "Growth", value: extractNumber("Growth", 70) },
    { name: "Competition", value: extractNumber("Competition", 60) },
    { name: "Profitability", value: extractNumber("Profit", 75) },
    { name: "Scalability", value: extractNumber("Scalability", 85) },
  ];

  const opportunity =
    text.split(".")[0] || "Strong market opportunity detected";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32 animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Globe className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Market Analysis</h1>
      </div>

      <p className="text-sm text-emerald-400">
        ● Live Market Intelligence
      </p>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* PERSONA */}
        <Card title="🎯 Target Persona">
          <p><b>Name:</b> {persona.name}</p>
          <p><b>Pain:</b> {persona.pain}</p>
          <p><b>Behavior:</b> {persona.behavior}</p>
        </Card>

        {/* OPPORTUNITY */}
        <Card title="🚀 Opportunity">
          <p>{opportunity}</p>
        </Card>

        {/* MARKET METRICS */}
        <Card title="📊 Market Strength">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={marketMetrics}>
              <XAxis dataKey="name" stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* EXPLANATION */}
          <div className="mt-3 text-xs text-gray-400">
            Higher values indicate stronger market potential
          </div>
        </Card>

      </div>

      {/* 📈 GROWTH */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-2">
          📈 Market Growth Trend
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          Estimated demand growth over time
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <XAxis dataKey="year" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card title="📄 Market Insights">
          <div className="text-gray-300 whitespace-pre-wrap">
            {text}
          </div>
        </Card>

        <Card title="🎯 Key Takeaways">
          <ul className="space-y-3 text-gray-300">
            {text.split(".").slice(0, 5).map((p, i) => (
              <li key={i}>• {p.trim()}</li>
            ))}
          </ul>
        </Card>

      </div>

    </div>
  );
}

// 🔥 CARD
function Card({ title, children }) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="text-gray-300">{children}</div>
    </div>
  );
}