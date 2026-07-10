import { BookOpenText, BrainCircuit, Search, Sparkles } from "lucide-react";

const features = [
  {
    icon: BookOpenText,
    label: "Summarize Research Papers",
  },
  {
    icon: Search,
    label: "Compare Multiple Papers",
  },
  {
    icon: BrainCircuit,
    label: "Discover Research Gaps",
  },
  {
    icon: Sparkles,
    label: "Ask ResearchMate",
  },
];

export default function AuthLeft() {
  return (
    <div className="leftContent">
      <div className="brandPill">ResearchMate</div>

      <h1>Welcome back to ResearchMate</h1>

      <p className="leftDescription">
        Continue your research journey with AI-powered literature analysis.
      </p>

      <div className="featureList">
        {features.map(({ icon: Icon, label }) => (
          <div className="featureCard" key={label}>
            <span className="featureIcon" aria-hidden="true">
              <Icon size={18} strokeWidth={2} />
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
