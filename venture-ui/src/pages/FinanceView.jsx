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

  // 🔥 EXTRACT NUMBERS FROM AI
  const getValue = (label, defaultVal) => {
    const regex = new RegExp(label + ".*?(\\d+)", "i");
    const match = text.match(regex);
    return match ? parseInt(match[1]) : defaultVal;
  };

  // 🔥 UNIT ECONOMICS (DYNAMIC)
  const unit = {
    revenue: getValue("Revenue", 120),
    cac: getValue("CAC", 40),
    ltv: getValue("LTV", 300),
    margin: getValue("Margin", 65),
  };

  // 🔥 DYNAMIC CHART DATA (based on idea)
  const seed = text.length || 50;

  const revenueData = [
    { year: "2021", revenue: seed * 100 },
    { year: "2022", revenue: seed * 200 },
    { year: "2023", revenue: seed * 350 },
    { year: "2024", revenue: seed * 500 },
    { year: "2025", revenue: seed * 800 },
  ];

  const profitData = [
    {
      year: "2021",
      expense: seed * 80,
      profit: seed * 20,
    },
    {
      year: "2022",
      expense: seed * 150,
      profit: seed * 100,
    },
    {
      year: "2023",
      expense: seed * 250,
      profit: seed * 150,
    },
    {
      year: "2024",
      expense: seed * 400,
      profit: seed * 300,
    },
    {
      year: "2025",
      expense: seed * 600,
      profit: seed * 500,
    },
  ];

  // 🔥 INSIGHTS
  const points =
    text.split(".").filter((p) => p.trim().length > 20) || [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32">

      {/* 🔥 HEADER */}
      <div className="flex items-center gap-3">
        <DollarSign className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Financial Analysis</h1>
      </div>

      {/* 💰 UNIT ECONOMICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-gray-400 text-sm">Revenue / User</p>
          <p className="text-xl font-bold text-emerald-400">
            ${unit.revenue}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-gray-400 text-sm">CAC</p>
          <p className="text-xl font-bold text-red-400">
            ${unit.cac}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-gray-400 text-sm">LTV</p>
          <p className="text-xl font-bold text-emerald-400">
            ${unit.ltv}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-gray-400 text-sm">Margin</p>
          <p className="text-xl font-bold text-emerald-400">
            {unit.margin}%
          </p>
        </div>

      </div>

      {/* 📈 REVENUE CHART */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-emerald-400" />
          Revenue Growth
        </h2>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 PROFIT VS EXPENSE */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="text-emerald-400" />
          Expense vs Profit
        </h2>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
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

      {/* 📄 AI OUTPUT */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">
          📄 Financial Insights
        </h2>

        <div className="text-gray-300 whitespace-pre-wrap">
          {data.financials}
        </div>
      </div>

      {/* 🎯 KEY INSIGHTS */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
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