import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Rise Again | Student Resilience",
  description: "A Living Archive for Student Resilience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-stone-50 text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed antialiased min-h-screen flex justify-center">
        {/* Mobile App Container */}
        <div className="relative w-full max-w-md min-h-screen bg-gradient-to-br from-[#fbf9f5] via-[#e5efdf] to-[#99c9a6] shadow-2xl overflow-x-hidden">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
