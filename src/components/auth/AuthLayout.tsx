import React, { ReactNode } from "react";
import InteractiveGlobe from "../layout/InteractiveGlobe";
import "../../styles/auth.css";

interface AuthLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export default function AuthLayout({ left, right }: AuthLayoutProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rx = -(y / (box.height / 2)) * 6; // Max 6 degrees rotation for large card
    const ry = (x / (box.width / 2)) * 6;
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="authPage">
      <InteractiveGlobe />
      <div
        className="authContainer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <aside className="authLeft">{left}</aside>
        <main className="authRight">{right}</main>
      </div>
    </div>
  );
}
