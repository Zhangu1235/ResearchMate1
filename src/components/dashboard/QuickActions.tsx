import React from "react";
import {
  BookOpen,
  Search,
  BrainCircuit,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Summarize",
    description: "Generate concise AI summaries from research papers.",
    icon: BookOpen,
    color: "#F5F3FF",
    iconColor: "#6D28D9",
    path: "/summary",
  },
  {
    title: "Compare",
    description: "Compare methodologies, datasets and findings.",
    icon: Search,
    color: "#EFF6FF",
    iconColor: "#2563EB",
    path: "/compare",
  },
  {
    title: "Research Gaps",
    description: "Identify unexplored opportunities instantly.",
    icon: BrainCircuit,
    color: "#ECFDF5",
    iconColor: "#059669",
    path: "/compare",
  },
  {
    title: "Ask AI",
    description: "Chat naturally with your uploaded papers.",
    icon: Sparkles,
    color: "#FFF7ED",
    iconColor: "#EA580C",
    path: "/chat",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rx = -(y / (box.height / 2)) * 12; // Max 12 degrees rotation
    const ry = (x / (box.width / 2)) * 12;
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  return (
    <section className="quickActions">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <div
            className="actionCard"
            key={action.title}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="actionIcon"
              style={{
                background: action.color,
                color: action.iconColor,
              }}
            >
              <Icon size={26} />
            </div>

            <h3>{action.title}</h3>

            <p>{action.description}</p>

            <button className="actionButton" onClick={() => navigate(action.path)}>
              Open
              <ArrowRight size={16} />
            </button>
          </div>
        );
      })}
    </section>
  );
}