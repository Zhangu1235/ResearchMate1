import Navbar from "../components/layout/Navbar";
import Hero from "../components/dashboard/Hero";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import UploadSection from "../components/dashboard/UploadSection";
import PaperList from "../components/dashboard/PaperList";
import SummaryCard from "../components/dashboard/SummaryCard";
import ComparisonTable from "../components/dashboard/ComparisonTable";
import GapCard from "../components/dashboard/GapCard";
import AskResearchMate from "../components/dashboard/AskResearchMate";
import Footer from "../components/layout/Footer";
export default function Dashboard() {
  return (
    <div
      style={{
        background: "#FAFBFF",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <Hero />

      <QuickActions />

      <RecentActivity />

      {/* <UploadSection />

      <PaperList />

      <SummaryCard />

      <ComparisonTable />

      <GapCard />

      <AskResearchMate />

      <Footer /> */}
    </div>
  );
}
