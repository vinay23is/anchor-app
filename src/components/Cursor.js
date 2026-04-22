import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };

    const onEnter = (e) => {
      if (e.target.closest("button, a, [data-hover]")) setHovering(true);
    };
    const onLeave = (e) => {
      if (e.target.closest("button, a, [data-hover]")) setHovering(false);
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Dot — instant */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: hovering ? "10px" : "6px",
          height: hovering ? "10px" : "6px",
          marginLeft: hovering ? "-5px" : "-3px",
          marginTop: hovering ? "-5px" : "-3px",
          borderRadius: "50%",
          background: "white",
          boxShadow: hovering
            ? "0 0 20px rgba(167,139,250,1), 0 0 40px rgba(167,139,250,0.5)"
            : "0 0 10px rgba(167,139,250,0.8)",
          transition: "width 0.2s, height 0.2s, margin 0.2s, box-shadow 0.2s",
          willChange: "transform",
        }}
      />
      {/* Ring — lags behind */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: hovering ? "50px" : "34px",
          height: hovering ? "50px" : "34px",
          marginLeft: hovering ? "-25px" : "-17px",
          marginTop: hovering ? "-25px" : "-17px",
          borderRadius: "50%",
          border: hovering
            ? "1.5px solid rgba(167,139,250,0.9)"
            : "1px solid rgba(167,139,250,0.5)",
          background: hovering ? "rgba(167,139,250,0.08)" : "transparent",
          transition: "width 0.3s, height 0.3s, margin 0.3s, border 0.3s, background 0.3s",
          willChange: "transform",
        }}
      />
    </>
  );
}
