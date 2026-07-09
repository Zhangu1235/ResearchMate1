import EmptyState from "../ui/EmptyState";

interface SummaryCardProps {
  summary?: string;
}

export default function SummaryCard({
  summary,
}: SummaryCardProps) {
  return (
    <section
      style={{
        padding: "0 50px 60px",
      }}
    >
      <h2
        style={{
          marginBottom: "25px",
        }}
      >
        AI Summary
      </h2>

      {!summary ? (
        <EmptyState
          title="No Summary Generated"
          description="Upload a research paper to generate an AI-powered summary using Gemini AI."
        />
      ) : (
        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "22px",
          }}
        >
          {summary}
        </div>
      )}
    </section>
  );
}