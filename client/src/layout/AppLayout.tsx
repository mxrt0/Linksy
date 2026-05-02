import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0a0a0f] dark:text-white flex flex-col">
      
      <Topbar />

      <main className="flex-1 px-4 md:px-6 py-6">
        <Outlet />
      </main>

    </div>
  );
}