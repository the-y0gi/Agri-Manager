// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   Phone,
//   Share2,
//   CheckCircle,
//   Clock,
//   Calendar,
//   IndianRupee,
//   Plus,
//   Banknote,
//   Trash2,
//   X,
//   Pencil,
//   ChevronDown,
//   Hash,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const OWNER_NAME = "Sanjay Chouriya";

// interface Service {
//   _id: string;
//   name: string;
//   price: number;
//   rateType: "hourly" | "fixed";
// }

// interface WorkLog {
//   _id: string;
//   date: string;
//   startTime?: string;
//   endTime?: string;
//   hoursWorked?: number;
//   fixedCost?: string | number;
//   serviceName?: string;
//   rate?: number;
// }

// interface PaymentLog {
//   _id: string;
//   date: string;
//   amount: string | number;
//   note: string;
// }

// interface Job {
//   _id: string;
//   farmerName: string;
//   serviceName: string;
//   serviceRate: number;
//   rateType: "hourly" | "fixed";
//   totalAmount: number;
//   paidAmount: number;
//   status: "ongoing" | "completed";
//   mobileNumber: string;
//   workLogs: WorkLog[];
//   paymentLogs: PaymentLog[];
// }

// interface EntryFormState {
//   date: string;
//   startTime: string;
//   endTime: string;
//   hoursWorked: number;
//   fixedCost: string;
//   serviceName: string;
//   rate: string;
//   quantity: string; // Added for Trips/Units
// }

// interface PaymentFormState {
//   amount: string;
//   date: string;
//   note: string;
// }

// export default function JobDetailsPage() {
//   const params = useParams();
//   const id = params?.id as string;
//   const router = useRouter();

//   // --- State Management ---
//   const [job, setJob] = useState<Job | null>(null);
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const [activeTab, setActiveTab] = useState<"work" | "payment">("work");
//   const [showEntryForm, setShowEntryForm] = useState(false);
//   const [showPaymentForm, setShowPaymentForm] = useState(false);

//   const [editingWorkLog, setEditingWorkLog] = useState<WorkLog | null>(null);
//   const [editingPaymentLog, setEditingPaymentLog] = useState<PaymentLog | null>(
//     null
//   );

//   const [entryData, setEntryData] = useState<EntryFormState>({
//     date: new Date().toISOString().split("T")[0],
//     startTime: "",
//     endTime: "",
//     hoursWorked: 0,
//     fixedCost: "",
//     serviceName: "",
//     rate: "",
//     quantity: "", // Init quantity
//   });

//   const [paymentData, setPaymentData] = useState<PaymentFormState>({
//     amount: "",
//     date: new Date().toISOString().split("T")[0],
//     note: "",
//   });

//   // --- Data Fetching ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const jobRes = await fetch(`/api/jobs/${id}`);

//         if (!jobRes.ok) {
//           toast.error("Job not found");
//           router.push("/");
//           return;
//         }

//         const jobData: Job = await jobRes.json();
//         setJob(jobData);

//         if (!editingWorkLog) {
//           setEntryData((prev) => ({
//             ...prev,
//             serviceName: jobData.serviceName,
//             rate: jobData.serviceRate.toString(),
//           }));
//         }

//         const servRes = await fetch("/api/services");
//         const servData = await servRes.json();
//         if (Array.isArray(servData)) setServices(servData);
//       } catch (error) {
//         toast.error("Failed to load job data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchData();
//   }, [id, refreshKey, router, editingWorkLog]);

//   // --- Helpers & Formatters ---
//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return "";
//     const d = new Date(dateStr);
//     return d.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "2-digit",
//     });
//   };

//   const formatDuration = (decimalHours: number) => {
//     if (!decimalHours) return "0 mins";
//     const totalMins = Math.round(decimalHours * 60);
//     const h = Math.floor(totalMins / 60);
//     const m = totalMins % 60;
//     if (h === 0) return `${m} mins`;
//     if (m === 0) return `${h} hrs`;
//     return `${h} hr ${m} mins`;
//   };

//   const formatTime = (time: string) => {
//     if (!time) return "";
//     const [hours, minutes] = time.split(":");
//     const date = new Date();
//     date.setHours(Number(hours), Number(minutes));
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const getUniqueServices = () => {
//     if (!job) return "";
//     const usedServices = job.workLogs.map(
//       (log) => log.serviceName || job.serviceName
//     );
//     usedServices.push(job.serviceName);
//     return [...new Set(usedServices)].join(", ");
//   };

//   // Helper to check if currently selected service is Hourly or Fixed
//   const getSelectedServiceType = () => {
//     if (!entryData.serviceName || !job) return "hourly";

//     // Check if it's the main job service
//     if (entryData.serviceName === job.serviceName) {
//       return job.rateType;
//     }

//     // Check in services list
//     const foundService = services.find((s) => s.name === entryData.serviceName);
//     return foundService ? foundService.rateType : "hourly";
//   };

//   const isHourly = getSelectedServiceType() === "hourly";

//   // --- Effects ---

//   // Logic for Hourly Calculation
//   useEffect(() => {
//     if (isHourly && entryData.startTime && entryData.endTime) {
//       const start = new Date(`2000-01-01T${entryData.startTime}`);
//       const end = new Date(`2000-01-01T${entryData.endTime}`);
//       let diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
//       if (diff < 0) diff = 0;
//       setEntryData((prev) => ({
//         ...prev,
//         hoursWorked: Number(diff.toFixed(2)),
//       }));
//     }
//   }, [entryData.startTime, entryData.endTime, isHourly]);

//   // Logic for Fixed Calculation (Rate * Quantity)
//   useEffect(() => {
//     if (!isHourly && entryData.quantity && entryData.rate) {
//       const totalCost = Number(entryData.quantity) * Number(entryData.rate);
//       setEntryData((prev) => ({
//         ...prev,
//         fixedCost: totalCost.toString(),
//       }));
//     }
//   }, [entryData.quantity, entryData.rate, isHourly]);

//   // --- Handlers ---
//   const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedName = e.target.value;
//     const selectedService = services.find((s) => s.name === selectedName);

//     // Default fallback if selected is main job
//     const rate = selectedService
//       ? selectedService.price.toString()
//       : selectedName === job?.serviceName
//       ? job.serviceRate.toString()
//       : "";

//     setEntryData((prev) => ({
//       ...prev,
//       serviceName: selectedName,
//       rate: rate,
//       quantity: "", // Reset quantity on change
//       startTime: "",
//       endTime: "",
//       fixedCost: "",
//     }));
//   };

//   const openEditWorkLog = (log: WorkLog) => {
//     setEditingWorkLog(log);

//     const logRate = log.rate || job?.serviceRate || 0;
//     const logCost = log.fixedCost ? Number(log.fixedCost) : 0;

//     // Reverse calculate quantity if it's fixed type
//     const calculatedQty =
//       logCost && logRate ? (logCost / logRate).toString() : "";

//     setEntryData({
//       date: log.date ? new Date(log.date).toISOString().split("T")[0] : "",
//       startTime: log.startTime || "",
//       endTime: log.endTime || "",
//       hoursWorked: log.hoursWorked || 0,
//       fixedCost: log.fixedCost?.toString() || "",
//       serviceName: log.serviceName || job?.serviceName || "",
//       rate: logRate.toString(),
//       quantity: calculatedQty,
//     });
//     setShowEntryForm(true);
//   };

//   const openEditPaymentLog = (log: PaymentLog) => {
//     setEditingPaymentLog(log);
//     setPaymentData({
//       date: log.date ? new Date(log.date).toISOString().split("T")[0] : "",
//       amount: log.amount.toString(),
//       note: log.note || "",
//     });
//     setShowPaymentForm(true);
//   };

//   const closeModals = () => {
//     setShowEntryForm(false);
//     setShowPaymentForm(false);
//     setEditingWorkLog(null);
//     setEditingPaymentLog(null);

//     if (job) {
//       setEntryData({
//         date: new Date().toISOString().split("T")[0],
//         startTime: "",
//         endTime: "",
//         hoursWorked: 0,
//         fixedCost: "",
//         serviceName: job.serviceName,
//         rate: job.serviceRate.toString(),
//         quantity: "",
//       });
//       setPaymentData({
//         amount: "",
//         date: new Date().toISOString().split("T")[0],
//         note: "",
//       });
//     }
//   };

//   const handleSaveEntry = async () => {
//     if (!entryData.date) return toast.error("Date required");
//     const finalServiceName = entryData.serviceName || job?.serviceName;
//     const toastId = toast.loading(editingWorkLog ? "Updating..." : "Saving...");

//     // Determine cost based on type
//     let finalFixedCost = entryData.fixedCost;
//     let finalHours = Number(entryData.hoursWorked);

//     // If Fixed mode, ensure fixedCost is explicitly set from quantity * rate logic
//     // and hoursWorked is 0 so it doesn't mess up hourly calculations
//     if (!isHourly) {
//       finalFixedCost = (
//         Number(entryData.quantity) * Number(entryData.rate)
//       ).toString();
//       finalHours = 0;
//     } else {
//       finalFixedCost = ""; // Reset fixed cost if hourly
//     }

//     const logData = {
//       ...entryData,
//       serviceName: finalServiceName,
//       hoursWorked: finalHours,
//       rate: Number(entryData.rate),
//       fixedCost: finalFixedCost,
//     };

//     const payload: {
//       updateWorkLog?: typeof logData & { _id: string };
//       newLog?: typeof logData;
//     } = {};

//     if (editingWorkLog) {
//       payload.updateWorkLog = { _id: editingWorkLog._id, ...logData };
//     } else {
//       payload.newLog = logData;
//     }

//     try {
//       const res = await fetch(`/api/jobs/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         setRefreshKey((k) => k + 1);
//         closeModals();
//         toast.success(editingWorkLog ? "Entry Updated" : "Entry Added", {
//           id: toastId,
//         });
//       } else {
//         throw new Error("Update failed");
//       }
//     } catch (e) {
//       toast.error("Operation failed", { id: toastId });
//     }
//   };

//   const handleSavePayment = async () => {
//     if (!paymentData.amount) return toast.error("Enter Amount");

//     const amountNum = Number(paymentData.amount);
//     const pendingAmount = (job?.totalAmount || 0) - (job?.paidAmount || 0);

//     if (!editingPaymentLog && amountNum > pendingAmount) {
//       return toast.error(
//         `Can't exceed pending amount (₹${Math.round(pendingAmount)})`
//       );
//     }

//     const toastId = toast.loading(
//       editingPaymentLog ? "Updating..." : "Saving..."
//     );

//     const payload: {
//       updatePaymentLog?: PaymentLog & Partial<PaymentFormState>;
//       newPayment?: PaymentFormState;
//     } = {};
//     if (editingPaymentLog) {
//       payload.updatePaymentLog = { _id: editingPaymentLog._id, ...paymentData };
//     } else {
//       payload.newPayment = { ...paymentData };
//     }

//     try {
//       const res = await fetch(`/api/jobs/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (res.ok) {
//         setRefreshKey((k) => k + 1);
//         closeModals();
//         toast.success(editingPaymentLog ? "Payment Updated" : "Payment Saved", {
//           id: toastId,
//         });
//       } else {
//         throw new Error("Payment update failed");
//       }
//     } catch (e) {
//       toast.error("Operation failed", { id: toastId });
//     }
//   };

  // // --- Toast Confirmation Helper ---
  // const confirmAction = (message: string, onConfirm: () => Promise<void>) => {
  //   toast(
  //     (t) => (
  //       <div className="flex flex-col gap-3 min-w-[200px]">
  //         <span className="font-semibold text-white text-sm">{message}</span>
  //         <div className="flex gap-2 justify-end">
  //           <button
  //             onClick={() => toast.dismiss(t.id)}
  //             className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             onClick={() => {
  //               toast.dismiss(t.id);
  //               onConfirm();
  //             }}
  //             className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
  //           >
  //             Confirm
  //           </button>
  //         </div>
  //       </div>
  //     ),
  //     { duration: 5000 }
  //   );
  // };

//   // --- Deletion Handlers ---
//   const handleDeleteWorkLog = () => {
//     if (!editingWorkLog) return;

//     confirmAction("Delete this work entry?", async () => {
//       const toastId = toast.loading("Deleting...");
//       try {
//         const res = await fetch(`/api/jobs/${id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ deleteWorkLogId: editingWorkLog._id }),
//         });
//         if (res.ok) {
//           setRefreshKey((k) => k + 1);
//           closeModals();
//           toast.success("Entry Deleted", { id: toastId });
//         } else throw new Error();
//       } catch (e) {
//         toast.error("Failed to delete", { id: toastId });
//       }
//     });
//   };

  // const handleDeletePaymentLog = () => {
  //   if (!editingPaymentLog) return;

  //   confirmAction("Delete this payment?", async () => {
  //     const toastId = toast.loading("Deleting...");
  //     try {
  //       const res = await fetch(`/api/jobs/${id}`, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ deletePaymentLogId: editingPaymentLog._id }),
  //       });
  //       if (res.ok) {
  //         setRefreshKey((k) => k + 1);
  //         closeModals();
  //         toast.success("Payment Deleted", { id: toastId });
  //       } else throw new Error();
  //     } catch (e) {
  //       toast.error("Failed to delete", { id: toastId });
  //     }
  //   });
  // };

//   const handleDeleteJob = () => {
//     confirmAction("Delete entire job permanently?", async () => {
//       const toastId = toast.loading("Deleting Job...");
//       try {
//         await fetch(`/api/jobs/${id}`, { method: "DELETE" });
//         toast.success("Job Deleted", { id: toastId });
//         router.push("/");
//       } catch (e) {
//         toast.error("Failed to delete job", { id: toastId });
//       }
//     });
//   };

//   const getAggregatedServices = () => {
//     if (!job?.workLogs) return [];

//     const summary: Record<
//       string,
//       { time: number; cost: number; isHourly: boolean; count: number } // Added count for trips
//     > = {};

//     job.workLogs.forEach((log) => {
//       // Service name
//       const name = log.serviceName || job.serviceName;
//       const rate = log.rate || job.serviceRate;

//       // Cost calculate
//       const logCost = log.fixedCost
//         ? Number(log.fixedCost)
//         : (log.hoursWorked || 0) * rate;

//       const isFixed = !!log.fixedCost;

//       if (!summary[name]) {
//         summary[name] = { time: 0, cost: 0, isHourly: !isFixed, count: 0 };
//       }

//       summary[name].time += log.hoursWorked || 0;
//       summary[name].cost += logCost;
//       if (isFixed && rate > 0) {
//         // Estimate Trip count
//         summary[name].count += logCost / rate;
//       }
//     });

//     return Object.entries(summary).map(([name, data]) => ({ name, ...data }));
//   };

//   const handleWhatsAppShare = () => {
//     if (!job) return;

//     const services = getAggregatedServices();
//     const total = Math.round(job.totalAmount || 0);
//     const paid = Math.round(job.paidAmount || 0);
//     const pending = total - paid;

//     let text = `नमस्ते *${job.farmerName}* जी,\nमैं *${OWNER_NAME}* हूँ।\n\n`;
//     text += `मैंने आपके यहाँ जो कार्य किया है, उसका पूरा विवरण नीचे दिया गया है:\n\n`;

//     services.forEach((s) => {
//       const amount = Math.round(s.cost);
//       if (s.isHourly && s.time > 0) {
//         text += ` *${s.name}* ${formatDuration(
//           s.time
//         )} तक चला, जिसका भुगतान *₹${amount}* है।\n`;
//       } else {
//         // Round off count for cleaner display (e.g., 2.0 -> 2)
//         const tripCount = Math.round(s.count * 100) / 100;
//         text += ` *${s.name}* (${tripCount} Trips/Unit), जिसका भुगतान *₹${amount}* है।\n`;
//       }
//     });

//     text += `\n------------------\n`;
//     text += ` *कुल राशि: ₹${total}*\n`;

//     if (paid > 0) {
//       text += `*जमा राशि: ₹${paid}*\n`;
//     }

//     text += `*शेष राशि: ₹${pending}*\n`;
//     text += `------------------\n\n`;
//     text += `कृपया शेष भुगतान शीघ्र करने की कृपा करें।\nधन्यवाद।`;

//     // WhatsApp Open
//     window.open(
//       `https://wa.me/91${job.mobileNumber}?text=${encodeURIComponent(text)}`,
//       "_blank"
//     );
//   };

//   const toggleComplete = async () => {
//     if (!job) return;
//     const newStatus = job.status === "completed" ? "ongoing" : "completed";

//     await fetch(`/api/jobs/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: newStatus }),
//     });
//     setRefreshKey((k) => k + 1);
//     toast.success(newStatus === "completed" ? "Job Completed" : "Job Reopened");
//   };

//   if (loading || !job)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-pulse h-10 w-10 bg-gray-200 rounded-full" />
//       </div>
//     );

//   const total = Math.round(job.totalAmount || 0);
//   const paid = Math.round(job.paidAmount || 0);
//   const pendingAmount = total - paid;
//   const isCompleted = job.status === "completed";

//   return (
//     <div className="min-h-screen bg-gray-50/50 pb-40 overflow-x-hidden">
//       {/* --- HEADER --- */}
//       <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-5 pt-10 pb-4 flex justify-between items-center shadow-sm">
//         <div className="flex items-center gap-3 min-w-0">
//           <Link href="/">
//             <button className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200 transition">
//               <ArrowLeft size={20} />
//             </button>
//           </Link>
//           <h1 className="text-lg font-bold text-gray-800 truncate">
//             {job.farmerName}
//           </h1>
//         </div>
//         <div className="flex items-center gap-2 shrink-0">
//           <a
//             href={`tel:${job.mobileNumber}`}
//             className="bg-emerald-50 text-emerald-600 p-2 rounded-full border border-emerald-100 active:scale-95 transition"
//           >
//             <Phone size={18} />
//           </a>
//           <button
//             onClick={handleDeleteJob}
//             className="bg-red-50 text-red-500 p-2 rounded-full border border-red-100 active:scale-95 transition"
//           >
//             <Trash2 size={18} />
//           </button>
//         </div>
//       </header>

//       {/* --- OVERVIEW CARD --- */}
//       <div className="px-4 mt-4">
//         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
//           <div
//             className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest ${
//               isCompleted
//                 ? "bg-emerald-500 text-white"
//                 : "bg-yellow-400 text-yellow-900"
//             }`}
//           >
//             {isCompleted ? "Completed" : "Ongoing"}
//           </div>
//           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//             Services Used
//           </p>
//           <h2 className="text-lg font-extrabold text-gray-900 mb-1 leading-tight">
//             {getUniqueServices()}
//           </h2>
//           <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
//             <IndianRupee size={14} /> <span>Rate Varies</span>{" "}
//             <span className="text-gray-300">|</span>{" "}
//             <span className="capitalize">{job.rateType}</span>
//           </div>
//         </div>
//       </div>

//       {/* --- FINANCIAL STATS --- */}
//       <div className="px-4 mt-4 grid grid-cols-3 gap-3">
//         <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
//           <span className="text-[10px] font-bold text-blue-400 uppercase">
//             Total
//           </span>
//           <span className="text-sm font-extrabold text-blue-700 mt-1 truncate w-full">
//             ₹{total}
//           </span>
//         </div>
//         <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
//           <span className="text-[10px] font-bold text-emerald-500 uppercase">
//             Paid
//           </span>
//           <span className="text-sm font-extrabold text-emerald-700 mt-1 truncate w-full">
//             ₹{paid}
//           </span>
//         </div>
//         <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex flex-col items-center text-center">
//           <span className="text-[10px] font-bold text-red-400 uppercase">
//             Pending
//           </span>
//           <span className="text-sm font-extrabold text-red-600 mt-1 truncate w-full">
//             ₹{pendingAmount}
//           </span>
//         </div>
//       </div>

//       {/* --- ACTION BUTTONS --- */}
//       {!isCompleted && (
//         <div className="px-4 mt-6 flex gap-3">
//           <button
//             onClick={() => {
//               setEditingWorkLog(null);
//               setShowEntryForm(true);
//             }}
//             className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition flex justify-center items-center gap-2"
//           >
//             <Plus size={16} /> Work
//           </button>
//           <button
//             onClick={() => {
//               setEditingPaymentLog(null);
//               setShowPaymentForm(true);
//             }}
//             className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition flex justify-center items-center gap-2"
//           >
//             <IndianRupee size={16} /> Pay
//           </button>
//         </div>
//       )}

//       {/* --- TABS --- */}
//       <div className="mt-8 px-4">
//         <div className="flex bg-gray-200/60 p-1 rounded-xl mb-4">
//           <button
//             onClick={() => setActiveTab("work")}
//             className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
//               activeTab === "work"
//                 ? "bg-white text-gray-900 shadow-sm"
//                 : "text-gray-500"
//             }`}
//           >
//             Work History
//           </button>
//           <button
//             onClick={() => setActiveTab("payment")}
//             className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
//               activeTab === "payment"
//                 ? "bg-white text-emerald-600 shadow-sm"
//                 : "text-gray-500"
//             }`}
//           >
//             Payment History
//           </button>
//         </div>

//         {/* --- LOGS LIST --- */}
//         <div className="space-y-3 pb-20">
//           {activeTab === "work" ? (
//             job.workLogs?.length > 0 ? (
//               job.workLogs.map((log: WorkLog, i: number) => {
//                 const entryRate = log.rate || job.serviceRate;
//                 const entryCost = log.fixedCost
//                   ? Number(log.fixedCost)
//                   : (log.hoursWorked || 0) * entryRate;

//                 // Calculate Trips for display if fixed
//                 const tripCount = log.fixedCost
//                   ? Number(log.fixedCost) / entryRate
//                   : 0;

//                 return (
//                   <div
//                     key={log._id || i}
//                     className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group"
//                   >
//                     <button
//                       onClick={() => openEditWorkLog(log)}
//                       className="absolute top-3 right-3 text-gray-300 hover:text-gray-600 p-2 z-10 transition-colors"
//                     >
//                       <Pencil size={16} />
//                     </button>
//                     <div className="flex justify-between items-start">
//                       <div className="flex gap-3">
//                         <div className="bg-gray-50 text-gray-500 p-2.5 rounded-xl h-fit">
//                           <Calendar size={18} />
//                         </div>
//                         <div>
//                           <p className="font-bold text-gray-800 text-sm">
//                             {formatDate(log.date)}
//                           </p>
//                           <div className="flex items-center gap-2 mt-0.5">
//                             <span className="text-xs font-bold text-emerald-600">
//                               {log.serviceName || job.serviceName}
//                             </span>
//                             <span className="text-[10px] text-gray-400 font-medium mt-0.5">
//                               {log.startTime
//                                 ? `${formatTime(log.startTime)} - ${formatTime(
//                                     log.endTime || ""
//                                   )}`
//                                 : `Fixed Rate (@${entryRate})`}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right pr-8">
//                         <p className="font-extrabold text-gray-900 text-sm">
//                           ₹{Math.round(entryCost)}
//                         </p>
//                         <p className="text-[11px] text-gray-500 font-medium">
//                           {log.hoursWorked
//                             ? formatDuration(log.hoursWorked)
//                             : `${Math.round(tripCount * 100) / 100} Trips`}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <p className="text-center text-xs text-gray-400 py-4">
//                 No work history recorded.
//               </p>
//             )
//           ) : job.paymentLogs?.length > 0 ? (
//             job.paymentLogs.map((log: PaymentLog, i: number) => (
//               <div
//                 key={log._id || i}
//                 className="bg-white p-4 rounded-2xl border border-emerald-100 flex justify-between items-center relative overflow-hidden"
//               >
//                 <button
//                   onClick={() => openEditPaymentLog(log)}
//                   className="absolute top-3 right-3 text-emerald-200 hover:text-emerald-500 p-2 z-10 transition-colors"
//                 >
//                   <Pencil size={16} />
//                 </button>
//                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
//                 <div className="flex items-center gap-3 pl-2">
//                   <div>
//                     <p className="font-extrabold text-emerald-700 text-base">
//                       ₹{Math.round(Number(log.amount))}
//                     </p>
//                     <p className="text-[11px] text-gray-400 font-medium">
//                       {formatDate(log.date)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold max-w-[120px] truncate mr-8">
//                   {log.note || "Cash"}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-xs text-gray-400 py-4">
//               No payments recorded.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* --- BOTTOM ACTIONS --- */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
//         {isCompleted ? (
//           <div className="flex gap-3">
//             <button
//               onClick={toggleComplete}
//               className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold text-sm active:scale-95 transition"
//             >
//               Reopen Job
//             </button>
//             <button
//               onClick={handleWhatsAppShare}
//               className="flex-[2] bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition"
//             >
//               <Share2 size={16} /> Share Bill
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={toggleComplete}
//             className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition"
//           >
//             <CheckCircle size={18} className="text-emerald-400" /> Finish Job &
//             Close
//           </button>
//         )}
//       </div>

//       {/* --- MODAL: WORK ENTRY --- */}
//       {showEntryForm && (
//         <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//           <div className="absolute inset-0" onClick={closeModals}></div>
//           <div className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                 <div className="bg-gray-100 p-2 rounded-full">
//                   <Clock size={18} />
//                 </div>
//                 {editingWorkLog ? "Edit Work Log" : "Add Work"}
//               </h3>
//               <div className="flex gap-2">
//                 {editingWorkLog && (
//                   <button
//                     onClick={handleDeleteWorkLog}
//                     className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 )}
//                 <button
//                   onClick={closeModals}
//                   className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex gap-3">
//                 <div className="flex-1">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">
//                     Date
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none"
//                     value={entryData.date}
//                     onChange={(e) =>
//                       setEntryData({ ...entryData, date: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="flex-[1.5]">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">
//                     Service
//                   </label>
//                   <div className="relative">
//                     <select
//                       className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none appearance-none"
//                       value={entryData.serviceName}
//                       onChange={handleServiceChange}
//                     >
//                       <option value={job?.serviceName}>
//                         {job?.serviceName}
//                       </option>
//                       {services
//                         .filter((s) => s.name !== job?.serviceName)
//                         .map((s) => (
//                           <option key={s._id} value={s.name}>
//                             {s.name}
//                           </option>
//                         ))}
//                     </select>
//                     <ChevronDown
//                       size={14}
//                       className="absolute right-3 top-4 text-gray-400 pointer-events-none"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* DYNAMIC FORM FIELDS BASED ON TYPE */}
//               {isHourly ? (
//                 <div className="flex gap-3">
//                   <div className="flex-1">
//                     <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">
//                       Start Time
//                     </label>
//                     <input
//                       type="time"
//                       className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none"
//                       value={entryData.startTime}
//                       onChange={(e) =>
//                         setEntryData({
//                           ...entryData,
//                           startTime: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">
//                       End Time
//                     </label>
//                     <input
//                       type="time"
//                       className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none"
//                       value={entryData.endTime}
//                       onChange={(e) =>
//                         setEntryData({ ...entryData, endTime: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex gap-3">
//                   <div className="flex-1">
//                     <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">
//                       Quantity (Trips)
//                     </label>
//                     <div className="relative">
//                       <span className="absolute left-3 top-3 text-gray-400">
//                         <Hash size={16} />
//                       </span>
//                       <input
//                         type="number"
//                         placeholder="e.g. 2"
//                         className="w-full pl-9 p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
//                         value={entryData.quantity}
//                         onChange={(e) =>
//                           setEntryData({
//                             ...entryData,
//                             quantity: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Rate Field (Common) */}
//               <div>
//                 <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">
//                   {isHourly ? "Hourly Rate (₹)" : "Rate per Trip/Unit (₹)"}
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-3 text-gray-400 text-xs">
//                     ₹
//                   </span>
//                   <input
//                     type="number"
//                     className="w-full pl-6 p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none"
//                     value={entryData.rate}
//                     onChange={(e) =>
//                       setEntryData({ ...entryData, rate: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Total Calculation Display */}
//               {(isHourly
//                 ? entryData.hoursWorked > 0
//                 : Number(entryData.quantity) > 0) && (
//                 <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
//                   <span className="text-xs font-bold text-emerald-600">
//                     {isHourly
//                       ? `Duration: ${formatDuration(entryData.hoursWorked)}`
//                       : `Total: ${entryData.quantity} Trips x ${entryData.rate}`}
//                   </span>
//                   <span className="text-sm font-extrabold text-emerald-700">
//                     ₹
//                     {isHourly
//                       ? Math.round(
//                           entryData.hoursWorked * Number(entryData.rate)
//                         )
//                       : Math.round(
//                           Number(entryData.quantity) * Number(entryData.rate)
//                         )}
//                   </span>
//                 </div>
//               )}

//               <button
//                 onClick={handleSaveEntry}
//                 className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition"
//               >
//                 {editingWorkLog ? "Update Work Entry" : "Save Work Entry"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: PAYMENT ENTRY --- */}
//       {showPaymentForm && (
//         <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//           <div className="absolute inset-0" onClick={closeModals}></div>
//           <div className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl border border-emerald-100">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
//                 <div className="bg-emerald-50 p-2 rounded-full">
//                   <Banknote size={18} className="text-emerald-600" />
//                 </div>
//                 {editingPaymentLog ? "Edit Payment" : "Add Payment"}
//               </h3>
//               <div className="flex gap-2">
//                 {editingPaymentLog && (
//                   <button
//                     onClick={handleDeletePaymentLog}
//                     className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 )}
//                 <button
//                   onClick={closeModals}
//                   className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <input
//                 type="date"
//                 className="w-full p-3 bg-emerald-50/30 rounded-xl font-bold text-sm outline-none"
//                 value={paymentData.date}
//                 onChange={(e) =>
//                   setPaymentData({ ...paymentData, date: e.target.value })
//                 }
//               />
//               <input
//                 type="number"
//                 placeholder="Amount (₹)"
//                 className="w-full p-3 bg-emerald-50/30 rounded-xl font-bold text-lg text-emerald-700 outline-none placeholder:text-emerald-300/50"
//                 value={paymentData.amount}
//                 onChange={(e) =>
//                   setPaymentData({ ...paymentData, amount: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Cash,PhonePay,UPI etc. (optional)"
//                 className="w-full p-3 bg-emerald-50/30 rounded-xl font-medium text-sm outline-none"
//                 value={paymentData.note}
//                 onChange={(e) =>
//                   setPaymentData({ ...paymentData, note: e.target.value })
//                 }
//               />
//               <button
//                 onClick={handleSavePayment}
//                 className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition"
//               >
//                 {editingPaymentLog ? "Update Payment" : "Confirm Payment"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   Phone,
//   Share2,
//   CheckCircle,
//   Clock,
//   Calendar,
//   IndianRupee,
//   Plus,
//   Banknote,
//   Trash2,
//   X,
//   Pencil,
//   ChevronDown,
//   ChevronUp,
//   Hash,
//   Languages,
//   LayoutList,
//   ChevronRight,
// } from "lucide-react";
// import toast from "react-hot-toast";

// // ✅ Import Translations
// import { jobDetailsContent } from "@/data/translations";

// const OWNER_NAME = "Sanjay Chouriya";

// // --- Interfaces ---
// interface Service {
//   _id: string;
//   name: string;
//   price: number;
//   rateType: "hourly" | "fixed";
// }

// interface WorkLog {
//   _id: string;
//   date: string;
//   startTime?: string;
//   endTime?: string;
//   hoursWorked?: number;
//   fixedCost?: string | number;
//   serviceName?: string;
//   rate?: number;
// }

// interface PaymentLog {
//   _id: string;
//   date: string;
//   amount: string | number;
//   note: string;
// }

// interface Job {
//   _id: string;
//   farmerName: string;
//   serviceName: string;
//   serviceRate: number;
//   rateType: "hourly" | "fixed";
//   totalAmount: number;
//   paidAmount: number;
//   status: "ongoing" | "completed";
//   mobileNumber: string;
//   workLogs: WorkLog[];
//   paymentLogs: PaymentLog[];
// }

// interface EntryFormState {
//   date: string;
//   startTime: string;
//   endTime: string;
//   hoursWorked: number;
//   fixedCost: string;
//   serviceName: string;
//   rate: string;
//   quantity: string;
// }

// interface PaymentFormState {
//   amount: string;
//   date: string;
//   note: string;
// }

// export default function JobDetailsPage() {
//   const params = useParams();
//   const id = params?.id as string;
//   const router = useRouter();

//   // --- State ---
//   const [lang, setLang] = useState<"en" | "hi">("hi");
//   const [job, setJob] = useState<Job | null>(null);
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const [activeTab, setActiveTab] = useState<"work" | "payment">("work");
  
//   // New State for Accordion: Stores which service card is expanded
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   const [showEntryForm, setShowEntryForm] = useState(false);
//   const [showPaymentForm, setShowPaymentForm] = useState(false);

//   const [editingWorkLog, setEditingWorkLog] = useState<WorkLog | null>(null);
//   const [editingPaymentLog, setEditingPaymentLog] = useState<PaymentLog | null>(null);

//   const [entryData, setEntryData] = useState<EntryFormState>({
//     date: new Date().toISOString().split("T")[0],
//     startTime: "",
//     endTime: "",
//     hoursWorked: 0,
//     fixedCost: "",
//     serviceName: "",
//     rate: "",
//     quantity: "",
//   });

//   const [paymentData, setPaymentData] = useState<PaymentFormState>({
//     amount: "",
//     date: new Date().toISOString().split("T")[0],
//     note: "",
//   });

//   const t = jobDetailsContent[lang];

//   const toggleLanguage = () => {
//     setLang((prev) => (prev === "hi" ? "en" : "hi"));
//   };

//   // --- Fetch Data ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const jobRes = await fetch(`/api/jobs/${id}`);
//         if (!jobRes.ok) {
//           toast.error(t.messages.failed);
//           router.push("/");
//           return;
//         }
//         const jobData: Job = await jobRes.json();
//         setJob(jobData);

//         // Pre-fill default service rate if not editing
//         if (!editingWorkLog) {
//           setEntryData((prev) => ({
//             ...prev,
//             serviceName: jobData.serviceName,
//             rate: jobData.serviceRate.toString(),
//           }));
//         }

//         const servRes = await fetch("/api/services");
//         const servData = await servRes.json();
//         if (Array.isArray(servData)) setServices(servData);
//       } catch (error) {
//         toast.error(t.messages.failed);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchData();
//   }, [id, refreshKey, router, lang]); // Removed editingWorkLog dependency to avoid loops

//   // --- Grouping Logic (The Magic ✨) ---
//   const groupedWorkLogs = useMemo(() => {
//     if (!job?.workLogs) return {};

//     const groups: Record<string, { 
//       logs: WorkLog[], 
//       totalCost: number, 
//       totalTime: number, 
//       totalCount: number,
//       isHourly: boolean 
//     }> = {};

//     job.workLogs.forEach(log => {
//       const name = log.serviceName || job.serviceName;
//       const rate = log.rate || job.serviceRate;
//       const logCost = log.fixedCost ? Number(log.fixedCost) : (log.hoursWorked || 0) * rate;
//       const isFixed = !!log.fixedCost;

//       if (!groups[name]) {
//         groups[name] = { logs: [], totalCost: 0, totalTime: 0, totalCount: 0, isHourly: !isFixed };
//       }

//       groups[name].logs.push(log);
//       groups[name].totalCost += logCost;
//       groups[name].totalTime += log.hoursWorked || 0;
      
//       if (isFixed && rate > 0) {
//         groups[name].totalCount += logCost / rate;
//       }
//     });

//     // Sort logs inside each group by date (descending)
//     Object.keys(groups).forEach(key => {
//       groups[key].logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     });

//     return groups;
//   }, [job?.workLogs]);

//   // --- Formatters ---
//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return "";
//     const d = new Date(dateStr);
//     const locale = lang === "hi" ? "hi-IN" : "en-GB";
//     return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "2-digit" });
//   };

//   const formatDuration = (decimalHours: number) => {
//     if (!decimalHours) return `0 ${t.units.min}`;
//     const totalMins = Math.round(decimalHours * 60);
//     const h = Math.floor(totalMins / 60);
//     const m = totalMins % 60;
//     if (h === 0) return `${m} ${t.units.min}`;
//     if (m === 0) return `${h} ${t.units.hrs}`;
//     return `${h} ${t.units.hr} ${m} ${t.units.min}`;
//   };

//   const formatTime = (time: string) => {
//     if (!time) return "";
//     const [hours, minutes] = time.split(":");
//     const date = new Date();
//     date.setHours(Number(hours), Number(minutes));
//     return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
//   };

//   const getUniqueServices = () => {
//     if (!job) return "";
//     return Object.keys(groupedWorkLogs).join(", ");
//   };

//   // --- Helpers ---
//   const getSelectedServiceType = () => {
//     if (!entryData.serviceName || !job) return "hourly";
//     if (entryData.serviceName === job.serviceName) return job.rateType;
//     const foundService = services.find((s) => s.name === entryData.serviceName);
//     return foundService ? foundService.rateType : "hourly";
//   };
//   const isHourly = getSelectedServiceType() === "hourly";

//   // --- Effects for Calculation ---
//   useEffect(() => {
//     if (isHourly && entryData.startTime && entryData.endTime) {
//       const start = new Date(`2000-01-01T${entryData.startTime}`);
//       const end = new Date(`2000-01-01T${entryData.endTime}`);
//       let diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
//       if (diff < 0) diff = 0;
//       setEntryData((prev) => ({ ...prev, hoursWorked: Number(diff.toFixed(2)) }));
//     }
//   }, [entryData.startTime, entryData.endTime, isHourly]);

//   useEffect(() => {
//     if (!isHourly && entryData.quantity && entryData.rate) {
//       const totalCost = Number(entryData.quantity) * Number(entryData.rate);
//       setEntryData((prev) => ({ ...prev, fixedCost: totalCost.toString() }));
//     }
//   }, [entryData.quantity, entryData.rate, isHourly]);

//   // --- Handlers ---
//   const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedName = e.target.value;
//     const selectedService = services.find((s) => s.name === selectedName);
//     const rate = selectedService ? selectedService.price.toString() : (selectedName === job?.serviceName ? job.serviceRate.toString() : "");

//     setEntryData((prev) => ({
//       ...prev,
//       serviceName: selectedName,
//       rate: rate,
//       quantity: "", startTime: "", endTime: "", fixedCost: "",
//     }));
//   };

//   // Open Add Work Modal (Global or Specific)
//   const openAddWorkModal = (preSelectedService?: string) => {
//     setEditingWorkLog(null);
//     const defaultService = preSelectedService || job?.serviceName || "";
    
//     // Find rate for this service
//     const foundService = services.find(s => s.name === defaultService);
//     const defaultRate = foundService ? foundService.price.toString() : (defaultService === job?.serviceName ? job.serviceRate.toString() : "");

//     setEntryData({
//       date: new Date().toISOString().split("T")[0],
//       startTime: "", endTime: "", hoursWorked: 0, fixedCost: "",
//       serviceName: defaultService,
//       rate: defaultRate,
//       quantity: "",
//     });
//     setShowEntryForm(true);
//   };

//   const openEditWorkLog = (log: WorkLog) => {
//     setEditingWorkLog(log);
//     const logRate = log.rate || job?.serviceRate || 0;
//     const logCost = log.fixedCost ? Number(log.fixedCost) : 0;
//     const calculatedQty = logCost && logRate ? (logCost / logRate).toString() : "";

//     setEntryData({
//       date: log.date ? new Date(log.date).toISOString().split("T")[0] : "",
//       startTime: log.startTime || "", endTime: log.endTime || "", hoursWorked: log.hoursWorked || 0,
//       fixedCost: log.fixedCost?.toString() || "",
//       serviceName: log.serviceName || job?.serviceName || "",
//       rate: logRate.toString(),
//       quantity: calculatedQty,
//     });
//     setShowEntryForm(true);
//   };

//   const openEditPaymentLog = (log: PaymentLog) => {
//     setEditingPaymentLog(log);
//     setPaymentData({
//       date: log.date ? new Date(log.date).toISOString().split("T")[0] : "",
//       amount: log.amount.toString(),
//       note: log.note || "",
//     });
//     setShowPaymentForm(true);
//   };

//   const closeModals = () => {
//     setShowEntryForm(false);
//     setShowPaymentForm(false);
//     setEditingWorkLog(null);
//     setEditingPaymentLog(null);
//   };

//   // --- API Handlers (Save/Delete) ---
//   const handleSaveEntry = async () => {
//     if (!entryData.date) return toast.error(t.messages.dateReq);
//     const finalServiceName = entryData.serviceName || job?.serviceName;
//     const toastId = toast.loading(editingWorkLog ? t.messages.updating : t.messages.saving);

//     let finalFixedCost = entryData.fixedCost;
//     let finalHours = Number(entryData.hoursWorked);

//     if (!isHourly) {
//       finalFixedCost = (Number(entryData.quantity) * Number(entryData.rate)).toString();
//       finalHours = 0;
//     } else {
//       finalFixedCost = "";
//     }

//     const logData = { ...entryData, serviceName: finalServiceName, hoursWorked: finalHours, rate: Number(entryData.rate), fixedCost: finalFixedCost };
//     const payload: any = editingWorkLog ? { updateWorkLog: { _id: editingWorkLog._id, ...logData } } : { newLog: logData };

//     try {
//       const res = await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//       if (res.ok) {
//         setRefreshKey((k) => k + 1);
//         closeModals();
//         toast.success(editingWorkLog ? t.messages.entryUpdated : t.messages.entryAdded, { id: toastId });
//       } else throw new Error();
//     } catch (e) { toast.error(t.messages.failed, { id: toastId }); }
//   };

//   const handleSavePayment = async () => {
//     if (!paymentData.amount) return toast.error(t.messages.enterAmount);
//     const amountNum = Number(paymentData.amount);
//     const pendingAmount = (job?.totalAmount || 0) - (job?.paidAmount || 0);

//     if (!editingPaymentLog && amountNum > pendingAmount) {
//       return toast.error(`${t.messages.exceedAmount} (₹${Math.round(pendingAmount)})`);
//     }

//     const toastId = toast.loading(editingPaymentLog ? t.messages.updating : t.messages.saving);
//     const payload: any = editingPaymentLog ? { updatePaymentLog: { _id: editingPaymentLog._id, ...paymentData } } : { newPayment: paymentData };

//     try {
//       const res = await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//       if (res.ok) {
//         setRefreshKey((k) => k + 1);
//         closeModals();
//         toast.success(editingPaymentLog ? t.messages.paymentUpdated : t.messages.paymentSaved, { id: toastId });
//       } else throw new Error();
//     } catch (e) { toast.error(t.messages.failed, { id: toastId }); }
//   };

//   const handleDeleteWorkLog = () => {
//     if (!editingWorkLog) return;
//     toast((toastT) => (
//       <div className="flex flex-col gap-3 min-w-[200px]">
//         <span className="font-semibold text-white text-sm">{t.messages.deleteWorkConfirm}</span>
//         <div className="flex gap-2 justify-end">
//           <button onClick={() => toast.dismiss(toastT.id)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">{t.buttons.cancel}</button>
//           <button onClick={async () => {
//             toast.dismiss(toastT.id);
//             const toastId = toast.loading(t.messages.deleting);
//             try {
//               const res = await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deleteWorkLogId: editingWorkLog._id }) });
//               if (res.ok) {
//                 setRefreshKey(k => k + 1); closeModals(); toast.success(t.messages.entryDeleted, { id: toastId });
//               } else throw new Error();
//             } catch (e) { toast.error(t.messages.failed, { id: toastId }); }
//           }} className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600">{t.buttons.confirm}</button>
//         </div>
//       </div>
//     ));
//   };

//   // Shared Logic (WhatsApp, Delete Job, etc - same as before)
//   const handleWhatsAppShare = () => {
//     if (!job) return;
//     // ... (WhatsApp Logic same as previous - reusing aggregatedServices from groupedWorkLogs logic if needed, but keeping it simple)
//     // Quick recalc for whatsapp text
//     const summary = Object.entries(groupedWorkLogs).map(([name, data]) => ({name, cost: data.totalCost, time: data.totalTime, count: data.totalCount, isHourly: data.isHourly}));
    
//     const total = Math.round(job.totalAmount || 0);
//     const paid = Math.round(job.paidAmount || 0);
//     const pending = total - paid;

//     let text = `नमस्ते *${job.farmerName}* जी,\nमैं *${OWNER_NAME}* हूँ।\n\n`;
//     text += `कार्य विवरण:\n\n`;

//     summary.forEach((s) => {
//       const amount = Math.round(s.cost);
//       if (s.isHourly && s.time > 0) {
//         text += ` *${s.name}* ${formatDuration(s.time)} तक चला, जिसका भुगतान *₹${amount}* है।\n`;
//       } else {
//         const tripCount = Math.round(s.count * 100) / 100;
//         text += ` *${s.name}* (${tripCount} Trips/Unit), जिसका भुगतान *₹${amount}* है।\n`;
//       }
//     });

//     text += `\n------------------\n`;
//     text += ` *कुल राशि: ₹${total}*\n`;
//     if (paid > 0) text += `*जमा राशि: ₹${paid}*\n`;
//     text += `*शेष राशि: ₹${pending}*\n`;
//     text += `------------------\n\nकृपया शेष भुगतान शीघ्र करें।\nधन्यवाद।`;

//     window.open(`https://wa.me/91${job.mobileNumber}?text=${encodeURIComponent(text)}`, "_blank");
//   };

//   const handleDeleteJob = () => {
//     toast((toastT) => (
//        <div className="flex flex-col gap-3 min-w-[200px]">
//         <span className="font-semibold text-white text-sm">{t.messages.deleteJobConfirm}</span>
//         <div className="flex gap-2 justify-end">
//           <button onClick={() => toast.dismiss(toastT.id)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">{t.buttons.cancel}</button>
//           <button onClick={async () => {
//              toast.dismiss(toastT.id);
//              await fetch(`/api/jobs/${id}`, { method: "DELETE" });
//              router.push("/");
//           }} className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600">{t.buttons.confirm}</button>
//         </div>
//        </div>
//     ));
//   };
  
//     // --- Toast Confirmation Helper ---
//   const confirmAction = (message: string, onConfirm: () => Promise<void>) => {
//     toast(
//       (t) => (
//         <div className="flex flex-col gap-3 min-w-[200px]">
//           <span className="font-semibold text-white text-sm">{message}</span>
//           <div className="flex gap-2 justify-end">
//             <button
//               onClick={() => toast.dismiss(t.id)}
//               className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => {
//                 toast.dismiss(t.id);
//                 onConfirm();
//               }}
//               className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//             >
//               Confirm
//             </button>
//           </div>
//         </div>
//       ),
//       { duration: 5000 }
//     );
//   };
  
//   const handleDeletePaymentLog = () => {
//     if (!editingPaymentLog) return;

//     confirmAction("Delete this payment?", async () => {
//       const toastId = toast.loading("Deleting...");
//       try {
//         const res = await fetch(`/api/jobs/${id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ deletePaymentLogId: editingPaymentLog._id }),
//         });
//         if (res.ok) {
//           setRefreshKey((k) => k + 1);
//           closeModals();
//           toast.success("Payment Deleted", { id: toastId });
//         } else throw new Error();
//       } catch (e) {
//         toast.error("Failed to delete", { id: toastId });
//       }
//     });
//   };


//   const toggleComplete = async () => {
//      if (!job) return;
//      const newStatus = job.status === "completed" ? "ongoing" : "completed";
//      await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
//      setRefreshKey(k => k + 1);
//      toast.success(newStatus === "completed" ? t.messages.jobCompleted : t.messages.jobReopened);
//   };

//   if (loading || !job) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse h-10 w-10 bg-gray-200 rounded-full" /></div>;

//   const total = Math.round(job.totalAmount || 0);
//   const paid = Math.round(job.paidAmount || 0);
//   const pendingAmount = total - paid;
//   const isCompleted = job.status === "completed";

//   return (
//     <div className="min-h-screen bg-gray-50/50 pb-40 overflow-x-hidden">
//       {/* --- HEADER --- */}
//       <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-5 pt-10 pb-4 flex justify-between items-center shadow-sm">
//         <div className="flex items-center gap-3 min-w-0">
//           <Link href="/">
//             <button className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200 transition"><ArrowLeft size={20} /></button>
//           </Link>
//           <h1 className="text-lg font-bold text-gray-800 truncate">{job.farmerName}</h1>
//         </div>
//         <div className="flex items-center gap-2 shrink-0">
//           <button onClick={toggleLanguage} className="p-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 active:scale-95 transition"><Languages size={18} /></button>
//           <a href={`tel:${job.mobileNumber}`} className="bg-emerald-50 text-emerald-600 p-2 rounded-full border border-emerald-100 active:scale-95 transition"><Phone size={18} /></a>
//           <button onClick={handleDeleteJob} className="bg-red-50 text-red-500 p-2 rounded-full border border-red-100 active:scale-95 transition"><Trash2 size={18} /></button>
//         </div>
//       </header>

//       {/* --- OVERVIEW CARD --- */}
//       <div className="px-4 mt-4">
//         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
//           <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest ${isCompleted ? "bg-emerald-500 text-white" : "bg-yellow-400 text-yellow-900"}`}>
//             {isCompleted ? t.status.completed : t.status.ongoing}
//           </div>
//           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.status.servicesUsed}</p>
//           <h2 className="text-lg font-extrabold text-gray-900 mb-1 leading-tight">{getUniqueServices()}</h2>
//         </div>
//       </div>

//       {/* --- FINANCIAL STATS --- */}
//       <div className="px-4 mt-4 grid grid-cols-3 gap-3">
//         <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
//           <span className="text-[10px] font-bold text-blue-400 uppercase">{t.stats.total}</span>
//           <span className="text-sm font-extrabold text-blue-700 mt-1 truncate w-full">₹{total}</span>
//         </div>
//         <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
//           <span className="text-[10px] font-bold text-emerald-500 uppercase">{t.stats.paid}</span>
//           <span className="text-sm font-extrabold text-emerald-700 mt-1 truncate w-full">₹{paid}</span>
//         </div>
//         <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex flex-col items-center text-center">
//           <span className="text-[10px] font-bold text-red-400 uppercase">{t.stats.pending}</span>
//           <span className="text-sm font-extrabold text-red-600 mt-1 truncate w-full">₹{pendingAmount}</span>
//         </div>
//       </div>

//       {/* --- ACTION BUTTONS --- */}
//       {!isCompleted && (
//         <div className="px-4 mt-6 flex gap-3">
//           <button onClick={() => openAddWorkModal()} className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition flex justify-center items-center gap-2">
//             <Plus size={16} /> {t.buttons.work}
//           </button>
//           <button onClick={() => { setEditingPaymentLog(null); setShowPaymentForm(true); }} className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition flex justify-center items-center gap-2">
//             <IndianRupee size={16} /> {t.buttons.pay}
//           </button>
//         </div>
//       )}

//       {/* --- TABS --- */}
//       <div className="mt-8 px-4">
//         <div className="flex bg-gray-200/60 p-1 rounded-xl mb-4">
//           <button onClick={() => setActiveTab("work")} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "work" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{t.tabs.work}</button>
//           <button onClick={() => setActiveTab("payment")} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "payment" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}>{t.tabs.payment}</button>
//         </div>

//         {/* --- LOGS LIST --- */}
//         <div className="space-y-3 pb-20">
//           {activeTab === "work" ? (
//             Object.keys(groupedWorkLogs).length > 0 ? (
//               // --- GROUPED VIEW (ACCORDION) ---
//               Object.entries(groupedWorkLogs).map(([serviceName, data]) => (
//                 <div key={serviceName} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
//                   {/* Card Header */}
//                   <div 
//                     onClick={() => setExpandedService(expandedService === serviceName ? null : serviceName)}
//                     className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${expandedService === serviceName ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${expandedService === serviceName ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
//                         {serviceName.charAt(0)}
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-gray-900 text-base">{serviceName}</h3>
//                         <p className="text-[11px] text-gray-400 font-medium">
//                           {data.isHourly 
//                              ? `${formatDuration(data.totalTime)} Total` 
//                              : `${Math.round(data.totalCount * 100) / 100} Trips/Units`}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span className="font-extrabold text-gray-800 text-sm">₹{Math.round(data.totalCost)}</span>
//                       {expandedService === serviceName ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
//                     </div>
//                   </div>

//                   {/* Expanded Content */}
//                   {expandedService === serviceName && (
//                     <div className="border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
//                       {/* Add Button Inside Group */}
//                       {!isCompleted && (
//                         <button 
//                           onClick={(e) => { e.stopPropagation(); openAddWorkModal(serviceName); }}
//                           className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 text-xs font-bold border-b border-emerald-100 hover:bg-emerald-100 transition-colors"
//                         >
//                           <Plus size={14} /> Add {serviceName} Work
//                         </button>
//                       )}

//                       {/* Entries List */}
//                       <div className="p-2 space-y-2 bg-gray-50/50">
//                         {data.logs.map((log) => {
//                            const entryRate = log.rate || job.serviceRate;
//                            const entryCost = log.fixedCost ? Number(log.fixedCost) : (log.hoursWorked || 0) * entryRate;
//                            const tripCount = log.fixedCost ? Number(log.fixedCost) / entryRate : 0;
                           
//                            return (
//                              <div key={log._id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-start relative group">
//                                 <button onClick={() => openEditWorkLog(log)} className="absolute top-2 right-2 text-gray-300 hover:text-gray-600 p-1.5"><Pencil size={14} /></button>
//                                 <div className="flex gap-3">
//                                   <div className="mt-1">
//                                     <p className="text-xs font-bold text-gray-600">{formatDate(log.date)}</p>
//                                     <p className="text-[10px] text-gray-400 mt-0.5">
//                                       {log.startTime ? `${formatTime(log.startTime)} - ${formatTime(log.endTime || "")}` : `Fixed (@${entryRate})`}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="text-right pr-6">
//                                   <p className="text-sm font-bold text-gray-900">₹{Math.round(entryCost)}</p>
//                                   <p className="text-[10px] text-gray-500">
//                                     {log.hoursWorked ? formatDuration(log.hoursWorked) : `${Math.round(tripCount * 100)/100} Trips`}
//                                   </p>
//                                 </div>
//                              </div>
//                            );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : <p className="text-center text-xs text-gray-400 py-4">{t.empty.work}</p>
//           ) : (
//             // --- PAYMENT TAB (UNCHANGED) ---
//             job.paymentLogs?.length > 0 ? (
//               job.paymentLogs.map((log: PaymentLog) => (
//                 <div key={log._id} className="bg-white p-4 rounded-2xl border border-emerald-100 flex justify-between items-center relative overflow-hidden">
//                   <button onClick={() => openEditPaymentLog(log)} className="absolute top-3 right-3 text-emerald-200 hover:text-emerald-500 p-2 z-10 transition-colors"><Pencil size={16} /></button>
//                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
//                   <div className="flex items-center gap-3 pl-2">
//                     <div>
//                       <p className="font-extrabold text-emerald-700 text-base">₹{Math.round(Number(log.amount))}</p>
//                       <p className="text-[11px] text-gray-400 font-medium">{formatDate(log.date)}</p>
//                     </div>
//                   </div>
//                   <div className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold max-w-[120px] truncate mr-8">{log.note || "Cash"}</div>
//                 </div>
//               ))
//             ) : <p className="text-center text-xs text-gray-400 py-4">{t.empty.payment}</p>
//           )}
//         </div>
//       </div>
      
//       {/* Bottom Bar Buttons */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
//         {isCompleted ? (
//           <div className="flex gap-3">
//             <button onClick={toggleComplete} className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold text-sm active:scale-95 transition">{t.buttons.reopen}</button>
//             <button onClick={handleWhatsAppShare} className="flex-[2] bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition"><Share2 size={16} /> {t.buttons.share}</button>
//           </div>
//         ) : (
//           <button onClick={toggleComplete} className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition"><CheckCircle size={18} className="text-emerald-400" /> {t.buttons.finish}</button>
//         )}
//       </div>

//       {/* --- MODAL: WORK ENTRY --- */}
//       {showEntryForm && (
//         <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//           <div className="absolute inset-0" onClick={closeModals}></div>
//           <div className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                 <div className="bg-gray-100 p-2 rounded-full"><Clock size={18} /></div>
//                 {editingWorkLog ? t.forms.work.editTitle : t.forms.work.addTitle}
//               </h3>
//               <div className="flex gap-2">
//                 {editingWorkLog && <button onClick={handleDeleteWorkLog} className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition"><Trash2 size={18} /></button>}
//                 <button onClick={closeModals} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"><X size={18} /></button>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex gap-3">
//                 <div className="flex-1">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{t.forms.work.date}</label>
//                   <input type="date" className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none" value={entryData.date} onChange={(e) => setEntryData({ ...entryData, date: e.target.value })} />
//                 </div>
//                 <div className="flex-[1.5]">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{t.forms.work.service}</label>
//                   <div className="relative">
//                     <select className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none appearance-none" value={entryData.serviceName} onChange={handleServiceChange}>
//                       <option value={job?.serviceName}>{job?.serviceName}</option>
//                       {services.filter((s) => s.name !== job?.serviceName).map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
//                     </select>
//                     <ChevronDown size={14} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
//                   </div>
//                 </div>
//               </div>

//               {isHourly ? (
//                 <div className="flex gap-3">
//                   <div className="flex-1">
//                     <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{t.forms.work.startTime}</label>
//                     <input type="time" className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none" value={entryData.startTime} onChange={(e) => setEntryData({ ...entryData, startTime: e.target.value })} />
//                   </div>
//                   <div className="flex-1">
//                     <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{t.forms.work.endTime}</label>
//                     <input type="time" className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none" value={entryData.endTime} onChange={(e) => setEntryData({ ...entryData, endTime: e.target.value })} />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex gap-3">
//                   <div className="flex-1">
//                     <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{t.forms.work.qty}</label>
//                     <div className="relative">
//                       <span className="absolute left-3 top-3 text-gray-400"><Hash size={16} /></span>
//                       <input type="number" placeholder="e.g. 2" className="w-full pl-9 p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all" value={entryData.quantity} onChange={(e) => setEntryData({ ...entryData, quantity: e.target.value })} />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{isHourly ? t.forms.work.rateHourly : t.forms.work.rateFixed}</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-3 text-gray-400 text-xs">₹</span>
//                   <input type="number" className="w-full pl-6 p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none" value={entryData.rate} onChange={(e) => setEntryData({ ...entryData, rate: e.target.value })} />
//                 </div>
//               </div>

//               {(isHourly ? entryData.hoursWorked > 0 : Number(entryData.quantity) > 0) && (
//                 <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
//                   <span className="text-xs font-bold text-emerald-600">
//                     {isHourly ? `${t.forms.work.duration}: ${formatDuration(entryData.hoursWorked)}` : `${t.forms.work.total}: ${entryData.quantity} ${t.units.trips} x ${entryData.rate}`}
//                   </span>
//                   <span className="text-sm font-extrabold text-emerald-700">₹{isHourly ? Math.round(entryData.hoursWorked * Number(entryData.rate)) : Math.round(Number(entryData.quantity) * Number(entryData.rate))}</span>
//                 </div>
//               )}

//               <button onClick={handleSaveEntry} className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition">
//                 {editingWorkLog ? t.forms.work.update : t.forms.work.save}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: PAYMENT ENTRY --- */}
//       {showPaymentForm && (
//         <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//           <div className="absolute inset-0" onClick={closeModals}></div>
//           <div className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl border border-emerald-100">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
//                 <div className="bg-emerald-50 p-2 rounded-full"><Banknote size={18} className="text-emerald-600" /></div>
//                 {editingPaymentLog ? t.forms.payment.editTitle : t.forms.payment.addTitle}
//               </h3>
//               <div className="flex gap-2">
//                 {editingPaymentLog && <button onClick={handleDeletePaymentLog} className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition"><Trash2 size={18} /></button>}
//                 <button onClick={closeModals} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"><X size={18} /></button>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <input type="date" className="w-full p-3 bg-emerald-50/30 rounded-xl font-bold text-sm outline-none" value={paymentData.date} onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })} />
//               <input type="number" placeholder={t.forms.payment.amount} className="w-full p-3 bg-emerald-50/30 rounded-xl font-bold text-lg text-emerald-700 outline-none placeholder:text-emerald-300/50" value={paymentData.amount} onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })} />
//               <input type="text" placeholder={t.forms.payment.note} className="w-full p-3 bg-emerald-50/30 rounded-xl font-medium text-sm outline-none" value={paymentData.note} onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })} />
//               <button onClick={handleSavePayment} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition">{editingPaymentLog ? t.forms.payment.update : t.forms.payment.save}</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Share2,
  CheckCircle,
  Clock,
  IndianRupee,
  Plus,
  Banknote,
  Trash2,
  X,
  Pencil,
  ChevronDown,
  ChevronUp,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";

import { useLanguage } from "@/context/LanguageContext"; 
import { jobDetailsContent } from "@/data/translations";

const OWNER_NAME = "Sanjay Chouriya";

interface Service {
  _id: string;
  name: string;
  price: number;
  rateType: "hourly" | "fixed";
}

interface WorkLog {
  _id: string;
  date: string;
  startTime?: string;
  endTime?: string;
  hoursWorked?: number;
  fixedCost?: string | number;
  serviceName?: string;
  rate?: number;
}

interface PaymentLog {
  _id: string;
  date: string;
  amount: string | number;
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
  status: "ongoing" | "completed";
  mobileNumber: string;
  workLogs: WorkLog[];
  paymentLogs: PaymentLog[];
}

interface EntryFormState {
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  fixedCost: string;
  serviceName: string;
  rate: string;
  quantity: string;
}

interface PaymentFormState {
  amount: string;
  date: string;
  note: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { lang, toggleLanguage } = useLanguage();

  const [job, setJob] = useState<Job | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [activeTab, setActiveTab] = useState<"work" | "payment">("work");
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [editingWorkLog, setEditingWorkLog] = useState<WorkLog | null>(null);
  const [editingPaymentLog, setEditingPaymentLog] = useState<PaymentLog | null>(null);

  const [entryData, setEntryData] = useState<EntryFormState>({
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    hoursWorked: 0,
    fixedCost: "",
    serviceName: "",
    rate: "",
    quantity: "",
  });

  const [paymentData, setPaymentData] = useState<PaymentFormState>({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const t = jobDetailsContent[lang];


  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await fetch(`/api/jobs/${id}`);
        if (!jobRes.ok) {
          toast.error(t.messages.failed);
          router.push("/");
          return;
        }
        const jobData: Job = await jobRes.json();
        setJob(jobData);

        if (!editingWorkLog) {
          setEntryData((prev) => ({
            ...prev,
            serviceName: jobData.serviceName,
            rate: jobData.serviceRate.toString(),
          }));
        }

        const servRes = await fetch("/api/services");
        const servData = await servRes.json();
        if (Array.isArray(servData)) setServices(servData);
      } catch (error) {
        toast.error(t.messages.failed);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, refreshKey, router, lang]); 

  // --- Grouping Logic ---
  const groupedWorkLogs = useMemo(() => {
    if (!job?.workLogs) return {};

    const groups: Record<string, { 
      logs: WorkLog[], 
      totalCost: number, 
      totalTime: number, 
      totalCount: number,
      isHourly: boolean 
    }> = {};

    job.workLogs.forEach(log => {
      const name = log.serviceName || job.serviceName;
      const rate = log.rate || job.serviceRate;
      const logCost = log.fixedCost ? Number(log.fixedCost) : (log.hoursWorked || 0) * rate;
      const isFixed = !!log.fixedCost;

      if (!groups[name]) {
        groups[name] = { logs: [], totalCost: 0, totalTime: 0, totalCount: 0, isHourly: !isFixed };
      }

      groups[name].logs.push(log);
      groups[name].totalCost += logCost;
      groups[name].totalTime += log.hoursWorked || 0;
      
      if (isFixed && rate > 0) {
        groups[name].totalCount += logCost / rate;
      }
    });

    Object.keys(groups).forEach(key => {
      groups[key].logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    return groups;
  }, [job?.workLogs]);

  // --- Formatters ---
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const locale = lang === "hi" ? "hi-IN" : "en-GB";
    return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "2-digit" });
  };

  const formatDuration = (decimalHours: number) => {
    if (!decimalHours) return `0 ${t.units.min}`;
    const totalMins = Math.round(decimalHours * 60);
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h === 0) return `${m} ${t.units.min}`;
    if (m === 0) return `${h} ${t.units.hrs}`;
    return `${h} ${t.units.hr} ${m} ${t.units.min}`;
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const getUniqueServices = () => {
    if (!job) return "";
    return Object.keys(groupedWorkLogs).join(", ");
  };

  // --- Helpers ---
  const getSelectedServiceType = () => {
    if (!entryData.serviceName || !job) return "hourly";
    if (entryData.serviceName === job.serviceName) return job.rateType;
    const foundService = services.find((s) => s.name === entryData.serviceName);
    return foundService ? foundService.rateType : "hourly";
  };
  const isHourly = getSelectedServiceType() === "hourly";

  // --- Effects for Calculation ---
  useEffect(() => {
    if (isHourly && entryData.startTime && entryData.endTime) {
      const start = new Date(`2000-01-01T${entryData.startTime}`);
      const end = new Date(`2000-01-01T${entryData.endTime}`);
      let diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
      if (diff < 0) diff = 0;
      setEntryData((prev) => ({ ...prev, hoursWorked: Number(diff.toFixed(2)) }));
    }
  }, [entryData.startTime, entryData.endTime, isHourly]);

  useEffect(() => {
    if (!isHourly && entryData.quantity && entryData.rate) {
      const totalCost = Number(entryData.quantity) * Number(entryData.rate);
      setEntryData((prev) => ({ ...prev, fixedCost: totalCost.toString() }));
    }
  }, [entryData.quantity, entryData.rate, isHourly]);

  // --- Handlers ---
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selectedService = services.find((s) => s.name === selectedName);
    const rate = selectedService ? selectedService.price.toString() : (selectedName === job?.serviceName ? job.serviceRate.toString() : "");

    setEntryData((prev) => ({
      ...prev,
      serviceName: selectedName,
      rate: rate,
      quantity: "", startTime: "", endTime: "", fixedCost: "",
    }));
  };

  const openAddWorkModal = (preSelectedService?: string) => {
    setEditingWorkLog(null);
    const defaultService = preSelectedService || job?.serviceName || "";
    const foundService = services.find(s => s.name === defaultService);
    const defaultRate = foundService ? foundService.price.toString() : (defaultService === job?.serviceName ? job.serviceRate.toString() : "");

    setEntryData({
      date: new Date().toISOString().split("T")[0],
      startTime: "", endTime: "", hoursWorked: 0, fixedCost: "",
      serviceName: defaultService,
      rate: defaultRate,
      quantity: "",
    });
    setShowEntryForm(true);
  };

  const openEditWorkLog = (log: WorkLog) => {
    setEditingWorkLog(log);
    const logRate = log.rate || job?.serviceRate || 0;
    const logCost = log.fixedCost ? Number(log.fixedCost) : 0;
    const calculatedQty = logCost && logRate ? (logCost / logRate).toString() : "";

    setEntryData({
      date: log.date ? new Date(log.date).toISOString().split("T")[0] : "",
      startTime: log.startTime || "", endTime: log.endTime || "", hoursWorked: log.hoursWorked || 0,
      fixedCost: log.fixedCost?.toString() || "",
      serviceName: log.serviceName || job?.serviceName || "",
      rate: logRate.toString(),
      quantity: calculatedQty,
    });
    setShowEntryForm(true);
  };

  const openEditPaymentLog = (log: PaymentLog) => {
    setEditingPaymentLog(log);
    setPaymentData({
      date: log.date ? new Date(log.date).toISOString().split("T")[0] : "",
      amount: log.amount.toString(),
      note: log.note || "",
    });
    setShowPaymentForm(true);
  };

  const closeModals = () => {
    setShowEntryForm(false);
    setShowPaymentForm(false);
    setEditingWorkLog(null);
    setEditingPaymentLog(null);
  };

  // --- API Handlers ---
  const handleSaveEntry = async () => {
    if (!entryData.date) return toast.error(t.messages.dateReq);
    const finalServiceName = entryData.serviceName || job?.serviceName;
    const toastId = toast.loading(editingWorkLog ? t.messages.updating : t.messages.saving);

    let finalFixedCost = entryData.fixedCost;
    let finalHours = Number(entryData.hoursWorked);

    if (!isHourly) {
      finalFixedCost = (Number(entryData.quantity) * Number(entryData.rate)).toString();
      finalHours = 0;
    } else {
      finalFixedCost = "";
    }

    const logData = { ...entryData, serviceName: finalServiceName, hoursWorked: finalHours, rate: Number(entryData.rate), fixedCost: finalFixedCost };
    const payload: any = editingWorkLog ? { updateWorkLog: { _id: editingWorkLog._id, ...logData } } : { newLog: logData };

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        setRefreshKey((k) => k + 1);
        closeModals();
        toast.success(editingWorkLog ? t.messages.entryUpdated : t.messages.entryAdded, { id: toastId });
      } else throw new Error();
    } catch (e) { toast.error(t.messages.failed, { id: toastId }); }
  };

  const handleSavePayment = async () => {
    if (!paymentData.amount) return toast.error(t.messages.enterAmount);
    const amountNum = Number(paymentData.amount);
    const pendingAmount = (job?.totalAmount || 0) - (job?.paidAmount || 0);

    if (!editingPaymentLog && amountNum > pendingAmount) {
      return toast.error(`${t.messages.exceedAmount} (₹${Math.round(pendingAmount)})`);
    }

    const toastId = toast.loading(editingPaymentLog ? t.messages.updating : t.messages.saving);
    const payload: any = editingPaymentLog ? { updatePaymentLog: { _id: editingPaymentLog._id, ...paymentData } } : { newPayment: paymentData };

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        setRefreshKey((k) => k + 1);
        closeModals();
        toast.success(editingPaymentLog ? t.messages.paymentUpdated : t.messages.paymentSaved, { id: toastId });
      } else throw new Error();
    } catch (e) { toast.error(t.messages.failed, { id: toastId }); }
  };

  const confirmAction = (message: string, onConfirm: () => Promise<void>) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[200px]">
        <span className="font-semibold text-white text-sm">{message}</span>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">{jobDetailsContent[lang].buttons.cancel}</button>
          <button onClick={() => { toast.dismiss(t.id); onConfirm(); }} className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600">{jobDetailsContent[lang].buttons.confirm}</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleDeleteWorkLog = () => {
    if (!editingWorkLog) return;
    confirmAction(t.messages.deleteWorkConfirm, async () => {
      const toastId = toast.loading(t.messages.deleting);
      try {
        const res = await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deleteWorkLogId: editingWorkLog._id }) });
        if (res.ok) {
          setRefreshKey(k => k + 1); closeModals(); toast.success(t.messages.entryDeleted, { id: toastId });
        } else throw new Error();
      } catch (e) { toast.error(t.messages.failed, { id: toastId }); }
    });
  };

  const handleDeletePaymentLog = () => {
    if (!editingPaymentLog) return;
    confirmAction(t.messages.deleteWorkConfirm, async () => { 
      const toastId = toast.loading(t.messages.deleting);
      try {
        const res = await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deletePaymentLogId: editingPaymentLog._id }) });
        if (res.ok) {
          setRefreshKey(k => k + 1); closeModals(); toast.success(t.messages.entryDeleted, { id: toastId });
        } else throw new Error();
      } catch (e) { toast.error(t.messages.failed, { id: toastId }); }
    });
  };

  const handleWhatsAppShare = () => {
    if (!job) return;
    const summary = Object.entries(groupedWorkLogs).map(([name, data]) => ({name, cost: data.totalCost, time: data.totalTime, count: data.totalCount, isHourly: data.isHourly}));
    
    const total = Math.round(job.totalAmount || 0);
    const paid = Math.round(job.paidAmount || 0);
    const pending = total - paid;

    let text = `नमस्ते *${job.farmerName}* जी,\nमैं *${OWNER_NAME}* हूँ।\n\n`;
    text += `कार्य विवरण:\n\n`;

    summary.forEach((s) => {
      const amount = Math.round(s.cost);
      if (s.isHourly && s.time > 0) {
        text += ` *${s.name}* ${formatDuration(s.time)} तक चला, जिसका भुगतान *₹${amount}* है।\n`;
      } else {
        const tripCount = Math.round(s.count * 100) / 100;
        text += ` *${s.name}* (${tripCount} Trips/Unit), जिसका भुगतान *₹${amount}* है।\n`;
      }
    });

    text += `\n------------------\n`;
    text += ` *कुल राशि: ₹${total}*\n`;
    if (paid > 0) text += `*जमा राशि: ₹${paid}*\n`;
    text += `*शेष राशि: ₹${pending}*\n`;
    text += `------------------\n\nकृपया शेष भुगतान शीघ्र करें।\nधन्यवाद।`;

    window.open(`https://wa.me/91${job.mobileNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleDeleteJob = () => {
    confirmAction(t.messages.deleteJobConfirm, async () => {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      router.push("/");
    });
  };

  const toggleComplete = async () => {
     if (!job) return;
     const newStatus = job.status === "completed" ? "ongoing" : "completed";
     await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
     setRefreshKey(k => k + 1);
     toast.success(newStatus === "completed" ? t.messages.jobCompleted : t.messages.jobReopened);
  };

  if (loading || !job) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse h-10 w-10 bg-gray-200 rounded-full" /></div>;

  const total = Math.round(job.totalAmount || 0);
  const paid = Math.round(job.paidAmount || 0);
  const pendingAmount = total - paid;
  const isCompleted = job.status === "completed";

  return (
    <div className="min-h-screen bg-gray-50/50 pb-40 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-5 pt-10 pb-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/">
            <button className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200 transition"><ArrowLeft size={20} /></button>
          </Link>
          <h1 className="text-lg font-bold text-gray-800 truncate">{job.farmerName}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a href={`tel:${job.mobileNumber}`} className="bg-emerald-50 text-emerald-600 p-2 rounded-full border border-emerald-100 active:scale-95 transition"><Phone size={18} /></a>
          <button onClick={handleDeleteJob} className="bg-red-50 text-red-500 p-2 rounded-full border border-red-100 active:scale-95 transition"><Trash2 size={18} /></button>
        </div>
      </header>

      {/* Overview Card */}
      <div className="px-4 mt-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest ${isCompleted ? "bg-emerald-500 text-white" : "bg-yellow-400 text-yellow-900"}`}>
            {isCompleted ? t.status.completed : t.status.ongoing}
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.status.servicesUsed}</p>
          <h2 className="text-lg font-extrabold text-gray-900 mb-1 leading-tight">{getUniqueServices()}</h2>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-3">
        <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-blue-400 uppercase">{t.stats.total}</span>
          <span className="text-sm font-extrabold text-blue-700 mt-1 truncate w-full">₹{total}</span>
        </div>
        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-emerald-500 uppercase">{t.stats.paid}</span>
          <span className="text-sm font-extrabold text-emerald-700 mt-1 truncate w-full">₹{paid}</span>
        </div>
        <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-red-400 uppercase">{t.stats.pending}</span>
          <span className="text-sm font-extrabold text-red-600 mt-1 truncate w-full">₹{pendingAmount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {!isCompleted && (
        <div className="px-4 mt-6 flex gap-3">
          <button onClick={() => openAddWorkModal()} className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition flex justify-center items-center gap-2">
            <Plus size={16} /> {t.buttons.work}
          </button>
          <button onClick={() => { setEditingPaymentLog(null); setShowPaymentForm(true); }} className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition flex justify-center items-center gap-2">
            <IndianRupee size={16} /> {t.buttons.pay}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-8 px-4">
        <div className="flex bg-gray-200/60 p-1 rounded-xl mb-4">
          <button onClick={() => setActiveTab("work")} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "work" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{t.tabs.work}</button>
          <button onClick={() => setActiveTab("payment")} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "payment" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}>{t.tabs.payment}</button>
        </div>

        {/* Logs List */}
        <div className="space-y-3 pb-20">
          {activeTab === "work" ? (
            Object.keys(groupedWorkLogs).length > 0 ? (
              Object.entries(groupedWorkLogs).map(([serviceName, data]) => (
                <div key={serviceName} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                  {/* Card Header */}
                  <div 
                    onClick={() => setExpandedService(expandedService === serviceName ? null : serviceName)}
                    className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${expandedService === serviceName ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${expandedService === serviceName ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {serviceName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{serviceName}</h3>
                        <p className="text-[11px] text-gray-400 font-medium">
                          {data.isHourly 
                             ? `${formatDuration(data.totalTime)} Total` 
                             : `${Math.round(data.totalCount * 100) / 100} Trips/Units`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-gray-800 text-sm">₹{Math.round(data.totalCost)}</span>
                      {expandedService === serviceName ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedService === serviceName && (
                    <div className="border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                      {!isCompleted && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); openAddWorkModal(serviceName); }}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 text-xs font-bold border-b border-emerald-100 hover:bg-emerald-100 transition-colors"
                        >
                          <Plus size={14} /> Add {serviceName} Work
                        </button>
                      )}

                      <div className="p-2 space-y-2 bg-gray-50/50">
                        {data.logs.map((log) => {
                           const entryRate = log.rate || job.serviceRate;
                           const entryCost = log.fixedCost ? Number(log.fixedCost) : (log.hoursWorked || 0) * entryRate;
                           const tripCount = log.fixedCost ? Number(log.fixedCost) / entryRate : 0;
                           
                           return (
                             <div key={log._id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-start relative group">
                                <button onClick={() => openEditWorkLog(log)} className="absolute top-2 right-2 text-gray-300 hover:text-gray-600 p-1.5"><Pencil size={14} /></button>
                                <div className="flex gap-3">
                                  <div className="mt-1">
                                    <p className="text-xs font-bold text-gray-600">{formatDate(log.date)}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                      {log.startTime ? `${formatTime(log.startTime)} - ${formatTime(log.endTime || "")}` : `Fixed (@${entryRate})`}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right pr-6">
                                  <p className="text-sm font-bold text-gray-900">₹{Math.round(entryCost)}</p>
                                  <p className="text-[10px] text-gray-500">
                                    {log.hoursWorked ? formatDuration(log.hoursWorked) : `${Math.round(tripCount * 100)/100} ${t.units.trips}`}
                                  </p>
                                </div>
                             </div>
                           );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : <p className="text-center text-xs text-gray-400 py-4">{t.empty.work}</p>
          ) : (
            job.paymentLogs?.length > 0 ? (
              job.paymentLogs.map((log: PaymentLog) => (
                <div key={log._id} className="bg-white p-4 rounded-2xl border border-emerald-100 flex justify-between items-center relative overflow-hidden">
                  <button onClick={() => openEditPaymentLog(log)} className="absolute top-3 right-3 text-emerald-200 hover:text-emerald-500 p-2 z-10 transition-colors"><Pencil size={16} /></button>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
                  <div className="flex items-center gap-3 pl-2">
                    <div>
                      <p className="font-extrabold text-emerald-700 text-base">₹{Math.round(Number(log.amount))}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{formatDate(log.date)}</p>
                    </div>
                  </div>
                  <div className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold max-w-[120px] truncate mr-8">{log.note || "Cash"}</div>
                </div>
              ))
            ) : <p className="text-center text-xs text-gray-400 py-4">{t.empty.payment}</p>
          )}
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
        {isCompleted ? (
          <div className="flex gap-3">
            <button onClick={toggleComplete} className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold text-sm active:scale-95 transition">{t.buttons.reopen}</button>
            <button onClick={handleWhatsAppShare} className="flex-[2] bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition"><Share2 size={16} /> {t.buttons.share}</button>
          </div>
        ) : (
          <button onClick={toggleComplete} className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition"><CheckCircle size={18} className="text-emerald-400" /> {t.buttons.finish}</button>
        )}
      </div>

      {/* Entry Form Modal */}
      {showEntryForm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={closeModals}></div>
          <div className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded-full"><Clock size={18} /></div>
                {editingWorkLog ? t.forms.work.editTitle : t.forms.work.addTitle}
              </h3>
              <div className="flex gap-2">
                {editingWorkLog && <button onClick={handleDeleteWorkLog} className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition"><Trash2 size={18} /></button>}
                <button onClick={closeModals} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"><X size={18} /></button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{t.forms.work.date}</label>
                  <input type="date" className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none" value={entryData.date} onChange={(e) => setEntryData({ ...entryData, date: e.target.value })} />
                </div>
                <div className="flex-[1.5]">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{t.forms.work.service}</label>
                  <div className="relative">
                    <select className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none appearance-none" value={entryData.serviceName} onChange={handleServiceChange}>
                      <option value={job?.serviceName}>{job?.serviceName}</option>
                      {services.filter((s) => s.name !== job?.serviceName).map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {isHourly ? (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{t.forms.work.startTime}</label>
                    <input type="time" className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none" value={entryData.startTime} onChange={(e) => setEntryData({ ...entryData, startTime: e.target.value })} />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{t.forms.work.endTime}</label>
                    <input type="time" className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none" value={entryData.endTime} onChange={(e) => setEntryData({ ...entryData, endTime: e.target.value })} />
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{t.forms.work.qty}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400"><Hash size={16} /></span>
                      <input type="number" placeholder="e.g. 2" className="w-full pl-9 p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all" value={entryData.quantity} onChange={(e) => setEntryData({ ...entryData, quantity: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">{isHourly ? t.forms.work.rateHourly : t.forms.work.rateFixed}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-xs">₹</span>
                  <input type="number" className="w-full pl-6 p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none" value={entryData.rate} onChange={(e) => setEntryData({ ...entryData, rate: e.target.value })} />
                </div>
              </div>

              {(isHourly ? entryData.hoursWorked > 0 : Number(entryData.quantity) > 0) && (
                <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-600">
                    {isHourly ? `${t.forms.work.duration}: ${formatDuration(entryData.hoursWorked)}` : `${t.forms.work.total}: ${entryData.quantity} ${t.units.trips} x ${entryData.rate}`}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700">₹{isHourly ? Math.round(entryData.hoursWorked * Number(entryData.rate)) : Math.round(Number(entryData.quantity) * Number(entryData.rate))}</span>
                </div>
              )}

              <button onClick={handleSaveEntry} className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition">
                {editingWorkLog ? t.forms.work.update : t.forms.work.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={closeModals}></div>
          <div className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl border border-emerald-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                <div className="bg-emerald-50 p-2 rounded-full"><Banknote size={18} className="text-emerald-600" /></div>
                {editingPaymentLog ? t.forms.payment.editTitle : t.forms.payment.addTitle}
              </h3>
              <div className="flex gap-2">
                {editingPaymentLog && <button onClick={handleDeletePaymentLog} className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition"><Trash2 size={18} /></button>}
                <button onClick={closeModals} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"><X size={18} /></button>
              </div>
            </div>
            <div className="space-y-4">
              <input type="date" className="w-full p-3 bg-emerald-50/30 rounded-xl font-bold text-sm outline-none" value={paymentData.date} onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })} />
              <input type="number" placeholder={t.forms.payment.amount} className="w-full p-3 bg-emerald-50/30 rounded-xl font-bold text-lg text-emerald-700 outline-none placeholder:text-emerald-300/50" value={paymentData.amount} onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })} />
              <input type="text" placeholder={t.forms.payment.note} className="w-full p-3 bg-emerald-50/30 rounded-xl font-medium text-sm outline-none" value={paymentData.note} onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })} />
              <button onClick={handleSavePayment} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition">{editingPaymentLog ? t.forms.payment.update : t.forms.payment.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}