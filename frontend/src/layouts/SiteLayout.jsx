import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SiteLayout() {
  return <><Navbar /><main className="min-h-[65vh]"><Outlet /></main><Footer /></>;
}
