"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return; 
    }

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-emerald-900 border border-emerald-800 rounded-2xl p-4 shadow-2xl flex items-center gap-4 text-white">
        <div className="bg-emerald-800 p-3 rounded-xl shrink-0">
          <Download size={24} className="text-emerald-100" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-sm tracking-tight text-white mb-0.5">Install App</h3>
          <p className="text-[11px] text-emerald-200 leading-tight">
            Add to home screen for faster access & better experience.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleClose}
            className="p-2 text-emerald-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <button 
            onClick={handleInstallClick}
            className="bg-white text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
