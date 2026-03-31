import React from "react";
import { Brain, Target, Lightbulb } from "lucide-react";

function BusinessView({ data }) {
  if (!data) {
    return (
      <div className="text-gray-400 text-center mt-10">
        Generate strategy first 🚀
      </div>
    );
  }

  // 🔥 Extract bullet points from AI text
  const points =
    data.business_model
      ?.split(".")
      .filter((p) => p.trim().length > 20) || [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">

      {/* 🔥 HEADER */}
      <div className="flex items-center gap-3">
        <Brain className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Business Analysis</h1>
      </div>

      {/* 🧠 PROBLEM + SOLUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 🚨 Problem */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            🚨 Problem
          </h2>

          <p className="text-gray-300">
            {points[0] || "Users face inefficiencies in current systems."}
          </p>
        </div>

        {/* 💡 Solution */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="text-emerald-400" />
            Solution
          </h2>

          <p className="text-gray-300">
            {points[1] || "AI-powered platform solving core problems."}
          </p>
        </div>

      </div>

      {/* 📊 SWOT ANALYSIS */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-4">
          📊 SWOT Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Strength */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold text-emerald-400 mb-2">Strengths</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• {points[2] || "Strong innovation"}</li>
              <li>• {points[3] || "Scalable solution"}</li>
            </ul>
          </div>

          {/* Weakness */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold text-red-400 mb-2">Weaknesses</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• {points[4] || "Early-stage risk"}</li>
              <li>• {points[5] || "Limited resources"}</li>
            </ul>
          </div>

          {/* Opportunity */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold text-blue-400 mb-2">Opportunities</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• {points[6] || "Growing market demand"}</li>
              <li>• {points[7] || "Expansion potential"}</li>
            </ul>
          </div>

          {/* Threat */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold text-yellow-400 mb-2">Threats</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• {points[8] || "Competition"}</li>
              <li>• {points[9] || "Market volatility"}</li>
            </ul>
          </div>

        </div>
      </div>

      {/* 🎯 USP + RESOURCES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 🎯 USP */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="text-emerald-400" />
            Unique Selling Proposition
          </h2>

          <p className="text-gray-300">
            {points[10] || "Differentiated AI-driven approach with scalability."}
          </p>
        </div>

        {/* 🧩 Resources */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-4">
            🧩 Key Resources
          </h2>

          <ul className="text-gray-300 space-y-2">
            <li>• {points[11] || "Technology infrastructure"}</li>
            <li>• {points[12] || "Skilled team"}</li>
            <li>• {points[13] || "Funding & partnerships"}</li>
          </ul>
        </div>

      </div>

      {/* 📄 RAW AI OUTPUT (KEEP YOUR ORIGINAL) */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-4">
          📄 Business Model Details
        </h2>

        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {data.business_model}
        </div>
      </div>

    </div>
  );
}

export default BusinessView;