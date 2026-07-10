import {
  BookOpen,
  Search,
  BrainCircuit,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Summarize",
    description: "Generate concise AI summaries from research papers.",
    icon: BookOpen,
    color: "#F5F3FF",
    iconColor: "#6D28D9",
  },
  {
    title: "Compare",
    description: "Compare methodologies, datasets and findings.",
    icon: Search,
    color: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    title: "Research Gaps",
    description: "Identify unexplored opportunities instantly.",
    icon: BrainCircuit,
    color: "#ECFDF5",
    iconColor: "#059669",
  },
  {
    title: "Ask AI",
    description: "Chat naturally with your uploaded papers.",
    icon: Sparkles,
    color: "#FFF7ED",
    iconColor: "#EA580C",
  },
];

export default function QuickActions() {
  return (
    <section className="quickActions">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <div className="actionCard" key={action.title}>
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

            <button className="actionButton">
              Open
              <ArrowRight size={16} />
            </button>
          </div>
        );
      })}
    </section>
  );
}