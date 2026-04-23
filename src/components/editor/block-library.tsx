import { 
  Type, 
  Image as ImageIcon, 
  User, 
  Code, 
  Layout, 
  MessageSquare, 
  CreditCard, 
  BarChart, 
  Mail, 
  ExternalLink,
  Sparkles,
  GalleryHorizontal,
} from "lucide-react"
import { BlockType } from "@/lib/types/editor"

interface BlockLibraryProps {
  onAddBlock: (type: BlockType) => void
}

const BLOCK_TYPES: { type: BlockType; name: string; icon: any; description: string }[] = [
  { type: "hero",          name: "Hero Header",    icon: Type,          description: "Bold headline and CTA for the top of your page." },
  { type: "gallery",       name: "Work Gallery",   icon: ImageIcon,     description: "Display your projects in a beautiful grid." },
  { type: "casestudy",     name: "Case Study",     icon: Layout,        description: "Spotlight a single project with deep details." },
  { type: "about",         name: "About Me",       icon: User,          description: "Share your story and background." },
  { type: "skills",        name: "Expertise",      icon: Code,          description: "Showcase your technical & creative skills." },
  { type: "testimonials",  name: "Testimonials",   icon: MessageSquare, description: "Social proof from your happy clients." },
  { type: "pricing",       name: "Packages",       icon: CreditCard,    description: "Show your service rates and offerings." },
  { type: "stats",         name: "Numbers",        icon: BarChart,      description: "Highlight your impact with statistics." },
  { type: "contact",       name: "Contact Form",   icon: Mail,          description: "Allow clients to reach out directly." },
  { type: "textanimation", name: "Dynamic Text",   icon: Sparkles,      description: "Animated headlines: typewriter, gradient, glitch & more." },
  { type: "slider",        name: "Image Slider",   icon: GalleryHorizontal, description: "Interactive image carousel with text." },
  { type: "embed",         name: "Custom Embed",   icon: ExternalLink,  description: "Figma, Dribbble, or custom scripts." },
]

export function BlockLibrary({ onAddBlock }: BlockLibraryProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground px-2">Library</h3>
      <div className="space-y-2">
        {BLOCK_TYPES.map((block) => (
          <button
            key={block.type}
            onClick={() => onAddBlock(block.type)}
            className="w-full flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-border hover:bg-secondary/50 transition-all text-left group"
          >
            <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <block.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{block.name}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{block.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
