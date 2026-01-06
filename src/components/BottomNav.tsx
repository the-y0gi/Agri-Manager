"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Plus } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();


  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      
      {/* Main Navigation Container */}
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl shadow-gray-200/50 px-6 py-3 flex justify-between items-center relative">

        {/* Home Navigation Item */}
        <Link 
          href="/" 
          className="flex-1 flex justify-center"
          aria-label="Go to homepage"
        >
          <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${
             isActive("/") ? "text-emerald-600 scale-110" : "text-gray-400 hover:text-gray-600"
          }`}>
            <Home 
              size={24} 
              strokeWidth={isActive("/") ? 3 : 2} 
              aria-hidden="true"
            />
            {/* Active State Indicator */}
            <span 
              className={`h-1 w-1 rounded-full bg-emerald-600 transition-all duration-300 ${
                isActive("/") ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
          </div>
        </Link>

        {/* Central Floating Action Button (FAB) */}
        <div className="relative -top-8">
          <Link 
            href="/jobs/new" 
            aria-label="Create new job"
          >
            <button 
              className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-white shadow-xl shadow-gray-900/40 border-[4px] border-white/50 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label="Create new job"
            >
              
              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              />
              
              {/* Plus Icon with Hover Animation */}
              <Plus 
                size={32} 
                className="group-hover:rotate-90 transition-transform duration-300"
                aria-hidden="true"
              />
            
            </button>
          </Link>
        </div>

        {/* Reports Navigation Item */}
        <Link 
          href="/reports" 
          className="flex-1 flex justify-center"
          aria-label="View reports"
        >
          <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${
             isActive("/reports") ? "text-emerald-600 scale-110" : "text-gray-400 hover:text-gray-600"
          }`}>
            <BarChart3 
              size={24} 
              strokeWidth={isActive("/reports") ? 3 : 2} 
              aria-hidden="true"
            />
            {/* Active State Indicator */}
            <span 
              className={`h-1 w-1 rounded-full bg-emerald-600 transition-all duration-300 ${
                isActive("/reports") ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
          </div>
        </Link>

      </div>
    </div>
  );
}