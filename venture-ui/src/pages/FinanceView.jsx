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

  // ✅ FIXED REGEX
  const extractSection = (label) => {
    const regex = new RegExp(
      `${label}:([\\s\\S]*?)(?=\\n\\s*[A-Z][a-zA-Z ]+:|$)`,
      "i"
    );
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  // ✅ BULLET FIX
  const splitPoints = (content) =>
    content
      ?.split(/[-•]/)
      .map((c) => c.trim())
      .filter((c) => c.length > 5);

  const formatMoney = (num) => `$${num.toLocaleString()}`;

  // 🔥 UNIT ECONOMICS
  const unit = {
    revenue: extractMoney("Revenue per user", 120),
    cac: extractMoney("CAC", 40),
    ltv: extractMoney("LTV", 300),
    margin: extractMoney("Margin", 60),
  };

  // 🔥 SECTIONS
  const sections = {
    pricing: extractSection("Pricing Strategy"),
    cashflow: extractSection("Cash Flow Forecast"),
    funding: extractSection("Funding Requirements"),
    roi: extractSection("ROI Estimation"),
    risks: extractSection("Financial Risks"),
  };

  // 🔥 DATA (UNCHANGED)
  const revenueData = [
    { year: "Year 1", revenue: 2000000, desc: "100k eggs/month" },
    { year: "Year 2", revenue: 4000000, desc: "Scaling production" },
    { year: "Year 3", revenue: 8000000, desc: "Optimized margins" },
  ];

  const profitData = revenueData.map((r) => ({
    year: r.year,
    expense: Math.round(r.revenue * 0.6),
    profit: Math.round(r.revenue * 0.4),
  }));

  const pnlData = [
    { year: "Year 1", value: -800000 },
    { year: "Year 2", value: -350000 },
    { year: "Year 3", value: 2200000 },
  ];

  const breakevenData = [
    { year: "Year 1", value: 4600000 },
    { year: "Year 2", value: 2950000 },
    { year: "Year 3", value: 1800000 },
  ];

  const costData = [
    { name: "Raw Materials", value: 300000, desc: "Eggs, feed, utilities" },
    { name: "Labor", value: 400000, desc: "Employee benefits" },
    { name: "Facility", value: 250000, desc: "Lease or mortgage" },
    { name: "Equipment", value: 150000, desc: "Processing" },
    { name: "Admin", value: 100000, desc: "Legal, insurance" },
    { name: "Marketing", value: 75000, desc: "Sales & growth" },
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

      {/* UNIT ECONOMICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card label="Revenue / User" value={formatMoney(unit.revenue)} />
        <Card label="CAC" value={formatMoney(unit.cac)} color="red" />
        <Card label="LTV" value={formatMoney(unit.ltv)} />
        <Card label="Margin" value={`${unit.margin}%`} />
      </div>

      {/* MAIN GRAPHS */}
      <div className="grid md:grid-cols-2 gap-6">

        <GraphCard title="Revenue Growth" icon={<TrendingUp />} >
          <LineChart data={revenueData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(v) => formatMoney(v)} />
            <Line dataKey="revenue" stroke="#10b981" strokeWidth={3} />
          </LineChart>
        </GraphCard>

        <GraphCard title="Expense vs Profit" icon={<BarChart3 />} >
          <BarChart data={profitData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(v) => formatMoney(v)} />
            <Bar dataKey="expense" fill="#ef4444" />
            <Bar dataKey="profit" fill="#10b981" />
          </BarChart>
        </GraphCard>

      </div>

      {/* ✅ ADDED (NO REMOVAL) */}
      <div className="grid md:grid-cols-2 gap-6">

        <GraphCard title="Profit & Loss Forecast">
          <BarChart data={pnlData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(v) => formatMoney(v)} />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </GraphCard>

        <GraphCard title="Break-even Analysis">
          <BarChart data={breakevenData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(v) => formatMoney(v)} />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </GraphCard>

      </div>

      {/* COST */}
      <div className="grid md:grid-cols-2 gap-6">

        <GraphCard title="Cost Structure">
          <BarChart data={costData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => formatMoney(v)} />
            <Bar dataKey="value" fill="#10b981" onClick={(d) => setSelectedCost(d)} />
          </BarChart>
        </GraphCard>

        <div className="glass-card p-6 text-center">
          {selectedCost ? (
            <>
              <h3>{selectedCost.name}</h3>
              <p className="text-3xl text-emerald-400 font-bold">
                {formatMoney(selectedCost.value)}
              </p>
              <p className="text-gray-400">{selectedCost.desc}</p>
            </>
          ) : (
            <p className="text-gray-400">Click a bar</p>
          )}
        </div>

      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="space-y-6">
          <InfoCard title="Pricing Strategy" content={sections.pricing} />
          <InfoCard title="Cash Flow Forecast" content={sections.cashflow} />
          <InfoCard title="Funding Requirements" content={sections.funding} />
          <InfoCard title="ROI Estimation" content={sections.roi} />
        </div>

        <div className="glass-card p-6">
          <h2 className="text-red-400 mb-3">⚠ Financial Risks</h2>
          {splitPoints(sections.risks).map((r, i) => (
            <div key={i} className="p-3 bg-red-500/10 rounded mb-2">
              • {r}
            </div>
          ))}
        </div>

      </div>

      {/* KEEP */}
      <div className="glass-card p-6">
        <h2>📄 Financial Insights</h2>
        <div className="whitespace-pre-wrap">{text}</div>
      </div>

      <div className="glass-card p-6">
        <h2>🎯 Key Insights</h2>
        {points.slice(0, 5).map((p, i) => (
          <p key={i}>• {p}</p>
        ))}
      </div>

    </div>
  );
}

// 🔥 SMALL COMPONENTS
function Card({ label, value, color = "emerald" }) {
  return (
    <div className="glass-card p-5 text-center">
      <p>{label}</p>
      <p className={`text-xl font-bold text-${color}-400`}>
        {value}
      </p>
    </div>
  );
}

function GraphCard({ title, children, icon }) {
  return (
    <div className="glass-card p-6">
      <h2 className="flex gap-2 mb-3">
        {icon} {title}
      </h2>
      <ResponsiveContainer height={260}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function InfoCard({ title, content }) {
  const points =
    content?.split(/[-•]/).filter((c) => c.trim().length > 5) || [];

  return (
    <div className="glass-card p-5">
      <h3 className="mb-2">{title}</h3>
      {points.map((p, i) => (
        <p key={i}>• {p.trim()}</p>
      ))}
    </div>
  );
}