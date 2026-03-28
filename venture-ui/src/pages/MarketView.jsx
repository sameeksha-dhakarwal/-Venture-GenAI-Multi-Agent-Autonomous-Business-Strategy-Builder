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

  // 📊 Dummy chart data (can later come from backend)
  const trendData = [
    { year: "2021", value: 20 },
    { year: "2022", value: 35 },
    { year: "2023", value: 30 },
    { year: "2024", value: 50 },
    { year: "2025", value: 65 },
  ];

  const radarData = [
    { feature: "Demand", value: 80 },
    { feature: "Growth", value: 70 },
    { feature: "Competition", value: 50 },
    { feature: "Profit", value: 75 },
    { feature: "Scalability", value: 85 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex items-center gap-3">
        <Globe className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Market Analysis</h1>
      </div>

      {/* 📊 TOP GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* 👤 PERSONA */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="text-emerald-400" />
            Persona
          </h2>

          <div className="space-y-2 text-gray-300">
            <p><b>Name:</b> Eco-conscious user</p>
            <p><b>Pain:</b> Finding sustainable options</p>
            <p><b>Behavior:</b> Mobile-first buyer</p>
          </div>
        </div>

        {/* 🎯 OPPORTUNITY */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="text-emerald-400" />
            Opportunity
          </h2>

          <p className="text-gray-300">
            Rapidly growing niche market with strong demand signals.
          </p>
        </div>

        {/* 📊 RADAR CHART */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">
            Market Strength
          </h2>

          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#555" />
              <PolarAngleAxis dataKey="feature" stroke="#ccc" />
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

      {/* 📈 LINE CHART */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">
          📈 Demand Growth
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <XAxis dataKey="year" stroke="#ccc" />
            <YAxis stroke="#ccc" />
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

      {/* 📄 CONTENT */}
      <div className="grid grid-cols-2 gap-6">

        {/* 🧠 INSIGHTS */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">
            📊 Market Insights
          </h2>

          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {data.market}
          </div>
        </div>

        {/* 🎯 TAKEAWAYS */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
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