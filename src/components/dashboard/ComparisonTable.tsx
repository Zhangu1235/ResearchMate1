import EmptyState from "../ui/EmptyState";

interface ComparisonTableProps {
  comparison?: any[];
}

export default function ComparisonTable({
  comparison,
}: ComparisonTableProps) {
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
        Paper Comparison
      </h2>

      {!comparison || comparison.length === 0 ? (
        <EmptyState
          title="Comparison Not Available"
          description="Upload at least two research papers to compare methodologies, datasets and results."
        />
      ) : (
        <table>
          {/* Backend data goes here */}
        </table>
      )}
    </section>
  );
}