"use client";
import { useState, useEffect } from "react";
import { Tractor, Clock, Tag, Fuel, ArrowRight } from "lucide-react";

interface Service {
  _id: string;
  name: string;
  rateType: "hourly" | "fixed";
  price: number;
}

export default function ServicesSection({ t, handleCall }: { t: any; handleCall: () => void }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div id="rates-section" className="px-6 mt-14 relative z-20 space-y-4 scroll-mt-24">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 font-bold text-xl">{t.services.title}</h2>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
          {t.services.updated}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl shadow-sm animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={service._id}
              className="group relative bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-lg overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-10 -mt-10 transition-colors group-hover:bg-emerald-50/50"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-emerald-50 h-10 w-10 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Tractor size={20} strokeWidth={2} />
                  </div>
                  {index === 0 && (
                    <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      {t.services.popular}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{service.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded">
                      {service.rateType === "hourly" ? <Clock size={10} /> : <Tag size={10} />}
                      <span className="capitalize">{service.rateType}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                      <Fuel size={10} /> {t.services.dieselFree}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
                  <div>
                    <span className="text-xs text-gray-400 font-medium">{t.services.rateLabel}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-gray-900">₹{service.price}</span>
                      <span className="text-xs font-bold text-gray-400">
                        /{service.rateType === "hourly" ? "hr" : "unit"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCall}
                    className="bg-black text-white p-2.5 rounded-full hover:bg-emerald-600 transition-colors shadow-lg"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full bg-white rounded-3xl p-8 text-center border border-dashed border-gray-300">
              <p className="text-gray-400 font-medium">{t.services.empty}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}