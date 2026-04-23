"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc-client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Sidebar: Conversations */}
      <div className="w-80 border-r flex flex-col shrink-0">
        <div className="p-4 border-b space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 bg-secondary/50 border-none rounded-full h-9" placeholder="Search chats..." />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => setSelectedId(i.toString())}
                className={cn(
                  "p-4 flex items-start gap-3 text-left transition-colors hover:bg-secondary/30 border-b",
                  selectedId === i.toString() && "bg-primary/5 hover:bg-primary/5"
                )}
              >
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">TechFlow Solutions</span>
                    <span className="text-[10px] text-muted-foreground">10:42 AM</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    Hey! I just saw the latest branding concepts and we love the direction...
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Area: Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-secondary/5">
        {selectedId ? (
          <>
            {/* Chat Header */}
            <header className="h-16 border-b bg-white px-6 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                     <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedId}`} />
                  </Avatar>
                  <div>
                     <h3 className="font-bold text-sm leading-none">TechFlow Solutions</h3>
                     <span className="text-[10px] text-green-500 font-medium">Online</span>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs">View Project</Button>
               </div>
            </header>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
               <div className="space-y-6">
                  {/* Incoming */}
                  <div className="flex gap-3 max-w-[80%]">
                     <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedId}`} />
                     </Avatar>
                     <div className="space-y-1">
                        <div className="bg-white border p-3 rounded-2xl rounded-tl-none shadow-sm text-sm">
                           Hi! We are looking for a branding expert to help with our upcoming launch. Can you share your process?
                        </div>
                        <span className="text-[10px] text-muted-foreground ml-1">9:15 AM</span>
                     </div>
                  </div>

                  {/* Outgoing */}
                  <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
                     <div className="space-y-1 text-right">
                        <div className="bg-black text-white p-3 rounded-2xl rounded-tr-none shadow-md text-sm">
                           Absolutely! I typically start with a discovery phase where we define your brand values and audience.
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                           <span className="text-[10px] text-muted-foreground">9:22 AM</span>
                           <CheckCheck className="h-3 w-3 text-primary" />
                        </div>
                     </div>
                  </div>
               </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t shrink-0">
               <div className="flex gap-2 bg-secondary/30 rounded-2xl p-1 items-center">
                  <Input 
                     className="border-none bg-transparent focus-visible:ring-0 h-10" 
                     placeholder="Type a message..."
                     value={messageText}
                     onChange={(e) => setMessageText(e.target.value)}
                  />
                  <Button size="icon" className="rounded-xl h-9 w-9 shrink-0">
                     <Send className="h-4 w-4" />
                  </Button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
             <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-10 w-10 text-primary" />
             </div>
             <h3 className="text-xl font-bold">Select a conversation</h3>
             <p className="text-muted-foreground max-w-sm mt-2">
                Click on a chat to view messages and start communicating with your clients.
             </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper icons needed from lucide-react
import { MessageSquare } from "lucide-react"
