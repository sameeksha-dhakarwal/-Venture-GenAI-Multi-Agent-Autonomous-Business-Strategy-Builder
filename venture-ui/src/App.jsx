import { useState } from "react";
import {
  Home,
  Globe,
  Brain,
  BarChart3,
  Mic,
  Building2,
  Sparkles,
  User
} from "lucide-react";

function App() {
  // 🔐 AUTH STATE
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // 🚀 APP STATE
  const [idea, setIdea] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("landing");

  // 🚀 GENERATE
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

  // 🔐 LOGIN
  const login = async () => {
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (result.user) {
      setUser(result.user);
    }

    alert(result.message);
    setShowAuth(null);
  };

  // 🔐 REGISTER
  const register = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    });

    const result = await res.json();
    alert(result.message);
    setShowAuth(null);
  };

  const logout = () => {
    setUser(null);
    setShowProfile(false);
    setActiveTab("landing");
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

  const features = [
    { icon: Globe, title: "Market Analysis", desc: "TAM, SAM, SOM insights" },
    { icon: Building2, title: "Competitors", desc: "SWOT & positioning" },
    { icon: Brain, title: "Business Model", desc: "USP & strategy" },
    { icon: BarChart3, title: "Financials", desc: "Forecasts & ROI" },
    { icon: Mic, title: "Pitch Deck", desc: "Investor-ready" },
    { icon: Sparkles, title: "AI Agents", desc: "Multi-agent system" }
  ];

  const renderContent = () => {
    if (!data && activeTab !== "dashboard") {
      return <p className="text-gray-300">Generate strategy first</p>;
    }

    switch (activeTab) {
      case "market":
        return <pre className="whitespace-pre-wrap">{data.market}</pre>;
      case "business":
        return <pre>{data.business_model}</pre>;
      case "finance":
        return <pre>{data.financials}</pre>;
      case "pitch":
        return <pre>{data.pitch_deck}</pre>;
      case "competitor":
        return <pre>{data.competitors}</pre>;
      default:
        return <p>Select section</p>;
    }
  };

  // 🌐 LANDING PAGE
  if (activeTab === "landing") {
    return (
      <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

        {/* NAVBAR */}
        <div className="flex justify-between items-center p-6">
          <h1 className="text-xl font-bold">🚀 Venture GenAI</h1>

          <div className="flex gap-4 items-center">

            {user && (
              <span className="text-sm text-gray-300">
                Hello {user.first_name} {user.last_name}
              </span>
            )}

            {user && (
              <div className="relative">
                <User
                  className="cursor-pointer"
                  onClick={() => setShowProfile(!showProfile)}
                />

                {showProfile && (
                  <div className="absolute right-0 mt-2 bg-white text-black p-3 rounded shadow">
                    <p>{user.first_name} {user.last_name}</p>
                    <button className="text-blue-600 text-sm mt-2">
                      Change Password
                    </button>
                    <button
                      onClick={logout}
                      className="block text-red-500 mt-2"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {!user && (
              <>
                <button
                  onClick={() => setShowAuth("login")}
                  className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10"
                >
                  Login
                </button>

                <button
                  onClick={() => setShowAuth("register")}
                  className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>

        {/* HERO */}
        <div className="flex flex-col items-center text-center mt-20">
          <h1 className="text-5xl font-bold mb-4">
            Build Your Startup with AI 🚀
          </h1>

          <p className="text-gray-400 mb-10 max-w-xl">
            Multi-agent AI system generating full business strategies instantly.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-10 max-w-4xl">
            {features.map((f, i) => (
              <div key={i} className="glass p-6 hover:scale-105 transition">
                <f.icon className="mb-3 text-emerald-400" size={28} />
                <h3>{f.title}</h3>
                <p className="text-sm text-gray-300">{f.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab("dashboard")}
            className="mt-10 px-6 py-3 bg-emerald-600 rounded-xl hover:bg-emerald-700"
          >
            Start Building 🚀
          </button>
        </div>

        {/* 🔐 AUTH MODAL */}
        {showAuth && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60">
            <div className="glass p-6 w-[320px]">

              <h2 className="text-xl mb-4">
                {showAuth === "login" ? "Login" : "Create Account"}
              </h2>

              {showAuth === "register" && (
                <>
                  <input placeholder="First Name" className="input" onChange={(e)=>setFirstName(e.target.value)} />
                  <input placeholder="Last Name" className="input" onChange={(e)=>setLastName(e.target.value)} />
                </>
              )}

              <input placeholder="Email" className="input" onChange={(e)=>setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="input" onChange={(e)=>setPassword(e.target.value)} />

              {showAuth === "register" && (
                <input type="password" placeholder="Confirm Password" className="input" onChange={(e)=>setConfirmPassword(e.target.value)} />
              )}

              <button
                onClick={showAuth === "login" ? login : register}
                className="w-full bg-emerald-600 p-2 rounded mt-2"
              >
                Submit
              </button>

              <button
                onClick={() => setShowAuth(null)}
                className="mt-3 text-sm text-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 📊 DASHBOARD
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

        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Enter startup idea..."
          className="w-[400px] p-3 rounded-xl bg-white/10 border border-white/20"
        />

        <button
          onClick={generate}
          className="ml-4 px-6 py-3 bg-emerald-600 rounded-xl"
        >
          Generate
        </button>

        {loading && <p className="mt-2">🤖 Generating...</p>}

        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;