"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2 neo-text font-space-grotesk">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 neo-glow rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
          <div className="w-full md:w-2/5 flex justify-center floating-delay-1">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-primary/20 neo-glow">
              <Image src="/profile.png" alt="Profile" fill className="object-cover" />
            </div>
          </div>

          <div className="w-full md:w-3/5 neo-card p-8">
            <p className="text-white/90 mb-4 leading-relaxed">
              Full-stack developer skilled in React, Next.js, Node.js, and MongoDB. Currently pursuing MCA at Measi 
              Institute of Information Technology, with a focus on building scalable web applications and exploring 
              cloud & DevOps technologies.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="neo-card p-4">
                <h3 className="font-medium text-primary font-space-grotesk">Education</h3>
                <p className="text-white/80 text-sm font-poppins">MCA (Ongoing) - Measi Institute of Information Technology </p>
              </div>
              <div className="neo-card p-4">
                <h3 className="font-medium text-primary font-space-grotesk">Location</h3>
                <p className="text-white/80 text-sm font-poppins">Chennai, India</p>
              </div>
              <div className="neo-card p-4">
                <h3 className="font-medium text-primary font-space-grotesk">Email</h3>
                <p className="text-white/80 text-sm font-poppins">reachme.zaid@gmail.com</p>
              </div>
              <div className="neo-card p-4">
                <h3 className="font-medium text-primary font-space-grotesk">Availability</h3>
                <p className="text-white/80 text-sm">Open to opportunities</p>
              </div>
            </div>

            <Button 
              className="gap-2 bg-primary/20 border border-primary/50 hover:bg-primary/30 text-primary neo-glow"
              onClick={() => window.open("https://drive.google.com/file/d/1Hojq4Hx1jY4n0GnkjFnmm8lQWNXj2Coy/view?usp=sharing", "_blank")}
            >
              <FileText size={16} />
              Download Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Removed floating geometric shapes - galaxy background provides the cosmic effect */}
    </section>
  )
}

