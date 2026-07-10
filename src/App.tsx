import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MyPapers from "./pages/MyPapers";

import Upload from "./pages/Upload";
import Compare from "./pages/Compare";
import Summary from "./pages/Summary";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/papers" element={<MyPapers />} />

      <Route path="/upload" element={<Upload />} />

      <Route path="/compare" element={<Compare />} />

      <Route path="/summary" element={<Summary />} />

      <Route path="/chat" element={<Chat />} />

      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}