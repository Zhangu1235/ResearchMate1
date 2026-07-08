import { Upload, GitCompare, Search } from "lucide-react";

export default function QuickActions() {
  return (
    <section
      style={{
        padding: "0 50px 50px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "25px",
        }}
      >
        <ActionCard
          icon={<Upload size={30} />}
          title="Upload Papers"
          text="Upload one or more research papers."
        />

        <ActionCard
          icon={<GitCompare size={30} />}
          title="Compare Papers"
          text="Compare methods and datasets."
        />

        <ActionCard
          icon={<Search size={30} />}
          title="Ask ResearchMate"
          text="Ask questions across all uploaded papers."
        />
      </div>
    </section>
  );
}

function ActionCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "30px",
        border: "1px solid #E5E7EB",
        boxShadow: "0 8px 20px rgba(0,0,0,.05)",
        cursor: "pointer",
        transition: ".25s",
      }}
    >
      <div
        style={{
          color: "#4F46E5",
          marginBottom: "18px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          marginBottom: "10px",
          color: "#111827",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#6B7280",
          lineHeight: 1.7,
        }}
      >
        {text}
      </p>
    </div>
  );
}