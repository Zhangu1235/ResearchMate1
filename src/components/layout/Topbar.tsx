import { Bell, Search } from "lucide-react";

export default function Topbar() {

  const username =
    localStorage.getItem("username") || "Researcher";

  return (

    <header className="topbarSimple">

      <div>

        <h2>
          {username}
        </h2>

        <p>
          ResearchMate AI Workspace
        </p>

      </div>

      <div className="searchRow">

        <div className="searchBox">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search papers..."
          />

        </div>

        <button className="notification">

          <Bell size={20}/>

        </button>

      </div>

    </header>

  );

}