import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveCheckIn, getRecentMoods } from "../firebase/checkInService";
import { getAIResponse } from "../utils/gemini";
import { getFeed } from "../firebase/feedService";
import { sendConnectRequest } from "../firebase/connectService";
import Background from "../components/Background";

export default function Home() {
  const { user, profile } = useAuth();
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState(5);
  const [loading, setLoading] = useState(false);
  const [aiReply, setAiReply] = useState(null);
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState(null);
  const [sentRequests, setSentRequests] = useState({});

  const moodLabel = [
    "", "Barely holding on", "Really struggling", "Pretty rough",
    "Not great", "Just okay", "Doing alright", "Feeling decent",
    "Pretty good", "Really good", "Feeling great",
  ];

  const moodColor = [
    "", "#ef4444", "#f97316", "#f97316", "#eab308",
    "#eab308", "#84cc16", "#22c55e", "#22c55e", "#10b981", "#10b981",
  ];

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      let recentMoods = [];
      try { recentMoods = await getRecentMoods(user.uid); } catch (e) {}
      await saveCheckIn(user.uid, profile.username, message, mood);
      const [reply, feedPosts] = await Promise.all([
        getAIResponse(message, mood, recentMoods),
        getFeed(user.uid),
      ]);
      setAiReply(reply);
      setFeed(feedPosts);
    } catch (err) {
      setError(`Something went wrong. Try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (post) => {
    setSentRequests((prev) => ({ ...prev, [post.id]: "sending" }));
    await sendConnectRequest(user.uid, profile.username, post.uid, post.username);
    setSentRequests((prev) => ({ ...prev, [post.id]: "sent" }));
  };

  const handleReset = () => {
    setMessage(""); setMood(5);
    setAiReply(null); setFeed([]); setSentRequests({});
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#080810] flex flex-col items-center justify-center px-6 relative">
        <Background />
        <div className="relative z-10 text-center">
          <div className="text-5xl mb-6 animate-pulse">⚓</div>
          <p className="gradient-text font-semibold text-lg">Reading your words...</p>
          <p className="text-gray-600 text-sm mt-2">This'll just take a second</p>
        </div>
      </div>
    );
  }

  if (aiReply) {
    return (
      <div className="min-h-screen w-full bg-[#080810] pb-28 relative">
        <Background />
        <div className="relative z-10 flex flex-col px-5 py-10 max-w-lg mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">you are</p>
              <p className="text-white font-bold text-base">{profile?.username}</p>
            </div>
            {profile?.streak > 0 && (
              <div className="glass rounded-2xl px-4 py-2 text-center">
                <p className="gradient-text font-black text-xl leading-none">{profile.streak}</p>
                <p className="text-gray-500 text-xs mt-0.5">day streak 🔥</p>
              </div>
            )}
          </div>

          {/* AI Card */}
          <div className="glass-strong rounded-3xl p-6 mb-4 shadow-xl shadow-violet-900/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-blue-500 to-fuchsia-500" />
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">⚓</span>
              <p className="gradient-text font-bold text-sm">Anchor says</p>
            </div>
            <p className="text-gray-100 text-sm leading-relaxed">{aiReply}</p>
          </div>

          {/* Your message */}
          <div className="glass rounded-2xl p-4 mb-8">
            <p className="text-gray-600 text-xs mb-1">you said</p>
            <p className="text-gray-300 text-sm italic leading-relaxed">"{message}"</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: moodColor[mood] }} />
              <p className="text-gray-600 text-xs">{mood}/10 — {moodLabel[mood]}</p>
            </div>
          </div>

          {/* Feed */}
          {feed.length > 0 && (
            <>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-4 px-1">
                others checked in today
              </p>
              <div className="flex flex-col gap-3">
                {feed.map((post) => (
                  <div key={post.id} className="glass rounded-2xl p-4 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-violet-400 text-xs font-semibold">{post.username}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: moodColor[post.mood] || "#888" }} />
                        <p className="text-gray-600 text-xs">{post.mood}/10</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{post.message}</p>
                    <button
                      onClick={() => handleConnect(post)}
                      disabled={!!sentRequests[post.id]}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-40"
                      style={{
                        background: sentRequests[post.id] === "sent"
                          ? "rgba(167,139,250,0.15)"
                          : "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.3))",
                        border: "1px solid rgba(167,139,250,0.3)",
                        color: sentRequests[post.id] === "sent" ? "#a78bfa" : "white",
                      }}
                    >
                      {sentRequests[post.id] === "sent"
                        ? "✓ Request sent"
                        : sentRequests[post.id] === "sending"
                        ? "Sending..."
                        : "I've been there too →"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {feed.length === 0 && (
            <div className="glass rounded-2xl p-6 text-center mt-2">
              <p className="text-3xl mb-3">🌱</p>
              <p className="text-gray-400 text-sm">You're the first one here today.</p>
              <p className="text-gray-600 text-xs mt-1">Others will follow.</p>
            </div>
          )}

          <button
            onClick={handleReset}
            className="mt-8 w-full glass py-3.5 rounded-2xl text-gray-400 text-sm font-medium hover:text-white transition-all"
          >
            Check in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#080810] pb-28 relative">
      <Background />
      <div className="relative z-10 flex flex-col px-5 py-10 max-w-lg mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-gray-500 text-xs mb-0.5">you are</p>
            <p className="text-white font-bold">{profile?.username}</p>
          </div>
          {profile?.streak > 0 && (
            <div className="glass rounded-2xl px-4 py-2 text-center">
              <p className="gradient-text font-black text-xl leading-none">{profile.streak}</p>
              <p className="text-gray-500 text-xs mt-0.5">day streak 🔥</p>
            </div>
          )}
        </div>

        {/* Main heading */}
        <h1 className="text-4xl font-black text-white leading-tight mb-2">
          Why are you<br />
          <span className="gradient-text">here today?</span>
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          No one sees your name. Just say what's real.
        </p>

        {/* Text area */}
        <div className="glass-strong rounded-2xl p-1 mb-6 shadow-xl shadow-black/30">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's going on for you right now..."
            rows={5}
            className="w-full bg-transparent text-white text-sm p-4 focus:outline-none resize-none placeholder-gray-600 leading-relaxed"
          />
        </div>

        {/* Mood slider */}
        <div className="glass rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-400 text-sm">How are you feeling?</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full transition-colors" style={{ backgroundColor: moodColor[mood] }} />
              <p className="text-white font-bold text-sm">{mood}/10</p>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-gray-500 text-xs mt-3 text-center">{moodLabel[mood]}</p>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center glass rounded-xl py-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!message.trim()}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-violet-900/30"
          style={{
            background: message.trim()
              ? "linear-gradient(135deg, #7c3aed, #3b82f6)"
              : "rgba(255,255,255,0.1)",
            color: "white",
          }}
        >
          Share with Anchor ⚓
        </button>
      </div>
    </div>
  );
}
