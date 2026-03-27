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
    <div className="w-full flex justify-between items-center px-8 py-4 bg-white/5 backdrop-blur-lg border-b border-white/10">

      {/* 🔥 LEFT TITLE */}
      <h1 className="text-2xl font-semibold text-white">
        {getTitle()}
      </h1>

      {/* 👤 RIGHT PROFILE */}
      {user && (
        <div className="relative flex items-center gap-4">

          <span className="text-sm text-gray-300 hidden md:block">
            {user.first_name} {user.last_name}
          </span>

          <User
            className="cursor-pointer"
            onClick={() => setShowProfile(!showProfile)}
          />

          {showProfile && (
            <div className="absolute right-0 top-12 bg-white text-black p-3 rounded shadow-lg w-52 z-50">
              
              <p className="font-semibold">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>

              <button
                onClick={() => {
                  const newPass = prompt("Enter new password");
                  if (newPass) changePassword(newPass);
                }}
                className="block w-full text-left text-blue-600 mt-3 text-sm"
              >
                Change Password
              </button>

              <button
                onClick={logout}
                className="block w-full text-left text-red-500 mt-2 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Topbar;