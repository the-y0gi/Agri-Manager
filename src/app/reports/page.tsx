"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertOctagon, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

import BottomNav from "@/components/BottomNav";
import JobCard from "@/components/JobCard";
import RevenueChart from "@/components/RevenueChart";
import { useLanguage } from "@/context/LanguageContext";
import { reportsContent, jobCardContent } from "@/data/translations";

interface Job {
  _id: string;
  farmerName: string;
  serviceName: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
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

type TimeFilter = "week" | "month" | "year";
type ActiveTab = "pending" | "all";

export default function ReportsPage() {
  const { lang } = useLanguage();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    received: 0,
    pending: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");
  const [activeTab, setActiveTab] = useState<ActiveTab>("pending");
  const [currentPage, setCurrentPage] = useState(1);

  const t = reportsContent[lang];
  const tCard = jobCardContent[lang];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/reports?filter=${timeFilter}&tab=${activeTab}&page=${currentPage}`,
        );

        const data = await res.json();

        setJobs(data.jobs || []);
        setStats(data.stats || { total: 0, received: 0, pending: 0 });
        setChartData(data.chartData || []);
        setHasMore(data.hasMore || false);
      } catch (error) {
        toast.error(
          lang === "hi" ? "डेटा लोड करने में विफल" : "Failed to load data",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeFilter, activeTab, currentPage, lang]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = lang === "hi" ? "hi-IN" : "en-US";
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString(locale, { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month} ${year}`;
  };

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
        </div>

        <div className="bg-gray-100 p-1.5 rounded-xl flex">
          {(["week", "month", "year"] as TimeFilter[]).map((filter) => (
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
              {t.filters?.[filter] ?? filter.toUpperCase()}
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
            ) : jobs.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <p className="text-xs text-gray-400">{t.noData}</p>
              </div>
            ) : (
              <>
                {jobs.map((job) => (
                  <Link key={job._id} href={`/jobs/${job._id}`}>
                    <JobCard
                      farmerName={job.farmerName || "Unknown"}
                      serviceName={job.serviceName}
                      status={job.status}
                      totalAmount={job.totalAmount}
                      paidAmount={job.paidAmount}
                      date={formatDate(job.createdAt)}
                      labels={tCard}
                    />
                  </Link>
                ))}

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
