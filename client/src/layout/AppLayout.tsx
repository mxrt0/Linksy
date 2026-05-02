import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";

export function AppLayout() {

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      
      <Topbar
        onCreateClick={undefined} 
      />

      <main className="flex-1 px-4 md:px-6 py-6">
        <Outlet />
      </main>

    </div>
  );
}