import { Bell, Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav
      style={{
        width: "100%",
        height: "80px",
        background: "white",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 50px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}

      <h1
        style={{
          fontSize: "32px",
          fontWeight: 800,
          color: "#111827",
          margin: 0,
        }}
      >
        Research
        <span
          style={{
            background:
              "linear-gradient(135deg,#4F46E5,#8B5CF6)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Mate
        </span>
      </h1>

      {/* Search */}

      <div
        style={{
          width: "420px",
          height: "46px",
          background: "#F8FAFC",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: "12px",
        }}
      >
        <Search size={18} color="#64748B" />

        <input
          placeholder="Search uploaded papers..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
            fontSize: "15px",
          }}
        />
      </div>

      {/* Right */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Bell
          size={22}
          color="#6B7280"
          style={{ cursor: "pointer" }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#4F46E5,#8B5CF6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <User color="white" size={18} />
          </div>

          <div>
            <div
              style={{
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Jessica
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#6B7280",
              }}
            >
              Researcher
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}