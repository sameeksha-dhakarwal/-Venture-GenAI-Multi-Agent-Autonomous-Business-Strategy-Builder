import React from "react";

function Dashboard({ idea, setIdea, generate, loading, user }) {
  return (
    <div className="flex flex-col items-center justify-start h-full px-6 py-10 text-white animate-fade-in">

      {/* 👋 GREETING */}
      <h1 className="text-4xl font-bold mb-2 text-center">
        Hello {user?.first_name} {user?.last_name}! 👋
      </h1>

      <p className="text-gray-400 mb-8 text-center">
        Turn your idea into a full startup strategy powered by AI
      </p>

      {/* 💡 INPUT BOX */}
      <div className="flex items-center gap-4 mb-6 w-full max-w-2xl">

        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="💡 Describe your startup idea (e.g. AI fitness app)..."
          className="flex-1 p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg 
          focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />

        <button
          onClick={generate}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 
          transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Generate 🚀
        </button>
      </div>

      {/* 🔴 LIVE AI STATUS */}
      {!loading && (
        <p className="text-xs text-emerald-400 mb-6">
          ● Ready for real-time AI analysis
        </p>
      )}

      {/* 🤖 LOADING ANIMATION */}
      {loading && (
        <div className="flex flex-col items-center gap-4 mb-10">

          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>

          <p className="text-emerald-400 animate-pulse text-center">
            🤖 AI Agents analyzing your startup...
          </p>

          <p className="text-gray-400 text-sm">
            Market • Competitors • Finance • Pitch
          </p>
        </div>
      )}

      {/* 📊 FEATURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-4">
        {[
          { title: "Market Analysis", desc: "TAM, SAM, SOM insights", icon: "🌍" },
          { title: "Competitors", desc: "Real-time competitor data", icon: "🏢" },
          { title: "Business Model", desc: "Strategy & USP", icon: "🧠" },
          { title: "Financials", desc: "Forecasts & ROI", icon: "📊" },
          { title: "Pitch Deck", desc: "Investor-ready", icon: "🎤" },
          { title: "AI Agents", desc: "Multi-agent intelligence", icon: "✨" },
        ].map((card, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl glass-card cursor-pointer 
            transition-all duration-300 hover:scale-105"
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="font-semibold">{card.title}</h3>
            <p className="text-sm text-gray-300">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;