import EmptyState from "../ui/EmptyState";

interface GapCardProps {
  gaps?: any[];
}

export default function GapCard({
  gaps,
}: GapCardProps) {
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
        Research Gaps
      </h2>

      {!gaps || gaps.length === 0 ? (
        <EmptyState
          title="No Research Gaps Yet"
          description="Research gaps will automatically appear after comparing multiple research papers."
        />
      ) : (
        <div>
          {/* Backend cards */}
        </div>
      )}
    </section>
  );
}