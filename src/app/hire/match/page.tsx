"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Brain, ArrowRight, CheckCircle2, UserCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { trpc } from "@/lib/trpc-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AIMatchPage() {
  const [step, setStep] = useState(1)
  const [brief, setBrief] = useState("")
  const [isMatching, setIsMatching] = useState(false)

  const handleStartMatching = () => {
    setIsMatching(true)
    setTimeout(() => {
      setIsMatching(false)
      setStep(2)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-3xl w-full">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
               key="step1"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-8"
            >
               <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
                     <Sparkles className="h-4 w-4" /> AI Talent Match
                  </div>
                  <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl">
                     Describe your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">vision</span>.
                  </h1>
                  <p className="text-gray-400 text-xl max-w-xl mx-auto">
                     Our AI neural network will analyze your brief and find the top 3 designers whose styles perfectly align with your goals.
                  </p>
               </div>

               <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
                  <CardContent className="p-8 space-y-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Project Brief</label>
                        <Textarea 
                           className="bg-black/40 border-white/10 h-48 focus-visible:ring-primary/50 text-lg placeholder:text-gray-600" 
                           placeholder="Describe your project, desired aesthetic, and core deliverables... e.g. 'I need a brand identity for a luxury eco-resort that feels organic yet sophisticated...'"
                           value={brief}
                           onChange={(e) => setBrief(e.target.value)}
                        />
                     </div>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex gap-4 text-xs text-gray-500">
                           <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Visual Style Analysis</span>
                           <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Skillset Mapping</span>
                        </div>
                        <Button 
                           size="lg" 
                           className="rounded-full px-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold"
                           onClick={handleStartMatching}
                           disabled={!brief || isMatching}
                        >
                           {isMatching ? (
                             <><Brain className="h-4 w-4 animate-spin" /> Analyzing Brief...</>
                           ) : (
                             <>Find My Matches <ArrowRight className="h-4 w-4" /></>
                           )}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
          ) : (
            <motion.div 
               key="step2"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-8"
            >
               <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight">Your Neural Matches Are In.</h2>
                  <p className="text-gray-400 text-lg">We found these designers whose past work perfectly matches your aesthetic profile.</p>
               </div>

               <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                       key={i}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                    >
                       <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors group cursor-pointer overflow-hidden">
                          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                             <div className="relative">
                                <Avatar className="h-20 w-20 border-2 border-primary/50">
                                   <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 10}`} />
                                   <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-black">
                                   <UserCheck className="h-3 w-3 text-white" />
                                </div>
                             </div>
                             
                             <div className="flex-1 text-center md:text-left space-y-1">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                   <h3 className="font-bold text-xl uppercase tracking-tighter">Velocity Design Co.</h3>
                                   <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold">98% Match</span>
                                </div>
                                <p className="text-gray-500 text-sm italic">"Past projects show a high overlap with your organic luxury theme."</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                                   <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Luxury Branding</span>
                                   <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Eco-Friendly</span>
                                </div>
                             </div>

                             <div className="shrink-0 flex flex-col gap-2">
                                <Button variant="outline" className="rounded-full border-white/20 hover:bg-white/10">View Analysis</Button>
                                <Button className="rounded-full px-6 bg-white text-black hover:bg-white/90">Hire Now</Button>
                             </div>
                          </CardContent>
                       </Card>
                    </motion.div>
                  ))}
               </div>

               <div className="flex justify-center pt-8">
                  <Button variant="link" className="text-gray-500" onClick={() => setStep(1)}>
                     Refine Brief ↺
                  </Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
