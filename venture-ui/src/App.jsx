import { useState, useEffect } from "react";
import {
  Home,
  Globe,
  Brain,
  BarChart3,
  Mic,
  Building2,
  Sparkles,
} from "lucide-react";

import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import MarketView from "./pages/MarketView";
import BusinessView from "./pages/BusinessView";
import FinanceView from "./pages/FinanceView";
import PitchView from "./pages/PitchView";
import CompetitorView from "./pages/CompetitorView";

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
  const [successMessage, setSuccessMessage] = useState("");

  // 🚀 APP STATE
  const [idea, setIdea] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("landing");

  // 🔥 AUTO HIDE SUCCESS POPUP
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // 🚀 GENERATE
  const generate = async () => {
    if (!idea.trim()) return alert("Enter an idea");

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.detail);

      setData(result);
      setActiveTab("market");
    } catch (err) {
      alert(err.message || "Error generating data");
    }
    setLoading(false);
  };

  // 🔐 LOGIN
  const login = async () => {
    if (!email || !password) return alert("Fill all fields");

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.detail);

      setUser(result.user);
      setSuccessMessage("✅ Login successful");
      setShowAuth(null);
      setActiveTab("dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔐 REGISTER
  const register = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return alert("Fill all fields");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
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
      if (!res.ok) throw new Error(result.detail);

      setSuccessMessage("✅ Account created successfully!");
      setShowAuth(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔐 CHANGE PASSWORD
  const changePassword = async () => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          new_password: newPassword,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.detail);

      setSuccessMessage("✅ Password updated");
    } catch (err) {
      alert(err.message);
    }
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
    { icon: Sparkles, title: "AI Agents", desc: "Multi-agent system" },
  ];

  const inputClass =
    "w-full p-3 mb-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400";

  // 🌐 LANDING PAGE (unchanged)
  if (activeTab === "landing") {
    return (
      <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {successMessage && (
          <div className="fixed top-5 right-5 bg-emerald-500 px-6 py-3 rounded-xl shadow-lg z-50">
            {successMessage}
          </div>
        )}

        <div className="flex justify-between items-center px-10 py-6">
          <h1 className="text-2xl font-bold">🚀 Venture GenAI</h1>

          {!user && (
            <div className="flex items-center gap-6">
              <button onClick={() => setShowAuth("login")} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
                Login
              </button>
              <button onClick={() => setShowAuth("register")} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500">
                Create Account
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center mt-20">
          <h1 className="text-5xl font-bold mb-4">Build Your Startup with AI 🚀</h1>

          <div className="grid grid-cols-3 gap-6 mt-10">
            {features.map((f, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-xl">
                <f.icon />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setActiveTab("dashboard")} className="mt-10 px-6 py-3 bg-emerald-600 rounded-xl">
            Start Building 🚀
          </button>
        </div>

        {/* AUTH MODAL (unchanged) */}
        {showAuth && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="p-6 bg-[#1e293b] rounded-2xl w-[400px] shadow-2xl">
              <h2 className="mb-4 text-xl font-semibold capitalize">{showAuth}</h2>

              {showAuth === "register" && (
                <>
                  <input className={inputClass} placeholder="First Name" onChange={(e)=>setFirstName(e.target.value)} />
                  <input className={inputClass} placeholder="Last Name" onChange={(e)=>setLastName(e.target.value)} />
                </>
              )}

              <input className={inputClass} placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
              <input type="password" className={inputClass} placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

              {showAuth === "register" && (
                <input type="password" className={inputClass} placeholder="Confirm Password" onChange={(e)=>setConfirmPassword(e.target.value)} />
              )}

              <button onClick={showAuth === "login" ? login : register} className="w-full mt-4 py-3 bg-emerald-600 rounded-xl">
                Submit
              </button>

              <button onClick={() => setShowAuth(null)} className="mt-3 text-gray-400">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 🚀 DASHBOARD (FIXED)
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 p-6 space-y-4 bg-emerald-700/90 text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Venture GenAI</h2>
        <SidebarItem icon={Home} label="Dashboard" tab="dashboard" />
        <SidebarItem icon={Globe} label="Market" tab="market" />
        <SidebarItem icon={Brain} label="Business" tab="business" />
        <SidebarItem icon={BarChart3} label="Finance" tab="finance" />
        <SidebarItem icon={Mic} label="Pitch" tab="pitch" />
        <SidebarItem icon={Building2} label="Competitor" tab="competitor" />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col bg-slate-900 text-white">

        <Topbar
          activeTab={activeTab}
          user={user}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          logout={logout}
          changePassword={changePassword}
        />

        {/* ✅ FIXED SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-8">

          {activeTab === "dashboard" && (
            <Dashboard
              idea={idea}
              setIdea={setIdea}
              generate={generate}
              loading={loading}
              user={user}
            />
          )}

          {activeTab === "market" && <MarketView data={data} />}
          {activeTab === "business" && <BusinessView data={data} />}
          {activeTab === "finance" && <FinanceView data={data} />}
          {activeTab === "pitch" && <PitchView data={data} />}
          {activeTab === "competitor" && <CompetitorView data={data} />}

        </div>
      </div>
    </div>
  );
}

export default App;