import { Building2, BarChart3 } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function CompetitorView({ data }) {
  if (!data) {
    return (
      <div className="text-gray-400 text-center mt-10">
        Generate strategy first 🚀
      </div>
    );
  }

  // 📊 Radar Data
  const radarData = [
    { feature: "Features", A: 80, B: 70, C: 60 },
    { feature: "Pricing", A: 60, B: 75, C: 65 },
    { feature: "UX", A: 75, B: 65, C: 70 },
    { feature: "Support", A: 70, B: 60, C: 75 },
    { feature: "Scalability", A: 85, B: 70, C: 80 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">

      {/* 🔥 HEADER */}
      <div className="flex items-center gap-3">
        <Building2 className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Competitor Analysis</h1>
      </div>

      {/* 🧱 COMPETITOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Competitor A", "Competitor B", "Competitor C"].map((comp, i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg"
          >
            <h2 className="text-lg font-semibold mb-2">{comp}</h2>
            <p className="text-gray-400 text-sm">Target: Enterprise</p>
            <p className="text-gray-400 text-sm">Pricing: High</p>
            <p className="text-gray-400 text-sm">Revenue: ~$10M</p>
          </div>
        ))}
      </div>

      {/* 💰 PRICING TABLE */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-4">
          💰 Pricing Comparison
        </h2>

        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="py-2">Feature</th>
              <th>Free</th>
              <th>Pro</th>
              <th>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Feature 1", "$0", "$20", "$150"],
              ["Feature 2", "$10", "$30", "$100"],
              ["Feature 3", "$20", "$40", "$200"],
              ["Feature 4", "$30", "$50", "$200"],
            ].map((row, i) => (
              <tr key={i} className="border-b border-white/5">
                {row.map((cell, j) => (
                  <td key={j} className="py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📊 RADAR + METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 📊 RADAR */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-4">
            📊 Feature Comparison
          </h2>

          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="feature" stroke="#cbd5f5" />
                <Radar
                  name="A"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Radar
                  name="B"
                  dataKey="B"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Radar
                  name="C"
                  dataKey="C"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 📈 METRICS */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-4">
            📈 Benchmark Metrics
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 bg-white/5 rounded-lg text-center">
              <p className="text-sm text-gray-400">Market Share</p>
              <p className="text-lg font-bold text-emerald-400">25%</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg text-center">
              <p className="text-sm text-gray-400">CAC</p>
              <p className="text-lg font-bold text-red-400">$500</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg text-center">
              <p className="text-sm text-gray-400">Churn</p>
              <p className="text-lg font-bold text-yellow-400">5%</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg text-center">
              <p className="text-sm text-gray-400">Growth</p>
              <p className="text-lg font-bold text-emerald-400">12%</p>
            </div>

          </div>
        </div>

      </div>

      {/* 📄 RAW DATA */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-4">
          📄 Competitor Insights
        </h2>

        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {data.competitors}
        </div>
      </div>

    </div>
  );
}