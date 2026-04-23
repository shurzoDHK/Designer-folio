import { FooterConfig } from "@/lib/types/editor"
import { cn } from "@/lib/utils"

export function EditorFooter({ config, onClick, isActive }: { config: FooterConfig, onClick: () => void, isActive: boolean }) {
  return (
    <footer 
      onClick={onClick}
      className={cn(
        "px-6 py-12 border-t mt-auto cursor-pointer transition-all hover:bg-secondary/5",
        isActive && "ring-2 ring-primary z-20 bg-primary/5 shadow-lg"
      )}
    >
      <div className={cn(
        "flex flex-col md:flex-row justify-between items-center gap-8",
        config.layout === "detailed" ? "items-start" : "items-center"
      )}>
        <div className="space-y-4">
           <div className="font-bold text-lg tracking-tight">DesignFolio</div>
           <p className="text-sm text-muted-foreground whitespace-pre-wrap">{config.text}</p>
        </div>
        
        <div className="flex gap-4">
           {config.socialLinks.map((link, idx) => (
             <div key={idx} className="h-8 w-8 rounded-full bg-secondary animate-pulse" />
           ))}
        </div>
      </div>
      <div className="mt-12 text-[10px] text-muted-foreground border-t pt-4">
        Built with DesignFolio
      </div>
    </footer>
  )
}
