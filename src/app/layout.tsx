import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/context/LanguageContext";
import { LoaderProvider } from "@/context/LoaderContext";
import GlobalLoader from "@/components/GlobalLoader"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriManager",
  description: "Tractor Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <LoaderProvider>
            <GlobalLoader />
            {children}
            
            <Toaster 
              position="top-center"
              toastOptions={{
                style: {
                  background: '#333',
                  color: '#fff',
                  borderRadius: '10px',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </LoaderProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}