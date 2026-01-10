// "use client";

// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Search, Settings, LogOut, X } from "lucide-react";
// import toast from "react-hot-toast";

// interface TopBarProps {
//   searchQuery?: string;
//   setSearchQuery?: (value: string) => void;
// }

// export default function TopBar({
//   searchQuery = "",
//   setSearchQuery,
// }: TopBarProps) {
//   const router = useRouter();

//   /**
//    * Handles logout confirmation by displaying a toast with
//    * action buttons for confirmation or cancellation.
//    */
//   const handleLogout = () => {
//     toast(
//       (t) => (
//         <div className="flex flex-col gap-2">
//           <span className="font-semibold text-white">
//             Are you sure you want to logout?
//           </span>
//           <div className="flex gap-2 mt-1">
//             <button
//               className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold"
//               onClick={async () => {
//                 toast.dismiss(t.id);
//                 await performLogout();
//               }}
//             >
//               Yes, Logout
//             </button>
//             <button
//               className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-bold"
//               onClick={() => toast.dismiss(t.id)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ),
//       {
//         duration: 5000,
//         // Added style prop to fix TypeScript error - toast container styling
//         style: {
//           background: "#363636",
//         },
//       }
//     );
//   };

//   /**
//    * Performs the actual logout operation by calling the logout API,
//    * handling loading states, and redirecting to login page.
//    */
//   const performLogout = async () => {
//     const loadingToast = toast.loading("Logging out...");
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });

//       // Redirect to login page
//       router.push("/login");

//       // Refresh router to ensure state is updated
//       router.refresh();

//       toast.success("Logged out successfully", { id: loadingToast });
//     } catch (error) {
//       console.error("Logout failed:", error);
//       toast.error("Logout failed", { id: loadingToast });
//     }
//   };

//   return (
//     <header className="px-6 pt-14 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100/50">
//       {/* Top Row: Brand/Title and Action Buttons */}
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
//             Welcome Back
//           </p>
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//             AgriManager<span className="text-emerald-500">.</span>
//           </h1>
//         </div>

//         {/* Action Buttons Container */}
//         <div className="flex items-center gap-3">
//           {/* Settings Button */}
//           <Link href="/settings">
//             <button
//               className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition"
//               aria-label="Open settings"
//             >
//               <Settings size={22} strokeWidth={1.5} />
//             </button>
//           </Link>

//           {/* Logout Button */}
//           <button
//             onClick={handleLogout}
//             className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 transition"
//             aria-label="Logout"
//           >
//             <LogOut size={22} strokeWidth={1.5} />
//           </button>
//         </div>
//       </div>

//       {/* Conditional Search Bar - Only rendered when setSearchQuery is provided */}
//       {setSearchQuery && (
//         <div className="relative group">
//           {/* Search Icon */}
//           <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
//             <Search size={20} />
//           </div>

//           {/* Search Input */}
//           <input
//             type="text"
//             placeholder="Search farmer name..."
//             className="w-full pl-12 pr-12 p-3.5 rounded-2xl bg-gray-100/80 border-transparent
//                        focus:bg-white focus:border-emerald-500/20
//                        focus:ring-4 focus:ring-emerald-500/10
//                        transition-all outline-none font-medium
//                        text-gray-700 placeholder:text-gray-400"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             aria-label="Search farmer names"
//           />

//           {/* Clear Search Button (Conditional) */}
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery("")}
//               className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
//               aria-label="Clear search"
//             >
//               <X size={20} />
//             </button>
//           )}
//         </div>
//       )}
//     </header>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Settings, LogOut, X, Languages } from "lucide-react"; // Languages icon added
import toast from "react-hot-toast";

// --- Translations for TopBar ---
const content = {
  en: {
    welcome: "Welcome Back",
    searchPlaceholder: "Search farmer name...",
    logoutTitle: "Are you sure you want to logout?",
    yesLogout: "Yes, Logout",
    cancel: "Cancel",
    loggingOut: "Logging out...",
    success: "Logged out successfully",
    fail: "Logout failed",
  },
  hi: {
    welcome: "स्वागत है",
    searchPlaceholder: "किसान का नाम खोजें...",
    logoutTitle: "क्या आप लॉग आउट करना चाहते हैं?",
    yesLogout: "हाँ, लॉग आउट",
    cancel: "रद्द करें",
    loggingOut: "लॉग आउट हो रहा है...",
    success: "सफलतापूर्वक लॉग आउट किया गया",
    fail: "लॉग आउट विफल रहा",
  },
};

interface TopBarProps {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
  lang: "en" | "hi";            // New Prop
  toggleLanguage: () => void;   // New Prop
}

export default function TopBar({
  searchQuery = "",
  setSearchQuery,
  lang,
  toggleLanguage,
}: TopBarProps) {
  const router = useRouter();
  const t = content[lang]; // Get current language text

  /**
   * Handles logout confirmation
   */
  const handleLogout = () => {
    toast(
      (toastInstance) => (
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-white">
            {t.logoutTitle}
          </span>
          <div className="flex gap-2 mt-1">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-red-600 transition"
              onClick={async () => {
                toast.dismiss(toastInstance.id);
                await performLogout();
              }}
            >
              {t.yesLogout}
            </button>
            <button
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-bold hover:bg-gray-300 transition"
              onClick={() => toast.dismiss(toastInstance.id)}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        style: {
          background: "#363636",
        },
      }
    );
  };

  /**
   * Performs the actual logout operation
   */
  const performLogout = async () => {
    const loadingToast = toast.loading(t.loggingOut);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
      toast.success(t.success, { id: loadingToast });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(t.fail, { id: loadingToast });
    }
  };

  return (
    <header className="px-6 pt-14 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100/50">
      {/* Top Row: Brand/Title and Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
            {t.welcome}
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            AgriManager<span className="text-emerald-500">.</span>
          </h1>
        </div>

        {/* Action Buttons Container */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* --- NEW: Language Toggle Button --- */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100 hover:bg-emerald-100 transition active:scale-95"
          >
            <Languages size={16} />
            <span className="hidden sm:inline">
              {lang === "hi" ? "English" : "हिंदी"}
            </span>
          </button>

          {/* Settings Button */}
          <Link href="/settings">
            <button
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition"
              aria-label="Open settings"
            >
              <Settings size={22} strokeWidth={1.5} />
            </button>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 transition"
            aria-label="Logout"
          >
            <LogOut size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Conditional Search Bar */}
      {setSearchQuery && (
        <div className="relative group">
          <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
            <Search size={20} />
          </div>

          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-12 p-3.5 rounded-2xl bg-gray-100/80 border-transparent
                       focus:bg-white focus:border-emerald-500/20
                       focus:ring-4 focus:ring-emerald-500/10
                       transition-all outline-none font-medium
                       text-gray-700 placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}