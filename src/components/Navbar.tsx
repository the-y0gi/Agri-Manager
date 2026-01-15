"use client";
import { Tractor, Settings, BarChart3, LogOut } from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";

export default function Navbar() {
  const router = useRouter();
  const { showLoader } = useLoader();

  const handleLogout = async () => {
    if(!confirm("Kya aap logout karna chahte hain?")) return;
    
    showLoader(); // Show loader on logout
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-emerald-600 text-white shadow-md z-50 h-16 flex items-center px-4 justify-between">
      {/* Left: Logo */}
      <Link href="/" onClick={showLoader}>
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-full text-emerald-600">
            <Tractor size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-wide">AgriManager</h1>
        </div>
      </Link>

      {/* Right: Icons */}
      <div className="flex items-center gap-2">
        <Link href="/reports" onClick={showLoader}>
          <button className="p-2 hover:bg-emerald-700 rounded-full text-white">
            <BarChart3 size={24} />
          </button>
        </Link>

        <Link href="/settings" onClick={showLoader}>
          <button className="p-2 hover:bg-emerald-700 rounded-full">
            <Settings size={22} />
          </button>
        </Link>
        
        {/* LOGOUT BUTTON (NEW) */}
        <button 
          onClick={handleLogout} 
          className="p-2 hover:bg-red-500 rounded-full transition ml-1"
          title="Logout"
        >
          <LogOut size={22} />
        </button>
      </div>
    </nav>
  );
}