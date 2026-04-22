import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { subscribeToChat, sendMessage } from "../firebase/chatService";
import Background from "../components/Background";

export default function Chat() {
  const { chatId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeToChat(chatId, setMessages);
    return unsub;
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const msg = text.trim();
    setText("");
    await sendMessage(chatId, user.uid, profile.username, msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080810] flex flex-col relative">
      <Background />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 px-5 py-4 border-b border-white/5 glass">
        <button
          onClick={() => navigate("/requests")}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
        >
          ←
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            ⚓
          </div>
          <div>
            <p className="text-white text-sm font-bold">Anonymous Chat</p>
            <p className="text-gray-500 text-xs">identities hidden</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🫂</p>
            <p className="text-gray-400 text-sm">Say hi. You both checked in today.</p>
            <p className="text-gray-600 text-xs mt-1">Neither of you is alone in this.</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.uid === user.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto mb-1 flex-shrink-0">
                  {msg.username?.slice(-2)}
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  isMe
                    ? "text-white rounded-br-sm"
                    : "glass text-gray-100 rounded-bl-sm"
                }`}
                style={isMe ? { background: "linear-gradient(135deg, #7c3aed, #3b82f6)" } : {}}
              >
                {!isMe && (
                  <p className="text-violet-400 text-xs font-semibold mb-1">{msg.username}</p>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="relative z-10 px-4 py-4 border-t border-white/5 glass flex gap-2 items-end">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say something..."
          rows={1}
          className="flex-1 bg-white/5 text-white text-sm rounded-2xl px-4 py-3 border border-white/10 focus:outline-none focus:border-violet-500/50 resize-none placeholder-gray-600 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="py-3 px-5 rounded-2xl text-white text-sm font-bold transition-all active:scale-95 disabled:opacity-30"
          style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
