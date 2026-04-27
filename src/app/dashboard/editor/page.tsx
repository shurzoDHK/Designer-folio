"use client"

import { useState, useEffect } from "react"
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { BlockLibrary } from "@/components/editor/block-library"
import { Canvas } from "@/components/editor/canvas"
import { BlockSettings } from "@/components/editor/block-settings"
import { PageBlock, BlockType, HeaderConfig, FooterConfig, ThemeConfig } from "@/lib/types/editor"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Monitor, Smartphone, Save, Globe, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { trpc } from "@/lib/trpc-client"
import { toast } from "sonner"

export default function EditorPage() {
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [header, setHeader] = useState<HeaderConfig>({
    logoText: "Designer",
    style: "classic",
    layout: "left",
    links: [
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    sticky: true,
    showCta: true,
    ctaText: "Hire Me",
    ctaHref: "#contact",
    bgColor: "#ffffff",
    textColor: "#0f172a",
    ctaBgColor: "#6366f1",
    ctaTextColor: "#ffffff",
    showBorder: true,
    glass: false,
    socialLinks: [],
  })
  const [footer, setFooter] = useState<FooterConfig>({
    text: "© 2026 Designed by me",
    socialLinks: [{ platform: "twitter", url: "" }],
    layout: "simple"
  })
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: "#000000",
    fontFamily: "inter",
    borderRadius: "md",
    mode: "light"
  })
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const { data: userData } = trpc.user.getMe.useQuery()
  const saveMutation = trpc.project.saveContent.useMutation()

  // Sync state once data is loaded from trpc
  const [hasLoaded, setHasLoaded] = useState(false)
  useEffect(() => {
    if (userData?.designerProfile && !hasLoaded) {
      const p = userData.designerProfile
      if (p.pageBlocks && p.pageBlocks.length > 0) {
        setBlocks(p.pageBlocks.map(b => ({
          ...b,
          type: b.type as BlockType,
          content: typeof b.content === "string" ? JSON.parse(b.content) : b.content
        })))
      }
      if (p.headerConfig) setHeader(JSON.parse(p.headerConfig as string))
      if (p.footerConfig) setFooter(JSON.parse(p.footerConfig as string))
      if (p.theme) setTheme(JSON.parse(p.theme as string))
      setHasLoaded(true)
    }
  }, [userData, hasLoaded])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveMutation.mutateAsync({ blocks, header, footer, theme })
      toast.success("Design saved successfully!")
    } catch (e) {
      toast.error("Failed to save changes.")
    } finally {
      setIsSaving(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex).map((block, idx) => ({
          ...block,
          order: idx,
        }))
      })
    }
  }

  const addBlock = (type: PageBlock["type"]) => {
    const newBlock: PageBlock = {
      id: Math.random().toString(36).substring(7),
      type,
      order: blocks.length,
      content: getInitialContent(type),
      isVisible: true,
    }
    setBlocks([...blocks, newBlock])
    setActiveBlockId(newBlock.id)
  }

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id))
    if (activeBlockId === id) setActiveBlockId(null)
  }

  const handleToggleVisibility = (id: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, isVisible: !b.isVisible } : b))
  }

  const getInitialContent = (type: PageBlock["type"]) => {
    switch (type) {
      case "hero": return {
        title: "I Design Digital Experiences",
        subtitle: "Creative designer specializing in UI/UX, brand identity, and interactive experiences that captivate and convert.",
        buttonText: "See My Work",
        buttonHref: "#gallery",
        showSecondButton: false,
        secondButtonText: "Download CV",
        secondButtonHref: "#",
        alignment: "center",
        avatarImage: "",
        styles: {
          minHeight: 600,
          titleColor: "#0f172a",
          titleSize: 56,
          subtitleColor: "#64748b",
          subtitleSize: 20,
          buttonColor: "#6366f1",
          buttonTextColor: "#ffffff",
          buttonScale: 1,
        },
        background: {
          type: "solid",
          color: "#ffffff",
          gradient: { type: "linear", angle: 135, colors: ["#6366f1", "#a855f7", "#ec4899"] },
          image: "",
          opacity: 1,
          scale: 1,
          positionX: 50,
          positionY: 50,
        },
      }
      case "about": return {
        title: "About Me",
        body: "I'm a passionate designer with over 5 years of experience crafting beautiful digital experiences. I believe great design is about solving problems elegantly.",
        avatarImage: "",
        avatarShape: "circle",
        layout: "imageLeft",
        skills: ["UI/UX Design", "Figma", "Branding", "Motion Design", "React"],
        socialLinks: [
          { platform: "github", url: "https://github.com/" },
          { platform: "linkedin", url: "https://linkedin.com/in/" },
          { platform: "twitter", url: "https://twitter.com/" },
        ],
        styles: {
          minHeight: 400,
          titleColor: "#0f172a",
          titleSize: 36,
          bodyColor: "#475569",
          bodySize: 16,
          skillsBg: "#f1f5f9",
          skillsColor: "#6366f1",
          socialIconColor: "#6366f1",
        },
        background: { type: "solid", color: "#ffffff", gradient: { type: "linear", angle: 135, colors: ["#6366f1", "#a855f7"] }, image: "", opacity: 1, scale: 1, positionX: 50, positionY: 50 },
      }
      case "gallery": return {
        title: "My Work",
        subtitle: "A selection of projects I've worked on",
        columns: 3,
        cardStyle: "shadow",
        showProjectSubtitle: true,
        items: [],
        styles: {
          minHeight: 500,
          titleColor: "#0f172a",
          titleSize: 36,
          subtitleColor: "#64748b",
          subtitleSize: 16,
          cardBg: "#ffffff",
          cardBorderColor: "#e2e8f0",
          skillsBg: "#f1f5f9",
          skillsColor: "#6366f1",
        },
        background: { type: "solid", color: "#f8fafc", gradient: { type: "linear", angle: 135, colors: ["#6366f1", "#a855f7"] }, image: "", opacity: 1, scale: 1, positionX: 50, positionY: 50 },
      }
      case "contact": return {
        title: "Let's Work Together",
        subtitle: "Have a project in mind? I'd love to hear about it.",
        email: "hello@designer.com",
        phone: "+1 (555) 000-0000",
        location: "San Francisco, CA",
        showForm: true,
        formButtonText: "Send Message",
        successMessage: "Thanks for reaching out! I'll get back to you soon.",
        layout: "twoColumn",
        socialLinks: [
          { platform: "github", url: "https://github.com/" },
          { platform: "linkedin", url: "https://linkedin.com/in/" },
          { platform: "twitter", url: "https://twitter.com/" },
        ],
        styles: {
          minHeight: 500,
          titleColor: "#0f172a",
          titleSize: 36,
          subtitleColor: "#64748b",
          subtitleSize: 16,
          buttonColor: "#6366f1",
          buttonTextColor: "#ffffff",
          buttonScale: 1,
          formBg: "#f8fafc",
          inputBorderColor: "#e2e8f0",
          skillsBg: "#f1f5f9",
        },
        background: { type: "solid", color: "#ffffff", gradient: { type: "linear", angle: 135, colors: ["#6366f1", "#a855f7"] }, image: "", opacity: 1, scale: 1, positionX: 50, positionY: 50 },
      }
      case "textanimation": return {
        text: "Design that moves with you.",
        animationType: "typewriter",
        loop: true,
        interval: 1,
        styles: {
          minHeight: 200,
          titleColor: "#0f172a",
          titleSize: 48,
          alignment: "center",
        },
        background: { type: "solid", color: "#ffffff", gradient: { type: "linear", angle: 135, colors: ["#6366f1", "#a855f7"] }, image: "", opacity: 1, scale: 1, positionX: 50, positionY: 50 },
      }
      case "slider": return {
        items: [
          { id: "1", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", title: "Creative Freedom", subtitle: "Unleash your imagination", buttonText: "View Project", buttonHref: "#" },
          { id: "2", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop", title: "Modern Aesthetics", subtitle: "Clean and minimalist design", buttonText: "See Details", buttonHref: "#" },
          { id: "3", image: "https://images.unsplash.com/photo-1618005192384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", title: "Digital Innovation", subtitle: "Pushing the boundaries of web", buttonText: "Read More", buttonHref: "#" },
        ],
        effect: "slide", // "slide", "fade"
        sliderStyle: "imageWithTextAndButton", // "imageOnly", "imageWithText", "imageWithTextAndButton"
        autoplay: true,
        autoplayInterval: 4,
        showArrows: true,
        showDots: true,
        styles: {
          minHeight: 500,
          titleColor: "#ffffff",
          titleSize: 48,
          subtitleColor: "#f1f5f9",
          subtitleSize: 18,
          buttonColor: "#6366f1",
          buttonTextColor: "#ffffff",
          overlayOpacity: 0.3,
          borderRadius: "none", // none, sm, md, lg, full
        },
        background: { type: "solid", color: "#f8fafc", gradient: { type: "linear", angle: 135, colors: ["#6366f1", "#a855f7"] }, image: "", opacity: 1, scale: 1, positionX: 50, positionY: 50 },
      }
      default: return { styles: { minHeight: 100 } }
    }
  }

  const activeBlock = blocks.find(b => b.id === activeBlockId)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Editor Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg tracking-tight">Editor</span>
          <div className="h-4 w-[1px] bg-border mx-2" />
          <div className="flex bg-secondary p-1 rounded-md">
            <Button 
              variant={!isMobileView ? "secondary" : "ghost"} 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => setIsMobileView(false)}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              variant={isMobileView ? "secondary" : "ghost"} 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => setIsMobileView(true)}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">
                {isSaving ? "Saving..." : "Saved"}
            </span>
          <Button 
            variant="outline"
            size="sm" 
            className="gap-2"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} 
            {isPreviewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button 
            size="sm" 
            className="gap-2 bg-black text-white hover:bg-black/90"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
          </Button>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
            <Globe className="h-4 w-4" /> Publish
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel: Library */}
        {!isPreviewMode && (
          <div className="w-64 border-r bg-white overflow-y-auto shrink-0">
            <BlockLibrary onAddBlock={addBlock} />
          </div>
        )}

        {/* Center Panel: Canvas */}
        <div className="flex-1 bg-secondary/30 overflow-y-auto p-12 transition-all duration-300">
           <div className={cn(
             "mx-auto bg-white shadow-2xl transition-all duration-300 min-h-[100%]",
             isMobileView ? "w-[375px]" : "w-full max-w-5xl"
           )}>
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={blocks.map(b => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Canvas 
                    blocks={blocks} 
                    header={header}
                    footer={footer}
                    theme={theme}
                    activeBlockId={activeBlockId} 
                    onSelectBlock={setActiveBlockId} 
                    onDeleteBlock={handleDeleteBlock}
                    onToggleBlockVisibility={handleToggleVisibility}
                    isPreview={isPreviewMode}
                  />
                </SortableContext>
              </DndContext>
              
              {blocks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-muted m-8 rounded-xl">
                    <p className="text-muted-foreground">Select a block from the library to start building</p>
                </div>
              )}
           </div>
        </div>

        {/* Right Panel: Settings */}
        {!isPreviewMode && (
          <div className="w-80 border-l bg-white overflow-y-auto shrink-0">
            {activeBlockId ? (
              <BlockSettings 
                block={activeBlock} 
                header={header}
                footer={footer}
                theme={theme}
                activeId={activeBlockId}
                onUpdateBlock={(content) => {
                  setBlocks(prev => prev.map(b => b.id === activeBlockId ? { ...b, content } : b))
                }}
                onUpdateHeader={setHeader}
                onUpdateFooter={setFooter}
                onUpdateTheme={setTheme}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 h-full text-center text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Select a block</p>
                <p className="text-xs">Customize your portfolio by selecting any block in the canvas.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
