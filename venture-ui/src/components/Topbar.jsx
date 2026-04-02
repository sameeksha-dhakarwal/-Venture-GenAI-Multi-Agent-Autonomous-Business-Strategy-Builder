import { User } from "lucide-react";

function Topbar({ activeTab, user, setShowProfile, showProfile, logout, changePassword }) {

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "market":
        return "Market Analysis";
      case "business":
        return "Business Analysis";
      case "finance":
        return "Financial Analysis";
      case "pitch":
        return "Pitch Deck";
      case "competitor":
        return "Competitor Analysis";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="w-full flex justify-between items-center px-8 py-4 
    bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-sm">

      {/* 🔥 LEFT TITLE */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-white tracking-wide">
          {getTitle()}
        </h1>

        {/* 🔴 LIVE INDICATOR */}
        <span className="text-xs text-emerald-400 mt-1 animate-pulse">
          ● Live AI Analysis
        </span>
      </div>

      {/* 👤 RIGHT PROFILE */}
      {user && (
        <div className="relative flex items-center gap-4">

          {/* USER NAME */}
          <span className="text-sm text-gray-300 hidden md:block">
            {user.first_name} {user.last_name}
          </span>

          {/* AVATAR */}
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition"
          >
            <User size={18} />
          </div>

          {/* DROPDOWN */}
          {showProfile && (
            <div className="absolute right-0 top-14 w-56 z-50 
            glass-card p-4 animate-fade-in">

              <p className="font-semibold text-white">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-400">{user.email}</p>

              <div className="mt-4 border-t border-white/10 pt-3 space-y-2">

                <button
                  onClick={() => {
                    const newPass = prompt("Enter new password");
                    if (newPass) changePassword(newPass);
                  }}
                  className="w-full text-left text-blue-400 hover:text-blue-300 text-sm transition"
                >
                  Change Password
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left text-red-400 hover:text-red-300 text-sm transition"
                >
                  Logout
                </button>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Topbar;