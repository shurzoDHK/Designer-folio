"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Palette, Users } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [role, setRole] = useState<"DESIGNER" | "CLIENT">("DESIGNER")
  const [displayName, setDisplayName] = useState("")
  const [slug, setSlug] = useState("")

  const onboard = trpc.user.onboard.useMutation({
    onSuccess: (data) => {
      if (data.role === "DESIGNER") {
        router.push("/dashboard/editor")
      } else {
        router.push("/explore")
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onboard.mutate({ role, displayName, slug })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to DesignFolio</CardTitle>
          <CardDescription>Tell us how you'll be using the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <RadioGroup 
              defaultValue="DESIGNER" 
              className="grid grid-cols-2 gap-4"
              onValueChange={(val) => setRole(val as any)}
            >
              <div>
                <RadioGroupItem value="DESIGNER" id="designer" className="peer sr-only" />
                <Label
                  htmlFor="designer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Palette className="mb-3 h-10 w-10" />
                  <span className="font-semibold text-center">Designer</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">Build your portfolio & get hired</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="CLIENT" id="client" className="peer sr-only" />
                <Label
                  htmlFor="client"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Users className="mb-3 h-10 w-10" />
                  <span className="font-semibold text-center">Client</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">Discover & hire top talent</span>
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Alex Studio" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              {role === "DESIGNER" && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="slug">Portfolio URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">designfolio.com/</span>
                    <Input 
                      id="slug" 
                      placeholder="alex-studio" 
                      value={slug} 
                      onChange={(e) => setSlug(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full text-lg h-12" 
            onClick={handleSubmit}
            disabled={onboard.isLoading || !displayName}
          >
            {onboard.isLoading ? "Setting up..." : "Complete Setup"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
