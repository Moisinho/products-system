"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
  index?: number;
  loading?: boolean;
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  index = 0,
  loading,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.22, ease: EASE }}
    >
      <Card
        className={cn(
          "group relative gap-0 overflow-hidden p-5 shadow-sm transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md",
          "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-brand before:opacity-0 before:transition-opacity before:duration-200 group-hover:before:opacity-100",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">{label}</p>
            {loading ? (
              <div className="shimmer h-8 w-24 rounded-md bg-muted" />
            ) : (
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {value}
              </p>
            )}
          </div>
          <div
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-lg ring-1 ring-inset ring-border/60 transition-transform duration-200 group-hover:scale-105",
              accent ?? "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="size-[18px]" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
