"use client";

import { useLoader } from "@/context/LoaderContext";
import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
  const { isLoading } = useLoader();

  if (!isLoading) return null;


return (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
  </div>
);

}
