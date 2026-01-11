"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("hi");

  useEffect(() => {
    const savedLang = localStorage.getItem("app-lang") as Language;
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => {
      const newLang = prev === "hi" ? "en" : "hi";
      localStorage.setItem("app-lang", newLang); 
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}