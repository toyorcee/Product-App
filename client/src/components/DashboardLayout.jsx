import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <div className="fixed top-0 left-0 w-full z-30 h-16">
        <Navbar onHamburgerClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-64 z-20 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <main
        className={`flex-1 pt-16 h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 p-4 transition-margin duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0 md:ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
