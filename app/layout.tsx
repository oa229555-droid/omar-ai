import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundEffect from "@/components/BackgroundEffect";

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "قديم استور | أرشيف الأنمي الخالد",
  description: "أكبر منصة لمشاهدة الأنمي القديم والكلاسيكي - استرجع ذكريات الطفولة",
  keywords: "انمي قديم, كلاسيك انمي, dragon ball, naruto, one piece",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <BackgroundEffect />
        <Navbar />
        <main className="relative z-10 pt-20 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
