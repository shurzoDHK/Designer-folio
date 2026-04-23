import { PageBlock, HeaderConfig, FooterConfig, ThemeConfig } from "@/lib/types/editor"
import { SortableBlock } from "./sortable-block"
import { EditorHeader } from "./editor-header"
import { EditorFooter } from "./editor-footer"

interface CanvasProps {
  blocks: PageBlock[]
  header: HeaderConfig
  footer: FooterConfig
  theme: ThemeConfig
  activeBlockId: string | null
  onSelectBlock: (id: string | "header" | "footer") => void
  onDeleteBlock: (id: string) => void
  onToggleBlockVisibility: (id: string) => void
  isPreview?: boolean
}

export function Canvas({ 
  blocks, 
  header, 
  footer, 
  theme, 
  activeBlockId, 
  onSelectBlock,
  onDeleteBlock,
  onToggleBlockVisibility,
  isPreview = false
}: CanvasProps) {
  return (
    <div 
       className="flex flex-col h-full min-h-screen"
       style={{
          // @ts-ignore
          "--primary": theme.primaryColor,
          "--radius": theme.borderRadius === "none" ? "0" : theme.borderRadius === "sm" ? "0.125rem" : theme.borderRadius === "md" ? "0.375rem" : theme.borderRadius === "lg" ? "0.5rem" : "9999px",
          fontFamily: theme.fontFamily === "serif" ? "serif" : theme.fontFamily === "mono" ? "monospace" : "sans-serif"
       }}
    >
      <EditorHeader 
        config={header} 
        onClick={() => !isPreview && onSelectBlock("header")}
        isActive={!isPreview && activeBlockId === "header"}
      />
      
      <div className="flex-1">
        {blocks.map((block) => (
          <SortableBlock 
            key={block.id} 
            block={block} 
            isActive={!isPreview && activeBlockId === block.id}
            onClick={() => !isPreview && onSelectBlock(block.id)}
            onDelete={() => onDeleteBlock(block.id)}
            onToggleVisibility={() => onToggleBlockVisibility(block.id)}
            isPreview={isPreview}
          />
        ))}
      </div>

      <EditorFooter 
        config={footer}
        onClick={() => !isPreview && onSelectBlock("footer")}
        isActive={!isPreview && activeBlockId === "footer"}
      />
    </div>
  )
}
