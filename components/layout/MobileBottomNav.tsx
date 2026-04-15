"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, PlusSquare, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "لوحة", icon: LayoutDashboard },
  { href: "/inventory", label: "المخزن", icon: Package },
  { href: "/sales", label: "المبيعات", icon: ShoppingCart },
  { href: "/add-product", label: "إضافة", icon: PlusSquare },
  { href: "/returns", label: "المرتجعات", icon: RotateCcw },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-around bg-white border-t border-border px-2 py-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px]",
              isActive ? "text-accent" : "text-text-secondary"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}