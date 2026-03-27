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
      }, 2000);
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
    { icon: Sparkles, title: "AI Agents", desc: "Multi-agent system" }
  ];

  const inputClass =
    "w-full p-3 mb-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400";

  const renderContent = () => {
    if (!data && activeTab !== "dashboard") {
      return <p className="text-gray-300">Generate strategy first</p>;
    }

    switch (activeTab) {
      case "market":
        return <pre>{data.market}</pre>;
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

        {successMessage && (
          <div className="fixed top-5 right-5 bg-emerald-500 px-6 py-3 rounded-xl shadow-lg">
            {successMessage}
          </div>
        )}

        {/* ✅ FIXED HEADER */}
        <div className="flex justify-between items-center px-10 py-6">
          <h1 className="text-2xl font-bold">🚀 Venture GenAI</h1>

          {!user && (
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowAuth("login")}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
              >
                Login
              </button>

              <button
                onClick={() => setShowAuth("register")}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition shadow-md"
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center mt-20">
          <h1 className="text-5xl font-bold mb-4">
            Build Your Startup with AI 🚀
          </h1>

          <div className="grid grid-cols-3 gap-6 mt-10">
            {features.map((f, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-xl">
                <f.icon />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab("dashboard")}
            className="mt-10 px-6 py-3 bg-emerald-600 rounded-xl hover:bg-emerald-500"
          >
            Start Building 🚀
          </button>
        </div>

        {/* AUTH MODAL */}
        {showAuth && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60">
            <div className="p-6 bg-white/10 rounded-xl w-[350px]">
              <h2 className="mb-4 capitalize">{showAuth}</h2>

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

              <button
                onClick={showAuth === "login" ? login : register}
                className="w-full mt-4 py-3 bg-emerald-600 rounded-xl"
              >
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

  // 🚀 DASHBOARD
  return (
    <div className="flex h-screen">

      <div className="w-64 p-6 space-y-4 bg-emerald-700/90 text-white">
        <h2 className="text-2xl font-bold mb-6">Venture GenAI</h2>
        <SidebarItem icon={Home} label="Dashboard" tab="dashboard" />
        <SidebarItem icon={Globe} label="Market" tab="market" />
        <SidebarItem icon={Brain} label="Business" tab="business" />
        <SidebarItem icon={BarChart3} label="Finance" tab="finance" />
        <SidebarItem icon={Mic} label="Pitch" tab="pitch" />
        <SidebarItem icon={Building2} label="Competitor" tab="competitor" />
      </div>

      <div className="flex-1 flex flex-col bg-slate-900 text-white">

        <Topbar
          activeTab={activeTab}
          user={user}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          logout={logout}
          changePassword={changePassword}
        />

        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">

          {user && (
            <h1 className="text-4xl font-bold mb-6">
              Hello {user.first_name} {user.last_name}! 🚀
            </h1>
          )}

          <div className="flex gap-3 mb-4">
            <input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Write your startup idea here..."
              className="w-[450px] p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg"
            />

            <button
              onClick={generate}
              className="px-6 py-3 bg-emerald-600 rounded-xl hover:bg-emerald-500"
            >
              Generate 🚀
            </button>
          </div>

          {loading && <p className="text-gray-300">Generating...</p>}

          <div className="mt-6 w-full max-w-4xl text-left">
            {renderContent()}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;