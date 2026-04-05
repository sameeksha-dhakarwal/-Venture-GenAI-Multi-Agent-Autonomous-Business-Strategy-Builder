import { Globe } from "lucide-react";
import { motion } from "framer-motion";

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

export default function MarketView({ data }) {
  if (!data) {
    return (
      <div className="text-gray-400 text-center mt-10">
        Generate strategy first 🚀
      </div>
    );
  }

  const text = data?.market || "";

  const extractSection = (label) => {
    const regex = new RegExp(
      `${label}:([\\s\\S]*?)(?=\\n[A-Z][a-zA-Z ]+:|$)`,
      "i"
    );
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  const toBullets = (content) => {
    return content
      .replace(/\n/g, " ")
      .split(/\.|;/)
      .map((l) => l.trim())
      .filter((l) => l.length > 15);
  };

  const getLine = (label, fallback) => {
    const match = text.match(new RegExp(label + ".*?:\\s*(.*)", "i"));
    return match ? match[1] : fallback;
  };

  const extractNumber = (label, fallback) => {
    const match = text.match(new RegExp(label + ".*?(\\d+)", "i"));
    return match ? parseInt(match[1]) : fallback;
  };

  const persona = {
    name: getLine("Personas", "Target users"),
    pain: getLine("Problem", "User pain points"),
    behavior: getLine("Behavior", "Digital-first"),
  };

  const growth = extractNumber("Growth", 20);

  const trendData = [
    { year: "Year 1", value: growth },
    { year: "Year 2", value: growth + 10 },
    { year: "Year 3", value: growth + 20 },
    { year: "Year 4", value: growth + 30 },
  ];

  const marketMetrics = [
    { name: "Demand", value: extractNumber("Demand", 80) },
    { name: "Growth", value: extractNumber("Growth", 70) },
    { name: "Competition", value: extractNumber("Competition", 60) },
    { name: "Profitability", value: extractNumber("Profit", 75) },
    { name: "Scalability", value: extractNumber("Scalability", 85) },
  ];

  const tam = text.match(/TAM.*?:\s*(.*)/i)?.[1];
  const sam = text.match(/SAM.*?:\s*(.*)/i)?.[1];
  const som = text.match(/SOM.*?:\s*(.*)/i)?.[1];

  const growthText =
    extractSection("Market Growth Rate") ||
    extractSection("Growth Rate") ||
    "Growth insights not available";

  const segments = toBullets(extractSection("Customer Segments"));
  const personasList = toBullets(extractSection("Customer Personas"));

  const demand = extractSection("Demand Trends");
  const problemFit = extractSection("Problem–Solution Fit");
  const behaviorText = extractSection("Buying Behavior");
  const trends = extractSection("Market Trends");
  const barriers = extractSection("Entry Barriers");
  const risks = extractSection("Market Risks");

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32 animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Globe className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Market Analysis</h1>
      </div>

      <p className="text-sm text-emerald-400">
        ● Live Market Intelligence
      </p>

      {/* PERSONA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="👤 Target Persona"><p>{persona.name}</p></Card>
        <Card title="⚠️ Pain Points"><p>{persona.pain}</p></Card>
        <Card title="🔄 Behavior"><p>{persona.behavior}</p></Card>
      </div>

      {/* OPPORTUNITY + STRENGTH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card title="🚀 Opportunity">
          <div className="space-y-3">
            {tam && <Box title="TAM" color="emerald" text={tam} />}
            {sam && <Box title="SAM" color="blue" text={sam} />}
            {som && <Box title="SOM" color="yellow" text={som} />}
          </div>
        </Card>

        <Card title="📊 Market Strength">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={marketMetrics}>
              <XAxis dataKey="name" stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

      </div>

      {/* GROWTH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-2">📈 Market Growth Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line dataKey="value" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <Card title="📊 Market Growth Rate">
          <p>{growthText}</p>
        </Card>

      </div>

      {/* SEGMENTS + PERSONAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card title="🎯 Customer Segments">
          <ul>
            {segments.map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        </Card>

        <Card title="👥 Customer Personas">
          <ul>
            {personasList.map((p, i) => <li key={i}>• {p}</li>)}
          </ul>
        </Card>

      </div>

      {/* FULL WIDTH */}
      <div className="space-y-6">

        <motion.div className="glass-card p-6 border border-emerald-500/20">
          <h2 className="text-emerald-400 font-semibold mb-3">📈 Demand Trends</h2>
          <p>{demand}</p>
        </motion.div>

        <motion.div className="glass-card p-6 border border-pink-500/20">
          <h2 className="text-pink-400 font-semibold mb-3">🧠 Problem–Solution Fit</h2>
          <p>{problemFit}</p>
        </motion.div>

      </div>

      {/* 🔥 HOVER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {[
          { title: "🛒 Buying Behavior", text: behaviorText, color: "emerald" },
          { title: "🌍 Market Trends", text: trends, color: "blue" },
          { title: "🚧 Entry Barriers", text: barriers, color: "yellow" },
          { title: "⚠️ Market Risks", text: risks, color: "red" },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`glass-card p-6 border border-transparent hover:border-${item.color}-400/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all duration-300`}
          >
            <h2 className={item.color === "red" ? "text-red-400" : ""}>
              {item.title}
            </h2>
            <p>{item.text}</p>
          </motion.div>
        ))}

      </div>

    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Box({ title, text, color }) {
  return (
    <div className={`bg-${color}-500/10 border border-${color}-500/20 p-3 rounded-lg`}>
      <p className={`text-${color}-400 font-semibold`}>{title}</p>
      <p className="text-sm text-gray-300 mt-1">{text}</p>
    </div>
  );
}