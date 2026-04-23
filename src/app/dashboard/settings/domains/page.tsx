"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Globe, CheckCircle2, AlertCircle, Copy, Loader2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function DomainsPage() {
  const [domain, setDomain] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleVerify = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setIsConnected(true)
    }, 2500)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Custom Domain</h1>
        <p className="text-muted-foreground text-lg">Connect your own domain to your DesignFolio profile for a professional look.</p>
      </div>

      <Card className="border-2 shadow-sm">
        <CardHeader>
           <CardTitle>Connect a Domain</CardTitle>
           <CardDescription>Enter the domain you want to link to your portfolio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex gap-3">
              <div className="relative flex-1">
                 <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="pl-10 h-12 rounded-xl text-lg" 
                    placeholder="e.g. portfolio.yourname.com" 
                 />
              </div>
              <Button 
                 onClick={handleVerify} 
                 disabled={!domain || isVerifying}
                 className="h-12 px-8 rounded-xl bg-black text-white hover:bg-black/90"
              >
                 {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
              </Button>
           </div>

           {isConnected && (
             <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800 font-medium font-inter">
                   Domain <strong>{domain}</strong> is pending verification. Please update your DNS settings below.
                </p>
             </div>
           )}
        </CardContent>
      </Card>

      {isConnected && (
        <Card className="border-2 shadow-sm animate-in zoom-in-95 duration-500">
           <CardHeader className="border-b bg-secondary/5">
              <CardTitle className="text-lg">DNS Configuration</CardTitle>
              <CardDescription>Copy these records to your domain registrar (e.g. GoDaddy, Namecheap).</CardDescription>
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y">
                 <DNSRecord 
                    type="A" 
                    name="@" 
                    value="76.76.21.21" 
                    description="Vercel Anycast IP" 
                 />
                 <DNSRecord 
                    type="CNAME" 
                    name="www" 
                    value="cname.designfolio.me" 
                    description="Canonical Name" 
                 />
              </div>
           </CardContent>
           <div className="p-6 bg-secondary/10 border-t flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                 <AlertCircle className="h-4 w-4" />
                 <span>DNS changes can take up to 24 hours to propagate.</span>
              </div>
              <Button variant="outline" className="gap-2">
                 Check Status <ExternalLink className="h-4 w-4" />
              </Button>
           </div>
        </Card>
      )}
    </div>
  )
}

function DNSRecord({ type, name, value, description }: any) {
  const copy = (val: string) => {
    navigator.clipboard.writeText(val)
  }

  return (
    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-secondary/5 transition-colors">
       <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
             <Badge className="bg-black text-white px-3 py-0.5 rounded-md font-mono">{type}</Badge>
             <span className="font-mono text-sm font-bold">{name}</span>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
       </div>
       
       <div className="bg-secondary/30 rounded-xl p-3 flex items-center justify-between gap-8 flex-1 border font-mono text-sm">
          <span className="truncate">{value}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copy(value)}>
             <Copy className="h-3 w-3" />
          </Button>
       </div>
    </div>
  )
}
