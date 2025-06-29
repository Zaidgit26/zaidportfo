"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Github, Linkedin, ExternalLink, Send, AlertCircle, CheckCircle } from "lucide-react"
import { sendEmail, initEmailJS, createMailtoLink } from "@/lib/email-service"
import { toast } from "sonner"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [emailServiceReady, setEmailServiceReady] = useState(false)

  // Initialize EmailJS on component mount
  useEffect(() => {
    try {
      const isInitialized = initEmailJS()
      setEmailServiceReady(isInitialized)

      if (isInitialized) {
        console.log('✅ EmailJS initialized successfully')
      } else {
        console.warn('⚠️ EmailJS not fully configured - check environment variables')
      }
    } catch (error) {
      console.warn('❌ EmailJS initialization failed:', error)
      setEmailServiceReady(false)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Send email using the email service
      const result = await sendEmail(formData)

      if (result.success) {
        setSubmitMessage({
          type: "success",
          text: result.message,
        })
        setFormData({ name: "", email: "", subject: "", message: "" })

        // Show success toast
        toast.success("Message sent successfully!", {
          description: "I'll get back to you as soon as possible.",
          duration: 5000,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message"

      setSubmitMessage({
        type: "error",
        text: errorMessage,
      })

      // Show error toast with fallback option
      toast.error("Failed to send message", {
        description: "Please try the direct email link below or contact me directly.",
        duration: 7000,
        action: {
          label: "Open Email",
          onClick: () => {
            const mailtoLink = createMailtoLink(formData)
            window.open(mailtoLink, '_blank')
          },
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle direct email fallback
  const handleEmailFallback = () => {
    const mailtoLink = createMailtoLink(formData)
    window.open(mailtoLink, '_blank')

    toast.info("Opening your email client", {
      description: "A pre-filled email will open in your default email application.",
      duration: 4000,
    })
  }

  const contactInfo = [
    {
      icon: <Mail className="w-8 h-8 text-primary" />,
      title: "Email",
      value: "reachme.zaid@gmail.com",
      link: "mailto:reachme.zaid@gmail.com",
    },
    {
      icon: <Phone className="w-8 h-8 text-primary" />,
      title: "Phone",
      value: "+91 7397006532",
      link: "tel:+917397006532",
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Location",
      value: "Chennai, India",
      link: "https://maps.google.com/?q=Chennai,India",
    },
  ]

  const socialLinks = [
    {
      icon: <Github size={20} />,
      name: "GitHub",
      url: "https://github.com/Zaidgit26",
      username: "Zaidgit26",
    },
    {
      icon: <Linkedin size={20} />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/zaid-ahmed-s-33008023b/",
      username: "Zaid Ahmed S",
    },
    {
      icon: <ExternalLink size={20} />,
      name: "Resume",
      url: "https://drive.google.com/file/d/1cB98YnieMnp488ptjxFEjATda_TXgj8t/view?usp=sharing",
      username: "Visit Here",
    },
  ]

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 neo-text bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90 font-space-grotesk">
            Get In Touch
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-blue-500 mx-auto mb-6 neo-glow rounded-full"></div>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Have a project in mind or want to discuss potential opportunities? Feel free to reach out to me using the
            form below or through my contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="lg:col-span-2">
            <Card className="neo-card">
              <CardContent className="p-6">
                {/* Email Service Status Indicator */}
                <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${emailServiceReady ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <span className="text-white/80">
                      Email Service: {emailServiceReady ? 'Ready' : 'Configuring...'}
                    </span>
                    {!emailServiceReady && (
                      <span className="text-yellow-400 text-xs">
                        (Messages will still be processed)
                      </span>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-white/80">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-white/80">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email"
                        required
                        className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-white/80">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      required
                      className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-white/80">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message"
                      rows={5}
                      required
                      className="bg-white/5 border-white/10 focus:border-primary/50 text-white resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full bg-primary/20 border border-primary/50 hover:bg-primary/30 text-primary neo-glow transition-all duration-300 flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>

                    {/* Fallback email button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEmailFallback}
                      className="w-full bg-white/5 border border-white/20 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      <Mail className="w-4 h-4" />
                      Open in Email Client
                    </Button>
                  </div>

                  {submitMessage && (
                    <div
                      className={`p-4 rounded-lg flex items-start gap-3 ${
                        submitMessage.type === "success"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {submitMessage.type === "success" ? (
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{submitMessage.text}</p>
                        {submitMessage.type === "error" && (
                          <p className="text-sm mt-1 opacity-80">
                            You can also reach me directly at{" "}
                            <a
                              href="mailto:reachme.zaid@gmail.com"
                              className="underline hover:no-underline"
                            >
                              reachme.zaid@gmail.com
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <Card key={index} className="neo-card overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="mb-2">{info.icon}</div>
                  <h3 className="text-base font-medium mb-1 text-white font-space-grotesk">{info.title}</h3>
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-primary transition-colors text-sm"
                  >
                    {info.value}
                  </a>
                </CardContent>
              </Card>
            ))}

            <Card className="neo-card overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-base font-medium mb-3 text-white text-center font-space-grotesk">Connect With Me</h3>
                <div className="flex justify-center space-x-3">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 text-white/70 hover:text-primary transition-colors group"
                    >
                      <div className="p-2 rounded-full bg-primary/10 group-hover:neo-glow">{link.icon}</div>
                      <span className="text-xs">{link.name}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Removed floating geometric shapes - galaxy background provides the cosmic effect */}
    </section>
  )
}

