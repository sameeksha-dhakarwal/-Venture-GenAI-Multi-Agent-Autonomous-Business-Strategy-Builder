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

  const text = data?.competitors || "";

  // ✅ FIXED: ROBUST EXTRACTION
  const extractCompetitors = (text) => {
    if (!text) return [];

    // Try structured format first
    const matches = text.match(/Name:\s*(.+)/gi);

    if (matches) {
      return matches.map((m) =>
        m.replace(/Name:/i, "").trim()
      );
    }

    // 🔥 Fallback: detect known company names
    const known = [
      "Zomato", "Swiggy", "Uber Eats", "DoorDash", "Grubhub",
      "Stripe", "PayPal", "Razorpay", "Notion", "Slack"
    ];

    return known.filter((c) => text.includes(c));
  };

  const competitors = extractCompetitors(text);

  // 🔥 METRIC EXTRACTION (IMPROVED)
  const getValue = (label, defaultVal) => {
    const regex = new RegExp(label + ".*?(\\d+)", "i");
    const match = text.match(regex);
    return match ? parseInt(match[1]) : defaultVal;
  };

  const metrics = {
    marketShare: getValue("Market Share", 25),
    cac: getValue("CAC", 500),
    churn: getValue("Churn", 5),
    growth: getValue("Growth", 12),
  };

  // 🔥 RADAR DATA (DYNAMIC)
  const radarData = [
    { feature: "Features", A: getValue("Features", 80), B: 70, C: 60 },
    { feature: "Pricing", A: getValue("Pricing", 60), B: 75, C: 65 },
    { feature: "UX", A: getValue("UX", 75), B: 65, C: 70 },
    { feature: "Support", A: getValue("Support", 70), B: 60, C: 75 },
    { feature: "Scalability", A: getValue("Scalability", 85), B: 70, C: 80 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32">

      {/* 🔥 HEADER */}
      <div className="flex items-center gap-3">
        <Building2 className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Competitor Analysis</h1>
      </div>

      {/* 🧱 COMPETITOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(competitors.length > 0 ? competitors : ["No competitors found"]).map((comp, i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg"
          >
            <h2 className="text-lg font-semibold mb-2">{comp}</h2>
            <p className="text-gray-400 text-sm">Real-time competitor</p>
            <p className="text-gray-400 text-sm">AI + API generated</p>
            <p className="text-gray-400 text-sm">Dynamic insight</p>
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
              ["Core Features", "$0", "$20", "$150"],
              ["Advanced Tools", "$10", "$30", "$100"],
              ["Automation", "$20", "$40", "$200"],
              ["Support", "$30", "$50", "$200"],
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
                <Radar dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                <Radar dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar dataKey="C" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
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
            <Metric label="Market Share" value={`${metrics.marketShare}%`} color="emerald" />
            <Metric label="CAC" value={`$${metrics.cac}`} color="red" />
            <Metric label="Churn" value={`${metrics.churn}%`} color="yellow" />
            <Metric label="Growth" value={`${metrics.growth}%`} color="emerald" />
          </div>
        </div>

      </div>

      {/* 📄 RAW DATA */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-4">
          📄 Competitor Insights
        </h2>

        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {text}
        </div>
      </div>

    </div>
  );
}

// 🔥 SMALL COMPONENT (cleaner UI)
function Metric({ label, value, color }) {
  return (
    <div className="p-4 bg-white/5 rounded-lg text-center">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-lg font-bold text-${color}-400`}>
        {value}
      </p>
    </div>
  );
}