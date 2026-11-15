import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteLayout() {
  return <><Navbar /><main className="min-h-[65vh]"><Outlet /></main><Footer /></>;
}
