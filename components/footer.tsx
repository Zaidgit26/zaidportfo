import Link from "next/link"
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-8 border-t border-white/10 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <Link href="#home" className="text-xl font-bold neo-text mb-6">
            Zaid<span className="text-primary">.</span>
          </Link>

          <div className="flex space-x-6 mb-6">
            <a
              href="https://github.com/Zaidgit26"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors p-2 rounded-full hover:neo-glow"
            >
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/zaid-ahm"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors p-2 rounded-full hover:neo-glow"
            >
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors p-2 rounded-full hover:neo-glow"
            >
              <ExternalLink size={20} />
              <span className="sr-only">Portfolio</span>
            </a>
            <a
              href="mailto:zaid@example.com"
              className="hover:text-primary transition-colors p-2 rounded-full hover:neo-glow"
            >
              <Mail size={20} />
              <span className="sr-only">Email</span>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="#home" className="text-white/70 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="#about" className="text-white/70 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#skills" className="text-white/70 hover:text-primary transition-colors">
              Skills
            </Link>
            <Link href="#projects" className="text-white/70 hover:text-primary transition-colors">
              Projects
            </Link>
            <Link href="#experience" className="text-white/70 hover:text-primary transition-colors">
              Experience
            </Link>
            <Link href="#contact" className="text-white/70 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>


        </div>
      </div>

      {/* Removed floating geometric shapes - galaxy background provides the cosmic effect */}
    </footer>
  )
}

