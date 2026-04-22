import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { getMoodHistory } from "../firebase/checkInService";
import Background from "../components/Background";

function MoodSparkline({ data }) {
  if (data.length < 2) {
    return (
      <p className="text-gray-600 text-xs text-center py-4">
        Check in a few more days to see your mood trend.
      </p>
    );
  }

  const W = 280, H = 70, P = 12;
  const moods = data.map((d) => d.mood);
  const points = moods
    .map((m, i) => {
      const x = P + (i / (moods.length - 1)) * (W - P * 2);
      const y = H - P - ((m - 1) / 9) * (H - P * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const dotPoints = moods.map((m, i) => ({
    x: P + (i / (moods.length - 1)) * (W - P * 2),
    y: H - P - ((m - 1) / 9) * (H - P * 2),
    mood: m,
  }));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Fill area */}
      <polygon
        points={`${P},${H} ${points} ${W - P},${H}`}
        fill="url(#fillGrad)"
      />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots */}
      {dotPoints.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="white" opacity="0.8" />
      ))}
    </svg>
  );
}

export default function Profile() {
  const { user, profile } = useAuth();
  const [moodHistory, setMoodHistory] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getMoodHistory(user.uid).then(setMoodHistory).catch(() => {});
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [user.uid]);

  const avgMood = moodHistory.length
    ? (moodHistory.reduce((s, d) => s + d.mood, 0) / moodHistory.length).toFixed(1)
    : null;

  const moodLabel = ["", "Barely holding on", "Really struggling", "Pretty rough",
    "Not great", "Just okay", "Doing alright", "Feeling decent",
    "Pretty good", "Really good", "Feeling great"];

  return (
    <div className="min-h-screen w-full bg-[#030308] pb-28 relative">
      <Background />
      <div className="relative z-10 flex flex-col px-5 py-10 max-w-lg mx-auto">

        {/* Avatar + username */}
        <div
          className="flex flex-col items-center mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-xl mb-4 shadow-xl shadow-violet-900/40"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            {profile?.username?.slice(-4)}
          </div>
          <h1 className="text-white font-black text-2xl">{profile?.username}</h1>
          <p className="text-gray-500 text-xs mt-1">anonymous · always</p>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 gap-3 mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
          }}
        >
          <div className="glass-strong rounded-2xl p-5 text-center">
            <p className="gradient-text font-black text-4xl leading-none">
              {profile?.streak || 0}
            </p>
            <p className="text-gray-500 text-xs mt-2">day streak 🔥</p>
          </div>
          <div className="glass-strong rounded-2xl p-5 text-center">
            <p className="gradient-text font-black text-4xl leading-none">
              {avgMood || "—"}
            </p>
            <p className="text-gray-500 text-xs mt-2">avg mood (7d)</p>
          </div>
        </div>

        {/* Mood chart */}
        <div
          className="glass-strong rounded-2xl p-5 mb-6 relative overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 to-fuchsia-500" />
          <div className="flex justify-between items-center mb-4">
            <p className="text-white text-sm font-semibold">Mood this week</p>
            {avgMood && (
              <p className="text-gray-500 text-xs">{moodLabel[Math.round(avgMood)]}</p>
            )}
          </div>
          <MoodSparkline data={moodHistory} />
          <div className="flex justify-between mt-2">
            <p className="text-gray-700 text-xs">7 days ago</p>
            <p className="text-gray-700 text-xs">today</p>
          </div>
        </div>

        {/* About */}
        <div
          className="glass rounded-2xl p-5 mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
          }}
        >
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">About Anchor</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Built for people fighting invisible wars — immigrant grads, the unemployed, the lonely, the overwhelmed. You're not alone in this.
          </p>
        </div>

        {/* Sign out */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.45s",
          }}
        >
          <button
            onClick={() => signOut(auth)}
            data-hover
            className="w-full glass rounded-2xl py-4 text-sm font-semibold transition-all active:scale-95"
            style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
