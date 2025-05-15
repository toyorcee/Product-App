import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed top-0 left-0 w-full z-30 h-16">
        <Navbar onHamburgerClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main
        className={`flex-1 pt-16 h-[calc(100vh-64px)] overflow-y-auto transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0 md:ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
