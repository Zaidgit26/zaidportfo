import { ActOneSignal } from "@/components/act-one-signal";
import { ActTwoBuild } from "@/components/act-two-build";
import { ActThreeMethod } from "@/components/act-three-method";
import { ActFourProcess } from "@/components/act-four-process";
import { ActFiveLine } from "@/components/act-five-line";

export default function Home() {
  return (
    <main className="relative w-full flex flex-col">
      <ActOneSignal />
      <ActTwoBuild />
      <ActThreeMethod />
      <ActFourProcess />
      <ActFiveLine />
    </main>
  );
}
