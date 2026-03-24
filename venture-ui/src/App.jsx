import { useState } from "react";
import {
  Home,
  Globe,
  Brain,
  BarChart3,
  Mic,
  Building2
} from "lucide-react";

function App() {
  const [idea, setIdea] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const generate = async () => {
    if (!idea) return;

    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    });

    const result = await res.json();
    setData(result);
    setLoading(false);
    setActiveTab("market");
  };

  const SidebarItem = ({ icon: Icon, label, tab }) => (
    <div
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition 
      ${activeTab === tab ? "bg-white/20" : "hover:bg-white/10"}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </div>
  );

  const Card = ({ title, children }) => (
    <div className="glass p-5 fade-in shadow-lg">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );

  const renderContent = () => {
    if (!data && activeTab !== "dashboard") {
      return <p className="text-gray-300">Generate strategy first</p>;
    }

    switch (activeTab) {
      case "market":
        return (
          <div className="grid grid-cols-3 gap-6">
            <Card title="Market Size">
              <p>TAM: $500B</p>
              <p>SAM: $50B</p>
              <p>SOM: $5B</p>
            </Card>

            <Card title="Customer Persona">
              <p>Eco-conscious users</p>
              <p>Need affordability & sustainability</p>
            </Card>

            <Card title="Trends">
              <p>📈 Growing demand</p>
              <p>🤖 AI adoption</p>
            </Card>

            <div className="col-span-3">
              <Card title="Full Market Analysis">
                <pre className="text-sm whitespace-pre-wrap">
                  {data.market}
                </pre>
              </Card>
            </div>
          </div>
        );

      case "business":
        return (
          <div className="grid grid-cols-3 gap-6">
            <Card title="Business Model">
              <pre>{data.business_model}</pre>
            </Card>

            <Card title="SWOT">
              <ul className="list-disc pl-4">
                <li>Strengths</li>
                <li>Weaknesses</li>
                <li>Opportunities</li>
                <li>Threats</li>
              </ul>
            </Card>

            <Card title="USP">
              <p>Unique differentiation advantage</p>
            </Card>
          </div>
        );

      case "finance":
        return (
          <div className="grid grid-cols-3 gap-6">
            <Card title="Revenue">
              <p>3-year projections</p>
            </Card>

            <Card title="Unit Economics">
              <p>LTV / CAC</p>
            </Card>

            <Card title="Costs">
              <p>Fixed + Variable</p>
            </Card>

            <div className="col-span-3">
              <Card title="Financial Details">
                <pre>{data.financials}</pre>
              </Card>
            </div>
          </div>
        );

      case "pitch":
        return (
          <Card title="Pitch Deck">
            <pre>{data.pitch_deck}</pre>
          </Card>
        );

      case "competitor":
        return (
          <Card title="Competitor Analysis">
            <pre>{data.competitors}</pre>
          </Card>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-5xl font-bold mb-6">
              🚀 Venture GenAI
            </h1>

            <input
              className="w-[500px] p-4 rounded-xl border bg-white/10 text-white"
              placeholder="Write your startup idea..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />

            <button
              onClick={generate}
              className="mt-6 px-6 py-3 bg-emerald-600 rounded-xl hover:bg-emerald-700 transition"
            >
              Generate 🚀
            </button>

            {loading && (
              <p className="mt-4 animate-pulse">
                🤖 AI is working...
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      
      {/* SIDEBAR */}
      <div className="w-64 p-6 space-y-4 bg-emerald-700/90 backdrop-blur-xl">
        <h2 className="text-2xl font-bold mb-6">Venture GenAI</h2>

        <SidebarItem icon={Home} label="Dashboard" tab="dashboard" />
        <SidebarItem icon={Globe} label="Market" tab="market" />
        <SidebarItem icon={Brain} label="Business" tab="business" />
        <SidebarItem icon={BarChart3} label="Finance" tab="finance" />
        <SidebarItem icon={Mic} label="Pitch" tab="pitch" />
        <SidebarItem icon={Building2} label="Competitor" tab="competitor" />
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;