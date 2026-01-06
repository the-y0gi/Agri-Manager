"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Tractor,
  Clock,
  Tag,
  Share2,
  MapPin,
  Star,
  BadgeCheck,
  Users,
  ShieldCheck,
  ArrowRight,
  ThumbsUp,
} from "lucide-react";
import toast from "react-hot-toast";

interface Service {
  _id: string;
  name: string;
  rateType: "hourly" | "fixed";
  price: number;
}

export default function PublicPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const OWNER_NUMBER = "9713126319";
  const SHOP_NAME = "Jay Jawan Tractor Service";
  const LOCATION = "Bhajipani, Madhya Pradesh";

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (Array.isArray(data)) setServices(data);
      } catch (error) {
        console.error("Error fetching services", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleCall = () => {
    window.open(`tel:${OWNER_NUMBER}`, "_self");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: SHOP_NAME,
          text: `Best Tractor Services in ${LOCATION}. Check rates here!`,
          url: window.location.href,
        });
        toast.success("Shared successfully!");
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-emerald-900 text-white pt-10 pb-20 px-6 rounded-b-[2.5rem] shadow-2xl overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/4"></div>

        {/* Top Header */}
        <div className="relative z-10 flex justify-between items-start mb-8">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
            <Tractor size={28} className="text-yellow-400" />
          </div>
          <button
            onClick={handleShare}
            className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition active:scale-95 border border-white/10"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700 text-emerald-100 text-xs font-medium mb-4">
            <BadgeCheck size={14} className="text-yellow-400" />
            Certified Service Provider
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
            Powerful Farming <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-yellow-200">
              Solutions For You
            </span>
          </h1>

          <p className="text-emerald-100 text-sm mb-6 max-w-xs leading-relaxed opacity-90">
            Professional tractor services in {LOCATION}. Fast, reliable, and
            affordable rates for all your farming needs.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleCall}
              className="flex-1 bg-white text-emerald-900 py-3 px-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Phone size={16} /> Call Now
            </button>
            <button className="flex-1 bg-emerald-800 text-white py-3 px-4 rounded-xl font-bold text-sm border border-emerald-700 active:scale-95 transition flex items-center justify-center gap-2">
              View Rates <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION (Floating) --- */}
      <div className="px-6 -mt-10 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex justify-between divide-x divide-gray-100">
          <div className="text-center w-1/3">
            <p className="text-lg font-bold text-gray-900">5+</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
              Years
            </p>
          </div>
          <div className="text-center w-1/3">
            <p className="text-lg font-bold text-gray-900">500+</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
              Clients
            </p>
          </div>
          <div className="text-center w-1/3">
            <div className="flex items-center justify-center gap-1">
              <p className="text-lg font-bold text-gray-900">4.9</p>
              <Star size={12} fill="#FACC15" className="text-yellow-400" />
            </div>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
              Rating
            </p>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US --- */}
      <div className="px-6 mt-10">
        <h2 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" size={20} />
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Clock className="text-emerald-600 mb-2" size={24} />
            <h3 className="font-bold text-sm text-gray-800">On Time</h3>
            <p className="text-xs text-gray-500 mt-1">Always punctual.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Users className="text-emerald-600 mb-2" size={24} />
            <h3 className="font-bold text-sm text-gray-800">Expert Drivers</h3>
            <p className="text-xs text-gray-500 mt-1">Skilled team.</p>
          </div>
        </div>
      </div>

      {/* --- SERVICES LIST --- */}
      <div className="px-6 mt-10 relative z-20 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900 font-bold text-xl">Our Services</h2>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
            Updated Rates
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-3xl shadow-sm animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={service._id}
                className="group relative bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
              >
                {/* Decorative circle */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-10 -mt-10 transition-colors group-hover:bg-emerald-50/50"></div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-emerald-50 h-10 w-10 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Tractor size={20} strokeWidth={2} />
                    </div>
                    {index === 0 && (
                      <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      {service.rateType === "hourly" ? (
                        <Clock size={12} />
                      ) : (
                        <Tag size={12} />
                      )}
                      <span className="capitalize">
                        {service.rateType} Basis
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">
                        Starting at
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-gray-900">
                          ₹{service.price}
                        </span>
                        <span className="text-xs font-bold text-gray-400">
                          /{service.rateType === "hourly" ? "hr" : "unit"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleCall}
                      className="bg-black text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {services.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl p-8 text-center border border-dashed border-gray-300">
                <p className="text-gray-400 font-medium">
                  No services listed yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- TESTIMONIALS (New Content) --- */}
      <div className="px-6 mt-12 mb-8">
        <h2 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-2">
          <ThumbsUp className="text-emerald-600" size={20} />
          Happy Farmers
        </h2>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                fill="#FACC15"
                className="text-yellow-400"
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 italic mb-4">
            &quot;Bohot badhiya service hai. Driver time par aaye aur kaam
            safayi se kiya. Rates bhi market se acche hain.&quot;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
              RP
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Rajesh Patel</p>
              <p className="text-[10px] text-gray-400">Local Farmer</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER INFO --- */}
      <div className="text-center py-8 text-gray-400 text-xs">
        <p className="font-medium mb-1">{SHOP_NAME}</p>
        <div className="flex items-center justify-center gap-1">
          <MapPin size={10} /> {LOCATION}
        </div>
      </div>

      {/* --- STICKY BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleCall}
          className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-1/2 rotate-12 blur-2xl"></div>
          <div className="bg-white/20 p-1.5 rounded-full animate-pulse">
            <Phone size={20} />
          </div>
          Call To Book Now
        </button>
      </div>
    </div>
  );
}
