"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

export function useReveal(threshold = 0.15, once = true) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  return { ref, isInView };
}
