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

  // =========================
  // HELPERS
  // =========================

  const extractMoney = (label, fallback) => {
    const match = text.match(new RegExp(label + ".*?\\$?([0-9,]+)", "i"));
    return match ? parseInt(match[1].replace(/,/g, "")) : fallback;
  };

  const extractSection = (label) => {
    const regex = new RegExp(
      `${label}:([\\s\\S]*?)(?=\\n\\s*[A-Z][a-zA-Z ]+:|$)`,
      "i"
    );
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  const splitPoints = (content) =>
    content
      ?.split(/[-•]/)
      .map((c) => c.trim())
      .filter((c) => c.length > 5);

  const formatMoney = (num) => `$${num.toLocaleString()}`;

  // ✅ NEW: EXTRACT YEARLY VALUES
  const extractYearlyValues = (label) => {
    const regex = new RegExp(
      `${label}:[\\s\\S]*?Year 1.*?\\$?([0-9,]+)[\\s\\S]*?Year 2.*?\\$?([0-9,]+)[\\s\\S]*?Year 3.*?\\$?([0-9,]+)`,
      "i"
    );

    const match = text.match(regex);

    if (!match) return [0, 0, 0];

    return [
      parseInt(match[1].replace(/,/g, "")),
      parseInt(match[2].replace(/,/g, "")),
      parseInt(match[3].replace(/,/g, "")),
    ];
  };

  // =========================
  // BUSINESS MODEL DETECTION
  // =========================

  const detectBusinessModel = () => {
    const t = text.toLowerCase();

    if (t.includes("saas") || t.includes("software") || t.includes("app"))
      return "saas";

    if (t.includes("farm") || t.includes("agriculture") || t.includes("egg"))
      return "agriculture";

    if (t.includes("ecommerce") || t.includes("store") || t.includes("retail"))
      return "ecommerce";

    if (t.includes("ai") || t.includes("technology") || t.includes("platform"))
      return "tech";

    return "general";
  };

  // =========================
  // UNIT ECONOMICS
  // =========================

  const unit = {
    revenue: extractMoney("Revenue per user", 120),
    cac: extractMoney("CAC", 40),
    ltv: extractMoney("LTV", 300),
    margin: extractMoney("Margin", 60),
  };

  // =========================
  // SECTIONS
  // =========================

  const sections = {
    pricing: extractSection("Pricing Strategy"),
    cashflow: extractSection("Cash Flow Forecast"),
    funding: extractSection("Funding Requirements"),
    roi: extractSection("ROI Estimation"),
    risks: extractSection("Financial Risks"),
  };

  // =========================
  // 🔥 DYNAMIC DATA
  // =========================

  const [rev1, rev2, rev3] = extractYearlyValues("Revenue Projections");

  const revenueData = [
    { year: "Year 1", revenue: rev1 || 2000000 },
    { year: "Year 2", revenue: rev2 || 4000000 },
    { year: "Year 3", revenue: rev3 || 8000000 },
  ];

  const profitData = revenueData.map((r) => ({
    year: r.year,
    expense: Math.round(r.revenue * 0.6),
    profit: Math.round(r.revenue * 0.4),
  }));

  const pnlData = revenueData.map((r, i) => ({
    year: r.year,
    value: i === 0 ? -r.revenue * 0.4 : r.revenue * 0.3,
  }));

  const breakevenData = revenueData.map((r) => ({
    year: r.year,
    value: Math.round(r.revenue * 0.75),
  }));

  // =========================
  // 💡 DYNAMIC COST MODEL
  // =========================

  const model = detectBusinessModel();
  const base = revenueData[0]?.revenue || 2000000;

  let costData = [];

  if (model === "saas") {
    costData = [
      { name: "Engineering", value: base * 0.35, desc: "Developers & tech team" },
      { name: "Cloud Infra", value: base * 0.15, desc: "Servers & hosting" },
      { name: "Marketing", value: base * 0.2, desc: "User acquisition" },
      { name: "Operations", value: base * 0.1, desc: "Admin & support" },
      { name: "Product", value: base * 0.1, desc: "Design & UX" },
    ];
  } else if (model === "agriculture") {
    costData = [
      { name: "Feed & Supplies", value: base * 0.25, desc: "Animal feed" },
      { name: "Labor", value: base * 0.2, desc: "Farm workers" },
      { name: "Facility", value: base * 0.15, desc: "Land & infrastructure" },
      { name: "Logistics", value: base * 0.1, desc: "Transport & delivery" },
      { name: "Veterinary", value: base * 0.08, desc: "Animal care" },
    ];
  } else if (model === "ecommerce") {
    costData = [
      { name: "Inventory", value: base * 0.4, desc: "Product sourcing" },
      { name: "Marketing", value: base * 0.25, desc: "Ads & promotions" },
      { name: "Logistics", value: base * 0.15, desc: "Shipping" },
      { name: "Platform Fees", value: base * 0.1, desc: "Marketplace fees" },
      { name: "Support", value: base * 0.05, desc: "Customer service" },
    ];
  } else if (model === "tech") {
    costData = [
      { name: "R&D", value: base * 0.3, desc: "Innovation & development" },
      { name: "Infrastructure", value: base * 0.2, desc: "Cloud & systems" },
      { name: "Talent", value: base * 0.2, desc: "Engineers & AI experts" },
      { name: "Marketing", value: base * 0.15, desc: "Growth" },
      { name: "Operations", value: base * 0.1, desc: "Admin" },
    ];
  } else {
    costData = [
      { name: "Operations", value: base * 0.25, desc: "General costs" },
      { name: "Labor", value: base * 0.2, desc: "Staff" },
      { name: "Marketing", value: base * 0.15, desc: "Growth" },
      { name: "Infrastructure", value: base * 0.15, desc: "Setup" },
      { name: "Admin", value: base * 0.1, desc: "Legal & misc" },
    ];
  }

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

      {/* GRAPHS */}
      <div className="grid md:grid-cols-2 gap-6">
        <GraphCard title="Revenue Growth" icon={<TrendingUp />}>
          <LineChart data={revenueData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(v) => formatMoney(v)} />
            <Line dataKey="revenue" stroke="#10b981" strokeWidth={3} />
          </LineChart>
        </GraphCard>

        <GraphCard title="Expense vs Profit" icon={<BarChart3 />}>
          <BarChart data={profitData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(v) => formatMoney(v)} />
            <Bar dataKey="expense" fill="#ef4444" />
            <Bar dataKey="profit" fill="#10b981" />
          </BarChart>
        </GraphCard>
      </div>

      {/* EXTRA GRAPHS */}
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

      {/* COLORED CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        <InfoCard title="Pricing Strategy" content={sections.pricing} color="emerald" />
        <InfoCard title="Cash Flow Forecast" content={sections.cashflow} color="blue" />
        <InfoCard title="Funding Requirements" content={sections.funding} color="purple" />
        <InfoCard title="ROI Estimation" content={sections.roi} color="orange" />
      </div>

      {/* RISKS + KEY INSIGHTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="glass-card p-6">
          <h2 className="text-red-400 mb-4">⚠ Financial Risks</h2>
          {splitPoints(sections.risks).map((r, i) => (
            <div key={i} className="p-3 bg-red-500/10 border border-red-400/20 rounded mb-2">
              • {r}
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-emerald-400 mb-4">🎯 Key Insights</h2>
          {points.slice(0, 6).map((p, i) => (
            <div key={i} className="p-3 bg-emerald-500/10 border border-emerald-400/20 rounded mb-2">
              • {p}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

// COMPONENTS (UNCHANGED)
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

function InfoCard({ title, content, color }) {
  const points =
    content?.split(/[-•]/).filter((c) => c.trim().length > 5) || [];

  const styles = {
    emerald: "bg-emerald-500/10 border-emerald-400",
    blue: "bg-blue-500/10 border-blue-400",
    purple: "bg-purple-500/10 border-purple-400",
    orange: "bg-orange-500/10 border-orange-400",
  };

  return (
    <div className={`glass-card p-5 border-l-4 ${styles[color]}`}>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      {points.map((p, i) => (
        <p key={i} className="text-gray-300 mb-1">
          • {p.trim()}
        </p>
      ))}
    </div>
  );
}