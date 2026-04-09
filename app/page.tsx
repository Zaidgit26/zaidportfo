"use client";

import { ActOneSignal } from "@/components/act-one-signal";
import { ActTwoBuild } from "@/components/act-two-build";
import { ActThreeMethod } from "@/components/act-three-method";
import { ActFourProcess } from "@/components/act-four-process";
import { ActFiveLine } from "@/components/act-five-line";
import dynamic from "next/dynamic";

const AuroraSphere = dynamic(
  () => import("@/components/orbital-mesh").then((mod) => mod.AuroraSphere),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative w-full flex flex-col">
      <div className="fixed inset-0 z-[0] pointer-events-none opacity-40">
        <AuroraSphere />
      </div>
      
      {/* Act 1 has its own solid background to hide the global sphere */}
      <ActOneSignal />
      <ActTwoBuild />
      <ActThreeMethod />
      <ActFourProcess />
      <ActFiveLine />
    </main>
  );
}
