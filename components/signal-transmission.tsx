"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Send } from "lucide-react"

export function SignalTransmission() {
    return (
        <section className="py-24 px-4 min-h-[50vh] flex items-center justify-center relative">
            <div className="max-w-2xl mx-auto w-full relative z-10">
                <div className="relative p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500/50 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500/50 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500/50 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500/50 rounded-br-lg" />

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white font-space-grotesk tracking-tighter mb-2">INITIATE TRANSMISSION</h2>
                        <p className="text-gray-400 text-sm">Target: Zaid Commander // Secure Channel Open</p>
                    </div>

                    <form className="space-y-6" action="mailto:reachme.zaid@gmail.com" method="GET">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-orange-400/80 pl-1">Identifier</label>
                                <Input
                                    placeholder="Enter Name"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-orange-400/80 pl-1">Frequency</label>
                                <Input
                                    placeholder="Enter Email"
                                    type="email"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-orange-400/80 pl-1">Payload Message</label>
                            <Textarea
                                placeholder="Type your transmission here..."
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 min-h-[120px] focus:border-orange-500 transition-colors"
                            />
                        </div>

                        <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-black font-bold uppercase tracking-widest transition-all">
                            Send Signal <Send className="w-4 h-4 ml-2" />
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
}
