"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Image as ImageIcon, Loader2, MoreVertical } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProjectsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  
  const utils = trpc.useContext()
  const { data: projects, isLoading } = trpc.project.list.useQuery()
  const createProject = trpc.project.create.useMutation({
    onSuccess: () => {
      utils.project.list.invalidate()
      setIsOpen(false)
      setTitle("")
      setDescription("")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProject.mutate({ title, description, tags: [] })
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
           <p className="text-muted-foreground mt-1">Manage your portfolio works and case studies.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Brand Identity for TechFlow" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe the project goal, process and outcome..."
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createProject.isPending}>
                {createProject.isPending ? "Creating..." : "Create Project"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects?.map((project) => (
            <Card key={project.id} className="group overflow-hidden border-2 hover:border-primary transition-all cursor-pointer">
              <div className="aspect-[4/3] bg-secondary flex items-center justify-center relative">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
                      <MoreVertical className="h-4 w-4" />
                   </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{project.category || "Uncategorized"}</p>
              </CardContent>
            </Card>
          ))}
          
          {projects?.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted">
               <p className="text-muted-foreground italic">You haven't added any projects yet.</p>
               <Button variant="link" onClick={() => setIsOpen(true)}>Add your first project</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
