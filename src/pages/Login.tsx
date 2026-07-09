// interface LoginProps {
//   next: () => void;
// }

// export default function Login({ next }: LoginProps) {
//   return (
//     <div
//       style={{
//         height: "100vh",
//         background: "#FAFBFF",
//         display: "grid",
//         gridTemplateColumns: "1.3fr 1fr",
//         padding: "80px",
//         gap: "70px",
//         alignItems: "center",
//         fontFamily: "Inter,sans-serif",
//       }}
//     >
//       {/* LEFT */}

//       <div>
//         <h1
//           style={{
//             fontSize: "58px",
//             marginBottom: "18px",
//             color: "#101828",
//           }}
//         >
//           Welcome to ResearchMate
//         </h1>

//         <p
//           style={{
//             fontSize: "20px",
//             lineHeight: 1.8,
//             color: "#667085",
//             maxWidth: "650px",
//           }}
//         >
//           ResearchMate is an AI-powered research assistant that helps
//           students and researchers analyze multiple research papers,
//           compare methodologies, generate concise summaries and
//           identify research gaps from one intelligent workspace.
//         </p>

//         <div
//           style={{
//             marginTop: "45px",
//             display: "grid",
//             gap: "20px",
//           }}
//         >
//           <Feature title="Multi-Paper Analysis" />
//           <Feature title="AI Generated Summaries" />
//           <Feature title="Cross-Paper Question Answering" />
//           <Feature title="Comparison Tables" />
//           <Feature title="Research Gap Detection" />
//         </div>
//       </div>

//       {/* RIGHT */}

//       <div
//         style={{
//           background: "white",
//           borderRadius: "24px",
//           padding: "45px",
//           boxShadow: "0 20px 60px rgba(0,0,0,.08)",
//         }}
//       >
//         <h2
//           style={{
//             marginBottom: "8px",
//             color: "#101828",
//           }}
//         >
//           Sign In
//         </h2>

//         <p
//           style={{
//             color: "#667085",
//             marginBottom: "35px",
//           }}
//         >
//           Continue to your workspace.
//         </p>

//         <input
//           placeholder="Email"
//           style={inputStyle}
//         />

//         <input
//           placeholder="Password"
//           type="password"
//           style={inputStyle}
//         />

//         <button
//           onClick={next}
//           style={{
//             width: "100%",
//             marginTop: "25px",
//             padding: "15px",
//             background:
//               "linear-gradient(135deg,#4F46E5,#8B5CF6)",
//             color: "white",
//             border: "none",
//             borderRadius: "12px",
//             cursor: "pointer",
//             fontWeight: 600,
//             fontSize: "16px",
//           }}
//         >
//           Sign In
//         </button>

//         <p
//           style={{
//             marginTop: "25px",
//             textAlign: "center",
//             color: "#667085",
//           }}
//         >
//           New to ResearchMate?

//           <span
//             style={{
//               color: "#4F46E5",
//               cursor: "pointer",
//               fontWeight: 600,
//             }}
//           >
//             {" "}
//             Create Account
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "15px",
//   marginBottom: "18px",
//   borderRadius: "12px",
//   border: "1px solid #E5E7EB",
//   fontSize: "15px",
//   boxSizing: "border-box" as const,
// };

// function Feature({ title }: { title: string }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "15px",
//       }}
//     >
//       <div
//         style={{
//           width: "10px",
//           height: "10px",
//           borderRadius: "50%",
//           background: "#6366F1",
//         }}
//       />

//       <span
//         style={{
//           fontSize: "18px",
//           color: "#374151",
//         }}
//       >
//         {title}
//       </span>
//     </div>
//   );
// }
interface LoginProps {
  next: () => void;
}

export default function Login({ next }: LoginProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFBFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: "70px",
          padding: "80px",
          alignItems: "center",
          flex: 1,
        }}
      >
        {/* LEFT SECTION */}

        <div>
          <h1
            style={{
              fontSize: "56px",
              color: "#111827",
              marginBottom: "20px",
            }}
          >
            Welcome to ResearchMate
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.9,
              color: "#6B7280",
              maxWidth: "650px",
            }}
          >
            ResearchMate is an AI-powered research assistant that helps
            students, researchers and professionals analyse multiple
            research papers from a single workspace.
          </p>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.9,
              color: "#6B7280",
              maxWidth: "650px",
              marginTop: "18px",
            }}
          >
            Upload research papers, generate concise AI summaries,
            compare methodologies, discover research gaps and answer
            questions across multiple papers with citation-supported
            responses.
          </p>

          <div
            style={{
              marginTop: "45px",
              display: "grid",
              gap: "18px",
            }}
          >
            <Feature text="AI-generated paper summaries" />
            <Feature text="Cross-paper comparison tables" />
            <Feature text="Citation-aware question answering" />
            <Feature text="Automatic research gap detection" />
            <Feature text="Upload and analyse multiple PDFs" />
          </div>
        </div>

        {/* LOGIN CARD */}

        <div
          style={{
            background: "white",
            padding: "45px",
            borderRadius: "22px",
            boxShadow: "0 20px 60px rgba(0,0,0,.08)",
            border: "1px solid #E5E7EB",
          }}
        >
          <h2
            style={{
              marginBottom: "8px",
              color: "#111827",
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              color: "#6B7280",
              marginBottom: "30px",
            }}
          >
            Sign in to continue your research journey.
          </p>

          <input
            placeholder="Email"
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
          />

          <button
            onClick={next}
            style={primaryButton}
          >
            Sign In
          </button>

          <button
            style={secondaryButton}
          >
            Create Account
          </button>
{/* 
          <p
            style={{
              textAlign: "center",
              marginTop: "22px",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            Authentication is currently in demo mode.
          </p> */}
        </div>
      </div>

      {/* FOOTER */}

      <footer
        style={{
          borderTop: "1px solid #E5E7EB",
          padding: "28px",
          textAlign: "center",
          background: "white",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#111827",
          }}
        >
          ResearchMate
        </h3>

        <p
          style={{
            marginTop: "10px",
            color: "#6B7280",
            fontSize: "15px",
          }}
        >
          AI-powered literature analysis for researchers and students.
        </p>

        <p
          style={{
            marginTop: "16px",
            color: "#94A3B8",
            fontSize: "14px",
          }}
        >
          © 2026 ResearchMate • Built with React, Flask & Gemini AI
        </p>
      </footer>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "18px",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  fontSize: "15px",
  boxSizing: "border-box" as const,
};

const primaryButton = {
  width: "100%",
  padding: "15px",
  background: "linear-gradient(135deg,#4F46E5,#8B5CF6)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 600,
};

const secondaryButton = {
  width: "100%",
  padding: "15px",
  marginTop: "14px",
  background: "white",
  color: "#4F46E5",
  border: "1px solid #D1D5DB",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 600,
};

function Feature({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#6366F1",
        }}
      />

      <span
        style={{
          fontSize: "17px",
          color: "#374151",
        }}
      >
        {text}
      </span>
    </div>
  );
}
