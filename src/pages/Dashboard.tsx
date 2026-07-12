import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Hero from "../components/dashboard/Hero";
import StatsGrid from "../components/dashboard/StatsGrid";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import UploadSection from "../components/dashboard/UploadSection";

import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboardPage">
      {/* Premium Fusion Glow Blobs */}
      <div className="glowBg glowBg-1" />
      <div className="glowBg glowBg-2" />

      <Sidebar />

      <main className="dashboardContent">

        <Topbar />

        <Hero />

        <StatsGrid />

        <QuickActions />

        <RecentActivity />

        <UploadSection />

      </main>

    </div>
  );
}