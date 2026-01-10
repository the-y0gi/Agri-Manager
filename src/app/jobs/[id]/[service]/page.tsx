// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { ArrowLeft, Clock, Calendar, Plus, Trash2, X, Pencil, Hash } from "lucide-react";
// import toast from "react-hot-toast";
// import { jobDetailsContent } from "@/data/translations";

// export default function ServiceDetailPage() {
//   const params = useParams();
//   const id = params?.id as string;
//   // Decode URL (e.g., Rotavator%20Machine -> Rotavator Machine)
//   const serviceName = decodeURIComponent(params?.service as string);
//   const router = useRouter();

//   const [lang, setLang] = useState<"en" | "hi">("hi");
//   const [logs, setLogs] = useState<any[]>([]);
//   const [job, setJob] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingLog, setEditingLog] = useState<any>(null);
//   const [refreshKey, setRefreshKey] = useState(0);

//   // Form State
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split("T")[0],
//     startTime: "", endTime: "", hoursWorked: 0,
//     quantity: "", fixedCost: "", rate: "",
//   });

//   const t = jobDetailsContent[lang];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`/api/jobs/${id}`);
//         const data = await res.json();
//         setJob(data);
        
//         // Filter logs only for THIS service
//         const filteredLogs = data.workLogs.filter((log: any) => 
//            (log.serviceName || data.serviceName) === serviceName
//         ).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
//         setLogs(filteredLogs);

//         // Set default rate if not editing
//         if(!editingLog) {
//            // Find rate from job or service list logic here if needed
//            // For now using current job rate if name matches, or we'd need to fetch services list.
//            // Assuming simplistic approach:
//            setFormData(prev => ({...prev, rate: data.serviceName === serviceName ? data.serviceRate : prev.rate}));
//         }
//       } catch (e) { toast.error("Error loading"); } 
//       finally { setLoading(false); }
//     };
//     fetchData();
//   }, [id, serviceName, refreshKey]);

//   // Determine if this service is predominantly hourly or fixed based on first log or job type
//   const isHourly = job ? (job.serviceName === serviceName ? job.rateType === 'hourly' : !logs[0]?.fixedCost) : true;

//   // --- Effects for Auto-Calc ---
//   useEffect(() => {
//     if (isHourly && formData.startTime && formData.endTime) {
//       const start = new Date(`2000-01-01T${formData.startTime}`);
//       const end = new Date(`2000-01-01T${formData.endTime}`);
//       let diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
//       if (diff < 0) diff = 0;
//       setFormData(p => ({ ...p, hoursWorked: Number(diff.toFixed(2)) }));
//     }
//   }, [formData.startTime, formData.endTime, isHourly]);

//   const handleSubmit = async () => {
//     const toastId = toast.loading("Saving...");
    
//     let finalFixed = "";
//     let finalHours = Number(formData.hoursWorked);

//     if(!isHourly) {
//        finalFixed = (Number(formData.quantity) * Number(formData.rate)).toString();
//        finalHours = 0;
//     }

//     const payload = {
//        date: formData.date,
//        startTime: formData.startTime, endTime: formData.endTime,
//        hoursWorked: finalHours,
//        fixedCost: finalFixed,
//        rate: Number(formData.rate),
//        serviceName: serviceName // Force this service name
//     };

//     const body: any = editingLog 
//       ? { updateWorkLog: { _id: editingLog._id, ...payload } } 
//       : { newLog: payload };

//     try {
//       const res = await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
//       if(res.ok) {
//         setRefreshKey(k => k+1); setShowModal(false); toast.success("Saved", {id: toastId});
//       } else throw new Error();
//     } catch(e) { toast.error("Failed", {id: toastId}); }
//   };

//   const handleDelete = async () => {
//     if(!editingLog || !confirm("Delete this entry?")) return;
//     await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deleteWorkLogId: editingLog._id }) });
//     setRefreshKey(k => k+1); setShowModal(false); toast.success("Deleted");
//   };

//   const openAdd = () => {
//     setEditingLog(null);
//     setFormData({ date: new Date().toISOString().split("T")[0], startTime: "", endTime: "", hoursWorked: 0, quantity: "", fixedCost: "", rate: job?.serviceRate || "" });
//     setShowModal(true);
//   };

//   const openEdit = (log: any) => {
//     setEditingLog(log);
//     const rate = log.rate || job?.serviceRate;
//     const cost = log.fixedCost ? Number(log.fixedCost) : 0;
//     const qty = cost && rate ? (cost/rate).toString() : "";
    
//     setFormData({
//       date: log.date.split("T")[0],
//       startTime: log.startTime || "", endTime: log.endTime || "",
//       hoursWorked: log.hoursWorked || 0,
//       fixedCost: log.fixedCost || "",
//       rate: rate,
//       quantity: qty
//     });
//     setShowModal(true);
//   };

//   // Formatters
//   const formatDate = (d: string) => new Date(d).toLocaleDateString(lang==="hi"?"hi-IN":"en-GB", {day:"2-digit", month:"short"});
//   const formatTime = (t: string) => {
//      if(!t) return "";
//      const [h, m] = t.split(":");
//      return new Date(2000, 0, 1, Number(h), Number(m)).toLocaleTimeString("en-US", {hour:"numeric", minute:"2-digit"});
//   };

//   if(loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse h-10 w-10 bg-gray-200 rounded-full"/></div>;

//   return (
//     <div className="min-h-screen bg-slate-50 pb-24">
//       {/* Header */}
//       <header className="bg-white sticky top-0 z-30 px-5 pt-10 pb-4 border-b border-gray-100 flex items-center gap-3">
//         <button onClick={() => router.back()} className="bg-gray-100 p-2 rounded-full"><ArrowLeft size={20}/></button>
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">{serviceName}</h1>
//           <p className="text-xs text-gray-500">{job?.farmerName}</p>
//         </div>
//       </header>

//       {/* List */}
//       <div className="p-4 space-y-3">
//         {logs.map((log) => {
//            const rate = log.rate || job?.serviceRate;
//            const cost = log.fixedCost ? Number(log.fixedCost) : (log.hoursWorked * rate);
//            const trip = log.fixedCost ? (Number(log.fixedCost)/rate) : 0;

//            return (
//              <div key={log._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center relative group">
//                <button onClick={() => openEdit(log)} className="absolute top-2 right-2 p-2 text-gray-300 hover:text-gray-600"><Pencil size={16}/></button>
//                <div className="flex gap-4">
//                  <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center text-gray-500"><Calendar size={20}/></div>
//                  <div>
//                    <p className="font-bold text-gray-800">{formatDate(log.date)}</p>
//                    <p className="text-xs text-gray-500 mt-1">
//                      {log.startTime ? `${formatTime(log.startTime)} - ${formatTime(log.endTime)}` : `Fixed @ ₹${rate}`}
//                    </p>
//                  </div>
//                </div>
//                <div className="text-right pr-8">
//                  <p className="font-extrabold text-gray-900">₹{Math.round(cost)}</p>
//                  <p className="text-xs text-gray-500 font-medium">
//                    {log.hoursWorked ? `${log.hoursWorked} hrs` : `${Math.round(trip*100)/100} Trips`}
//                  </p>
//                </div>
//              </div>
//            );
//         })}
//         {logs.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No entries found.</p>}
//       </div>

//       {/* Floating Add Button */}
//       {job?.status !== 'completed' && (
//         <div className="fixed bottom-6 right-6 z-40">
//           <button onClick={openAdd} className="bg-black text-white p-4 rounded-full shadow-xl active:scale-95 transition flex gap-2 font-bold items-center">
//             <Plus size={24}/> Add Work
//           </button>
//         </div>
//       )}

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
//           <div className="bg-white w-full max-w-md rounded-3xl p-6 relative animate-in slide-in-from-bottom-10">
//             <div className="flex justify-between mb-6">
//               <h3 className="font-bold text-lg">{editingLog ? "Edit Entry" : "Add Entry"}</h3>
//               <div className="flex gap-2">
//                 {editingLog && <button onClick={handleDelete} className="bg-red-50 text-red-500 p-2 rounded-full"><Trash2 size={18}/></button>}
//                 <button onClick={() => setShowModal(false)} className="bg-gray-100 p-2 rounded-full"><X size={18}/></button>
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <input type="date" className="w-full p-3 bg-gray-50 rounded-xl font-bold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              
//               {isHourly ? (
//                 <div className="flex gap-3">
//                   <div className="flex-1"><label className="text-[10px] uppercase text-gray-400 font-bold">Start</label><input type="time" className="w-full p-3 bg-gray-50 rounded-xl" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} /></div>
//                   <div className="flex-1"><label className="text-[10px] uppercase text-gray-400 font-bold">End</label><input type="time" className="w-full p-3 bg-gray-50 rounded-xl" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} /></div>
//                 </div>
//               ) : (
//                 <div><label className="text-[10px] uppercase text-gray-400 font-bold">Quantity</label><input type="number" placeholder="Trips" className="w-full p-3 bg-gray-50 rounded-xl font-bold" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} /></div>
//               )}

//               <div><label className="text-[10px] uppercase text-gray-400 font-bold">Rate</label><input type="number" className="w-full p-3 bg-gray-50 rounded-xl font-bold" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} /></div>

//               <button onClick={handleSubmit} className="w-full bg-black text-white py-4 rounded-xl font-bold mt-2">Save Entry</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Plus, Trash2, X, Pencil, Hash, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { jobDetailsContent } from "@/data/translations";

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const serviceName = decodeURIComponent(params?.service as string);
  const router = useRouter();

  const [lang, setLang] = useState<"en" | "hi">("hi");
  
  // Data States
  const [logs, setLogs] = useState<any[]>([]);
  const [job, setJob] = useState<any>(null);
  const [allServices, setAllServices] = useState<any[]>([]); // ✅ Added to check rate type
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    hoursWorked: 0,
    quantity: "", 
    fixedCost: "", 
    rate: "",
  });

  const t = jobDetailsContent[lang];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Job Data
        const jobRes = await fetch(`/api/jobs/${id}`);
        const jobData = await jobRes.json();
        setJob(jobData);
        
        // 2. Fetch All Services (To check rate types)
        const servRes = await fetch("/api/services");
        const servData = await servRes.json();
        if(Array.isArray(servData)) setAllServices(servData);

        // 3. Filter Logs
        const filteredLogs = jobData.workLogs.filter((log: any) => 
           (log.serviceName || jobData.serviceName) === serviceName
        ).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setLogs(filteredLogs);

      } catch (e) { toast.error("Error loading"); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, serviceName, refreshKey]);

  // --- Logic to Determine Service Type (Fixed vs Hourly) ---
  const isHourly = (() => {
    // 1. If editing, check the log itself (if it has fixedCost, it's NOT hourly)
    if (editingLog) return !editingLog.fixedCost;

    // 2. Check if it matches the main job service
    if (job?.serviceName === serviceName) return job.rateType === 'hourly';

    // 3. Check in the global services list
    const foundService = allServices.find(s => s.name === serviceName);
    if (foundService) return foundService.rateType === 'hourly';

    // 4. Default fallback
    return true; 
  })();

  // --- Auto-Calculate Hourly Cost ---
  useEffect(() => {
    if (isHourly && formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      let diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
      if (diff < 0) diff = 0;
      setFormData(p => ({ ...p, hoursWorked: Number(diff.toFixed(2)) }));
    }
  }, [formData.startTime, formData.endTime, isHourly]);

  // --- Auto-Calculate Fixed Cost ---
  useEffect(() => {
    if (!isHourly && formData.quantity && formData.rate) {
      const total = Number(formData.quantity) * Number(formData.rate);
      setFormData(p => ({ ...p, fixedCost: total.toString() }));
    }
  }, [formData.quantity, formData.rate, isHourly]); // ✅ This dependency ensures update

  const handleSubmit = async () => {
    const toastId = toast.loading("Saving...");
    
    let finalFixed = "";
    let finalHours = Number(formData.hoursWorked);

    if(!isHourly) {
       finalFixed = (Number(formData.quantity) * Number(formData.rate)).toString();
       finalHours = 0;
    } else {
       finalFixed = ""; // Reset fixed cost if hourly
    }

    const payload = {
       date: formData.date,
       startTime: formData.startTime, 
       endTime: formData.endTime,
       hoursWorked: finalHours,
       fixedCost: finalFixed,
       rate: Number(formData.rate),
       serviceName: serviceName
    };

    const body: any = editingLog 
      ? { updateWorkLog: { _id: editingLog._id, ...payload } } 
      : { newLog: payload };

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if(res.ok) {
        setRefreshKey(k => k+1); setShowModal(false); toast.success("Saved", {id: toastId});
      } else throw new Error();
    } catch(e) { toast.error("Failed", {id: toastId}); }
  };

  const handleDelete = async () => {
    if(!editingLog || !confirm("Delete this entry?")) return;
    const toastId = toast.loading("Deleting...");
    try {
        await fetch(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deleteWorkLogId: editingLog._id }) });
        setRefreshKey(k => k+1); setShowModal(false); toast.success("Deleted", {id: toastId});
    } catch(e) { toast.error("Failed", {id: toastId}); }
  };

  const openAdd = () => {
    setEditingLog(null);
    
    // Find rate
    let defaultRate = "";
    const foundService = allServices.find(s => s.name === serviceName);
    
    if (job?.serviceName === serviceName) {
        defaultRate = job.serviceRate;
    } else if (foundService) {
        defaultRate = foundService.price;
    }

    setFormData({ 
        date: new Date().toISOString().split("T")[0], 
        startTime: "", endTime: "", hoursWorked: 0, 
        quantity: "", fixedCost: "", 
        rate: defaultRate.toString() 
    });
    setShowModal(true);
  };

  const openEdit = (log: any) => {
    setEditingLog(log);
    const rate = log.rate || job?.serviceRate;
    const cost = log.fixedCost ? Number(log.fixedCost) : 0;
    // Calculate qty if it's missing (Backwards compatibility)
    const qty = (cost && rate) ? (cost/rate).toString() : "";
    
    setFormData({
      date: log.date.split("T")[0],
      startTime: log.startTime || "", endTime: log.endTime || "",
      hoursWorked: log.hoursWorked || 0,
      fixedCost: log.fixedCost || "",
      rate: rate,
      quantity: qty
    });
    setShowModal(true);
  };

  // Formatters
  const formatDate = (d: string) => new Date(d).toLocaleDateString(lang==="hi"?"hi-IN":"en-GB", {day:"2-digit", month:"short"});
  const formatTime = (t: string) => {
     if(!t) return "";
     const [h, m] = t.split(":");
     return new Date(2000, 0, 1, Number(h), Number(m)).toLocaleTimeString("en-US", {hour:"numeric", minute:"2-digit"});
  };

  if(loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" size={32}/></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 px-5 pt-10 pb-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => router.back()} className="bg-gray-100 p-2 rounded-full"><ArrowLeft size={20}/></button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{serviceName}</h1>
          <p className="text-xs text-gray-500">{job?.farmerName}</p>
        </div>
      </header>

      {/* List */}
      <div className="p-4 space-y-3">
        {logs.map((log) => {
           const rate = log.rate || job?.serviceRate;
           const cost = log.fixedCost ? Number(log.fixedCost) : (log.hoursWorked * rate);
           const trip = log.fixedCost ? (Number(log.fixedCost)/rate) : 0;

           return (
             <div key={log._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center relative group">
               <button onClick={() => openEdit(log)} className="absolute top-2 right-2 p-2 text-gray-300 hover:text-gray-600"><Pencil size={16}/></button>
               <div className="flex gap-4">
                 <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center text-gray-500"><Calendar size={20}/></div>
                 <div>
                   <p className="font-bold text-gray-800">{formatDate(log.date)}</p>
                   <p className="text-xs text-gray-500 mt-1">
                     {log.startTime ? `${formatTime(log.startTime)} - ${formatTime(log.endTime)}` : `Fixed @ ₹${rate}`}
                   </p>
                 </div>
               </div>
               <div className="text-right pr-8">
                 <p className="font-extrabold text-gray-900">₹{Math.round(cost)}</p>
                 <p className="text-xs text-gray-500 font-medium">
                   {log.hoursWorked ? `${log.hoursWorked} hrs` : `${Math.round(trip*100)/100} Trips`}
                 </p>
               </div>
             </div>
           );
        })}
        {logs.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No entries found.</p>}
      </div>

      {/* Floating Add Button */}
      {job?.status !== 'completed' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button onClick={openAdd} className="bg-black text-white p-4 rounded-full shadow-xl active:scale-95 transition flex gap-2 font-bold items-center">
            <Plus size={24}/> Add Work
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 relative animate-in slide-in-from-bottom-10">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-lg">{editingLog ? "Edit Entry" : "Add Entry"}</h3>
              <div className="flex gap-2">
                {editingLog && <button onClick={handleDelete} className="bg-red-50 text-red-500 p-2 rounded-full"><Trash2 size={18}/></button>}
                <button onClick={() => setShowModal(false)} className="bg-gray-100 p-2 rounded-full"><X size={18}/></button>
              </div>
            </div>
            
            <div className="space-y-4">
              <input type="date" className="w-full p-3 bg-gray-50 rounded-xl font-bold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              
              {isHourly ? (
                <div className="flex gap-3">
                  <div className="flex-1"><label className="text-[10px] uppercase text-gray-400 font-bold">Start</label><input type="time" className="w-full p-3 bg-gray-50 rounded-xl" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} /></div>
                  <div className="flex-1"><label className="text-[10px] uppercase text-gray-400 font-bold">End</label><input type="time" className="w-full p-3 bg-gray-50 rounded-xl" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} /></div>
                </div>
              ) : (
                <div>
                    <label className="text-[10px] uppercase text-gray-400 font-bold">Quantity (Trips/Units)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400"><Hash size={16}/></span>
                        <input type="number" placeholder="e.g. 5" className="w-full pl-9 p-3 bg-gray-50 rounded-xl font-bold" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                    </div>
                </div>
              )}

              <div>
                  <label className="text-[10px] uppercase text-gray-400 font-bold">Rate</label>
                  <input type="number" className="w-full p-3 bg-gray-50 rounded-xl font-bold" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} />
              </div>

              {/* Total Cost Display inside Modal */}
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-600">Total Cost</span>
                  <span className="text-lg font-extrabold text-emerald-700">
                      ₹{Math.round(isHourly 
                          ? (formData.hoursWorked * Number(formData.rate)) 
                          : (Number(formData.quantity) * Number(formData.rate))
                      )}
                  </span>
              </div>

              <button onClick={handleSubmit} className="w-full bg-black text-white py-4 rounded-xl font-bold mt-2">Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}