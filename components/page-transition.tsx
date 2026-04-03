"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* Exit overlay: slides in from bottom */}
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{ backgroundColor: "var(--color-void)" }}
          initial={{ y: "100%" }}
          animate={{ y: "-100%" }}
          transition={{
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
          }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
