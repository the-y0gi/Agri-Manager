// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { ArrowLeft, Plus, Trash2, Wrench, ChevronRight, Loader2, Info } from "lucide-react";
// import toast from "react-hot-toast";

// import BottomNav from "@/components/BottomNav";

// interface Service {
//   _id: string;
//   name: string;
//   rateType: "hourly" | "fixed";
//   price: number;
// }

// export default function SettingsPage() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   const [newService, setNewService] = useState({
//     name: "",
//     rateType: "hourly" as "hourly" | "fixed",
//     price: "",
//   });

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   async function fetchServices() {
//     try {
//       const res = await fetch("/api/services");
//       const data = await res.json();
//       if (Array.isArray(data)) setServices(data);
//     } catch (error) {
//       toast.error("Failed to load settings");
//     } finally {
//       setFetching(false);
//     }
//   }

//   const handleAddService = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!newService.name.trim() || !newService.price.trim()) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     const priceNum = Number(newService.price);
//     if (isNaN(priceNum) || priceNum < 0) {
//       toast.error("Please enter a valid price");
//       return;
//     }
    
//     setLoading(true);
//     const toastId = toast.loading("Adding machine...");

//     try {
//       const res = await fetch("/api/services", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...newService,
//           price: priceNum,
//         }),
//       });

//       if (res.ok) {
//         toast.success("Machine added successfully", { id: toastId });
//         setNewService({ name: "", rateType: "hourly", price: "" });
//         fetchServices();
//       } else {
//         throw new Error();
//       }
//     } catch (error) {
//       toast.error("Error adding machine", { id: toastId });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2 w-full">
//         <span className="font-bold text-white text-sm">Delete this machine?</span>
//         <div className="flex gap-2">
//           <button
//             onClick={() => confirmDelete(id, t.id)}
//             className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition"
//           >
//             Yes, Delete
//           </button>
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     ), { duration: 4000 });
//   };

//   const confirmDelete = async (id: string, toastId: string) => {
//     toast.dismiss(toastId);
//     const loadingToast = toast.loading("Deleting...");

//     try {
//       const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      
//       if (res.ok) {
//         toast.success("Deleted", { id: loadingToast });
//         setServices(prev => prev.filter(s => s._id !== id));
//       } else {
//         throw new Error();
//       }
//     } catch (error) {
//       toast.error("Failed to delete", { id: loadingToast });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50 pb-32">
//       <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100/50 px-6 pt-12 pb-4">
//         <div className="flex items-center gap-4">
//           <Link href="/">
//             <button className="bg-gray-100 p-2.5 rounded-full text-gray-600 hover:bg-gray-200 transition active:scale-95">
//               <ArrowLeft size={20} strokeWidth={2} />
//             </button>
//           </Link>
//           <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Machine Settings</h1>
//         </div>
//       </header>

//       <div className="px-5 pt-6 space-y-8">
//         <section>
//           <div className="flex items-center gap-2 mb-4">
//             <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-700">
//               <Plus size={16} strokeWidth={3} />
//             </div>
//             <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Add New Machine</h2>
//           </div>

//           <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
//             <form onSubmit={handleAddService} className="space-y-4">
//               <div className="space-y-1">
//                 <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Machine Name</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Rotavator, Tractor 55HP"
//                   className="w-full p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-400 text-sm"
//                   value={newService.name}
//                   onChange={(e) => setNewService({...newService, name: e.target.value})}
//                 />
//               </div>

//               <div className="flex gap-3">
//                 <div className="flex-1 space-y-1">
//                   <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Billing Type</label>
//                   <div className="relative">
//                     <select
//                       className="w-full p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-semibold text-gray-700 text-sm appearance-none"
//                       value={newService.rateType}
//                       onChange={(e) => setNewService({...newService, rateType: e.target.value as "hourly" | "fixed"})}
//                     >
//                       <option value="hourly">Per Hour</option>
//                       <option value="fixed">Fixed Rate</option>
//                     </select>
//                     <ChevronRight className="absolute right-3 top-3.5 text-gray-400 rotate-90" size={16} />
//                   </div>
//                 </div>

//                 <div className="flex-1 space-y-1">
//                   <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Rate (₹)</label>
//                   <input
//                     type="number"
//                     placeholder="00"
//                     min="0"
//                     step="any"
//                     className="w-full p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm"
//                     value={newService.price}
//                     onChange={(e) => setNewService({...newService, price: e.target.value})}
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-gray-200 flex items-center justify-center gap-2 mt-2"
//               >
//                 {loading ? <Loader2 className="animate-spin" size={18} /> : "Save Machine"}
//               </button>
//             </form>
//           </div>
//         </section>

//         <section>
//           <div className="flex items-center gap-2 mb-4">
//             <div className="bg-gray-100 p-1.5 rounded-lg text-gray-600">
//               <Wrench size={16} strokeWidth={2} />
//             </div>
//             <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Machines</h2>
//           </div>

//           <div className="flex flex-col gap-3">
//             {fetching ? (
//               [1,2].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)
//             ) : services.length === 0 ? (
//               <div className="text-center py-10 opacity-50 bg-white rounded-3xl border border-dashed border-gray-200">
//                 <Info size={24} className="mx-auto text-gray-300 mb-2" />
//                 <p className="text-xs text-gray-400">No machines found.</p>
//                 <p className="text-[10px] text-gray-300">Add one above to get started.</p>
//               </div>
//             ) : (
//               services.map((service) => (
//                 <div key={service._id} className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:border-emerald-200 active:scale-[0.99]">
//                   <div className="flex items-center gap-4">
//                     <div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm border border-emerald-100">
//                       {service.name.charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-gray-800 text-base leading-tight">{service.name}</h4>
//                       <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mt-1">
//                         <span className="capitalize">
//                           {service.rateType === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-4">
//                     <div className="text-right">
//                       <p className="text-sm font-extrabold text-gray-800">₹{service.price}</p>
//                       <p className="text-[10px] text-gray-400 font-medium opacity-70">
//                         /{service.rateType === 'hourly' ? 'hr' : 'unit'}
//                       </p>
//                     </div>
                    
//                     <button 
//                       onClick={() => handleDelete(service._id)}
//                       className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100 hover:border-red-100"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </section>
//       </div>
      
//       <BottomNav />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Wrench, ChevronRight, Loader2, Info, Languages } from "lucide-react"; // Added Languages Icon
import toast from "react-hot-toast";

import BottomNav from "@/components/BottomNav";
import { settingsContent } from "@/data/translations"; // ✅ Import Translations

interface Service {
  _id: string;
  name: string;
  rateType: "hourly" | "fixed";
  price: number;
}

export default function SettingsPage() {
  // --- Language State ---
  const [lang, setLang] = useState<"en" | "hi">("hi");

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [newService, setNewService] = useState({
    name: "",
    rateType: "hourly" as "hourly" | "fixed",
    price: "",
  });

  // ✅ Get Content
  const t = settingsContent[lang];

  const toggleLanguage = () => {
    setLang((prev) => (prev === "hi" ? "en" : "hi"));
  };

  useEffect(() => {
    fetchServices();
  }, [lang]); // Added lang dependency to re-fetch if needed (mostly for error toasts consistency)

  async function fetchServices() {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch (error) {
      toast.error(t.messages.loadError);
    } finally {
      setFetching(false);
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newService.name.trim() || !newService.price.trim()) {
      toast.error(t.messages.fillAll);
      return;
    }

    const priceNum = Number(newService.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error(t.messages.validPrice);
      return;
    }

    setLoading(true);
    const toastId = toast.loading(t.form.saving);

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newService,
          price: priceNum,
        }),
      });

      if (res.ok) {
        toast.success(t.messages.success, { id: toastId });
        setNewService({ name: "", rateType: "hourly", price: "" });
        fetchServices();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error(t.messages.error, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    toast(
      (toastT) => (
        <div className="flex flex-col gap-2 w-full">
          <span className="font-bold text-white text-sm">
            {t.messages.deleteConfirm}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => confirmDelete(id, toastT.id)}
              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition"
            >
              {t.messages.yes}
            </button>
            <button
              onClick={() => toast.dismiss(toastT.id)}
              className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
            >
              {t.messages.cancel}
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  const confirmDelete = async (id: string, toastId: string) => {
    toast.dismiss(toastId);
    const loadingToast = toast.loading(t.messages.deleting);

    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });

      if (res.ok) {
        toast.success(t.messages.deleteSuccess, { id: loadingToast });
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error(t.messages.deleteError, { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100/50 px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="bg-gray-100 p-2.5 rounded-full text-gray-600 hover:bg-gray-200 transition active:scale-95">
                <ArrowLeft size={20} strokeWidth={2} />
              </button>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {t.title}
            </h1>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 active:scale-95 transition"
          >
            <Languages size={20} />
          </button>
        </div>
      </header>

      <div className="px-5 pt-6 space-y-8">
        {/* Add Machine Form */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-700">
              <Plus size={16} strokeWidth={3} />
            </div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              {t.addNew}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                  {t.form.nameLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.form.namePlaceholder}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-400 text-sm"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                    {t.form.billingType}
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-semibold text-gray-700 text-sm appearance-none"
                      value={newService.rateType}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          rateType: e.target.value as "hourly" | "fixed",
                        })
                      }
                    >
                      <option value="hourly">{t.form.perHour}</option>
                      <option value="fixed">{t.form.fixedRate}</option>
                    </select>
                    <ChevronRight
                      className="absolute right-3 top-3.5 text-gray-400 rotate-90"
                      size={16}
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                    {t.form.rateLabel}
                  </label>
                  <input
                    type="number"
                    placeholder={t.form.ratePlaceholder}
                    min="0"
                    step="any"
                    className="w-full p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({ ...newService, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-gray-200 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  t.form.saveBtn
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Active Machines List */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gray-100 p-1.5 rounded-lg text-gray-600">
              <Wrench size={16} strokeWidth={2} />
            </div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              {t.activeMachines}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {fetching ? (
              [1, 2].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-white rounded-2xl animate-pulse"
                />
              ))
            ) : services.length === 0 ? (
              <div className="text-center py-10 opacity-50 bg-white rounded-3xl border border-dashed border-gray-200">
                <Info size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-400">{t.list.emptyTitle}</p>
                <p className="text-[10px] text-gray-300">{t.list.emptyDesc}</p>
              </div>
            ) : (
              services.map((service) => (
                <div
                  key={service._id}
                  className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:border-emerald-200 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm border border-emerald-100">
                      {service.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-base leading-tight">
                        {service.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mt-1">
                        <span className="capitalize">
                          {service.rateType === "hourly"
                            ? t.list.hourly
                            : t.list.fixed}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-gray-800">
                        ₹{service.price}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium opacity-70">
                        /
                        {service.rateType === "hourly"
                          ? t.list.hr
                          : t.list.unit}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(service._id)}
                      className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100 hover:border-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}