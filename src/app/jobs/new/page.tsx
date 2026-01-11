// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, User, Phone, Wrench, IndianRupee, ChevronRight, Loader2, Sparkles, Check } from "lucide-react";
// import Link from "next/link";
// import toast from "react-hot-toast";

// import BottomNav from "@/components/BottomNav";

// interface Service {
//   _id: string;
//   name: string;
//   price: number;
//   rateType: "hourly" | "fixed";
// }

// interface FormData {
//   farmerName: string;
//   mobileNumber: string;
//   serviceName: string;
//   serviceRate: string;
//   rateType: "hourly" | "fixed";
// }

// export default function NewJobPage() {
//   const router = useRouter();
  
//   const [loading, setLoading] = useState(false);
//   const [services, setServices] = useState<Service[]>([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
//   const [formData, setFormData] = useState<FormData>({
//     farmerName: "",
//     mobileNumber: "",
//     serviceName: "",
//     serviceRate: "",
//     rateType: "hourly",
//   });

//   useEffect(() => {
//     async function fetchServices() {
//       try {
//         const res = await fetch("/api/services");
//         const data = await res.json();
//         if (Array.isArray(data)) setServices(data);
//       } catch (err) {
//         toast.error("Failed to load machines");
//       }
//     }
//     fetchServices();
//   }, []);

//   const handleSelectMachine = (service: Service) => {
//     setFormData({
//       ...formData,
//       serviceName: service.name,
//       serviceRate: service.price.toString(),
//       rateType: service.rateType,
//     });
//     setIsDropdownOpen(false);
//     toast.success(`Selected: ${service.name}`);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.farmerName.trim() || !formData.mobileNumber.trim() || !formData.serviceName.trim()) {
//       toast.error("Please fill all details");
//       return;
//     }

//     if (!formData.serviceRate.trim()) {
//       toast.error("Please enter a rate");
//       return;
//     }

//     const rateNum = Number(formData.serviceRate);
//     if (isNaN(rateNum) || rateNum < 0) {
//       toast.error("Please enter a valid rate");
//       return;
//     }

//     setLoading(true);
//     const toastId = toast.loading("Creating job...");

//     try {
//       const res = await fetch("/api/jobs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           serviceRate: rateNum,
//         }),
//       });

//       if (res.ok) {
//         toast.success("Job Started Successfully! 🎉", { id: toastId });
//         router.push("/");
//         router.refresh();
//       } else {
//         throw new Error();
//       }
//     } catch (error) {
//       toast.error("Error creating job", { id: toastId });
//     } finally {
//       setLoading(false);
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
//           <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">New Job</h1>
//         </div>
//       </header>

//       <div className="px-5 pt-6 max-w-lg mx-auto">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative group hover:border-emerald-100 transition-colors">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="bg-blue-100 p-1.5 rounded-lg text-blue-700">
//                 <User size={16} strokeWidth={3} />
//               </div>
//               <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Farmer Details</h2>
//             </div>
            
//             <div className="space-y-4">
//               <div className="relative group/input">
//                 <User className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={20} />
//                 <input
//                   type="text"
//                   required
//                   placeholder="Farmer Name"
//                   className="w-full pl-11 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-400 text-sm"
//                   value={formData.farmerName}
//                   onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
//                 />
//               </div>

//               <div className="relative group/input">
//                 <Phone className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={20} />
//                 <input
//                   type="tel"
//                   required
//                   placeholder="Mobile Number"
//                   className="w-full pl-11 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-400 text-sm"
//                   value={formData.mobileNumber}
//                   onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
//                 />
//               </div>
//             </div>
//           </section>

//           <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative group hover:border-emerald-100 transition-colors">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-700">
//                 <Wrench size={16} strokeWidth={3} />
//               </div>
//               <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Work Details</h2>
//             </div>

//             <div className="space-y-4">
//               <div className="relative group/input z-20">
//                 <Wrench 
//                   className={`absolute left-3.5 top-3.5 transition-colors pointer-events-none z-10 ${isDropdownOpen ? 'text-emerald-500' : 'text-gray-400'}`} 
//                   size={20} 
//                 />
                
//                 <button
//                   type="button"
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className={`w-full pl-11 p-3.5 text-left rounded-xl border-transparent outline-none transition-all font-semibold text-sm flex justify-between items-center relative ${
//                     isDropdownOpen 
//                     ? "bg-white ring-2 ring-emerald-500/20 border-emerald-500 text-gray-800 shadow-lg" 
//                     : "bg-gray-50 text-gray-700 hover:bg-gray-100"
//                   }`}
//                   aria-expanded={isDropdownOpen}
//                   aria-haspopup="listbox"
//                 >
//                   <span className={formData.serviceName ? "text-gray-800" : "text-gray-400"}>
//                     {formData.serviceName || "Select Machine..."}
//                   </span>
//                   <ChevronRight 
//                     size={16} 
//                     className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-90 text-emerald-500" : ""}`} 
//                   />
//                 </button>

//                 {isDropdownOpen && (
//                   <>
//                     <div 
//                       className="fixed inset-0 z-10" 
//                       onClick={() => setIsDropdownOpen(false)} 
//                       aria-hidden="true"
//                     />

//                     <div 
//                       className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30"
//                       role="listbox"
//                       aria-label="Select machine"
//                     >
//                       <div className="max-h-60 overflow-y-auto p-2 space-y-1">
//                         {services.map((service) => {
//                           const isSelected = formData.serviceName === service.name;
//                           return (
//                             <div
//                               key={service._id}
//                               onClick={() => handleSelectMachine(service)}
//                               className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98] border ${
//                                 isSelected 
//                                 ? "bg-emerald-50 border-emerald-100" 
//                                 : "hover:bg-gray-50 border-transparent"
//                               }`}
//                               role="option"
//                               aria-selected={isSelected}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
//                                   isSelected ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"
//                                 }`}>
//                                   {service.name.charAt(0)}
//                                 </div>
                                
//                                 <div className="flex flex-col">
//                                   <span className={`text-sm font-bold ${isSelected ? "text-emerald-700" : "text-gray-700"}`}>
//                                     {service.name}
//                                   </span>
//                                   <span className="text-[10px] text-gray-400 font-medium capitalize">
//                                     {service.rateType === 'hourly' ? 'Per Hour' : 'Fixed Rate'}
//                                   </span>
//                                 </div>
//                               </div>

//                               <div className="flex items-center gap-3">
//                                 <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
//                                   ₹{service.price}
//                                 </span>
//                                 {isSelected && <Check size={16} className="text-emerald-500" />}
//                               </div>
//                             </div>
//                           );
//                         })}

//                         {services.length === 0 && (
//                           <div className="text-center p-6 flex flex-col items-center">
//                             <p className="text-gray-400 text-xs font-medium">No machines found.</p>
//                           </div>
//                         )}
//                       </div>
                      
//                       <div className="border-t border-gray-50 p-2 bg-gray-50/50">
//                         <Link href="/settings">
//                           <button className="w-full text-center py-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider hover:bg-emerald-50 rounded-lg transition-colors">
//                             + Add New Machine
//                           </button>
//                         </Link>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="flex gap-3 z-0">
//                 <div className="relative group/input flex-1">
//                   <IndianRupee className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
//                   <input
//                     type="number"
//                     required
//                     min="0"
//                     step="any"
//                     placeholder="Rate"
//                     className="w-full pl-11 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400 text-sm"
//                     value={formData.serviceRate}
//                     onChange={(e) => setFormData({...formData, serviceRate: e.target.value})}
//                   />
//                 </div>
                
//                 <div className="bg-gray-100 px-4 rounded-xl border border-transparent text-gray-500 font-bold text-xs uppercase flex items-center justify-center min-w-[90px] tracking-wider">
//                   {formData.rateType === "hourly" ? "/ Hour" : "/ Unit"}
//                 </div>
//               </div>
//             </div>
//           </section>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-base shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4 relative z-0"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="animate-spin" size={20} /> Creating...
//               </>
//             ) : (
//               <>
//                 <Sparkles size={20} className="text-yellow-400" /> Start New Job
//               </>
//             )}
//           </button>
//         </form>
//       </div>

//       <BottomNav />
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, User, Phone, Wrench, IndianRupee, ChevronRight, Loader2, Sparkles, Check, Languages } from "lucide-react"; // Languages icon added
// import Link from "next/link";
// import toast from "react-hot-toast";

// import BottomNav from "@/components/BottomNav";
// import { newJobContent } from "@/data/translations"; // ✅ Import Translations

// interface Service {
//   _id: string;
//   name: string;
//   price: number;
//   rateType: "hourly" | "fixed";
// }

// interface FormData {
//   farmerName: string;
//   mobileNumber: string;
//   serviceName: string;
//   serviceRate: string;
//   rateType: "hourly" | "fixed";
// }

// export default function NewJobPage() {
//   const router = useRouter();
  
//   // --- Language State ---
//   const [lang, setLang] = useState<"en" | "hi">("hi");
  
//   const [loading, setLoading] = useState(false);
//   const [services, setServices] = useState<Service[]>([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
//   const [formData, setFormData] = useState<FormData>({
//     farmerName: "",
//     mobileNumber: "",
//     serviceName: "",
//     serviceRate: "",
//     rateType: "hourly",
//   });

//   // ✅ Get Content
//   const t = newJobContent[lang];

//   const toggleLanguage = () => {
//     setLang((prev) => (prev === "hi" ? "en" : "hi"));
//   };

//   useEffect(() => {
//     async function fetchServices() {
//       try {
//         const res = await fetch("/api/services");
//         const data = await res.json();
//         if (Array.isArray(data)) setServices(data);
//       } catch (err) {
//         toast.error(t.messages.loadError);
//       }
//     }
//     fetchServices();
//   }, [lang]); // Added lang dependency

//   const handleSelectMachine = (service: Service) => {
//     setFormData({
//       ...formData,
//       serviceName: service.name,
//       serviceRate: service.price.toString(),
//       rateType: service.rateType,
//     });
//     setIsDropdownOpen(false);
//     toast.success(`${t.messages.selected} ${service.name}`);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.farmerName.trim() || !formData.mobileNumber.trim() || !formData.serviceName.trim()) {
//       toast.error(t.messages.fillAll);
//       return;
//     }

//     if (!formData.serviceRate.trim()) {
//       toast.error(t.messages.enterRate);
//       return;
//     }

//     const rateNum = Number(formData.serviceRate);
//     if (isNaN(rateNum) || rateNum < 0) {
//       toast.error(t.messages.validRate);
//       return;
//     }

//     setLoading(true);
//     const toastId = toast.loading(t.creating);

//     try {
//       const res = await fetch("/api/jobs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           serviceRate: rateNum,
//         }),
//       });

//       if (res.ok) {
//         toast.success(t.messages.success, { id: toastId });
//         router.push("/");
//         router.refresh();
//       } else {
//         throw new Error();
//       }
//     } catch (error) {
//       toast.error(t.messages.error, { id: toastId });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50 pb-32">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100/50 px-6 pt-12 pb-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Link href="/">
//               <button className="bg-gray-100 p-2.5 rounded-full text-gray-600 hover:bg-gray-200 transition active:scale-95">
//                 <ArrowLeft size={20} strokeWidth={2} />
//               </button>
//             </Link>
//             <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{t.title}</h1>
//           </div>

//           {/* Language Toggle */}
//           <button
//             onClick={toggleLanguage}
//             className="p-2.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 active:scale-95 transition"
//           >
//             <Languages size={20} />
//           </button>
//         </div>
//       </header>

//       <div className="px-5 pt-6 max-w-lg mx-auto">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Farmer Details Section */}
//           <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative group hover:border-emerald-100 transition-colors">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="bg-blue-100 p-1.5 rounded-lg text-blue-700">
//                 <User size={16} strokeWidth={3} />
//               </div>
//               <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.farmerDetails}</h2>
//             </div>
            
//             <div className="space-y-4">
//               <div className="relative group/input">
//                 <User className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={20} />
//                 <input
//                   type="text"
//                   required
//                   placeholder={t.farmerName}
//                   className="w-full pl-11 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-400 text-sm"
//                   value={formData.farmerName}
//                   onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
//                 />
//               </div>

//               <div className="relative group/input">
//                 <Phone className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={20} />
//                 <input
//                   type="tel"
//                   required
//                   placeholder={t.mobileNumber}
//                   className="w-full pl-11 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-400 text-sm"
//                   value={formData.mobileNumber}
//                   onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Work Details Section */}
//           <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative group hover:border-emerald-100 transition-colors">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-700">
//                 <Wrench size={16} strokeWidth={3} />
//               </div>
//               <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.workDetails}</h2>
//             </div>

//             <div className="space-y-4">
//               <div className="relative group/input z-20">
//                 <Wrench 
//                   className={`absolute left-3.5 top-3.5 transition-colors pointer-events-none z-10 ${isDropdownOpen ? 'text-emerald-500' : 'text-gray-400'}`} 
//                   size={20} 
//                 />
                
//                 <button
//                   type="button"
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className={`w-full pl-11 p-3.5 text-left rounded-xl border-transparent outline-none transition-all font-semibold text-sm flex justify-between items-center relative ${
//                     isDropdownOpen 
//                     ? "bg-white ring-2 ring-emerald-500/20 border-emerald-500 text-gray-800 shadow-lg" 
//                     : "bg-gray-50 text-gray-700 hover:bg-gray-100"
//                   }`}
//                   aria-expanded={isDropdownOpen}
//                   aria-haspopup="listbox"
//                 >
//                   <span className={formData.serviceName ? "text-gray-800" : "text-gray-400"}>
//                     {formData.serviceName || t.selectMachine}
//                   </span>
//                   <ChevronRight 
//                     size={16} 
//                     className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-90 text-emerald-500" : ""}`} 
//                   />
//                 </button>

//                 {isDropdownOpen && (
//                   <>
//                     <div 
//                       className="fixed inset-0 z-10" 
//                       onClick={() => setIsDropdownOpen(false)} 
//                       aria-hidden="true"
//                     />

//                     <div 
//                       className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30"
//                       role="listbox"
//                     >
//                       <div className="max-h-60 overflow-y-auto p-2 space-y-1">
//                         {services.map((service) => {
//                           const isSelected = formData.serviceName === service.name;
//                           return (
//                             <div
//                               key={service._id}
//                               onClick={() => handleSelectMachine(service)}
//                               className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98] border ${
//                                 isSelected 
//                                 ? "bg-emerald-50 border-emerald-100" 
//                                 : "hover:bg-gray-50 border-transparent"
//                               }`}
//                               role="option"
//                               aria-selected={isSelected}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
//                                   isSelected ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"
//                                 }`}>
//                                   {service.name.charAt(0)}
//                                 </div>
                                
//                                 <div className="flex flex-col">
//                                   <span className={`text-sm font-bold ${isSelected ? "text-emerald-700" : "text-gray-700"}`}>
//                                     {service.name}
//                                   </span>
//                                   <span className="text-[10px] text-gray-400 font-medium capitalize">
//                                     {service.rateType === 'hourly' ? t.perHour : t.fixedRate}
//                                   </span>
//                                 </div>
//                               </div>

//                               <div className="flex items-center gap-3">
//                                 <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
//                                   ₹{service.price}
//                                 </span>
//                                 {isSelected && <Check size={16} className="text-emerald-500" />}
//                               </div>
//                             </div>
//                           );
//                         })}

//                         {services.length === 0 && (
//                           <div className="text-center p-6 flex flex-col items-center">
//                             <p className="text-gray-400 text-xs font-medium">{t.messages.noMachines}</p>
//                           </div>
//                         )}
//                       </div>
                      
//                       <div className="border-t border-gray-50 p-2 bg-gray-50/50">
//                         <Link href="/settings">
//                           <button className="w-full text-center py-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider hover:bg-emerald-50 rounded-lg transition-colors">
//                             {t.addMachine}
//                           </button>
//                         </Link>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="flex gap-3 z-0">
//                 <div className="relative group/input flex-1">
//                   <IndianRupee className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
//                   <input
//                     type="number"
//                     required
//                     min="0"
//                     step="any"
//                     placeholder={t.rate}
//                     className="w-full pl-11 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400 text-sm"
//                     value={formData.serviceRate}
//                     onChange={(e) => setFormData({...formData, serviceRate: e.target.value})}
//                   />
//                 </div>
                
//                 <div className="bg-gray-100 px-4 rounded-xl border border-transparent text-gray-500 font-bold text-xs uppercase flex items-center justify-center min-w-[90px] tracking-wider">
//                   {formData.rateType === "hourly" ? `/ ${t.hour}` : `/ ${t.unit}`}
//                 </div>
//               </div>
//             </div>
//           </section>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-base shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4 relative z-0"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="animate-spin" size={20} /> {t.creating}
//               </>
//             ) : (
//               <>
//                 <Sparkles size={20} className="text-yellow-400" /> {t.startJob}
//               </>
//             )}
//           </button>
//         </form>
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, Wrench, IndianRupee, ChevronRight, Loader2, Sparkles, Check } from "lucide-react"; 
import Link from "next/link";
import toast from "react-hot-toast";

import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/context/LanguageContext"; 
import { newJobContent } from "@/data/translations"; 

interface Service {
  _id: string;
  name: string;
  price: number;
  rateType: "hourly" | "fixed";
}

interface FormData {
  farmerName: string;
  mobileNumber: string;
  serviceName: string;
  serviceRate: string;
  rateType: "hourly" | "fixed";
}

export default function NewJobPage() {
  const router = useRouter();
  
  const { lang, toggleLanguage } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    farmerName: "",
    mobileNumber: "",
    serviceName: "",
    serviceRate: "",
    rateType: "hourly",
  });

  const t = newJobContent[lang];


  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (Array.isArray(data)) setServices(data);
      } catch (err) {
        toast.error(t.messages.loadError);
      }
    }
    fetchServices();
  }, [lang]); 

  const handleSelectMachine = (service: Service) => {
    setFormData({
      ...formData,
      serviceName: service.name,
      serviceRate: service.price.toString(),
      rateType: service.rateType,
    });
    setIsDropdownOpen(false);
    toast.success(`${t.messages.selected} ${service.name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.farmerName.trim() || !formData.mobileNumber.trim() || !formData.serviceName.trim()) {
      toast.error(t.messages.fillAll);
      return;
    }

    if (!formData.serviceRate.trim()) {
      toast.error(t.messages.enterRate);
      return;
    }

    const rateNum = Number(formData.serviceRate);
    if (isNaN(rateNum) || rateNum < 0) {
      toast.error(t.messages.validRate);
      return;
    }

    setLoading(true);
    const toastId = toast.loading(t.creating);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          serviceRate: rateNum,
        }),
      });

      if (res.ok) {
        toast.success(t.messages.success, { id: toastId });
        router.push("/");
        router.refresh();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error(t.messages.error, { id: toastId });
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{t.title}</h1>
          </div>

        </div>
      </header>

      <div className="px-5 pt-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Farmer Details Section */}
          <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative group hover:border-emerald-100 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 p-1.5 rounded-lg text-blue-700">
                <User size={16} strokeWidth={3} />
              </div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.farmerDetails}</h2>
            </div>
            
            <div className="space-y-4">
              <div className="relative group/input">
                <User className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  placeholder={t.farmerName}
                  className="w-full pl-11 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-400 text-sm"
                  value={formData.farmerName}
                  onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
                />
              </div>

              <div className="relative group/input">
                <Phone className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={20} />
                <input
                  type="tel"
                  required
                  placeholder={t.mobileNumber}
                  className="w-full pl-11 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-gray-700 placeholder:text-gray-400 text-sm"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Work Details Section */}
          <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative group hover:border-emerald-100 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-700">
                <Wrench size={16} strokeWidth={3} />
              </div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.workDetails}</h2>
            </div>

            <div className="space-y-4">
              <div className="relative group/input z-20">
                <Wrench 
                  className={`absolute left-3.5 top-3.5 transition-colors pointer-events-none z-10 ${isDropdownOpen ? 'text-emerald-500' : 'text-gray-400'}`} 
                  size={20} 
                />
                
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full pl-11 p-3.5 text-left rounded-xl border-transparent outline-none transition-all font-semibold text-sm flex justify-between items-center relative ${
                    isDropdownOpen 
                    ? "bg-white ring-2 ring-emerald-500/20 border-emerald-500 text-gray-800 shadow-lg" 
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <span className={formData.serviceName ? "text-gray-800" : "text-gray-400"}>
                    {formData.serviceName || t.selectMachine}
                  </span>
                  <ChevronRight 
                    size={16} 
                    className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-90 text-emerald-500" : ""}`} 
                  />
                </button>

                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)} 
                      aria-hidden="true"
                    />

                    <div 
                      className="absolute bottom-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30"
                      role="listbox"
                    >
                      <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                        {services.map((service) => {
                          const isSelected = formData.serviceName === service.name;
                          return (
                            <div
                              key={service._id}
                              onClick={() => handleSelectMachine(service)}
                              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98] border ${
                                isSelected 
                                ? "bg-emerald-50 border-emerald-100" 
                                : "hover:bg-gray-50 border-transparent"
                              }`}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isSelected ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"
                                }`}>
                                  {service.name.charAt(0)}
                                </div>
                                
                                <div className="flex flex-col">
                                  <span className={`text-sm font-bold ${isSelected ? "text-emerald-700" : "text-gray-700"}`}>
                                    {service.name}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-medium capitalize">
                                    {service.rateType === 'hourly' ? t.perHour : t.fixedRate}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                                  ₹{service.price}
                                </span>
                                {isSelected && <Check size={16} className="text-emerald-500" />}
                              </div>
                            </div>
                          );
                        })}

                        {services.length === 0 && (
                          <div className="text-center p-6 flex flex-col items-center">
                            <p className="text-gray-400 text-xs font-medium">{t.messages.noMachines}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-50 p-2 bg-gray-50/50">
                        <Link href="/settings">
                          <button className="w-full text-center py-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider hover:bg-emerald-50 rounded-lg transition-colors">
                            {t.addMachine}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 z-0">
                <div className="relative group/input flex-1">
                  <IndianRupee className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    placeholder={t.rate}
                    className="w-full pl-11 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400 text-sm"
                    value={formData.serviceRate}
                    onChange={(e) => setFormData({...formData, serviceRate: e.target.value})}
                  />
                </div>
                
                <div className="bg-gray-100 px-4 rounded-xl border border-transparent text-gray-500 font-bold text-xs uppercase flex items-center justify-center min-w-[90px] tracking-wider">
                  {formData.rateType === "hourly" ? `/ ${t.hour}` : `/ ${t.unit}`}
                </div>
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-base shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4 relative z-0"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> {t.creating}
              </>
            ) : (
              <>
                <Sparkles size={20} className="text-yellow-400" /> {t.startJob}
              </>
            )}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}