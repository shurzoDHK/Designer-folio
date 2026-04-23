"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Star, MapPin, SlidersHorizontal, ArrowRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CATEGORIES = [
  "All",
  "Brand Identity",
  "UI/UX Design",
  "Illustration",
  "Motion Graphics",
  "3D Modeling",
  "Packaging"
]

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("All")

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <header className="px-6 h-20 flex items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-8 w-full max-w-7xl mx-auto">
          <h1 className="font-bold text-2xl tracking-tighter shrink-0">DesignFolio</h1>
          
          <div className="flex-1 max-w-xl relative hidden md:block">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input 
                className="pl-12 h-12 bg-secondary/40 border-none rounded-2xl ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/20" 
                placeholder="Search by skill, style, or name..." 
             />
          </div>

          <nav className="ml-auto flex items-center gap-6">
             <div className="hidden lg:flex gap-6 text-sm font-medium text-muted-foreground">
                <a href="#" className="hover:text-black transition-colors">How it works</a>
                <a href="#" className="hover:text-black transition-colors">Pricing</a>
             </div>
             <Button className="rounded-full px-6">Post a Brief</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
           <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Find your perfect <span className="text-primary italic">creative match</span>.</h2>
              <p className="text-lg text-muted-foreground">Discover over 10,000+ top-vetted independent designers globally.</p>
           </div>
           <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-2 gap-2 h-12">
                 <SlidersHorizontal className="h-4 w-4" /> Filters
              </Button>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden sm:block">
                 <TabsList className="h-12 rounded-xl bg-secondary/50 p-1">
                    {CATEGORIES.slice(0, 4).map(cat => (
                      <TabsTrigger key={cat} value={cat} className="rounded-lg h-10 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                         {cat}
                      </TabsTrigger>
                    ))}
                 </TabsList>
              </Tabs>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
             <Card key={i} className="group overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 border-none bg-white rounded-3xl">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                   {/* Mock work image */}
                   <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <Palette className="h-12 w-12 text-primary/20" />
                   </div>
                   <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-md border-none rounded-full px-3">
                         Available Now
                      </Badge>
                   </div>
                </div>
                
                <CardContent className="p-6">
                   <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white ring-2 ring-secondary/20">
                           <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                           <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                           <h3 className="font-bold text-lg leading-none">Studio Pulse</h3>
                           <p className="text-xs text-muted-foreground mt-1">London, UK</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg">
                         <Star className="h-3 w-3 fill-yellow-700" /> 4.9
                      </div>
                   </div>

                   <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                      Specializing in minimal branding and high-performance digital experiences for modern startups.
                   </p>
                   
                   <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="outline" className="rounded-full bg-secondary/50 border-none font-medium">Bento UI</Badge>
                      <Badge variant="outline" className="rounded-full bg-secondary/50 border-none font-medium">SaaS</Badge>
                      <Badge variant="outline" className="rounded-full bg-secondary/50 border-none font-medium">+2</Badge>
                   </div>

                   <div className="flex items-center justify-between pt-6 border-t font-semibold">
                      <div className="flex flex-col">
                         <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mb-1">Starting from</span>
                         <span className="text-lg">$1,500</span>
                      </div>
                      <Button variant="ghost" className="rounded-full group/btn hover:bg-primary/5 text-primary gap-2">
                         View Details <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="mt-16 flex justify-center">
           <Button variant="outline" size="lg" className="rounded-full px-12 border-2 h-14 font-bold">
              Load More Talent
           </Button>
        </div>
      </main>

      <footer className="bg-white border-t py-12 mt-20">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4">
               <h4 className="font-bold text-lg">DesignFolio</h4>
               <p className="text-sm text-muted-foreground">The world's leading community for creative professionals.</p>
            </div>
            {/* Standard footer columns */}
         </div>
         <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t flex justify-between items-center text-xs text-muted-foreground font-medium">
            <p>© 2026 DesignFolio. Built for the future of work.</p>
            <div className="flex gap-6">
               <a href="#">Terms</a>
               <a href="#">Privacy</a>
               <a href="#">Cookies</a>
            </div>
         </div>
      </footer>
    </div>
  )
}

import { Palette } from "lucide-react"
