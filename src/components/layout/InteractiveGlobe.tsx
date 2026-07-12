import React, { useState, useRef, useEffect } from "react";

export default function InteractiveGlobe() {
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(-15);
  const [isDragging, setIsDragging] = useState(false);
  const [pulse, setPulse] = useState(1);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const startRotationRef = useRef(0);
  const startTiltRef = useRef(0);

  // Auto rotate when not dragging
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.15) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    startRotationRef.current = rotation;
    startTiltRef.current = tilt;
    setPulse(1.08); // grab scale feedback
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    setRotation(startRotationRef.current + dx * 0.5);
    setTilt(Math.max(-45, Math.min(45, startTiltRef.current - dy * 0.35)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setPulse(1.0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    startRotationRef.current = rotation;
    startTiltRef.current = tilt;
    setPulse(1.08);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    
    setRotation(startRotationRef.current + dx * 0.5);
    setTilt(Math.max(-45, Math.min(45, startTiltRef.current - dy * 0.35)));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, rotation, tilt]);

  return (
    <div style={{
      position: "absolute",
      bottom: "-320px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "700px",
      height: "700px",
      zIndex: -2,
      pointerEvents: "none" // allow clicking elements in front
    }}>
      {/* Central Planet Container */}
      <div 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          pointerEvents: "auto", // enable dragging on globe itself
          transform: `scale(${pulse})`,
          transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2), box-shadow 0.4s",
          background: "radial-gradient(circle at 50% 30%, rgba(13, 9, 30, 0.95) 0%, rgba(3, 0, 10, 0.98) 100%)",
          boxShadow: `
            0 0 100px rgba(168, 85, 247, ${isDragging ? 0.65 : 0.45}),
            inset 0 0 70px rgba(168, 85, 247, ${isDragging ? 0.55 : 0.35}),
            0 0 200px rgba(99, 102, 241, 0.25)
          `,
          border: "1.5px solid rgba(255, 255, 255, 0.12)"
        }}
      >
        {/* 3D Wireframe Grids */}
        <svg 
          viewBox="0 0 100 100" 
          style={{
            width: "100%",
            height: "100%",
            transform: `rotate(${tilt}deg)`,
            transition: "transform 0.15s ease-out"
          }}
        >
          <defs>
            <linearGradient id="globe-grid-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Latitudes Horizontal lines */}
          {[15, 30, 45, 60, 75, 90].map((lat) => {
            const y = lat;
            const rx = Math.sqrt(y * (100 - y)) * 1.0;
            return (
              <ellipse
                key={`lat-${lat}`}
                cx="50"
                cy={y}
                rx={rx}
                ry={rx * 0.18}
                fill="none"
                stroke="url(#globe-grid-grad)"
                strokeWidth="0.35"
                strokeDasharray={isDragging ? "1, 1" : "none"}
              />
            );
          })}

          {/* Longitudes Vertical rotating lines */}
          {[-90, -60, -30, 0, 30, 60, 90].map((lon) => {
            const angle = (lon + rotation) * (Math.PI / 180);
            const rx = 50 * Math.sin(angle);
            return (
              <ellipse
                key={`lon-${lon}`}
                cx="50"
                cy="50"
                rx={Math.abs(rx)}
                ry="50"
                fill="none"
                stroke="url(#globe-grid-grad)"
                strokeWidth="0.4"
                strokeDasharray={isDragging ? "2, 1" : "none"}
                style={{
                  opacity: Math.cos(angle) > 0 ? 0.85 : 0.15
                }}
              />
            );
          })}

          {/* Equator */}
          <ellipse 
            cx="50" 
            cy="50" 
            rx="50" 
            ry="9" 
            fill="none" 
            stroke="url(#globe-grid-grad)" 
            strokeWidth="0.7"
            strokeDasharray="4, 2"
          />
        </svg>

        {/* Outer Planet Glowing Ring */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "900px",
          height: "80px",
          border: "2px solid rgba(168, 85, 247, 0.3)",
          borderRadius: "50%",
          transform: `translate(-50%, -50%) rotate(${tilt + 5}deg) scaleY(0.28)`,
          pointerEvents: "none",
          boxShadow: "0 0 35px rgba(168, 85, 247, 0.15), inset 0 0 35px rgba(168, 85, 247, 0.15)",
          transition: "transform 0.15s ease-out"
        }} />

        {/* Orbiting Satellite Planet 1 (Neon Cyan) */}
        <div className="orbitingPlanet opCyan" style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #22d3ee 0%, #0891b2 100%)",
          boxShadow: "0 0 30px rgba(34, 211, 238, 0.8), inset -2px -2px 8px rgba(0,0,0,0.5)",
          animation: "orbitCyan 15s infinite linear",
          transformOrigin: "center"
        }} />

        {/* Orbiting Satellite Planet 2 (Hot Pink) */}
        <div className="orbitingPlanet opPink" style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #f43f5e 0%, #be123c 100%)",
          boxShadow: "0 0 25px rgba(244, 63, 94, 0.85), inset -2px -2px 6px rgba(0,0,0,0.5)",
          animation: "orbitPink 9s infinite linear",
          transformOrigin: "center"
        }} />

        {/* Orbiting Satellite Planet 3 (Cyberpunk Gold) */}
        <div className="orbitingPlanet opGold" style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #eab308 0%, #854d0e 100%)",
          boxShadow: "0 0 20px rgba(234, 179, 8, 0.8), inset -2px -2px 5px rgba(0,0,0,0.5)",
          animation: "orbitGold 22s infinite linear",
          transformOrigin: "center"
        }} />
      </div>

      {/* Orbiting animations CSS keyframes */}
      <style>{`
        @keyframes orbitCyan {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(460px) rotate(0deg) scale(0.7);
            z-index: -3;
          }
          49% { z-index: -3; }
          50% {
            transform: translate(-50%, -50%) rotate(180deg) translateX(460px) rotate(-180deg) scale(1.1);
            z-index: 3;
          }
          99% { z-index: 3; }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(460px) rotate(-360deg) scale(0.7);
            z-index: -3;
          }
        }

        @keyframes orbitPink {
          0% {
            transform: translate(-50%, -50%) rotate(120deg) translateX(280px) rotate(-120deg) scale(0.85);
            z-index: 2;
          }
          24% { z-index: 2; }
          25% {
            transform: translate(-50%, -50%) rotate(210deg) translateX(280px) rotate(-210deg) scale(0.65);
            z-index: -2;
          }
          74% { z-index: -2; }
          75% {
            transform: translate(-50%, -50%) rotate(390deg) translateX(280px) rotate(-390deg) scale(0.85);
            z-index: 2;
          }
          100% {
            transform: translate(-50%, -50%) rotate(480deg) translateX(280px) rotate(-480deg) scale(0.85);
            z-index: 2;
          }
        }

        @keyframes orbitGold {
          0% {
            transform: translate(-50%, -50%) rotate(240deg) translateX(550px) rotate(-240deg) scale(0.6);
            z-index: -4;
          }
          49% { z-index: -4; }
          50% {
            transform: translate(-50%, -50%) rotate(420deg) translateX(550px) rotate(-420deg) scale(1.0);
            z-index: 4;
          }
          99% { z-index: 4; }
          100% {
            transform: translate(-50%, -50%) rotate(600deg) translateX(550px) rotate(-600deg) scale(0.6);
            z-index: -4;
          }
        }
      `}</style>
    </div>
  );
}
