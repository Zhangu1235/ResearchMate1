import {
  FileText,
  GitCompare,
  MessageSquare,
  BrainCircuit,
} from "lucide-react";

const stats = [
  {
    icon: <FileText size={24} />,
    title: "Uploaded Papers",
    value: "0",
    color: "#EEF2FF",
    iconColor: "#4F46E5",
  },
  {
    icon: <GitCompare size={24} />,
    title: "Comparisons",
    value: "0",
    color: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    icon: <MessageSquare size={24} />,
    title: "AI Chats",
    value: "0",
    color: "#ECFDF5",
    iconColor: "#059669",
  },
  {
    icon: <BrainCircuit size={24} />,
    title: "Research Gaps",
    value: "0",
    color: "#FFF7ED",
    iconColor: "#EA580C",
  },
];

export default function StatsGrid() {
  return (
    <section className="statsGrid">
      {stats.map((stat) => (
        <div className="statCard" key={stat.title}>

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