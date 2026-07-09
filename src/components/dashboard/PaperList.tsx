import PaperCard from "./PaperCard";

export default function PaperList() {
  return (
    <section
      style={{
        padding: "0 50px 60px",
      }}
    >
      <h2
        style={{
          marginBottom: "25px",
          color: "#111827",
        }}
      >
        Recent Papers
      </h2>

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        <PaperCard
          title="Attention Is All You Need"
          uploaded="2 minutes ago"
        />

        <PaperCard
          title="BERT: Pre-training of Deep Bidirectional Transformers"
          uploaded="Yesterday"
        />

        <PaperCard
          title="GPT-4 Technical Report"
          uploaded="Last Week"
        />
      </div>
    </section>
  );
}