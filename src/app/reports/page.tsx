"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, CheckCircle2, AlertOctagon } from "lucide-react";
import toast from "react-hot-toast";

import BottomNav from "@/components/BottomNav";
import JobCard from "@/components/JobCard";
import RevenueChart from "@/components/RevenueChart";

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");
  const [activeTab, setActiveTab] = useState<ActiveTab>("pending");
  const [stats, setStats] = useState<Stats>({ total: 0, received: 0, pending: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (Array.isArray(data)) setJobs(data.reverse());
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!jobs.length && !loading) return;

    const now = new Date();
    const timeFiltered = jobs.filter((job) => {
      const jobDate = new Date(job.createdAt);
      if (timeFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return jobDate >= weekAgo;
      } 
      if (timeFilter === "month") return jobDate.getMonth() === now.getMonth();
      if (timeFilter === "year") return jobDate.getFullYear() === now.getFullYear();
      return true;
    });

    let total = 0, received = 0;
    timeFiltered.forEach((j) => {
      total += (j.totalAmount || 0);
      received += (j.paidAmount || 0);
    });
    setStats({ total, received, pending: total - received });

    const chartMap: Record<string, number> = {};
    const sortedForChart = [...timeFiltered].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sortedForChart.forEach(job => {
      const dateKey = new Date(job.createdAt).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short' 
      });
      chartMap[dateKey] = (chartMap[dateKey] || 0) + (job.totalAmount || 0);
    });

    const finalChartData = Object.keys(chartMap).map(date => ({
      date,
      amount: chartMap[date]
    }));
    setChartData(finalChartData);

    if (activeTab === "pending") {
      setFilteredJobs(timeFiltered.filter(j => (j.totalAmount || 0) - (j.paidAmount || 0) > 0));
    } else {
      setFilteredJobs(timeFiltered);
    }

  }, [jobs, timeFilter, activeTab, loading]);

  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      return `${(amount/1000).toFixed(1)}k`;
    }
    return amount.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100/50 px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <button 
              className="bg-gray-100 p-2.5 rounded-full text-gray-600 hover:bg-gray-200 transition active:scale-95"
              aria-label="Go back to home"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Financial Report</h1>
        </div>

        <div className="bg-gray-100 p-1.5 rounded-xl flex">
          {(["week", "month", "year"] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all capitalize uppercase tracking-wider ${
                timeFilter === filter
                  ? "bg-white text-emerald-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 space-y-6 pt-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-blue-100 flex flex-col items-start relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet size={40} className="text-blue-600" />
            </div>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded-md mb-2">
              Total
            </span>
            <span className="text-lg font-extrabold text-gray-800">
              ₹{formatAmount(stats.total)}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-emerald-100 flex flex-col items-start relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded-md mb-2">
              In Hand
            </span>
            <span className="text-lg font-extrabold text-emerald-700">
              ₹{formatAmount(stats.received)}
            </span>
          </div>

          <div className="bg-red-50 p-3.5 rounded-2xl shadow-sm border border-red-100 flex flex-col items-start relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertOctagon size={40} className="text-red-600" />
            </div>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide bg-white/60 px-2 py-0.5 rounded-md mb-2">
              Pending
            </span>
            <span className="text-lg font-extrabold text-red-600">
              ₹{formatAmount(stats.pending)}
            </span>
          </div>
        </div>

        <div className="bg-white p-1 rounded-3xl shadow-sm border border-gray-100">
          <RevenueChart data={chartData} />
        </div>

        <div>
          <div className="flex bg-gray-200/50 p-1 rounded-xl mb-4">
            <button 
              onClick={() => setActiveTab("pending")} 
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "pending" ? "bg-white text-red-600 shadow-sm" : "text-gray-400"
              }`}
            >
              <AlertOctagon size={14} /> Pending
            </button>
            <button 
              onClick={() => setActiveTab("all")} 
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "all" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400"
              }`}
            >
              All History
            </button>
          </div>

          <div className="flex flex-col">
            {loading ? (
              <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <p className="text-xs text-gray-400">No data found for this period</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <Link key={job._id} href={`/jobs/${job._id}`}>
                  <JobCard 
                    farmerName={job.farmerName}
                    serviceName={job.serviceName}
                    status={job.status}
                    totalAmount={job.totalAmount}
                    paidAmount={job.paidAmount}
                    date={job.createdAt}
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}