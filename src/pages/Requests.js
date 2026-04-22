import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getIncomingRequests, getUserChats,
  acceptRequest, declineRequest,
} from "../firebase/connectService";
import Background from "../components/Background";

export default function Requests() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [reqs, userChats] = await Promise.all([
        getIncomingRequests(user.uid),
        getUserChats(user.uid),
      ]);
      setRequests(reqs);
      setChats(userChats);
      setLoading(false);
    }
    load();
  }, [user.uid]);

  const handleAccept = async (req) => {
    const chatId = await acceptRequest(req.id, req.fromUid, req.fromUsername, req.toUid, req.toUsername);
    navigate(`/chat/${chatId}`);
  };

  const handleDecline = async (req) => {
    await declineRequest(req.id);
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  const getChatUsername = (chat) => {
    const otherUid = chat.participants.find((uid) => uid !== user.uid);
    return chat.usernames?.[otherUid] || "Anonymous";
  };

  return (
    <div className="min-h-screen w-full bg-[#080810] pb-28 relative">
      <Background />
      <div className="relative z-10 flex flex-col px-5 py-10 max-w-lg mx-auto">

        <div className="mb-10">
          <p className="text-gray-500 text-xs mb-0.5">you are</p>
          <p className="text-white font-bold">{profile?.username}</p>
        </div>

        <h1 className="text-4xl font-black text-white mb-1">
          Connect
        </h1>
        <p className="gradient-text font-semibold text-sm mb-10">
          anonymous human moments
        </p>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        ) : (
          <>
            {/* Pending requests */}
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">
              Incoming requests
            </p>

            {requests.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center mb-8">
                <p className="text-3xl mb-3">🫂</p>
                <p className="text-gray-400 text-sm">No pending requests yet.</p>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                  When someone resonates with your check-in, they'll reach out here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mb-8">
                {requests.map((req) => (
                  <div key={req.id} className="glass-strong rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-blue-500" />
                    <p className="text-violet-400 font-semibold text-sm mb-1">{req.fromUsername}</p>
                    <p className="text-gray-500 text-xs mb-5">wants to connect anonymously</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(req)}
                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(req)}
                        className="flex-1 glass py-3 rounded-xl text-sm text-gray-400 hover:text-white transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Active chats */}
            {chats.length > 0 && (
              <>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">
                  Active conversations
                </p>
                <div className="flex flex-col gap-3">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => navigate(`/chat/${chat.chatId}`)}
                      className="glass rounded-2xl p-4 text-left hover:bg-white/5 transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                          {getChatUsername(chat).slice(-4)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{getChatUsername(chat)}</p>
                          <p className="text-gray-500 text-xs">Tap to open →</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
