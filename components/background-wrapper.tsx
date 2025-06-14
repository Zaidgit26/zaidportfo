"use client"

import { GalaxyBackground } from "@/components/galaxy-background"
import { useActiveSection } from "@/hooks/use-active-section"

export function BackgroundWrapper() {
  const activeSection = useActiveSection()

  return (
    <div className="fixed inset-0 -z-10">
      {/* Deep space base layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Subtle cosmic glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.08),transparent_40%)]" />

      {/* Galaxy background with stars and nebulae */}
      <GalaxyBackground section={activeSection} />
    </div>
  )
}
