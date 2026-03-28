import React from "react";

function Dashboard({ idea, setIdea, generate, loading, user }) {
  return (
    <div className="flex flex-col items-center justify-start h-full px-6 py-10 text-white">

      <h1 className="text-4xl font-bold mb-8 text-center">
        Hello {user?.first_name} {user?.last_name}! 👋
      </h1>

      <div className="flex items-center gap-4 mb-10 w-full max-w-2xl">
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Write your startup idea here..."
          className="flex-1 p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg focus:outline-none"
        />

        <button
          onClick={generate}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500"
        >
          Generate 🚀
        </button>
      </div>

      {loading && <p className="text-gray-300">Generating...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          { title: "Market Analysis", desc: "TAM, SAM, SOM", icon: "🌍" },
          { title: "Competitors", desc: "SWOT", icon: "🏢" },
          { title: "Business Model", desc: "USP", icon: "🧠" },
          { title: "Financials", desc: "ROI", icon: "📊" },
          { title: "Pitch Deck", desc: "Investor-ready", icon: "🎤" },
          { title: "AI Agents", desc: "Automation", icon: "✨" },
        ].map((card, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
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