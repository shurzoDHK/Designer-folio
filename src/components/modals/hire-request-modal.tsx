"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Loader2 } from "lucide-react"

export function HireRequestModal({ 
  isOpen, 
  onClose, 
  designerName 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  designerName: string 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
        {!isSuccess ? (
          <>
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold tracking-tight">Hire {designerName}</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Fill out the details below to start a formal inquiry. The designer will review and respond within 24 hours.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-2">
                 <label className="text-sm font-semibold">Project Name</label>
                 <Input className="h-12 border-2 focus-visible:ring-primary/20 rounded-xl" placeholder="e.g. Lunar Bank Rebranding" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Budget (USD)</label>
                    <Select defaultValue="medium">
                       <SelectTrigger className="h-12 border-2 rounded-xl">
                          <SelectValue placeholder="Select budget" />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="low">$1,000 - $3,000</SelectItem>
                          <SelectItem value="medium">$3,000 - $10,000</SelectItem>
                          <SelectItem value="high">$10,000+</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Timeline</label>
                    <Select defaultValue="1month">
                       <SelectTrigger className="h-12 border-2 rounded-xl">
                          <SelectValue placeholder="Select deadline" />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="2weeks">2 Weeks</SelectItem>
                          <SelectItem value="1month">1 Month</SelectItem>
                          <SelectItem value="3months">3+ Months</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-semibold">Project Description</label>
                 <Textarea 
                    className="min-h-[120px] border-2 focus-visible:ring-primary/20 rounded-xl" 
                    placeholder="Tell the designer more about what you're looking for..." 
                    required
                 />
              </div>

              <DialogFooter className="pt-4">
                 <Button 
                    type="submit" 
                    className="w-full h-14 rounded-full text-lg font-bold bg-black text-white hover:bg-black/90"
                    disabled={isSubmitting}
                 >
                    {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</> : "Send Inquiry"}
                 </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
             <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-bold">Inquiry Sent!</h2>
                <p className="text-muted-foreground text-lg">
                   Your request has been delivered to {designerName}. You'll be notified as soon as they respond in your inbox.
                </p>
             </div>
             <Button className="rounded-full px-8 h-12" onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
