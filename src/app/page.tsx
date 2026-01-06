"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

import BottomNav from "@/components/BottomNav";
import JobCard from "@/components/JobCard";
import TopBar from "@/components/TopBar";

interface Job {
  _id: string;
  farmerName: string;
  serviceName: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();

        if (Array.isArray(data)) {
          const sortedJobs = data.sort((a: Job, b: Job) => {
            const pendingA = a.totalAmount - a.paidAmount;
            const pendingB = b.totalAmount - b.paidAmount;
            const isClearA = pendingA === 0 && a.totalAmount > 0;
            const isClearB = pendingB === 0 && b.totalAmount > 0;

            // Priority: jobs with pending payments first
            if (isClearA && !isClearB) return 1;
            if (!isClearA && isClearB) return -1;

            // Then sort by most recent
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          setJobs(sortedJobs);
        }
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-36">
      <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="px-5 pt-6">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-gray-900 font-bold text-lg tracking-tight">
            {searchQuery ? "Search Results" : "Recent Activities"}
          </h2>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            {filteredJobs.length} Jobs
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white h-24 rounded-2xl shadow-sm animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <Search size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No jobs found</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <Link key={job._id} href={`/jobs/${job._id}`} className="block">
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
        )}
      </div>

      <BottomNav />
    </div>
  );
}