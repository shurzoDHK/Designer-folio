export type BlockType = 
  | "hero" 
  | "gallery" 
  | "casestudy" 
  | "about" 
  | "skills" 
  | "testimonials" 
  | "pricing" 
  | "stats" 
  | "contact" 
  | "embed"
  | "textanimation"
  | "slider"

export interface PageBlock {
  id: string
  type: BlockType
  order: number
  content: any
  isVisible: boolean
}

export interface HeaderConfig {
  logoText: string
  logoImage?: string
  /** Visual layout variant */
  style: "classic" | "centered" | "minimal" | "split"
  /** Legacy layout field kept for backwards compat */
  layout: "left" | "center" | "split"
  links: { label: string; href: string }[]
  sticky: boolean
  /** Show/hide CTA button in header */
  showCta: boolean
  ctaText: string
  ctaHref: string
  /** Header background color */
  bgColor: string
  /** Nav link + logo text color */
  textColor: string
  /** CTA button background */
  ctaBgColor: string
  /** CTA button text color */
  ctaTextColor: string
  /** Show border under header */
  showBorder: boolean
  /** Background blur / glass effect */
  glass: boolean
  socialLinks: { platform: string; url: string }[]
}

export interface FooterConfig {
  text: string
  socialLinks: { platform: string; url: string }[]
  layout: "simple" | "detailed"
}

export interface ThemeConfig {
  primaryColor: string
  fontFamily: "inter" | "serif" | "mono"
  borderRadius: "none" | "sm" | "md" | "lg" | "full"
  mode: "light" | "dark"
}

export interface EditorState {
  blocks: PageBlock[]
  header: HeaderConfig
  footer: FooterConfig
  theme: ThemeConfig
  activeBlockId: string | null
  isPreviewMode: boolean
  isMobileView: boolean
}
