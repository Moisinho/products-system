"use client";

import { motion } from "motion/react";
import { pageTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
