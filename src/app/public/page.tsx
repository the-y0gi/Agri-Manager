// "use client";

// import { useState, useEffect } from "react";
// import {
//   Phone,
//   Tractor,
//   Clock,
//   Tag,
//   Share2,
//   MapPin,
//   Star,
//   BadgeCheck,
//   Users,
//   ShieldCheck,
//   ArrowRight,
//   ThumbsUp,
//   ChevronDown,
//   ChevronUp,
//   Wrench,
//   Calendar,
//   Fuel,
//   Image as ImageIcon,
//   PhoneCall,
//   Leaf,
//   AlertTriangle,
//   Sprout,
//   Settings,
//   Truck,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import Image from "next/image";

// interface Service {
//   _id: string;
//   name: string;
//   rateType: "hourly" | "fixed";
//   price: number;
// }

// export default function PublicPage() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

//   // --- BRANDING DATA ---
//   const OWNER_NAME = "Sanjay Chouriya";
//   const OWNER_NUMBER = "9713126319";
//   const SHOP_NAME = "Jay Jawan Tractor Service";
//   const LOCATION = "Bhajipani, Madhya Pradesh";

//   // --- EQUIPMENT DATA ---

//   const equipments = [
//     {
//       name: "Heavy Rotavator",
//       desc: "Mitti bhurbhuri karne ke liye",
//       icon: <Settings size={20} />, // rotating / machinery feel
//     },
//     {
//       name: "9-Tine Cultivator",
//       desc: "Gehri aur safai se jutayi",
//       icon: <Tractor size={20} />, // farming + tillage
//     },
//     {
//       name: "Hydraulic Trolley",
//       desc: "Fasal aur saamaan dhulayi",
//       icon: <Truck size={20} />, // transport / trolley
//     },
//     {
//       name: "Seed Drill",
//       desc: "Sahi waqt par boni (Sowing)",
//       icon: <Sprout size={20} />, // seed + growth
//     },
//   ];

//   // --- GALLERY IMAGES ---
//   const galleryImages = [
//     "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=400&h=300",
//     "https://plus.unsplash.com/premium_photo-1732139715621-6f5a0f7e1435?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     "https://images.unsplash.com/photo-1651903149620-ad2dab120529?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     "https://images.unsplash.com/photo-1666993724963-ceb241907962?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     "https://images.unsplash.com/photo-1672664214886-8c2a0affa18c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   ];

//   const areas = [
//     "Bhajipani",
//     "Khapa",
//     "Sakh",
//     "Kuhiya",
//     "Mohgaon",
//     "Parasgoan",
//   ];

//   const faqs = [
//     {
//       q: "Kya diesel ka charge alag se dena hoga?",
//       a: "Nahi, humare hourly rates mein diesel shamil hota hai. Aapko sirf khet batana hai.",
//     },
//     {
//       q: "Kya aap raat mein kaam karte hain?",
//       a: "Haan, hum 24/7 service dete hain. Raat ke kaam ke liye dopehar mein booking karein.",
//     },
//     {
//       q: "Payment kaise kar sakte hain?",
//       a: "Kaam hone ke baad Cash ya UPI (PhonePe/GooglePay) se payment kar sakte hain.",
//     },
//     {
//       q: "Agar tractor kharab ho gaya toh?",
//       a: "Humare paas backup tractor aur mechanic team ready rehti hai, kaam nahi rukega.",
//     },
//   ];

//   useEffect(() => {
//     async function fetchServices() {
//       try {
//         const res = await fetch("/api/services");
//         const data = await res.json();
//         if (Array.isArray(data)) setServices(data);
//       } catch (error) {
//         console.error("Error fetching services", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchServices();
//   }, []);

//   const handleCall = () => {
//     window.open(`tel:${OWNER_NUMBER}`, "_self");
//   };

//   // --- NEW: Scroll Function ---
//   const scrollToRates = () => {
//     const section = document.getElementById("rates-section");
//     if (section) {
//       section.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: SHOP_NAME,
//           text: `Best Tractor Services by ${OWNER_NAME} in ${LOCATION}. Check rates here!`,
//           url: window.location.href,
//         });
//         toast.success("Shared successfully!");
//       } catch {}
//     } else {
//       await navigator.clipboard.writeText(window.location.href);
//       toast.success("Link copied!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans pb-32">
//       {/* --- HERO SECTION --- */}
//       <div className="relative bg-emerald-900 text-white pt-10 pb-24 px-6 rounded-b-[2.5rem] shadow-2xl overflow-hidden">
//         {/* Abstract Background Shapes */}
//         <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
//         <div className="absolute bottom-0 left-0 w-60 h-60 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/4"></div>

//         {/* Top Header */}
//         <div className="relative z-10 flex justify-between items-start mb-8">
//           <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
//             <Tractor size={28} className="text-yellow-400" />
//           </div>
//           <button
//             onClick={handleShare}
//             className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition active:scale-95 border border-white/10"
//           >
//             <Share2 size={20} />
//           </button>
//         </div>

//         {/* Hero Content */}
//         <div className="relative z-10">
//           <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700 text-emerald-100 text-xs font-medium mb-4">
//             <BadgeCheck size={14} className="text-yellow-400" />
//             Managed by {OWNER_NAME}
//           </div>

//           <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
//             Smart Farming <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
//               Powerful Results
//             </span>
//           </h1>

//           <p className="text-emerald-100 text-sm sm:text-base mb-8 max-w-sm leading-relaxed opacity-90">
//             {LOCATION} mein sabse bharosemand tractor service. Sahi daam, pakka
//             kaam.
//           </p>

//           <div className="flex gap-3">
//             <button
//               onClick={handleCall}
//               className="flex-1 bg-white text-emerald-900 py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
//             >
//               <Phone size={18} /> Call Now
//             </button>
//             <button
//               onClick={scrollToRates}
//               className="flex-1 bg-emerald-800 text-white py-3.5 px-4 rounded-xl font-bold text-sm border border-emerald-700 active:scale-95 transition flex items-center justify-center gap-2"
//             >
//               View Rates <ArrowRight size={18} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- STATS SECTION (Floating) --- */}
//       <div className="px-6 -mt-12 relative z-20">
//         <div className="bg-white p-5 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex justify-between divide-x divide-gray-100">
//           <div className="text-center w-1/3">
//             <p className="text-xl font-extrabold text-gray-900">5+</p>
//             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">
//               Years
//             </p>
//           </div>
//           <div className="text-center w-1/3">
//             <p className="text-xl font-extrabold text-gray-900">500+</p>
//             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">
//               Kisan
//             </p>
//           </div>
//           <div className="text-center w-1/3">
//             <div className="flex items-center justify-center gap-1">
//               <p className="text-xl font-extrabold text-gray-900">4.9</p>
//               <Star size={14} fill="#FACC15" className="text-yellow-400" />
//             </div>
//             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">
//               Rating
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* --- OWNER & BRANDING SECTION --- */}
//       <div className="px-6 mt-14">
//         <div className="bg-gradient-to-br from-emerald-50 via-white to-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
//           {/* Header */}
//           <div className="flex items-center gap-4 mb-4">
//             {/* <div className="w-14 h-14 rounded-full bg-emerald-200 flex items-center justify-center border-2 border-white shadow-md">
//               <Users size={26} className="text-emerald-800" />
//             </div> */}
//             <div className="w-14 h-14 rounded-full bg-emerald-200 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
//               <Image
//                 src="/owner.png" // "/owner.jpg" (public folder)
//                 alt="Owner"
//                 width={100}
//                 height={100}
//                 className="object-cover"
//               />
//             </div>

//             <div>
//               <h2 className="font-bold text-gray-900 text-lg leading-tight">
//                 {OWNER_NAME}
//               </h2>
//               <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
//                 {SHOP_NAME}
//               </p>
//             </div>
//           </div>

//           {/* Description */}
//           <p className="text-sm text-gray-600 leading-relaxed mb-5">
//             Namaste Kisan Bhaiyon! Main{" "}
//             <span className="font-semibold text-gray-900">Sanjay Chouriya</span>
//             , pichle <span className="font-semibold text-gray-900">5 saal</span>{" "}
//             se <span className="font-semibold text-gray-900">Bhajipani</span>{" "}
//             mein aapki seva mein hoon. Humara maqsad hai ki aapko kheti ke liye
//             best machines milein, wo bhi sahi aur bharosemand rate par.
//           </p>

//           {/* Badges */}
//           <div className="flex flex-wrap gap-2">
//             <span className="text-[11px] bg-white px-3 py-1.5 rounded-full border border-emerald-100 text-emerald-700 font-semibold shadow-sm">
//               Verified Owner
//             </span>
//             <span className="text-[11px] bg-white px-3 py-1.5 rounded-full border border-emerald-100 text-emerald-700 font-semibold shadow-sm">
//               Expert Driver
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* --- NEW SECTION: SEASONAL SPECIAL --- */}
//       <div className="px-6 mt-12">
//         <div className="flex items-center gap-2 mb-4">
//           <Leaf className="text-green-600" size={20} />
//           <h2 className="font-bold text-gray-900 text-lg">
//             Abhi Mausam Hai (Season)
//           </h2>
//         </div>
//         <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex items-center justify-between">
//           <div>
//             <h3 className="font-bold text-orange-900">Gehu & Chana Special</h3>
//             <p className="text-xs text-orange-800/80 mt-1 max-w-[200px]">
//               Rotavator aur Seed Drill ke liye abhi booking karein aur paaye
//               priority service.
//             </p>
//           </div>
//           <div className="bg-white p-3 rounded-full shadow-sm text-orange-500">
//             <Sprout size={24} />
//           </div>
//         </div>
//       </div>

//       {/* --- EQUIPMENT SHOWCASE --- */}
//       <div className="px-6 mt-12">
//         <h2 className="text-gray-900 font-bold text-xl mb-6 flex items-center gap-2">
//           <Wrench className="text-emerald-600" size={22} />
//           Humare Auzaar
//         </h2>
//         <div className="grid grid-cols-2 gap-3">
//           {equipments.map((item, idx) => (
//             <div
//               key={idx}
//               className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32"
//             >
//               <div className="bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center text-gray-600">
//                 {item.icon}
//               </div>
//               <div>
//                 <h3 className="font-bold text-gray-800 text-sm leading-tight">
//                   {item.name}
//                 </h3>
//                 <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
//                   {item.desc}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* --- SERVICES LIST (SCROLL TARGET) --- */}
//       <div
//         id="rates-section"
//         className="px-6 mt-14 relative z-20 space-y-4 scroll-mt-24"
//       >
//         <div className="flex items-center justify-between">
//           <h2 className="text-gray-900 font-bold text-xl">Rates & Services</h2>
//           <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
//             UPDATED TODAY
//           </span>
//         </div>

//         {loading ? (
//           <div className="space-y-3">
//             {[1, 2].map((i) => (
//               <div
//                 key={i}
//                 className="h-32 bg-white rounded-3xl shadow-sm animate-pulse"
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2">
//             {services.map((service, index) => (
//               <div
//                 key={service._id}
//                 className="group relative bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-lg overflow-hidden"
//               >
//                 {/* Decorative circle */}
//                 <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-10 -mt-10 transition-colors group-hover:bg-emerald-50/50"></div>

//                 <div className="relative z-10 flex flex-col h-full justify-between">
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="bg-emerald-50 h-10 w-10 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
//                       <Tractor size={20} strokeWidth={2} />
//                     </div>
//                     {index === 0 && (
//                       <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
//                         POPULAR
//                       </span>
//                     )}
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
//                       {service.name}
//                     </h3>
//                     <div className="flex items-center gap-2 mb-2">
//                       <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded">
//                         {service.rateType === "hourly" ? (
//                           <Clock size={10} />
//                         ) : (
//                           <Tag size={10} />
//                         )}
//                         <span className="capitalize">{service.rateType}</span>
//                       </span>
//                       <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
//                         <Fuel size={10} /> Diesel Free
//                       </span>
//                     </div>
//                   </div>

//                   <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
//                     <div>
//                       <span className="text-xs text-gray-400 font-medium">
//                         Rate
//                       </span>
//                       <div className="flex items-baseline gap-1">
//                         <span className="text-2xl font-extrabold text-gray-900">
//                           ₹{service.price}
//                         </span>
//                         <span className="text-xs font-bold text-gray-400">
//                           /{service.rateType === "hourly" ? "hr" : "unit"}
//                         </span>
//                       </div>
//                     </div>
//                     <button
//                       onClick={handleCall}
//                       className="bg-black text-white p-2.5 rounded-full hover:bg-emerald-600 transition-colors shadow-lg"
//                     >
//                       <ArrowRight size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {services.length === 0 && (
//               <div className="col-span-full bg-white rounded-3xl p-8 text-center border border-dashed border-gray-300">
//                 <p className="text-gray-400 font-medium">
//                   No services listed yet.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* --- PHOTO GALLERY --- */}
//       <div className="mt-14 bg-white py-10">
//         <div className="px-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-gray-900 font-bold text-xl flex items-center gap-2">
//               <ImageIcon className="text-emerald-600" size={20} /> Photo Gallery
//             </h2>
//             <span className="text-xs text-emerald-600 font-bold">
//               Recent Work
//             </span>
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             {galleryImages.map((img, i) => (
//               <div
//                 key={i}
//                 className={`rounded-2xl overflow-hidden shadow-sm h-32 relative ${
//                   i === 2 ? "col-span-2" : ""
//                 }`}
//               >
//                 <img
//                   src={img}
//                   alt="Farming Work"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- WORKING PROCESS --- */}
//       <div className="px-6 mt-14">
//         <h2 className="text-gray-900 font-bold text-xl mb-6 text-center">
//           Kaam Kaise Hota Hai?
//         </h2>
//         <div className="space-y-4">
//           {[
//             {
//               title: "Sanjay Ji ko Call Karein",
//               sub: "Seedhe owner se baat karein.",
//               icon: PhoneCall,
//             },
//             {
//               title: "Time Book Karein",
//               sub: "Apne hisaab se date aur time fix karein.",
//               icon: Calendar,
//             },
//             {
//               title: "Kaam Shuru",
//               sub: "Driver time par khet pahunch jayega.",
//               icon: Tractor,
//             },
//           ].map((step, idx) => (
//             <div
//               key={idx}
//               className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
//             >
//               <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
//                 <step.icon size={22} />
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 text-base">
//                   {idx + 1}. {step.title}
//                 </h4>
//                 <p className="text-xs text-gray-500 mt-0.5">{step.sub}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* --- NEW SECTION: EMERGENCY SUPPORT --- */}
//       <div className="px-6 mt-14">
//         <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center">
//           <AlertTriangle className="text-red-500 mx-auto mb-3" size={28} />
//           <h3 className="font-bold text-gray-900">Tractor Kharab Ho Gaya?</h3>
//           <p className="text-xs text-gray-600 mt-1 mb-4">
//             Chinta na karein. Humare paas expert mechanic team available hai jo
//             khet par aa kar repair kar sakti hai.
//           </p>
//           <button
//             onClick={handleCall}
//             className="text-xs font-bold bg-white text-red-600 border border-red-200 px-4 py-2 rounded-full shadow-sm"
//           >
//             Emergency Call
//           </button>
//         </div>
//       </div>

//       {/* --- WHY CHOOSE US --- */}
//       <div className="px-6 mt-14">
//         <h2 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-2">
//           <ShieldCheck className="text-emerald-600" size={20} />
//           Why Choose {SHOP_NAME}?
//         </h2>
//         <div className="grid grid-cols-2 gap-3">
//           <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
//             <Clock className="text-emerald-600 mb-2" size={24} />
//             <h3 className="font-bold text-sm text-gray-800">On Time</h3>
//             <p className="text-xs text-gray-500 mt-1">Waqt ki kadar.</p>
//           </div>
//           <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
//             <Users className="text-emerald-600 mb-2" size={24} />
//             <h3 className="font-bold text-sm text-gray-800">Expert Drivers</h3>
//             <p className="text-xs text-gray-500 mt-1">Anubhavi driver.</p>
//           </div>
//         </div>
//       </div>

//       {/* --- SERVICE AREAS --- */}
//       <div className="px-6 mt-14">
//         <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 text-center">
//           <MapPin size={28} className="text-emerald-600 mx-auto mb-3" />
//           <h2 className="text-gray-900 font-bold text-lg mb-2">
//             Service Locations
//           </h2>
//           <p className="text-xs text-gray-500 mb-4">
//             Hum in sabhi ilako mein service dete hain:
//           </p>
//           <div className="flex flex-wrap justify-center gap-2">
//             {areas.map((area, i) => (
//               <span
//                 key={i}
//                 className="text-[10px] font-bold bg-white text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
//               >
//                 {area}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- FAQ SECTION --- */}
//       <div className="px-6 mt-14 mb-8">
//         <h2 className="text-gray-900 font-bold text-xl mb-5">
//           Sawalo Ke Jawab (FAQ)
//         </h2>
//         <div className="space-y-3">
//           {faqs.map((faq, index) => (
//             <div
//               key={index}
//               className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all"
//             >
//               <button
//                 onClick={() =>
//                   setOpenFaqIndex(openFaqIndex === index ? null : index)
//                 }
//                 className="w-full flex justify-between items-center p-4 text-left"
//               >
//                 <span className="font-bold text-gray-800 text-sm">{faq.q}</span>
//                 {openFaqIndex === index ? (
//                   <ChevronUp size={18} className="text-emerald-600 shrink-0" />
//                 ) : (
//                   <ChevronDown size={18} className="text-gray-400 shrink-0" />
//                 )}
//               </button>
//               {openFaqIndex === index && (
//                 <div className="px-4 pb-4 bg-gray-50/50">
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     {faq.a}
//                   </p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* --- TESTIMONIALS --- */}
//       <div className="px-6 mt-8 mb-24">
//         <h2 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-2">
//           <ThumbsUp className="text-emerald-600" size={20} />
//           Happy Farmers
//         </h2>
//         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
//           <div className="flex gap-1 mb-2">
//             {[1, 2, 3, 4, 5].map((s) => (
//               <Star
//                 key={s}
//                 size={14}
//                 fill="#FACC15"
//                 className="text-yellow-400"
//               />
//             ))}
//           </div>
//           <p className="text-sm text-gray-600 italic mb-4">
//             &quot;Sanjay bhai ki service bohot badhiya hai. Raat ko bhi phone
//             kiya toh tractor bhej diya. Rates bhi sahi hain.&quot;
//           </p>
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
//               RP
//             </div>
//             <div>
//               <p className="text-xs font-bold text-gray-900">Rajesh Patel</p>
//               <p className="text-[10px] text-gray-400">Local Farmer</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Note: Footer Removed as requested */}

//       {/* --- STICKY BOTTOM BAR --- */}
//       <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
//         <button
//           onClick={handleCall}
//           className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden"
//         >
//           <div className="absolute inset-0 bg-white/10 translate-y-1/2 rotate-12 blur-2xl"></div>
//           <div className="bg-white/20 p-2 rounded-full animate-pulse">
//             <Phone size={20} />
//           </div>
//           Call {OWNER_NAME}
//         </button>
//       </div>
//     </div>
//   );
// }
      

"use client";

import { useState } from "react";
import {
  Phone, Tractor, Share2, MapPin, Star, BadgeCheck,
  ShieldCheck, ArrowRight, ThumbsUp, Wrench, Calendar,
  Image as ImageIcon, PhoneCall, Leaf, AlertTriangle,
  Sprout, Settings, Truck, Languages, Users, ChevronDown, ChevronUp,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

import { content } from "@/data/translations"; 
import ServicesSection from "@/components/ServicesSection"; 

export default function PublicPage() {
  const [lang, setLang] = useState<"en" | "hi">("hi");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const t = content[lang]; 
  const OWNER_NUMBER = "9713126319";

  const handleCall = () => window.open(`tel:${OWNER_NUMBER}`, "_self");
  
  const scrollToRates = () => {
    const section = document.getElementById("rates-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "hi" ? "en" : "hi"));
    toast.success(lang === "hi" ? "Language: English" : "भाषा: हिंदी");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.shopName,
          text: `${t.location} - ${t.shopName}. ${t.viewRates} here!`,
          url: window.location.href,
        });
        toast.success(lang === "hi" ? "शेयर किया गया!" : "Shared successfully!");
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(lang === "hi" ? "लिंक कॉपी हो गया!" : "Link copied!");
    }
  };

  const equipmentIcons = [<Settings key="1" size={20} />, <Tractor key="2" size={20} />, <Truck key="3" size={20} />, <Sprout key="4" size={20} />];
  const processIcons = [PhoneCall, Calendar, Tractor];
  const areaList = lang === "hi" 
    ? ["भाजीपानी", "खापा", "साख", "कुहिया", "मोहगांव", "परसगांव"] 
    : ["Bhajipani", "Khapa", "Sakh", "Kuhiya", "Mohgaon", "Parasgoan"];
  
  const galleryImages = [
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=400&h=300",
    "https://plus.unsplash.com/premium_photo-1732139715621-6f5a0f7e1435?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1651903149620-ad2dab120529?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1666993724963-ceb241907962?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1672664214886-8c2a0affa18c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-emerald-900 text-white pt-6 pb-24 px-6 rounded-b-[2.5rem] shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 flex justify-between items-center mb-8 mt-2">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
            <Tractor size={24} className="text-yellow-400" />
          </div>
          <div className="flex gap-3">
            <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 transition active:scale-95">
              <Languages size={16} /> {lang === "hi" ? "English" : "हिंदी"}
            </button>
            <button onClick={handleShare} className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition active:scale-95 border border-white/10">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700 text-emerald-100 text-xs font-medium mb-4">
            <BadgeCheck size={14} className="text-yellow-400" /> {t.managedBy}: {t.ownerName}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            {t.heroTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">{t.heroSubtitle}</span>
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mb-8 max-w-sm leading-relaxed opacity-90">{t.heroDesc}</p>
          <div className="flex gap-3">
            <button onClick={handleCall} className="flex-1 bg-white text-emerald-900 py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition flex items-center justify-center gap-2">
              <Phone size={18} /> {t.callNow}
            </button>
            <button onClick={scrollToRates} className="flex-1 bg-emerald-800 text-white py-3.5 px-4 rounded-xl font-bold text-sm border border-emerald-700 active:scale-95 transition flex items-center justify-center gap-2">
              {t.viewRates} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="px-6 -mt-12 relative z-20">
        <div className="bg-white p-5 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex justify-between divide-x divide-gray-100">
          {[
            { val: "5+", label: t.stats.years },
            { val: "500+", label: t.stats.farmers },
            { val: "4.9", label: t.stats.rating, icon: true }
          ].map((stat, i) => (
            <div key={i} className="text-center w-1/3">
              <div className="flex items-center justify-center gap-1">
                <p className="text-xl font-extrabold text-gray-900">{stat.val}</p>
                {stat.icon && <Star size={14} fill="#FACC15" className="text-yellow-400" />}
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- OWNER SECTION --- */}
      <div className="px-6 mt-14">
        <div className="bg-gradient-to-br from-emerald-50 via-white to-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-emerald-200 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
              <Image src="/owner.png" alt="Owner" width={100} height={100} className="object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg leading-tight">{t.ownerName}</h2>
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">{t.shopName}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            <span className="font-semibold text-gray-900">{t.intro.greeting}</span> {t.intro.text}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.badges.map((badge, i) => (
              <span key={i} className="text-[11px] bg-white px-3 py-1.5 rounded-full border border-emerald-100 text-emerald-700 font-semibold shadow-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- SEASONAL SPECIAL --- */}
      <div className="px-6 mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="text-green-600" size={20} />
          <h2 className="font-bold text-gray-900 text-lg">{t.season.title}</h2>
        </div>
        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-orange-900">{t.season.special}</h3>
            <p className="text-xs text-orange-800/80 mt-1 max-w-[200px]">{t.season.desc}</p>
          </div>
          <div className="bg-white p-3 rounded-full shadow-sm text-orange-500"><Sprout size={24} /></div>
        </div>
      </div>

      {/* --- EQUIPMENT SHOWCASE --- */}
      <div className="px-6 mt-12">
        <h2 className="text-gray-900 font-bold text-xl mb-6 flex items-center gap-2">
          <Wrench className="text-emerald-600" size={22} /> {t.equipments.title}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {t.equipments.list.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
              <div className="bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center text-gray-600">{equipmentIcons[idx]}</div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm leading-tight">{item.name}</h3>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SERVICES LIST (IMPORTED) --- */}
      <ServicesSection t={t} handleCall={handleCall} />

      {/* --- PHOTO GALLERY --- */}
      <div className="mt-14 bg-white py-10">
        <div className="px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 font-bold text-xl flex items-center gap-2">
              <ImageIcon className="text-emerald-600" size={20} /> {t.gallery.title}
            </h2>
            <span className="text-xs text-emerald-600 font-bold">{t.gallery.recent}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {galleryImages.map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden shadow-sm h-32 relative ${i === 2 ? "col-span-2" : ""}`}>
                <img src={img} alt="Work" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- WORKING PROCESS --- */}
      <div className="px-6 mt-14">
        <h2 className="text-gray-900 font-bold text-xl mb-6 text-center">{t.process.title}</h2>
        <div className="space-y-4">
          {t.process.steps.map((step, idx) => {
            const Icon = processIcons[idx];
            return (
              <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100"><Icon size={22} /></div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{idx + 1}. {step.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{step.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- EMERGENCY SUPPORT --- */}
      <div className="px-6 mt-14">
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center">
          <AlertTriangle className="text-red-500 mx-auto mb-3" size={28} />
          <h3 className="font-bold text-gray-900">{t.emergency.title}</h3>
          <p className="text-xs text-gray-600 mt-1 mb-4">{t.emergency.desc}</p>
          <button onClick={handleCall} className="text-xs font-bold bg-white text-red-600 border border-red-200 px-4 py-2 rounded-full shadow-sm">{t.emergency.btn}</button>
        </div>
      </div>

      {/* --- WHY CHOOSE US --- */}
      <div className="px-6 mt-14">
        <h2 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" size={20} /> {t.why.title} {lang === 'en' && t.shopName}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Clock className="text-emerald-600 mb-2" size={24} />
            <h3 className="font-bold text-sm text-gray-800">{t.why.onTime.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{t.why.onTime.desc}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Users className="text-emerald-600 mb-2" size={24} />
            <h3 className="font-bold text-sm text-gray-800">{t.why.expert.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{t.why.expert.desc}</p>
          </div>
        </div>
      </div>

      {/* --- SERVICE AREAS --- */}
      <div className="px-6 mt-14">
        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 text-center">
          <MapPin size={28} className="text-emerald-600 mx-auto mb-3" />
          <h2 className="text-gray-900 font-bold text-lg mb-2">{t.areas.title}</h2>
          <p className="text-xs text-gray-500 mb-4">{t.areas.desc}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {areaList.map((area, i) => (
              <span key={i} className="text-[10px] font-bold bg-white text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">{area}</span>
            ))}
          </div>
        </div>
      </div>

      {/* --- FAQ SECTION --- */}
      <div className="px-6 mt-14 mb-8">
        <h2 className="text-gray-900 font-bold text-xl mb-5">{t.faq.title}</h2>
        <div className="space-y-3">
          {t.faq.list.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all">
              <button onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} className="w-full flex justify-between items-center p-4 text-left">
                <span className="font-bold text-gray-800 text-sm">{faq.q}</span>
                {openFaqIndex === index ? <ChevronUp size={18} className="text-emerald-600 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
              </button>
              {openFaqIndex === index && <div className="px-4 pb-4 bg-gray-50/50"><p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p></div>}
            </div>
          ))}
        </div>
      </div>

      {/* --- TESTIMONIALS & BOTTOM BAR --- */}
      <div className="px-6 mt-8 mb-24">
        <h2 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-2">
          <ThumbsUp className="text-emerald-600" size={20} /> {t.testimonials.title}
        </h2>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="#FACC15" className="text-yellow-400" />)}
          </div>
          <p className="text-sm text-gray-600 italic mb-4">{t.testimonials.text}</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">RP</div>
            <div>
              <p className="text-xs font-bold text-gray-900">Rajesh Patel</p>
              <p className="text-[10px] text-gray-400">{t.testimonials.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button onClick={handleCall} className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 translate-y-1/2 rotate-12 blur-2xl"></div>
          <div className="bg-white/20 p-2 rounded-full animate-pulse"><Phone size={20} /></div>
          {t.footerBtn} {t.ownerName}
        </button>
      </div>
    </div>
  );
}