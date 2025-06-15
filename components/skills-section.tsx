"use client"

import { motion } from "framer-motion"
import { SkillGraph } from "./SkillGraph"

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-space-grotesk">
            My Skills
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-blue-500 mx-auto neo-glow rounded-full"></div>
        </motion.div>

        {/* Skills Graph */}
        <div className="flex justify-center">
          <SkillGraph />
        </div>
      </div>
    </section>
  )
}