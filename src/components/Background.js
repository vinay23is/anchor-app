import { useEffect, useRef } from "react";

export default function Background() {
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  useEffect(() => {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let raf;

    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5);
      targetY = (e.clientY / window.innerHeight - 0.5);
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${currentX * 40}px, ${currentY * 40}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${currentX * -30}px, ${currentY * -30}px)`;
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate(${currentX * 20}px, ${currentY * -20}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {/* Mesh gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 5%  0%,   rgba(109,40,217,0.5)  0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 95% 95%,  rgba(6,182,212,0.32)  0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 70% 15%,  rgba(192,38,211,0.20) 0%, transparent 55%),
            radial-gradient(ellipse 40% 60% at 10% 80%,  rgba(6,182,212,0.14)  0%, transparent 60%),
            #030308
          `,
        }}
      />

      {/* Mouse-reactive orbs */}
      <div
        ref={orb1Ref}
        className="absolute"
        style={{
          top: "-25%", left: "-15%",
          width: "700px", height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 65%)",
          filter: "blur(50px)",
          willChange: "transform",
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute"
        style={{
          bottom: "-20%", right: "-10%",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 65%)",
          filter: "blur(50px)",
          willChange: "transform",
        }}
      />
      <div
        ref={orb3Ref}
        className="absolute"
        style={{
          top: "40%", left: "35%",
          width: "400px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(192,38,211,0.14) 0%, transparent 65%)",
          filter: "blur(70px)",
          willChange: "transform",
        }}
      />

      {/* Spinning ring */}
      <div
        className="spin-slow absolute"
        style={{
          top: "-10%", right: "-12%",
          width: "520px", height: "520px",
          borderRadius: "50%",
          border: "1px solid rgba(124,58,237,0.13)",
        }}
      />
      <div
        className="pulse-ring absolute"
        style={{
          top: "-5%", right: "-7%",
          width: "380px", height: "380px",
          borderRadius: "50%",
          border: "1px solid rgba(192,38,211,0.18)",
        }}
      />
      <div
        className="pulse-ring absolute"
        style={{
          bottom: "-8%", left: "-8%",
          width: "440px", height: "440px",
          borderRadius: "50%",
          border: "1px solid rgba(6,182,212,0.10)",
          animationDelay: "4s",
        }}
      />

      {/* Constellation dots */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.4 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {[
          { cx: "8%",  cy: "12%", r: 1.5, color: "#a78bfa" },
          { cx: "18%", cy: "28%", r: 1,   color: "#a78bfa" },
          { cx: "30%", cy: "8%",  r: 1,   color: "#22d3ee" },
          { cx: "72%", cy: "6%",  r: 1.5, color: "#e879f9" },
          { cx: "88%", cy: "18%", r: 1,   color: "#22d3ee" },
          { cx: "92%", cy: "40%", r: 1,   color: "#a78bfa" },
          { cx: "78%", cy: "55%", r: 1.5, color: "#22d3ee" },
          { cx: "5%",  cy: "55%", r: 1,   color: "#e879f9" },
          { cx: "15%", cy: "70%", r: 1,   color: "#a78bfa" },
          { cx: "40%", cy: "88%", r: 1.5, color: "#22d3ee" },
          { cx: "60%", cy: "80%", r: 1,   color: "#a78bfa" },
          { cx: "85%", cy: "78%", r: 1,   color: "#e879f9" },
        ].map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.color} />
        ))}
        <line x1="8%"  y1="12%" x2="18%" y2="28%" stroke="rgba(167,139,250,0.15)" strokeWidth="0.5" />
        <line x1="18%" y1="28%" x2="30%" y2="8%"  stroke="rgba(167,139,250,0.10)" strokeWidth="0.5" />
        <line x1="72%" y1="6%"  x2="88%" y2="18%" stroke="rgba(34,211,238,0.15)"  strokeWidth="0.5" />
        <line x1="88%" y1="18%" x2="92%" y2="40%" stroke="rgba(34,211,238,0.10)"  strokeWidth="0.5" />
        <line x1="40%" y1="88%" x2="60%" y2="80%" stroke="rgba(167,139,250,0.12)" strokeWidth="0.5" />
      </svg>

      {/* Film grain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23grain)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.055,
          mixBlendMode: "overlay",
        }}
      />

      {/* Light sweep line */}
      <div
        className="absolute"
        style={{
          top: "38%", left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right, transparent 0%, rgba(124,58,237,0.25) 30%, rgba(6,182,212,0.25) 70%, transparent 100%)",
        }}
      />
    </div>
  );
}
