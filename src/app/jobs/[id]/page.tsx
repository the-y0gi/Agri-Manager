"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Phone, Share2, CheckCircle, 
  Clock, Calendar, IndianRupee, Plus, 
  Banknote, Trash2, X
} from "lucide-react";
import toast from "react-hot-toast";

interface WorkLog {
  date: string;
  startTime?: string;
  endTime?: string;
  hoursWorked?: number;
  fixedCost?: string;
}

interface PaymentLog {
  date: string;
  amount: string;
  note: string;
}

interface Job {
  _id: string;
  farmerName: string;
  serviceName: string;
  serviceRate: number;
  rateType: "hourly" | "fixed";
  totalAmount: number;
  paidAmount: number;
  status: string;
  mobileNumber: string;
  workLogs: WorkLog[];
  paymentLogs: PaymentLog[];
}

type ActiveTab = "work" | "payment";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [activeTab, setActiveTab] = useState<ActiveTab>("work");
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [entryData, setEntryData] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    hoursWorked: 0,
    fixedCost: "",
  });

  const [paymentData, setPaymentData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "", 
  });

  useEffect(() => {
    async function fetchJob() {
      try {
        if (!id) return;
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        
        if (!res.ok || data.error) {
          toast.error("Job not found");
          router.push("/");
          return;
        }
        setJob(data);
      } catch (error) {
        toast.error("Error loading job");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id, refreshKey, router]);

  useEffect(() => {
    if (entryData.startTime && entryData.endTime) {
      const start = new Date(`2000-01-01T${entryData.startTime}`);
      const end = new Date(`2000-01-01T${entryData.endTime}`);
      let diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
      if (diff < 0) diff = 0;
      setEntryData((prev) => ({ ...prev, hoursWorked: Number(diff.toFixed(2)) }));
    }
  }, [entryData.startTime, entryData.endTime]);

  const handleAddEntry = async () => {
    if (!entryData.date) {
      toast.error("Date is required");
      return;
    }
    if (job?.rateType === "hourly" && !entryData.startTime) {
      toast.error("Start time required");
      return;
    }
    if (job?.rateType === "fixed" && !entryData.fixedCost) {
      toast.error("Fixed cost required");
      return;
    }

    const toastId = toast.loading("Saving work...");
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          newLog: { 
            ...entryData, 
            hoursWorked: Number(entryData.hoursWorked),
            fixedCost: entryData.fixedCost || undefined
          } 
        }),
      });
      if (res.ok) {
        setRefreshKey((k) => k + 1);
        setShowEntryForm(false);
        setEntryData({ 
          date: new Date().toISOString().split("T")[0],
          startTime: "", 
          endTime: "", 
          hoursWorked: 0, 
          fixedCost: "" 
        });
        toast.success("Work added!", { id: toastId });
      } else { 
        throw new Error(); 
      }
    } catch (e) { 
      toast.error("Failed to save", { id: toastId }); 
    }
  };

  const handleAddPayment = async () => {
    if (!paymentData.amount) {
      toast.error("Enter Amount");
      return;
    }

    const amountNum = Number(paymentData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const toastId = toast.loading("Saving payment...");
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          newPayment: { 
            ...paymentData, 
            amount: amountNum.toString() 
          } 
        }),
      });
      if (res.ok) {
        setRefreshKey((k) => k + 1);
        setShowPaymentForm(false);
        setPaymentData({ 
          amount: "", 
          date: new Date().toISOString().split("T")[0], 
          note: "" 
        });
        toast.success("Payment saved!", { id: toastId });
      } else { 
        throw new Error(); 
      }
    } catch (e) { 
      toast.error("Failed to save", { id: toastId }); 
    }
  };

  const handleDeleteJob = () => {
    toast((t) => (
      <div className="flex flex-col gap-2 w-full">
        <span className="font-bold text-sm text-gray-800">Delete this job permanently?</span>
        <div className="flex gap-2">
          <button 
            onClick={() => confirmDelete(t.id)} 
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition"
          >
            Yes, Delete
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  const confirmDelete = async (toastId: string) => {
    toast.dismiss(toastId);
    const loadingToast = toast.loading("Deleting job...");
    try {
      const res = await fetch(`/api/jobs/${id}`, { 
        method: "DELETE" 
      });
      
      if (res.ok) {
        toast.success("Job Deleted", { id: loadingToast });
        router.push("/");
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error("Failed to delete", { id: loadingToast });
    }
  };

  const handleWhatsAppShare = () => {
    if (!job) return;
    
    const pending = (job.totalAmount || 0) - (job.paidAmount || 0);
    const text = `Bill for ${job.serviceName}\nName: ${job.farmerName}\nTotal: ₹${job.totalAmount}\nPaid: ₹${job.paidAmount}\nPending: ₹${pending}`;
    window.open(`https://wa.me/91${job.mobileNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const toggleComplete = async () => {
    if (!job) return;
    
    const newStatus = job.status === "completed" ? "ongoing" : "completed";
    const toastId = toast.loading("Updating status...");
    try {
      await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setRefreshKey(k => k + 1);
      toast.success(newStatus === "completed" ? "Job Finished" : "Job Reopened", { id: toastId });
    } catch (e) { 
      toast.error("Error updating", { id: toastId }); 
    }
  };

  if (loading || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  const total = job.totalAmount || 0;
  const paid = job.paidAmount || 0;
  const pendingAmount = total - paid;
  const isCompleted = job.status === "completed";

  return (
    <div className="min-h-screen bg-gray-50/50 pb-40 overflow-x-hidden">
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-5 pt-10 pb-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/">
            <button className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200 transition">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-lg font-bold text-gray-800 truncate">{job.farmerName}</h1>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <a href={`tel:${job.mobileNumber}`} className="bg-emerald-50 text-emerald-600 p-2 rounded-full border border-emerald-100">
            <Phone size={18} />
          </a>
          <button 
            onClick={handleDeleteJob} 
            className="bg-red-50 text-red-500 p-2 rounded-full border border-red-100"
            aria-label="Delete job"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <div className="px-4 mt-4 space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest ${
            isCompleted ? "bg-emerald-500 text-white" : "bg-yellow-400 text-yellow-900"
          }`}>
            {isCompleted ? "Completed" : "Ongoing"}
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Service</p>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1">{job.serviceName}</h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
            <IndianRupee size={14} /> 
            <span>₹{job.serviceRate}</span>
            <span className="text-gray-300">|</span>
            <span className="capitalize">{job.rateType}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-blue-400 uppercase">Total</span>
            <span className="text-sm font-extrabold text-blue-700 mt-1 truncate w-full">₹{total}</span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Paid</span>
            <span className="text-sm font-extrabold text-emerald-700 mt-1 truncate w-full">₹{paid}</span>
          </div>
          <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-red-400 uppercase">Pending</span>
            <span className="text-sm font-extrabold text-red-600 mt-1 truncate w-full">₹{pendingAmount}</span>
          </div>
        </div>

        {!isCompleted && (
          <div className="flex gap-3">
            <button 
              onClick={() => { setShowEntryForm(true); setShowPaymentForm(false); }} 
              className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition flex justify-center items-center gap-2"
            >
              <Plus size={16} /> Work
            </button>
            <button 
              onClick={() => { setShowPaymentForm(true); setShowEntryForm(false); }} 
              className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition flex justify-center items-center gap-2"
            >
              <IndianRupee size={16} /> Pay
            </button>
          </div>
        )}

        <div className="pt-2">
          <div className="flex bg-gray-200/60 p-1 rounded-xl mb-4">
            <button 
              onClick={() => setActiveTab("work")} 
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "work" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
            >
              Work
            </button>
            <button 
              onClick={() => setActiveTab("payment")} 
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "payment" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}
            >
              Payment
            </button>
          </div>

          <div className="space-y-3">
            {activeTab === "work" ? (
              job.workLogs?.length > 0 ? job.workLogs.map((log: WorkLog, i: number) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-gray-50 text-gray-400 p-2.5 rounded-xl shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">
                        {new Date(log.date).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {log.startTime ? `${log.startTime} - ${log.endTime}` : "Fixed Cost"}
                      </p>
                    </div>
                  </div>
                  <div className="font-extrabold text-sm text-gray-800 whitespace-nowrap ml-2">
                    {log.hoursWorked ? `${log.hoursWorked} hrs` : `₹${log.fixedCost}`}
                  </div>
                </div>
              )) : <p className="text-center text-xs text-gray-400 py-4">No work history.</p>
            ) : (
              job.paymentLogs?.length > 0 ? job.paymentLogs.map((log: PaymentLog, i: number) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-emerald-100 flex justify-between items-center shadow-sm w-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
                  <div className="flex items-center gap-3 pl-2 min-w-0">
                    <div className="min-w-0">
                      <p className="font-extrabold text-emerald-700 text-base truncate">₹{log.amount}</p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {new Date(log.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold max-w-[120px] truncate ml-2">
                    {log.note || "Cash"}
                  </div>
                </div>
              )) : <p className="text-center text-xs text-gray-400 py-4">No payments yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
        {isCompleted ? (
          <div className="flex gap-3">
            <button 
              onClick={toggleComplete} 
              className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold text-sm active:scale-95 transition"
            >
              Reopen
            </button>
            <button 
              onClick={handleWhatsAppShare} 
              className="flex-[2] bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Share2 size={16} /> Share Bill
            </button>
          </div>
        ) : (
          <button 
            onClick={toggleComplete} 
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <CheckCircle size={18} className="text-emerald-400" /> Finish Job & Close
          </button>
        )}
      </div>

      {showEntryForm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setShowEntryForm(false)}></div>
          <div className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded-full"><Clock size={18} /></div> Add Work Log
              </h3>
              <button 
                onClick={() => setShowEntryForm(false)} 
                className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 bg-gray-50 rounded-xl font-medium text-sm outline-none" 
                  value={entryData.date} 
                  onChange={(e) => setEntryData({...entryData, date: e.target.value})} 
                />
              </div>
              {job.rateType === 'hourly' ? (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">Start Time</label>
                    <input 
                      type="time" 
                      className="w-full p-3 bg-gray-50 rounded-xl font-medium text-sm outline-none" 
                      value={entryData.startTime} 
                      onChange={(e) => setEntryData({...entryData, startTime: e.target.value})} 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">End Time</label>
                    <input 
                      type="time" 
                      className="w-full p-3 bg-gray-50 rounded-xl font-medium text-sm outline-none" 
                      value={entryData.endTime} 
                      onChange={(e) => setEntryData({...entryData, endTime: e.target.value})} 
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">Fixed Cost</label>
                  <input 
                    type="number" 
                    min="0"
                    step="any"
                    placeholder="Enter amount" 
                    className="w-full p-3 bg-gray-50 rounded-xl font-medium text-sm outline-none" 
                    value={entryData.fixedCost} 
                    onChange={(e) => setEntryData({...entryData, fixedCost: e.target.value})} 
                  />
                </div>
              )}
              {job.rateType === 'hourly' && entryData.hoursWorked > 0 && (
                <div className="text-center text-sm font-bold text-emerald-600 bg-emerald-50 py-3 rounded-xl border border-emerald-100">
                  Calculated: {entryData.hoursWorked} Hours
                </div>
              )}
              <button 
                onClick={handleAddEntry} 
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-gray-200 active:scale-95 transition"
              >
                Save Work Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentForm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setShowPaymentForm(false)}></div>
          <div className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl border border-emerald-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                <div className="bg-emerald-50 p-2 rounded-full">
                  <Banknote size={18} className="text-emerald-600"/>
                </div> Receive Payment
              </h3>
              <button 
                onClick={() => setShowPaymentForm(false)} 
                className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-emerald-600/60 uppercase ml-1 mb-1 block">Payment Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 bg-emerald-50/30 rounded-xl font-medium text-sm outline-none" 
                  value={paymentData.date} 
                  onChange={(e) => setPaymentData({...paymentData, date: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-600/60 uppercase ml-1 mb-1 block">Amount Received</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">₹</span>
                  <input 
                    type="number" 
                    min="0"
                    step="any"
                    placeholder="0.00" 
                    className="w-full p-3 pl-8 bg-emerald-50/30 rounded-xl font-bold text-xl text-emerald-700 outline-none" 
                    value={paymentData.amount} 
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-600/60 uppercase ml-1 mb-1 block">Note (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. PhonePe, Cash" 
                  className="w-full p-3 bg-emerald-50/30 rounded-xl font-medium text-sm outline-none" 
                  value={paymentData.note} 
                  onChange={(e) => setPaymentData({...paymentData, note: e.target.value})} 
                />
              </div>
              <button 
                onClick={handleAddPayment} 
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 active:scale-95 transition"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}