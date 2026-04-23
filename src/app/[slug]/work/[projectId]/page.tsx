"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Heart, ExternalLink, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function CaseStudyPage({ params }: { params: { slug: string, projectId: string } }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Overlay */}
      <header className="fixed top-0 left-0 right-0 h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md z-50 border-b">
         <Link href={`/${params.slug}`} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
         </Link>
         <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="rounded-full"><Heart className="h-4 w-4 text-red-500 fill-red-500" /></Button>
            <Button className="rounded-full px-6">Hire the Designer</Button>
         </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
           {/* Left: Content */}
           <div className="space-y-12">
              <div className="space-y-6">
                 <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase tracking-widest font-bold px-3">Case Study</Badge>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold px-3">2024</Badge>
                 </div>
                 <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                    Lunar Bank: Redefining Digital Finance
                 </h1>
                 <p className="text-xl text-muted-foreground leading-relaxed">
                    A comprehensive brand redesign and mobile application experience for a next-gen digital banking platform.
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-8 py-8 border-y">
                 <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                       <Calendar className="h-3 w-3" /> Timeline
                    </span>
                    <p className="font-semibold">3 Months</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                       <Tag className="h-3 w-3" /> Services
                    </span>
                    <p className="font-semibold">Branding, UI/UX, Motion</p>
                 </div>
              </div>

              <div className="space-y-8">
                 <section className="space-y-4">
                    <h2 className="text-2xl font-bold">The Challenge</h2>
                    <p className="text-muted-foreground leading-relaxed">
                       Traditional banking feels cold and intimidating. Lunar Bank wanted to break this mold by creating a space that feels personal, fluid, and transparent. The challenge was balancing security with approachability.
                    </p>
                 </section>

                 <section className="space-y-4">
                    <h2 className="text-2xl font-bold">The Solution</h2>
                    <p className="text-muted-foreground leading-relaxed">
                       We implemented a glassmorphic design system combined with vibrant gradients to represent growth and energy. The result is a highly tactile mobile interface that guides users through complex financial decisions with ease.
                    </p>
                 </section>
              </div>

              <div className="pt-8">
                 <Button variant="outline" className="rounded-full h-14 px-8 gap-3 border-2 hover:bg-black hover:text-white transition-all text-lg font-bold">
                    View Live Project <ExternalLink className="h-5 w-5" />
                 </Button>
              </div>
           </div>

           {/* Right: Media Stack */}
           <div className="space-y-12">
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="aspect-[4/5] bg-secondary rounded-[40px] overflow-hidden shadow-2xl relative"
              >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                     <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                        <img 
                           src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                           className="w-full h-full object-cover"
                           alt="Case Study"
                        />
                     </div>
                  </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="aspect-square bg-secondary/50 rounded-3xl overflow-hidden border">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" />
                 </div>
                 <div className="aspect-square bg-secondary/50 rounded-3xl overflow-hidden border">
                    <img src="https://images.unsplash.com/photo-1614332287897-3c85fa4567 df?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" />
                 </div>
              </div>
           </div>
        </div>
      </main>

      <footer className="bg-secondary/20 py-20 mt-20 border-t">
         <div className="max-w-3xl mx-auto text-center space-y-8 px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Impressed by this work?</h2>
            <p className="text-lg text-muted-foreground">Start a conversation with Studio Pulse to see how they can transform your next big idea.</p>
            <div className="flex justify-center gap-4">
               <Button className="rounded-full h-14 px-10 text-lg font-bold">Start Inquiry</Button>
               <Button variant="outline" className="rounded-full h-14 px-10 text-lg border-2">Visit Profile</Button>
            </div>
         </div>
      </footer>
    </div>
  )
}
