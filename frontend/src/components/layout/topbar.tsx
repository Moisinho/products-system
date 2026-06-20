"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import type { SessionUser } from "@/types/auth";

function sectionTitle(pathname: string): string {
  if (pathname.startsWith("/products/new")) return "Nuevo producto";
  if (pathname.includes("/products/") && pathname.endsWith("/edit"))
    return "Editar producto";
  if (pathname.startsWith("/products")) return "Gestión de productos";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  return "";
}

export function Topbar({ user }: { user: SessionUser }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 md:px-6">
      <h1 className="truncate text-lg font-semibold tracking-tight text-foreground md:text-xl">
        {sectionTitle(pathname)}
      </h1>
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
