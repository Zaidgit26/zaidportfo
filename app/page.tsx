import { ActOneSignal } from "@/components/act-one-signal";
import { ActTwoWork } from "@/components/act-two-work";
import { ActThreeMethod } from "@/components/act-three-method";
import { ActFourChapter } from "@/components/act-four-chapter";
import { ActFiveLine } from "@/components/act-five-line";

export default function Home() {
  return (
    <main className="relative w-full flex flex-col">
      <ActOneSignal />
      <ActTwoWork />
      <ActThreeMethod />
      <ActFourChapter />
      <ActFiveLine />
    </main>
  );
}
