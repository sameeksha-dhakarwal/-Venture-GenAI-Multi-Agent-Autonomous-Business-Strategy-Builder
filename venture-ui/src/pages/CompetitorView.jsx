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

  // 🔥 FULL STRUCTURED EXTRACTION
  const extractCompetitors = (text) => {
    const blocks = text.split("- Name:").slice(1);

    return blocks.map((block) => {
      const getField = (label) => {
        const match = block.match(new RegExp(label + ".*?:\\s*(.*)", "i"));
        return match ? match[1].trim() : "N/A";
      };

      return {
        name: block.split("\n")[0].trim(),
        segment: getField("Segment"),
        pricing: getField("Pricing"),
        market: getField("Target Market"),
      };
    });
  };

  const competitors = extractCompetitors(text);

  // 🔥 FIXED MARKET SHARE EXTRACTION (ROBUST)
  const extractMarketShare = (text) => {
    const roles = ["Leader", "Mid-tier", "Emerging"];

    return roles
      .map((role) => {
        const line = text
          .split("\n")
          .find((l) => l.toLowerCase().includes(role.toLowerCase()));

        if (!line) return null;

        const percentMatch = line.match(/(\d+)%/);
        const nameMatch = line.match(
          /:\s*(.*?)(,|with|holding|competing|$)/i
        );

        return {
          role,
          name: nameMatch ? nameMatch[1].trim() : "",
          share: percentMatch ? parseInt(percentMatch[1]) : 0,
        };
      })
      .filter(Boolean);
  };

  const marketShareData = extractMarketShare(text);

  // 🔥 FIXED ROLE MATCHING (VERY IMPORTANT)
  const competitorsWithRole = competitors.map((comp) => {
    const match = marketShareData.find(
      (m) =>
        m.name.toLowerCase().includes(comp.name.toLowerCase()) ||
        comp.name.toLowerCase().includes(m.name.toLowerCase())
    );

    return {
      ...comp,
      role: match ? match.role : "",
    };
  });

  // 🔥 SAFE NUMBER EXTRACTION
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

  // ================= NEW PARSERS =================

  const extractSection = (title) => {
    const regex = new RegExp(title + ":(.*?)(\\n\\n|$)", "is");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  // 🔥 FEATURE COMPARISON
  const featureText = extractSection("Feature Comparison");

  const features = ["Features", "Pricing", "UX", "Support", "Scalability"].map((f) => {
    const match = featureText.match(new RegExp(f + ".*?:\\s*(.*)", "i"));
    return {
      title: f,
      value: match ? match[1] : "N/A",
    };
  });

  // 🔥 SWOT (MORE RELIABLE)
  const swText = extractSection("Strengths & Weaknesses");

  const strengths =
    swText.match(/Strengths:(.*?)(Weaknesses|$)/is)?.[1]
      ?.split("\n")
      .map((s) => s.replace("-", "").trim())
      .filter((s) => s.length > 5) || [];

  const weaknesses =
    swText.match(/Weaknesses:(.*)/is)?.[1]
      ?.split("\n")
      .map((s) => s.replace("-", "").trim())
      .filter((s) => s.length > 5) || [];

  // 🔥 GAPS
  const gapsText = extractSection("Competitive Gaps");

  const gaps = gapsText
    .split("\n")
    .map((g) => g.replace("-", "").trim())
    .filter((g) => g.length > 5);

  // 🔥 BENCHMARK METRICS
  const benchmarkText = extractSection("Benchmark Metrics");

  const benchmarkMetrics = [
    {
      title: "Market Share",
      value: benchmarkText.match(/Market Share:(.*)/i)?.[1]?.trim() || "N/A",
    },
    {
      title: "CAC",
      value: benchmarkText.match(/CAC:(.*)/i)?.[1]?.trim() || "N/A",
    },
    {
      title: "Churn",
      value: benchmarkText.match(/Churn:(.*)/i)?.[1]?.trim() || "N/A",
    },
    {
      title: "Growth",
      value: benchmarkText.match(/Growth Rate:(.*)/i)?.[1]?.trim() || "N/A",
    },
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
        {(competitorsWithRole.length
          ? competitorsWithRole
          : [{ name: "No competitors found" }]
        ).map((comp, i) => (
          <div key={i} className="glass-card p-6">
            <h2 className="text-lg font-semibold">{comp.name}</h2>

            {comp.role && (
              <p className={`mt-2 text-xs font-semibold px-2 py-1 inline-block rounded ${
                comp.role === "Leader"
                  ? "bg-green-500/20 text-green-400"
                  : comp.role === "Mid-tier"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {comp.role}
              </p>
            )}

            <p className="text-gray-400 text-sm mt-2">
              Real-world competitor
            </p>

            <div className="mt-4 text-sm text-gray-300 space-y-2">
              <p><b>Segment:</b> {comp.segment}</p>
              <p><b>Pricing:</b> {comp.pricing}</p>
              <p><b>Target:</b> {comp.market}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Key Metrics</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metrics}>
              <XAxis dataKey="name" stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🔥 ALWAYS SHOW MARKET GRAPH */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">
            📊 Market Share Distribution
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={
                marketShareData.length
                  ? marketShareData
                  : [{ name: "No Data", share: 0 }]
              }
            >
              <XAxis dataKey="name" stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="share" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 💰 PRICING */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">💰 Pricing Comparison</h2>
        <table className="w-full text-sm text-gray-300">
          <tbody>
            <tr>
              <td>Basic</td>
              <td>${getNumber("Free", 0)}</td>
              <td>Pro</td>
              <td>${getNumber("Pro", 29)}</td>
              <td>Enterprise</td>
              <td>${getNumber("Enterprise", 199)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📊 FEATURE COMPARISON */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Feature Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="text-sm text-gray-400">{f.title}</p>
              <p className="text-sm mt-2">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 💪 SWOT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="glass-card p-6">
          <h2 className="text-xl text-green-400 mb-4">Strengths</h2>
          {strengths.map((s, i) => <p key={i}>• {s}</p>)}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl text-red-400 mb-4">Weaknesses</h2>
          {weaknesses.map((w, i) => <p key={i}>• {w}</p>)}
        </div>

      </div>

      {/* ⚡ GAPS */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">⚡ Competitive Gaps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gaps.map((g, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              {g}
            </div>
          ))}
        </div>
      </div>

      {/* 📊 BENCHMARK METRICS */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Benchmark Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {benchmarkMetrics.map((m, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="text-sm text-gray-400">{m.title}</p>
              <p className="text-sm mt-2">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}