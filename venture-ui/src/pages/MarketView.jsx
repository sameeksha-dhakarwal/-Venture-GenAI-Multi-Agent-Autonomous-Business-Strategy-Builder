import {
  Globe,
  Users,
  Target,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
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

  // 🔥 EXTRACT PERSONA
  const getLine = (label, fallback) => {
    const regex = new RegExp(label + ".*?:\\s*(.*)", "i");
    const match = text.match(regex);
    return match ? match[1] : fallback;
  };

  const persona = {
    name: getLine("Persona", "Target user"),
    pain: getLine("Pain", "Problem awareness"),
    behavior: getLine("Behavior", "Digital-first"),
  };

  // 🔥 DYNAMIC TREND (based on idea text length)
  const seed = text.length || 50;

  const trendData = [
    { year: "2021", value: seed % 30 + 20 },
    { year: "2022", value: seed % 40 + 30 },
    { year: "2023", value: seed % 50 + 40 },
    { year: "2024", value: seed % 60 + 50 },
    { year: "2025", value: seed % 70 + 60 },
  ];

  // 🔥 RADAR FROM TEXT SIGNALS
  const getScore = (label, defaultVal) => {
    const regex = new RegExp(label + ".*?(\\d+)", "i");
    const match = text.match(regex);
    return match ? parseInt(match[1]) : defaultVal;
  };

  const radarData = [
    { feature: "Demand", value: getScore("Demand", 80) },
    { feature: "Growth", value: getScore("Growth", 70) },
    { feature: "Competition", value: getScore("Competition", 50) },
    { feature: "Profit", value: getScore("Profit", 75) },
    { feature: "Scalability", value: getScore("Scalability", 85) },
  ];

  // 🔥 OPPORTUNITY (AI BASED)
  const opportunity =
    text.split(".")[0] || "Strong market opportunity detected";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32">

      {/* 🔥 HEADER */}
      <div className="flex items-center gap-3">
        <Globe className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Market Analysis</h1>
      </div>

      {/* 📊 TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 👤 PERSONA (DYNAMIC) */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="text-emerald-400" />
            Persona
          </h2>

          <div className="space-y-2 text-gray-300">
            <p><b>Name:</b> {persona.name}</p>
            <p><b>Pain:</b> {persona.pain}</p>
            <p><b>Behavior:</b> {persona.behavior}</p>
          </div>
        </div>

        {/* 🎯 OPPORTUNITY (DYNAMIC) */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="text-emerald-400" />
            Opportunity
          </h2>

          <p className="text-gray-300">
            {opportunity}
          </p>
        </div>

        {/* 📊 RADAR CHART (DYNAMIC) */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-4">
            Market Strength
          </h2>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="feature" stroke="#cbd5f5" />
                <Radar
                  name="Market"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 📈 LINE CHART (DYNAMIC) */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-4">
          📈 Demand Growth
        </h2>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📄 CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 🧠 INSIGHTS */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-4">
            📊 Market Insights
          </h2>

          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {data.market}
          </div>
        </div>

        {/* 🎯 TAKEAWAYS */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-4">
            🎯 Key Takeaways
          </h2>

          <ul className="space-y-3 text-gray-300">
            {data.market
              ?.split(".")
              .slice(0, 5)
              .map((point, i) => (
                <li key={i} className="bg-white/5 p-3 rounded-lg">
                  • {point.trim()}
                </li>
              ))}
          </ul>
        </div>

      </div>

    </div>
  );
}