const stats = [
  {
    number: "12",
    label: "Papers",
  },
  {
    number: "4",
    label: "Comparisons",
  },
  {
    number: "6",
    label: "Research Gaps",
  },
  {
    number: "21",
    label: "Questions",
  },
];

export default function StatsCard() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "25px",
        padding: "0 50px 50px",
      }}
    >
      {stats.map((item) => (
        <div
          key={item.label}
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 8px 25px rgba(0,0,0,.05)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "40px",
              color: "#4F46E5",
            }}
          >
            {item.number}
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#6B7280",
              fontSize: "16px",
            }}
          >
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}