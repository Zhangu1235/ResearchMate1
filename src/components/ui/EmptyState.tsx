import { FileSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "22px",
        border: "1px solid #E5E7EB",
        padding: "60px",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          width: "75px",
          height: "75px",
          margin: "0 auto 25px",
          borderRadius: "50%",
          background: "#EEF2FF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FileSearch
          size={34}
          color="#4F46E5"
        />
      </div>

      <h2
        style={{
          color: "#111827",
          marginBottom: "12px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#6B7280",
          lineHeight: 1.8,
          maxWidth: "550px",
          margin: "0 auto",
        }}
      >
        {description}
      </p>
    </div>
  );
}