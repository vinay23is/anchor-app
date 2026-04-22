import { useRef, useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import Background from "../components/Background";

function MagneticButton({ children, onClick }) {
  const btnRef = useRef(null);

  const onMouseMove = (e) => {
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    btn.style.transition = "transform 0.1s ease";
  };

  const onMouseLeave = () => {
    const btn = btnRef.current;
    btn.style.transform = "translate(0px, 0px)";
    btn.style.transition = "transform 0.6s cubic-bezier(0.23,1,0.32,1)";
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      data-hover
      className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-4 px-5 rounded-2xl shadow-lg shadow-black/30"
      style={{ willChange: "transform" }}
    >
      {children}
    </button>
  );
}

export default function Login() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  const letters = "Anchor".split("");

  return (
    <div className="min-h-screen w-full bg-[#030308] flex flex-col items-center justify-center px-6 relative">
      <Background />

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo icon */}
        <div
          className="flex justify-center mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div className="w-20 h-20 rounded-3xl glass-strong flex items-center justify-center text-4xl shadow-2xl shadow-violet-500/20">
            ⚓
          </div>
        </div>

        {/* Animated title */}
        <h1 className="text-6xl font-black text-white tracking-tight text-center mb-3 flex justify-center overflow-hidden">
          {letters.map((letter, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: `opacity 0.6s ease ${0.2 + i * 0.07}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${0.2 + i * 0.07}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <p
          className="gradient-text text-base font-semibold text-center mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.7s, transform 0.7s ease 0.7s",
          }}
        >
          for people fighting invisible wars
        </p>

        {/* Card */}
        <div
          className="glass-strong rounded-3xl p-8 shadow-2xl shadow-black/60"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease 0.9s, transform 0.8s ease 0.9s",
          }}
        >
          <div className="flex flex-col gap-4 mb-8">
            {[
              { icon: "🤫", text: "Fully anonymous — no one sees your name." },
              { icon: "🤖", text: "AI that actually gets your situation." },
              { icon: "🫂", text: "Real people going through the same thing." },
            ].map((item, i) => (
              <div
                key={item.text}
                className="flex items-center gap-3"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 0.6s ease ${1.1 + i * 0.1}s, transform 0.6s ease ${1.1 + i * 0.1}s`,
                }}
              >
                <span className="text-xl">{item.icon}</span>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>

          <MagneticButton onClick={handleGoogleLogin}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </MagneticButton>

          <p className="text-gray-600 text-xs text-center mt-5 leading-relaxed">
            Your email becomes Anchor#4821 — we never store or show it.
          </p>
        </div>
      </div>
    </div>
  );
}
