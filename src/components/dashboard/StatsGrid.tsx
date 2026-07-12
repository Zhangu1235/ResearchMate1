import React from "react";
import {
  FileText,
  GitCompare,
  MessageSquare,
  BrainCircuit,
} from "lucide-react";
import { usePapers } from "../../context/PaperContext";

export default function StatsGrid() {
  const { papers, comparisonResult } = usePapers();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rx = -(y / (box.height / 2)) * 8; // Max 8 degrees rotation
    const ry = (x / (box.width / 2)) * 8;
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  const stats = [
    {
      icon: <FileText size={24} />,
      title: "Uploaded Papers",
      value: papers.length.toString(),
      color: "#EEF2FF",
      iconColor: "#4F46E5",
    },
    {
      icon: <GitCompare size={24} />,
      title: "Comparisons",
      value: comparisonResult ? "1" : "0",
      color: "#EFF6FF",
      iconColor: "#2563EB",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Summarized Papers",
      value: papers.filter(p => p.summary).length.toString(),
      color: "#ECFDF5",
      iconColor: "#059669",
    },
    {
      icon: <BrainCircuit size={24} />,
      title: "Research Gaps",
      value: comparisonResult ? "3" : "0",
      color: "#FFF7ED",
      iconColor: "#EA580C",
    },
  ];

  return (
    <section className="statsGrid">
      {stats.map((stat) => (
        <div
          className="statCard"
          key={stat.title}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="statIcon"
            style={{
              background: stat.color,
              color: stat.iconColor,
            }}
          >
            {stat.icon}
          </div>

          <div>
            <h3>{stat.value}</h3>
            <p>{stat.title}</p>
          </div>
        </div>
      ))}
    </section>
  );
}