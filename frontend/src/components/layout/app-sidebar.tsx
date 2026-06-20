"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Productos", icon: Package },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="grid size-10 place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm">
          <Boxes className="size-5" />
        </div>
        <span className="text-xl font-semibold tracking-tight text-sidebar-primary">
          Products<span className="text-sidebar-foreground/60">System</span>
        </span>
      </div>

      <nav className="flex-1 space-y-2 p-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium transition-all",
                active
                  ? "bg-brand/15 text-brand shadow-sm ring-1 ring-brand/25"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              {active ? (
                <span className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
              ) : null}
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-lg transition-colors",
                  active
                    ? "bg-brand/20 text-brand"
                    : "bg-sidebar-accent/40 text-sidebar-foreground/80 group-hover:bg-sidebar-accent group-hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground/50">
        ProductsSystem · v1.0
      </div>
    </aside>
  );
}
