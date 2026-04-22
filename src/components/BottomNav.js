import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getIncomingRequests } from "../firebase/connectService";

export default function BottomNav() {
  const { user } = useAuth();
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    getIncomingRequests(user.uid)
      .then((reqs) => setRequestCount(reqs.length))
      .catch(() => {});
  }, [user]);

  const tabs = [
    { to: "/",         end: true,  icon: "⚓", label: "Check In",  badge: 0 },
    { to: "/requests", end: false, icon: "💬", label: "Connect",   badge: requestCount },
    { to: "/profile",  end: false, icon: "✦",  label: "Profile",   badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-2">
      <div className="glass-strong rounded-2xl flex overflow-hidden shadow-2xl shadow-black/60 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 text-xs font-semibold transition-all ${
                isActive ? "text-white" : "text-gray-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative mb-1">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                      isActive
                        ? "shadow-lg shadow-violet-900/50"
                        : ""
                    }`}
                    style={
                      isActive
                        ? { background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }
                        : {}
                    }
                  >
                    {tab.icon}
                  </div>
                  {tab.badge > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-[9px] font-black">{tab.badge}</span>
                    </div>
                  )}
                </div>
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
