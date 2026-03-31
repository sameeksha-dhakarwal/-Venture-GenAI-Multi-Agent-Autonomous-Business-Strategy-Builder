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

  // 📊 Revenue growth
  const revenueData = [
    { year: "2021", revenue: 10000 },
    { year: "2022", revenue: 25000 },
    { year: "2023", revenue: 40000 },
    { year: "2024", revenue: 70000 },
    { year: "2025", revenue: 120000 },
  ];

  // 📊 Expense vs Profit
  const profitData = [
    { year: "2021", expense: 8000, profit: 2000 },
    { year: "2022", expense: 15000, profit: 10000 },
    { year: "2023", expense: 25000, profit: 15000 },
    { year: "2024", expense: 40000, profit: 30000 },
    { year: "2025", expense: 70000, profit: 50000 },
  ];

  // 🔥 Extract insights from AI
  const points =
    data.financials
      ?.split(".")
      .filter((p) => p.trim().length > 20) || [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">

      {/* 🔥 HEADER */}
      <div className="flex items-center gap-3">
        <DollarSign className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Financial Analysis</h1>
      </div>

      {/* 💰 UNIT ECONOMICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg text-center">
          <p className="text-gray-400 text-sm">Revenue / User</p>
          <p className="text-xl font-bold text-emerald-400">$120</p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg text-center">
          <p className="text-gray-400 text-sm">CAC</p>
          <p className="text-xl font-bold text-red-400">$40</p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg text-center">
          <p className="text-gray-400 text-sm">LTV</p>
          <p className="text-xl font-bold text-emerald-400">$300</p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg text-center">
          <p className="text-gray-400 text-sm">Margin</p>
          <p className="text-xl font-bold text-emerald-400">65%</p>
        </div>

      </div>

      {/* 📈 REVENUE CHART */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-emerald-400" />
          Revenue Growth
        </h2>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                }}
              />
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
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
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

      {/* 📄 AI FINANCIAL OUTPUT */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-4">
          📄 Financial Insights
        </h2>

        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {data.financials}
        </div>
      </div>

      {/* 🎯 KEY INSIGHTS */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
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