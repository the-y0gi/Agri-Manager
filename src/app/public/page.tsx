
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
    ? ["भाजीपानी", "खापा","उमरहर","साख", "कुहिया", "मोहगांव", "परसगांव", "जटामा","जैतपुर","मदनपुर"] 
    : ["Bhajipani", "Khapa", "Umarhar","Sankh", "Kuhiya", "Mohgaon", "Parasgoan","Jataama","Jaitpur","Madanpur"];
  
  const galleryImages = [
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=400&h=300",
    "https://plus.unsplash.com/premium_photo-1732139715621-6f5a0f7e1435?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1651903149620-ad2dab120529?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1666993724963-ceb241907962?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1672664214886-8c2a0affa18c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32 md:pb-12">
      {/* WRAPPER FOR DESKTOP CENTER ALIGNMENT */}
      <div className="max-w-7xl mx-auto md:px-8">
        
        {/* --- HERO SECTION --- */}
        <div className="relative bg-emerald-900 text-white pt-6 pb-24 px-6 rounded-b-[2.5rem] md:rounded-[3rem] md:mt-4 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/4"></div>

          <div className="relative z-10 flex justify-between items-center mb-8 mt-2 md:mb-12">
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

          <div className="relative z-10 md:flex md:flex-col md:items-center md:text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700 text-emerald-100 text-xs font-medium mb-4">
              <BadgeCheck size={14} className="text-yellow-400" /> {t.managedBy}: {t.ownerName}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 md:mb-6">
              {t.heroTitle} <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200"> {t.heroSubtitle}</span>
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mb-8 max-w-sm md:max-w-2xl leading-relaxed opacity-90">{t.heroDesc}</p>
            <div className="flex gap-3 w-full md:w-auto md:gap-6">
              <button onClick={handleCall} className="flex-1 md:flex-none md:w-48 bg-white text-emerald-900 py-3.5 px-4 rounded-xl font-bold text-sm md:text-base shadow-lg active:scale-95 transition flex items-center justify-center gap-2">
                <Phone size={18} /> {t.callNow}
              </button>
              <button onClick={scrollToRates} className="flex-1 md:flex-none md:w-48 bg-emerald-800 text-white py-3.5 px-4 rounded-xl font-bold text-sm md:text-base border border-emerald-700 active:scale-95 transition flex items-center justify-center gap-2">
                {t.viewRates} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* --- STATS SECTION --- */}
        <div className="px-6 -mt-12 md:-mt-16 relative z-20 md:max-w-4xl md:mx-auto">
          <div className="bg-white p-5 md:p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex justify-between divide-x divide-gray-100">
            {[
              { val: "5+", label: t.stats.years },
              { val: "500+", label: t.stats.farmers },
              { val: "4.9", label: t.stats.rating, icon: true }
            ].map((stat, i) => (
              <div key={i} className="text-center w-1/3">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-xl md:text-3xl font-extrabold text-gray-900">{stat.val}</p>
                  {stat.icon && <Star size={14} fill="#FACC15" className="text-yellow-400 md:w-6 md:h-6" />}
                </div>
                <p className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-wide mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP GRID CONTAINER 1: Owner + Seasonal */}
        <div className="md:grid md:grid-cols-2 md:gap-8 md:mt-16">
          
          {/* --- OWNER SECTION --- */}
          <div className="px-6 mt-14 md:mt-0">
            <div className="bg-gradient-to-br from-emerald-50 via-white to-white rounded-2xl p-6 border border-emerald-100 shadow-sm h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-200 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                  <Image src="/owner.png" alt="Owner" width={100} height={100} className="object-cover" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg md:text-xl leading-tight">{t.ownerName}</h2>
                  <p className="text-xs md:text-sm text-emerald-700 font-bold uppercase tracking-wider">{t.shopName}</p>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5">
                <span className="font-semibold text-gray-900">{t.intro.greeting}</span> {t.intro.text}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.badges.map((badge, i) => (
                  <span key={i} className="text-[11px] md:text-xs bg-white px-3 py-1.5 rounded-full border border-emerald-100 text-emerald-700 font-semibold shadow-sm">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* --- SEASONAL SPECIAL --- */}
          <div className="px-6 mt-12 md:mt-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="text-green-600" size={20} />
              <h2 className="font-bold text-gray-900 text-lg md:text-xl">{t.season.title}</h2>
            </div>
            <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex items-center justify-between h-full">
              <div>
                <h3 className="font-bold text-orange-900 md:text-lg">{t.season.special}</h3>
                <p className="text-xs md:text-sm text-orange-800/80 mt-1 max-w-[200px] md:max-w-xs">{t.season.desc}</p>
              </div>
              <div className="bg-white p-3 rounded-full shadow-sm text-orange-500"><Sprout size={24} className="md:w-8 md:h-8" /></div>
            </div>
          </div>

        </div>

        {/* --- EQUIPMENT SHOWCASE --- */}
        <div className="px-6 mt-12 md:mt-20">
          <h2 className="text-gray-900 font-bold text-xl md:text-2xl mb-6 flex items-center gap-2">
            <Wrench className="text-emerald-600" size={22} /> {t.equipments.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {t.equipments.list.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 md:h-40 hover:shadow-md transition-shadow">
                <div className="bg-gray-50 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-gray-600">
                  {/* Need to ensure icon sizing works, cloning element with new size if needed, or simple wrapper */}
                  <div className="scale-100 md:scale-110">{equipmentIcons[idx]}</div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight">{item.name}</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- SERVICES LIST (IMPORTED) --- */}
        <div className="md:mt-8">
            <ServicesSection t={t} handleCall={handleCall} />
        </div>

        {/* --- PHOTO GALLERY --- */}
        <div className="mt-14 bg-white py-10 md:rounded-3xl md:mx-6 md:shadow-sm md:border md:border-gray-50">
          <div className="px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900 font-bold text-xl md:text-2xl flex items-center gap-2">
                <ImageIcon className="text-emerald-600" size={20} /> {t.gallery.title}
              </h2>
              <span className="text-xs md:text-sm text-emerald-600 font-bold cursor-pointer hover:underline">{t.gallery.recent}</span>
            </div>
            {/* Modified Grid for Desktop: 2 cols mobile, 4 cols desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden shadow-sm h-32 md:h-48 relative group ${i === 2 ? "col-span-2 md:col-span-1" : ""}`}>
                  <img src={img} alt="Work" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- WORKING PROCESS --- */}
        <div className="px-6 mt-14 md:mt-20">
          <h2 className="text-gray-900 font-bold text-xl md:text-2xl mb-6 text-center">{t.process.title}</h2>
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
            {t.process.steps.map((step, idx) => {
              const Icon = processIcons[idx];
              return (
                <div key={idx} className="flex md:flex-col md:text-center md:items-center items-center gap-4 bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-colors">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100"><Icon size={22} className="md:w-8 md:h-8" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base md:text-lg">{idx + 1}. {step.title}</h4>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">{step.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DESKTOP GRID 2: Emergency + Why Choose */}
        <div className="md:grid md:grid-cols-2 md:gap-8 md:items-start">
            
            {/* --- EMERGENCY SUPPORT --- */}
            <div className="px-6 mt-14 md:mt-20">
              <div className="bg-red-50 p-5 md:p-8 rounded-2xl border border-red-100 text-center h-full flex flex-col justify-center items-center">
                <AlertTriangle className="text-red-500 mx-auto mb-3 md:w-10 md:h-10" size={28} />
                <h3 className="font-bold text-gray-900 md:text-xl">{t.emergency.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1 mb-4 max-w-sm mx-auto">{t.emergency.desc}</p>
                <button onClick={handleCall} className="text-xs md:text-sm font-bold bg-white text-red-600 border border-red-200 px-4 py-2 md:px-6 md:py-3 rounded-full shadow-sm hover:bg-red-600 hover:text-white transition-colors">{t.emergency.btn}</button>
              </div>
            </div>

            {/* --- WHY CHOOSE US --- */}
            <div className="px-6 mt-14 md:mt-20">
              <h2 className="text-gray-900 font-bold text-lg md:text-xl mb-5 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={20} /> {t.why.title} {lang === 'en' && t.shopName}
              </h2>
              <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <Clock className="text-emerald-600 mb-2 md:w-8 md:h-8" size={24} />
                  <h3 className="font-bold text-sm md:text-base text-gray-800">{t.why.onTime.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{t.why.onTime.desc}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <Users className="text-emerald-600 mb-2 md:w-8 md:h-8" size={24} />
                  <h3 className="font-bold text-sm md:text-base text-gray-800">{t.why.expert.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{t.why.expert.desc}</p>
                </div>
              </div>
            </div>
        </div>

        {/* --- SERVICE AREAS --- */}
        <div className="px-6 mt-14 md:mt-24">
          <div className="bg-emerald-50 p-6 md:p-10 rounded-[2rem] border border-emerald-100 text-center md:max-w-3xl md:mx-auto">
            <MapPin size={28} className="text-emerald-600 mx-auto mb-3 md:w-10 md:h-10" />
            <h2 className="text-gray-900 font-bold text-lg md:text-2xl mb-2">{t.areas.title}</h2>
            <p className="text-xs md:text-sm text-gray-500 mb-4">{t.areas.desc}</p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {areaList.map((area, i) => (
                <span key={i} className="text-[10px] md:text-sm font-bold bg-white text-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-200 shadow-sm">{area}</span>
              ))}
            </div>
          </div>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="px-6 mt-14 mb-8 md:mt-24">
          <h2 className="text-gray-900 font-bold text-xl md:text-2xl mb-5 text-center">{t.faq.title}</h2>
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {t.faq.list.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all h-fit">
                <button onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} className="w-full flex justify-between items-center p-4 md:p-5 text-left hover:bg-gray-50">
                  <span className="font-bold text-gray-800 text-sm md:text-base">{faq.q}</span>
                  {openFaqIndex === index ? <ChevronUp size={18} className="text-emerald-600 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                </button>
                {openFaqIndex === index && <div className="px-4 pb-4 md:px-5 md:pb-5 bg-gray-50/50"><p className="text-sm md:text-base text-gray-600 leading-relaxed">{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>

        {/* --- TESTIMONIALS --- */}
        <div className="px-6 mt-8 mb-24 md:mb-20 md:max-w-2xl md:mx-auto">
          <h2 className="text-gray-900 font-bold text-lg md:text-xl mb-5 flex items-center justify-center gap-2">
            <ThumbsUp className="text-emerald-600" size={20} /> {t.testimonials.title}
          </h2>
          <div className="bg-white p-5 md:p-8 rounded-2xl border border-gray-100 shadow-sm relative text-center">
            <div className="flex gap-1 mb-2 justify-center">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="#FACC15" className="text-yellow-400 md:w-5 md:h-5" />)}
            </div>
            <p className="text-sm md:text-lg text-gray-600 italic mb-4">"{t.testimonials.text}"</p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-gray-500">RP</div>
              <div className="text-left">
                <p className="text-xs md:text-sm font-bold text-gray-900">Rajesh Patel</p>
                <p className="text-[10px] md:text-xs text-gray-400">{t.testimonials.role}</p>
              </div>
            </div>
          </div>
        </div>

      </div> {/* END WRAPPER */}

      {/* --- MOBILE STICKY BOTTOM BAR (Hidden on Laptop) --- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        <button onClick={handleCall} className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 translate-y-1/2 rotate-12 blur-2xl"></div>
          <div className="bg-white/20 p-2 rounded-full animate-pulse"><Phone size={20} /></div>
          {t.footerBtn} {t.ownerName}
        </button>
      </div>
    </div>
  );
}