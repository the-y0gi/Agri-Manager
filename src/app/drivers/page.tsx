"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  ChevronDown,
  ArrowLeft,
  ArrowUpRight,
  X,
  Edit2,
  Check,
  Loader2,
  Clock,
  UserPlus,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const content = {
  en: {
    title: "Drivers",
    placeholder: "Driver name...",
    addBtn: "Add",
    payments: "Payments",
    history: "History",
    payTitle: "Add Payment",
    updateTitle: "Update Payment",
    amountLabel: "Amount",
    confirm: "Confirm",
    cancel: "Cancel",
    update: "Update",
    loading: "Loading Drivers...",
  },
  hi: {
    title: "ड्राइवर प्रबंधन",
    placeholder: "ड्राइवर का नाम...",
    addBtn: "जोड़ें",
    payments: "भुगतान",
    history: "इतिहास",
    payTitle: "भुगतान जोड़ें",
    updateTitle: "भुगतान सुधारें",
    amountLabel: "राशि",
    confirm: "पुष्टि करें",
    cancel: "रद्द करें",
    update: "अपडेट",
    loading: "ड्राइवर लोड हो रहे हैं...",
  },
};

export default function DriversPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = content[lang as keyof typeof content];

  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDriverName, setNewDriverName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedDriverName, setSelectedDriverName] = useState("");

  // Edit States
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [editingPayment, setEditingPayment] = useState<{
    id: string;
    amount: number;
  } | null>(null);

  const fetchDrivers = useCallback(async () => {
    try {
      const res = await fetch("/api/drivers");
      const data = await res.json();
      if (res.ok) {
        setDrivers(data);
      }
    } catch (error) {
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleAddDriver = async () => {
    if (!newDriverName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ADD_DRIVER", name: newDriverName }),
      });
      if (res.ok) {
        setNewDriverName("");
        await fetchDrivers();
        toast.success(lang === "hi" ? "ड्राइवर जोड़ा गया" : "Driver added");
      }
    } catch (error) {
      toast.error("Error adding driver");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentAmount || isSubmitting) return;
    setIsSubmitting(true);

    const isUpdate = !!editingPayment;
    const body = isUpdate
      ? {
          type: "UPDATE_PAYMENT",
          driverId: selectedDriverId,
          paymentId: editingPayment.id,
          updatedAmount: Number(paymentAmount),
        }
      : {
          type: "ADD_PAYMENT",
          driverId: selectedDriverId,
          payment: {
            amount: Number(paymentAmount),
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            note: "Driver Payment",
          },
        };

    try {
      const res = await fetch("/api/drivers", {
        method: isUpdate ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setPaymentAmount("");
        await fetchDrivers();
        toast.success(
          lang === "hi" ? "सुरक्षित किया गया" : "Saved successfully",
        );
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveNameEdit = async (id: string) => {
    try {
      const res = await fetch("/api/drivers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "UPDATE_NAME",
          driverId: id,
          name: tempName,
        }),
      });
      if (res.ok) {
        setEditingDriverId(null);
        await fetchDrivers();
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
        <p className="text-sm font-bold text-gray-400 animate-pulse">
          {t.loading}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100/50 px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-5">
          <button
            onClick={() => router.back()}
            className="bg-gray-100 p-2.5 rounded-full text-gray-600 active:scale-95 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {t.title}
          </h1>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder={t.placeholder}
            value={newDriverName}
            onChange={(e) => setNewDriverName(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3.5 outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
          />
          <button
            onClick={handleAddDriver}
            disabled={isSubmitting}
            className="bg-emerald-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:bg-gray-300"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <UserPlus size={22} />
            )}
          </button>
        </div>
      </header>

      <div className="px-5 space-y-4 pt-6">
        {drivers.length === 0 ? (
          <div className="text-center py-20 opacity-30 font-bold text-gray-400 uppercase tracking-widest text-xs">
            No Drivers Found
          </div>
        ) : (
          drivers.map((driver) => (
            <div
              key={driver._id}
              className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden transition-all"
            >
              <div
                className="p-5 flex items-center justify-between"
                onClick={() =>
                  setExpandedId(expandedId === driver._id ? null : driver._id)
                }
              >
                <div className="flex flex-col gap-1 overflow-hidden flex-1 pr-2">
                  {editingDriverId === driver._id ? (
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="bg-gray-100 border-none rounded-lg px-2 py-1 text-sm font-bold w-full outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => saveNameEdit(driver._id)}
                        className="text-emerald-600 bg-emerald-50 p-1 rounded-md"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 overflow-hidden">
                      {/*Truncate long names */}
                      <h3 className="text-lg font-extrabold text-gray-800 leading-none truncate">
                        {driver.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDriverId(driver._id);
                          setTempName(driver.name);
                        }}
                        className="text-gray-300 flex-shrink-0"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  )}
                  <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase tracking-wider w-fit">
                    {driver.paymentLogs?.length || 0} {t.payments}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5 leading-none">
                      Total Paid
                    </p>
                    <p className="text-xl font-black text-gray-900 tracking-tight">
                      ₹{driver.totalPaid || 0}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDriverId(driver._id);
                      setSelectedDriverName(driver.name);
                      setEditingPayment(null);
                      setPaymentAmount("");
                      setIsModalOpen(true);
                    }}
                    className="h-10 w-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-all"
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
                  <ChevronDown
                    size={18}
                    className={`text-gray-300 transition-transform duration-300 ${expandedId === driver._id ? "rotate-180" : ""}`}
                  />
                </div>
              </div>

              {expandedId === driver._id && (
                <div className="px-5 pb-5 bg-gray-50/50 pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                      {t.history}
                    </span>
                    <div className="h-[1px] flex-1 bg-gray-200"></div>
                  </div>

                  <div className="space-y-3">
                    {!driver.paymentLogs || driver.paymentLogs.length === 0 ? (
                      <p className="text-center text-[10px] text-gray-300 font-bold py-4 tracking-widest uppercase">
                        {lang === "hi" ? "कोई इतिहास नहीं" : "NO HISTORY"}
                      </p>
                    ) : (
                      driver.paymentLogs.map((item: any) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            setSelectedDriverId(driver._id);
                            setSelectedDriverName(driver.name);
                            setEditingPayment({
                              id: item._id,
                              amount: item.amount,
                            });
                            setPaymentAmount(item.amount.toString());
                            setIsModalOpen(true);
                          }}
                          className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm active:bg-emerald-50/20 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl group-active:scale-90 transition-transform">
                              <ArrowUpRight size={16} />
                            </div>
                            <div>
                              <p className="font-extrabold text-gray-800 text-sm">
                                {new Date(item.date).toLocaleDateString(
                                  lang === "hi" ? "hi-IN" : "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "2-digit",
                                  },
                                )}
                              </p>
                              {/* Time logic updated */}
                              <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 leading-none mt-1">
                                <Clock size={10} />
                                {new Date(item.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-black text-gray-900 tracking-tighter">
                              ₹{item.amount.toLocaleString()}
                            </p>
                            <div className="bg-gray-50 p-1.5 rounded-lg text-gray-300 group-hover:text-emerald-500 transition-colors">
                              <Edit2 size={12} />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-white w-full max-w-[340px] rounded-[32px] shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in duration-300 overflow-hidden mb-6 sm:mb-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg text-gray-900 tracking-tight">
                  {editingPayment ? t.updateTitle : t.payTitle}
                </h3>
                <button
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 p-1.5 rounded-full text-gray-400 active:scale-90"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100/50 overflow-hidden">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
                  <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest truncate">
                    {selectedDriverName}
                  </span>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="0"
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 pl-10 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-black text-2xl transition-all disabled:opacity-50"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 rounded-xl bg-gray-50 text-gray-500 font-bold text-xs active:scale-95"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={isSubmitting}
                    className="flex-[1.5] py-3.5 rounded-xl bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-100 active:scale-95 transition-all disabled:bg-emerald-300"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin inline mr-2" size={14} />
                    ) : editingPayment ? (
                      t.update
                    ) : (
                      t.confirm
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
