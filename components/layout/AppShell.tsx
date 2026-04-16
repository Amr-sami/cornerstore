"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";

interface AppShellProps {
  children: ReactNode;
  title: string;
}

export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg-main overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed start-0 top-0 w-60 h-screen bg-bg-sidebar z-40 no-print">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="lg:ms-60 min-h-screen flex flex-col">
        <main className="flex-1 p-4 md:p-6 pb-24 lg:pb-6">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 no-print">
        <MobileBottomNav />
      </div>
    </div>
  );
}