import { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState<"landing" | "login" | "dashboard">("landing");

  if (page === "landing") {
    return <Landing next={() => setPage("login")} />;
  }

  if (page === "login") {
    return <Login next={() => setPage("dashboard")} />;
  }

  return <Dashboard />;
}