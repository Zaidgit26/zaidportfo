"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Briefcase } from "lucide-react"

type Education = {
  degree: string
  institution: string
  duration: string
  gpa?: string
  details?: string
}

type Experience = {
  title: string
  organization: string
  duration: string
  details: string[]
}

export function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<"education" | "experience">("education")

  const education: Education[] = [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "Measi Institute of Information Technology, Chennai",
      duration: "2023 - Present",
      details: "Currently pursuing with focus on advanced programming and software development",
    },
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Islamiah College (Autonomous), Vaniyambadi",
      duration: "2020 - 2023",
      gpa: "7.8",
    },
    {
      degree: "Advanced Diploma in Computer Applications (ADCA)",
      institution: "Jawa Computer Center",
      duration: "2022 - 2023",
      gpa: "7.8",
    },
  ]

  const experiences: Experience[] = [
    {
      title: "Hackathon Participant",
      organization: "Various Events",
      duration: "2025",
      details: [
        "Participated in 50-hour hackathons, applying Design Thinking methodologies",
        "Leaded a team of 5 developers to design and build the solution for the hackathon challenge",
        "Collaborated in cross-functional teams to develop solutions for real-world problems",
        "Gained experience in rapid prototyping and agile development",
      ],
    },
    {
      title: "Web Development Projects",
      organization: "Academic & Personal",
      duration: "2020 - Present",
      details: [
        "Developed multiple web applications and responsive UI designs",
        "Implemented modern JavaScript frameworks and libraries",
        "Created user-friendly interfaces with focus on accessibility",
      ],
    },
    {
      title: "Cyber Guardians Event",
      organization: "College Event",
      duration: "2025",
      details: [
        "Organized and contributed to a college event focusing on cybersecurity and ethical hacking",
        "Coordinated team activities and managed technical aspects of the event",
        "Delivered presentations on web security best practices",
      ],
    },
    
  ]

  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2 neo-text">Experience & Education</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 neo-glow rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex p-1 neo-card">
              <button
                onClick={() => setActiveTab("education")}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === "education" ? "bg-primary/20 text-primary neo-glow" : "text-white/70 hover:text-white"
                }`}
              >
                <GraduationCap size={18} />
                Education
              </button>
              <button
                onClick={() => setActiveTab("experience")}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === "experience" ? "bg-primary/20 text-primary neo-glow" : "text-white/70 hover:text-white"
                }`}
              >
                <Briefcase size={18} />
                Experience
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === "education"
              ? education.map((item, index) => (
                  <Card key={index} className="neo-card overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary neo-glow">
                          <GraduationCap size={24} />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-medium text-white">{item.degree}</h3>
                          <p className="text-primary">{item.institution}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm">
                            <span className="text-white/70">{item.duration}</span>
                            {item.gpa && (
                              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs border border-primary/20">
                                GPA: {item.gpa}
                              </span>
                            )}
                          </div>
                          {item.details && <p className="mt-2 text-white/70 text-sm">{item.details}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : experiences.map((item, index) => (
                  <Card key={index} className="neo-card overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary neo-glow mt-1">
                          <Briefcase size={24} />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-medium text-white">{item.title}</h3>
                          <p className="text-primary">{item.organization}</p>
                          <p className="text-white/70 text-sm">{item.duration}</p>
                          <ul className="mt-3 space-y-2">
                            {item.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="text-white/70 text-sm flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/3 right-10 w-20 h-20 rounded-full bg-primary/10 backdrop-blur-3xl floating opacity-30 hidden lg:block"></div>
      <div className="absolute bottom-1/3 left-10 w-32 h-32 rounded-full bg-blue-500/10 backdrop-blur-3xl floating-delay-3 opacity-30 hidden lg:block"></div>
    </section>
  )
}

