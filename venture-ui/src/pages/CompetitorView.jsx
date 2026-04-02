import { Building2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
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

  // 🔥 EXTRACT COMPETITORS
  const extractCompetitors = (text) => {
    const matches = text.match(/Name:\s*(.+)/gi);
    return matches ? matches.map(m => m.replace(/Name:/i, "").trim()) : [];
  };

  const competitors = extractCompetitors(text);

  // 🔥 SAFE NUMBER EXTRACTION (NO RANDOM)
  const getNumber = (label, fallback) => {
    const match = text.match(new RegExp(label + ".*?(\\d+)", "i"));
    return match ? parseInt(match[1]) : fallback;
  };

  const metrics = [
    { name: "Market Share (%)", value: getNumber("Market Share", 25) },
    { name: "CAC ($)", value: getNumber("CAC", 120) },
    { name: "Churn (%)", value: getNumber("Churn", 5) },
    { name: "Growth (%)", value: getNumber("Growth", 15) },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32 animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Building2 className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Competitor Analysis</h1>
      </div>

      {/* 🏢 COMPETITORS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(competitors.length ? competitors : ["No competitors found"]).map((comp, i) => (
          <div key={i} className="glass-card p-6">
            <h2 className="text-lg font-semibold">{comp}</h2>
            <p className="text-gray-400 text-sm mt-1">
              Real-world competitor
            </p>
          </div>
        ))}
      </div>

      {/* 📊 METRICS BAR CHART */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Key Metrics</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={metrics}>
            <XAxis dataKey="name" stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* 🔥 EXPLANATION */}
        <div className="mt-4 text-sm text-gray-400 space-y-1">
          <p><b>Market Share:</b> % of market controlled</p>
          <p><b>CAC:</b> Cost to acquire a customer</p>
          <p><b>Churn:</b> % of users leaving</p>
          <p><b>Growth:</b> yearly growth rate</p>
        </div>
      </div>

      {/* 💰 PRICING */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">💰 Pricing Comparison</h2>

        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr>
              <th className="text-left">Tier</th>
              <th>Basic</th>
              <th>Pro</th>
              <th>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pricing</td>
              <td>${getNumber("Free", 0)}</td>
              <td>${getNumber("Pro", 29)}</td>
              <td>${getNumber("Enterprise", 199)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📄 RAW INSIGHTS */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">📄 AI Insights</h2>
        <div className="text-gray-300 whitespace-pre-wrap">{text}</div>
      </div>

    </div>
  );
}