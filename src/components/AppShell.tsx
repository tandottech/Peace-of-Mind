"use client";
import { usePathname } from "next/navigation";
import DesktopSidebar from "./DesktopSidebar";

const AUTH_PATHS = ["/login", "/signup"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <div className="flex-1 ml-[280px] min-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
