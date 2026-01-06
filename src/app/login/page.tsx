"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tractor, Lock, Mail, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Verifying credentials...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Welcome back, Admin!", { id: toastId });
        router.push("/");
        router.refresh(); 
      } else {
        toast.error("Invalid Email or Password", { id: toastId });
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", { id: toastId });
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 p-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 mb-4 shadow-inner ring-4 ring-white">
            <Tractor size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">AgriManager</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Secure Admin Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">
              Email Address
            </label>
            <div className="relative group">
              <input 
                type="email" 
                required
                className="w-full pl-11 pr-4 p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                placeholder="admin@tractor.com"
                value={data.email}
                onChange={(e) => setData({...data, email: e.target.value})}
              />
              <Mail className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">
              Password
            </label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-11 pr-12 p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                placeholder="••••••••"
                value={data.password}
                onChange={(e) => setData({...data, password: e.target.value})}
              />
              <Lock className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Verifying...
              </>
            ) : (
              <>
                Login to Dashboard <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-2">Want to check rates?</p>
          <Link href="/public">
             <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all">
               View Public Website
             </button>
          </Link>
        </div>
      </div>
    </div>
  );
}