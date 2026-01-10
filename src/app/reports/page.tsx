// "use client";

// import { useState, useEffect, useMemo } from "react";
// import Link from "next/link";
// import { ArrowLeft, AlertOctagon, ChevronDown } from "lucide-react";
// import toast from "react-hot-toast";

// import BottomNav from "@/components/BottomNav";
// import JobCard from "@/components/JobCard";
// import RevenueChart from "@/components/RevenueChart";

// // Interface
// interface Job {
//   _id: string;
//   farmerName: string;
//   serviceName: string;
//   status: string;
//   totalAmount: number;
//   paidAmount: number;
//   createdAt: string;
//   workLogs: ({ serviceName?: string } | null)[]; 
// }

// interface Stats {
//   total: number;
//   received: number;
//   pending: number;
// }

// interface ChartData {
//   date: string;
//   amount: number;
// }

// type TimeFilter = "day" | "week" | "month";
// type ActiveTab = "pending" | "all";

// export default function ReportsPage() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
//   const [activeTab, setActiveTab] = useState<ActiveTab>("pending");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 15;

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await fetch("/api/jobs");
//         const data = await res.json();
//         if (Array.isArray(data)) setJobs(data);
//       } catch (error) {
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);


//   const formatDate = (dateString: string) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       const day = date.getDate().toString().padStart(2, '0'); // 07
//       const month = date.toLocaleString('en-US', { month: 'short' }); // Jan
//       const year = date.getFullYear().toString().slice(-2); // 26
//       return `${day} ${month} ${year}`;
//     } catch (e) {
//       return "";
//     }
//   };


//   const getJobServices = (job: Job) => {
//     if (!job) return "";
    
//     const allServices: string[] = [];
    
//     // 1. Primary Service
//     if (job.serviceName) allServices.push(job.serviceName);

//     // 2. Logs Services (Filter out nulls)
//     if (Array.isArray(job.workLogs)) {
//         job.workLogs.forEach(log => {
//             if (log && log.serviceName) {
//                 allServices.push(log.serviceName);
//             }
//         });
//     }
    
//     // 3. Unique & Join
//     return [...new Set(allServices)].join(", ") || "Unknown";
//   };

//   // --- Filter Logic ---
//   const { filteredJobs, stats, chartData } = useMemo(() => {
//     const now = new Date();
//     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

//     // Time Filter
//     const timeFiltered = jobs.filter((job) => {
//       if (!job?.createdAt) return false;
//       const jobDate = new Date(job.createdAt);
//       const jobDateTime = new Date(jobDate.getFullYear(), jobDate.getMonth(), jobDate.getDate()).getTime();

//       if (timeFilter === "day") return jobDateTime === todayStart;
//       if (timeFilter === "week") {
//         const weekAgo = new Date();
//         weekAgo.setDate(now.getDate() - 7);
//         return jobDate >= weekAgo;
//       }
//       if (timeFilter === "month") {
//         return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
//       }
//       return true;
//     });

//     // Calculate Stats
//     let total = 0, received = 0;
//     timeFiltered.forEach((j) => {
//       total += j?.totalAmount || 0;
//       received += j?.paidAmount || 0;
//     });

//     // Chart Data
//     const chartMap: Record<string, number> = {};
//     const sortedJobs = [...timeFiltered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

//     sortedJobs.forEach((job) => {
//       const dateObj = new Date(job.createdAt);
//       // Chart dates can stay simple
//       const dateKey = timeFilter === "day" 
//         ? dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) 
//         : dateObj.toLocaleDateString("en-US", { day: "numeric", month: "short" });

//       chartMap[dateKey] = (chartMap[dateKey] || 0) + (job.totalAmount || 0);
//     });

//     const finalChartData = Object.keys(chartMap).map((date) => ({ date, amount: chartMap[date] }));

//     // Tab Filter
//     const tabFiltered = activeTab === "pending"
//       ? timeFiltered.filter((j) => (j.totalAmount || 0) - (j.paidAmount || 0) > 0)
//       : timeFiltered;

//     return {
//       filteredJobs: tabFiltered,
//       stats: { total, received, pending: total - received },
//       chartData: finalChartData,
//     };
//   }, [jobs, timeFilter, activeTab]);

//   // Pagination
//   const paginatedJobs = filteredJobs.slice(0, currentPage * itemsPerPage);
//   const hasMore = filteredJobs.length > paginatedJobs.length;

//   const formatAmount = (amount: number) => {
//     if (!amount) return "0";
//     return amount >= 1000 ? `${(amount / 1000).toFixed(1)}k` : Math.round(amount).toString();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50 pb-32">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100/50 px-6 pt-12 pb-4">
//         <div className="flex items-center gap-4 mb-4">
//           <Link href="/">
//             <button className="bg-gray-100 p-2.5 rounded-full text-gray-600 active:scale-95"><ArrowLeft size={20} /></button>
//           </Link>
//           <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Financial Report</h1>
//         </div>
//         <div className="bg-gray-100 p-1.5 rounded-xl flex">
//           {(["day", "week", "month"] as TimeFilter[]).map((filter) => (
//             <button key={filter} onClick={() => { setTimeFilter(filter); setCurrentPage(1); }}
//               className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all uppercase tracking-wider ${timeFilter === filter ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400"}`}>
//               {filter}
//             </button>
//           ))}
//         </div>
//       </header>

//       <div className="px-5 space-y-6 pt-6">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-3 gap-3">
//           <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-blue-100 flex flex-col">
//             <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-md mb-2 w-fit">Total</span>
//             <span className="text-lg font-extrabold text-gray-800">₹{formatAmount(stats.total)}</span>
//           </div>
//           <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-emerald-100 flex flex-col">
//             <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md mb-2 w-fit">In Hand</span>
//             <span className="text-lg font-extrabold text-emerald-700">₹{formatAmount(stats.received)}</span>
//           </div>
//           <div className="bg-red-50 p-3.5 rounded-2xl shadow-sm border border-red-100 flex flex-col">
//             <span className="text-[10px] font-bold text-red-600 uppercase bg-white/60 px-2 py-0.5 rounded-md mb-2 w-fit">Pending</span>
//             <span className="text-lg font-extrabold text-red-600">₹{formatAmount(stats.pending)}</span>
//           </div>
//         </div>

//         {/* Chart */}
//         <div className="bg-white p-1 rounded-3xl shadow-sm border border-gray-100">
//           <RevenueChart data={chartData} />
//         </div>

//         {/* List Section */}
//         <div>
//           <div className="flex bg-gray-200/50 p-1 rounded-xl mb-4">
//             <button onClick={() => { setActiveTab("pending"); setCurrentPage(1); }}
//               className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "pending" ? "bg-white text-red-600 shadow-sm" : "text-gray-400"}`}>
//               <AlertOctagon size={14} /> Pending
//             </button>
//             <button onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
//               className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "all" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400"}`}>
//               All History
//             </button>
//           </div>

//           <div className="flex flex-col space-y-3">
//             {loading ? <div className="h-32 bg-gray-100 rounded-xl animate-pulse" /> : 
//              paginatedJobs.length === 0 ? (
//               <div className="text-center py-10 opacity-50"><p className="text-xs text-gray-400">No data found</p></div>
//             ) : (
//               <>
//                 {paginatedJobs.map((job) => {
//                   if (!job) return null;
//                   return (
//                     <Link key={job._id} href={`/jobs/${job._id}`}>
//                       <JobCard
//                         farmerName={job.farmerName || "Unknown"}
//                         serviceName={getJobServices(job)} 
//                         status={job.status}
//                         totalAmount={job.totalAmount}
//                         paidAmount={job.paidAmount}
//                         date={formatDate(job.createdAt)} 
//                       />
//                     </Link>
//                   );
//                 })}
//                 {hasMore && (
//                   <button onClick={() => setCurrentPage(p => p + 1)} className="w-full py-4 mt-2 flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-2xl hover:bg-emerald-100">
//                     Load More <ChevronDown size={16} />
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <BottomNav />
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, AlertOctagon, ChevronDown, Languages } from "lucide-react"; // Languages icon added
import toast from "react-hot-toast";

import BottomNav from "@/components/BottomNav";
import JobCard from "@/components/JobCard";
import RevenueChart from "@/components/RevenueChart";

import { reportsContent, jobCardContent } from "@/data/translations";

// Interface
interface Job {
  _id: string;
  farmerName: string;
  serviceName: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  workLogs: ({ serviceName?: string } | null)[];
}

interface Stats {
  total: number;
  received: number;
  pending: number;
}

interface ChartData {
  date: string;
  amount: number;
}

type TimeFilter = "day" | "week" | "month";
type ActiveTab = "pending" | "all";

export default function ReportsPage() {
  // --- Language State ---
  const [lang, setLang] = useState<"en" | "hi">("hi");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const [activeTab, setActiveTab] = useState<ActiveTab>("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const t = reportsContent[lang];
  const tCard = jobCardContent[lang]; 
  const toggleLanguage = () => {
    setLang((prev) => (prev === "hi" ? "en" : "hi"));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (Array.isArray(data)) setJobs(data);
      } catch (error) {
        toast.error(lang === "hi" ? "डेटा लोड करने में विफल" : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [lang]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const locale = lang === "hi" ? "hi-IN" : "en-US"; // Dynamic Locale
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString(locale, { month: "short" });
      const year = date.getFullYear().toString().slice(-2);
      return `${day} ${month} ${year}`;
    } catch (e) {
      return "";
    }
  };

  const getJobServices = (job: Job) => {
    if (!job) return "";

    const allServices: string[] = [];

    // 1. Primary Service
    if (job.serviceName) allServices.push(job.serviceName);

    // 2. Logs Services (Filter out nulls)
    if (Array.isArray(job.workLogs)) {
      job.workLogs.forEach((log) => {
        if (log && log.serviceName) {
          allServices.push(log.serviceName);
        }
      });
    }

    // 3. Unique & Join
    return [...new Set(allServices)].join(", ") || "Unknown";
  };

  // --- Filter Logic ---
  const { filteredJobs, stats, chartData } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    // Time Filter
    const timeFiltered = jobs.filter((job) => {
      if (!job?.createdAt) return false;
      const jobDate = new Date(job.createdAt);
      const jobDateTime = new Date(
        jobDate.getFullYear(),
        jobDate.getMonth(),
        jobDate.getDate()
      ).getTime();

      if (timeFilter === "day") return jobDateTime === todayStart;
      if (timeFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return jobDate >= weekAgo;
      }
      if (timeFilter === "month") {
        return (
          jobDate.getMonth() === now.getMonth() &&
          jobDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });

    // Calculate Stats
    let total = 0,
      received = 0;
    timeFiltered.forEach((j) => {
      total += j?.totalAmount || 0;
      received += j?.paidAmount || 0;
    });

    // Chart Data
    const chartMap: Record<string, number> = {};
    const sortedJobs = [...timeFiltered].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sortedJobs.forEach((job) => {
      const dateObj = new Date(job.createdAt);
      // Chart dates can stay simple
      const dateKey =
        timeFilter === "day"
          ? dateObj.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : dateObj.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
              day: "numeric",
              month: "short",
            });

      chartMap[dateKey] = (chartMap[dateKey] || 0) + (job.totalAmount || 0);
    });

    const finalChartData = Object.keys(chartMap).map((date) => ({
      date,
      amount: chartMap[date],
    }));

    // Tab Filter
    const tabFiltered =
      activeTab === "pending"
        ? timeFiltered.filter(
            (j) => (j.totalAmount || 0) - (j.paidAmount || 0) > 0
          )
        : timeFiltered;

    return {
      filteredJobs: tabFiltered,
      stats: { total, received, pending: total - received },
      chartData: finalChartData,
    };
  }, [jobs, timeFilter, activeTab, lang]);

  // Pagination
  const paginatedJobs = filteredJobs.slice(0, currentPage * itemsPerPage);
  const hasMore = filteredJobs.length > paginatedJobs.length;

  const formatAmount = (amount: number) => {
    if (!amount) return "0";
    return amount >= 1000
      ? `${(amount / 1000).toFixed(1)}k`
      : Math.round(amount).toString();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100/50 px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="bg-gray-100 p-2.5 rounded-full text-gray-600 active:scale-95">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {t.title}
            </h1>
          </div>
          
          {/* Language Toggle */}
          {/* <button
            onClick={toggleLanguage}
            className="p-2.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 active:scale-95 transition"
          >
            <Languages size={20} />
          </button> */}
        </div>

        <div className="bg-gray-100 p-1.5 rounded-xl flex">
          {(["day", "week", "month"] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setTimeFilter(filter);
                setCurrentPage(1);
              }}
              className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all uppercase tracking-wider ${
                timeFilter === filter
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-400"
              }`}
            >
              {t.filters[filter]}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 space-y-6 pt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-blue-100 flex flex-col">
            <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-md mb-2 w-fit">
              {t.stats.total}
            </span>
            <span className="text-lg font-extrabold text-gray-800">
              ₹{formatAmount(stats.total)}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-emerald-100 flex flex-col">
            <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md mb-2 w-fit">
              {t.stats.received}
            </span>
            <span className="text-lg font-extrabold text-emerald-700">
              ₹{formatAmount(stats.received)}
            </span>
          </div>
          <div className="bg-red-50 p-3.5 rounded-2xl shadow-sm border border-red-100 flex flex-col">
            <span className="text-[10px] font-bold text-red-600 uppercase bg-white/60 px-2 py-0.5 rounded-md mb-2 w-fit">
              {t.stats.pending}
            </span>
            <span className="text-lg font-extrabold text-red-600">
              ₹{formatAmount(stats.pending)}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-1 rounded-3xl shadow-sm border border-gray-100">
          <RevenueChart data={chartData} />
        </div>

        {/* List Section */}
        <div>
          <div className="flex bg-gray-200/50 p-1 rounded-xl mb-4">
            <button
              onClick={() => {
                setActiveTab("pending");
                setCurrentPage(1);
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "pending"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-400"
              }`}
            >
              <AlertOctagon size={14} /> {t.tabs.pending}
            </button>
            <button
              onClick={() => {
                setActiveTab("all");
                setCurrentPage(1);
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-400"
              }`}
            >
              {t.tabs.all}
            </button>
          </div>

          <div className="flex flex-col space-y-3">
            {loading ? (
              <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            ) : paginatedJobs.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <p className="text-xs text-gray-400">{t.noData}</p>
              </div>
            ) : (
              <>
                {paginatedJobs.map((job) => {
                  if (!job) return null;
                  return (
                    <Link key={job._id} href={`/jobs/${job._id}`}>
                      <JobCard
                        farmerName={job.farmerName || "Unknown"}
                        serviceName={getJobServices(job)}
                        status={job.status}
                        totalAmount={job.totalAmount}
                        paidAmount={job.paidAmount}
                        date={formatDate(job.createdAt)}
                        labels={tCard}
                      />
                    </Link>
                  );
                })}
                {hasMore && (
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="w-full py-4 mt-2 flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-2xl hover:bg-emerald-100"
                  >
                    {t.loadMore} <ChevronDown size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}