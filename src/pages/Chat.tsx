import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import "../styles/dashboard.css";

export default function Chat() {
  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

<section className="pageHeader">

<h1>Ask AI</h1>

<p>

Chat with your uploaded papers naturally.

</p>

</section>

<div className="chatWindow">

<div className="chatMessages">

<p className="botMessage">

👋 Hello! Upload a paper and ask me anything.

</p>

</div>

<div className="chatInput">

<input

placeholder="Ask ResearchMate..."

type="text"

/>

<button className="primaryAction">

Send

</button>

</div>

</div></main>
    </div>
  );
}