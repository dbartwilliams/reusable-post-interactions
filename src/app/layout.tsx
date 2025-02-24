import {ClerkProvider} from '@clerk/nextjs'
import { ThemeProvider } from "@/components/ThemeProvider"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from "react-hot-toast";
import WhoToFollow from '@/components/WhoToFollow';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Africa24 | Social Media",
  description: "Supporting 1.5Billion Africans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>

              <div className="min-h-screen">
                    {/* Navbar */}
                    <Navbar />

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4">
                      {/* Sidebar */}
                      <div className="hidden lg:block lg:col-span-3 sticky top-20 h-fit">
                        <Sidebar />
                      </div>

                      {/* Main Content */}
                      <div className="lg:col-span-6">
                        {children}
                      </div>

                      {/* WhoToFollow */}
                      <div className="hidden lg:block lg:col-span-3 sticky top-20 h-fit">
                        <WhoToFollow />
                      </div>
                    </div>
                  </div>
              <Toaster />
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}



