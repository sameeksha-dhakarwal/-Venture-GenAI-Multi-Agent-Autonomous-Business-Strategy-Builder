import { useState } from "react";
import { DollarSign, TrendingUp, BarChart3 } from "lucide-react";
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

export default function FinanceView({ data }) {
  if (!data) {
    return (
      <div className="text-gray-400 text-center mt-10">
        Generate strategy first 🚀
      </div>
    );
  }

  const text = data?.financials || "";

  // 🔥 HELPERS
  const extractMoney = (label, fallback) => {
    const match = text.match(new RegExp(label + ".*?\\$?([0-9,]+)", "i"));
    return match ? parseInt(match[1].replace(/,/g, "")) : fallback;
  };

  const extractLine = (label) => {
    const match = text.match(new RegExp(label + ":(.*)", "i"));
    return match ? match[1].trim() : "";
  };

  const formatMoney = (num) => `$${num.toLocaleString()}`;

  // 🔥 UNIT ECONOMICS
  const unit = {
    revenue: extractMoney("Revenue per user", 120),
    cac: extractMoney("CAC", 40),
    ltv: extractMoney("LTV", 300),
    margin: extractMoney("Margin", 60),
  };

  // 🔥 REVENUE DATA WITH DESCRIPTIONS
  const revenueData = [
    {
      year: "Year 1",
      revenue: 2000000,
      desc:
        "Based on selling 100,000 eggs/month at $20 per dozen",
    },
    {
      year: "Year 2",
      revenue: 4000000,
      desc:
        "Doubling production to 200,000 eggs/month with efficiency gains",
    },
    {
      year: "Year 3",
      revenue: 8000000,
      desc:
        "Tripling production to 300,000 eggs/month with optimized costs",
    },
  ];

  // 🔥 PROFIT DATA
  const profitData = revenueData.map((r) => ({
    year: r.year,
    expense: Math.round(r.revenue * 0.6),
    profit: Math.round(r.revenue * 0.4),
  }));

  // 🔥 COST DATA (WITH DESCRIPTIONS)
  const costData = [
    {
      name: "Raw Materials",
      value: 300000,
      desc: "eggs, feed, utilities",
    },
    {
      name: "Labor",
      value: 400000,
      desc: "employee benefits",
    },
    {
      name: "Facility",
      value: 250000,
      desc: "lease or mortgage",
    },
    {
      name: "Equipment",
      value: 150000,
      desc: "incubation, processing, packaging",
    },
    {
      name: "Admin",
      value: 100000,
      desc: "insurance, legal, accounting",
    },
    {
      name: "Marketing",
      value: 75000,
      desc: "initial growth + sales expansion",
    },
  ];

  const [selectedCost, setSelectedCost] = useState(null);

  const points = text.split(".").filter((p) => p.trim().length > 20);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-32 animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <DollarSign className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Financial Analysis</h1>
      </div>

      <p className="text-sm text-emerald-400">
        ● Live AI Financial Model
      </p>

      {/* UNIT ECONOMICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card label="Revenue / User" value={formatMoney(unit.revenue)} color="emerald" />
        <Card label="CAC" value={formatMoney(unit.cac)} color="red" />
        <Card label="LTV" value={formatMoney(unit.ltv)} color="emerald" />
        <Card label="Margin" value={`${unit.margin}%`} color="emerald" />
      </div>

      {/* 📊 GRAPHS SIDE BY SIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* REVENUE GRAPH */}
        <div className="glass-card p-6 transition hover:scale-[1.02]">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="text-emerald-400" />
            Revenue Growth
          </h2>

          <div className="w-full h-[260px]">
            <ResponsiveContainer>
              <LineChart data={revenueData}>
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />

                {/* 🔥 CUSTOM TOOLTIP */}
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-black/80 p-3 rounded-lg text-sm border border-white/10">
                          <p className="text-emerald-400 font-semibold">
                            {d.year}
                          </p>
                          <p>{formatMoney(d.revenue)}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {d.desc}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Line
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PROFIT GRAPH */}
        <div className="glass-card p-6 transition hover:scale-[1.02]">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <BarChart3 className="text-emerald-400" />
            Expense vs Profit
          </h2>

          <div className="w-full h-[260px]">
            <ResponsiveContainer>
              <BarChart data={profitData}>
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="expense" fill="#ef4444" />
                <Bar dataKey="profit" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 💸 COST STRUCTURE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT GRAPH */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">💸 Cost Structure</h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={costData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                onClick={(d) => setSelectedCost(d)}
                className="cursor-pointer hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT DETAILS */}
        <div className="glass-card p-6 flex items-center justify-center text-center">
          {selectedCost ? (
            <div className="space-y-3 animate-fade-in">
              <h3 className="text-lg font-semibold">
                {selectedCost.name}
              </h3>

              <p className="text-emerald-400 text-3xl font-bold">
                {formatMoney(selectedCost.value)}
              </p>

              <p className="text-gray-400 text-sm max-w-xs">
                {selectedCost.desc}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">
              Click a bar to view cost details
            </p>
          )}
        </div>

      </div>

      {/* 🔥 KEEP THIS */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">
          📄 Financial Insights
        </h2>

        <div className="text-gray-300 whitespace-pre-wrap">
          {text}
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">
          🎯 Key Insights
        </h2>

        <ul className="space-y-2 text-gray-300">
          {points.slice(0, 5).map((p, i) => (
            <li key={i}>• {p}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}

// CARD
function Card({ label, value, color }) {
  const colorMap = {
    emerald: "text-emerald-400",
    red: "text-red-400",
  };

  return (
    <div className="glass-card p-5 text-center hover:scale-[1.02] transition">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-xl font-bold ${colorMap[color]}`}>
        {value}
      </p>
    </div>
  );
}