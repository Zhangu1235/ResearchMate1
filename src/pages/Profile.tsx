// import { BookOpenText, BrainCircuit, Search, Sparkles, UserRound } from "lucide-react";
// import "./Profile.css";

// interface ProfileProps {
//   username: string;
// }

// const profileActions = [
//   {
//     icon: BookOpenText,
//     title: "Summaries",
//     text: "Generate concise paper notes.",
//   },
//   {
//     icon: Search,
//     title: "Compare",
//     text: "Review multiple papers together.",
//   },
//   {
//     icon: BrainCircuit,
//     title: "Research Gaps",
//     text: "Find missing directions faster.",
//   },
//   {
//     icon: Sparkles,
//     title: "Ask AI",
//     text: "Chat with your uploaded papers.",
//   },
// ];

// export default function Profile({ username }: ProfileProps) {
//   return (
//     <main className="profilePage">
//       <section className="profileHero">
//         <div className="profileBadge">
//           <UserRound size={18} />
//           ResearchMate Profile
//         </div>

//         <h1>Welcome {username}</h1>

//         <p>
//           Your AI research workspace is ready. Start by uploading papers,
//           comparing findings, or asking ResearchMate for focused insights.
//         </p>
//       </section>

//       <section className="profileGrid" aria-label="ResearchMate tools">
//         {profileActions.map(({ icon: Icon, title, text }) => (
//           <article className="profileTool" key={title}>
//             <span>
//               <Icon size={22} />
//             </span>
//             <h2>{title}</h2>
//             <p>{text}</p>
//           </article>
//         ))}
//       </section>
//     </main>
//   );
// }
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import "../styles/dashboard.css";

export default function Profile() {
  const username = localStorage.getItem("username") || "Researcher";

  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

<section className="pageHeader">

<h1>My Profile</h1>

<p>

Manage your ResearchMate account.

</p>

</section>

<div className="profileCard">

<div className="profileAvatar">

R

</div>

<h2>

{username}

</h2>

<p>

ResearchMate User

</p>

<div className="profileStats">

<div>

<h3>0</h3>

<span>Papers</span>

</div>

<div>

<h3>0</h3>

<span>Comparisons</span>

</div>

<div>

<h3>0</h3>

<span>Chats</span>

</div>

</div>

</div></main>
    </div>
  );
}