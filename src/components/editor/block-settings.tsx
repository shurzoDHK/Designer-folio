"use client"

import { PageBlock, HeaderConfig, FooterConfig } from "@/lib/types/editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Loader2, Plus, Trash2, X, Mail, Phone, MapPin } from "lucide-react"
import { trpc } from "@/lib/trpc-client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface BlockSettingsProps {
  block?: PageBlock
  header?: HeaderConfig
  footer?: FooterConfig
  theme?: any
  activeId: string | "header" | "footer" | null
  onUpdateBlock: (content: any) => void
  onUpdateHeader: (config: HeaderConfig) => void
  onUpdateFooter: (config: FooterConfig) => void
  onUpdateTheme: (config: any) => void
}

export function BlockSettings({
  block,
  header,
  footer,
  theme,
  activeId,
  onUpdateBlock,
  onUpdateHeader,
  onUpdateFooter,
  onUpdateTheme,
}: BlockSettingsProps) {
  const generateAI = trpc.user.generateContent.useMutation()

  const handleAI = async (field: string, type: string) => {
    if (!block) return
    const res = await generateAI.mutateAsync({ prompt: block.content[field] || "", type })
    onUpdateBlock({ ...block.content, [field]: res.text })
  }

  const handleFieldChange = (field: string, value: any) => {
    if (!block) return
    onUpdateBlock({ ...block.content, [field]: value })
  }

  const updateStyle = (key: string, value: any) => {
    if (!block) return
    handleFieldChange("styles", { ...block.content.styles, [key]: value })
  }

  const updateBg = (value: any) => {
    if (!block) return
    handleFieldChange("background", { ...block.content.background, ...value })
  }

  // ─── Global Theme Panel ──────────────────────────────────────────────────
  if (!activeId && theme) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="p-4 border-b bg-white sticky top-0 z-10 shrink-0">
          <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Global Settings</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8 pb-20">
            <SectionLabel>Theme Branding</SectionLabel>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input type="color" value={theme.primaryColor} onChange={(e) => onUpdateTheme({ ...theme, primaryColor: e.target.value })} className="w-12 h-10 p-1 rounded-md" />
                  <Input value={theme.primaryColor} onChange={(e) => onUpdateTheme({ ...theme, primaryColor: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Typography</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["inter", "serif", "mono"].map((font) => (
                    <Button key={font} variant={theme.fontFamily === font ? "secondary" : "outline"} className="text-[10px] h-8 capitalize" onClick={() => onUpdateTheme({ ...theme, fontFamily: font })}>
                      {font}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Corner Roundness</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["none", "sm", "md", "lg"].map((r) => (
                    <Button key={r} variant={theme.borderRadius === r ? "secondary" : "outline"} className="text-[10px] h-8 capitalize" onClick={() => onUpdateTheme({ ...theme, borderRadius: r })}>
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl border-dashed border-2 text-center">
              <p className="text-[11px] text-muted-foreground">Click any block on the canvas to edit it.</p>
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  }

  // ─── Block Settings Panel ────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">
          {activeId === "header" ? "Global Header"
            : activeId === "footer" ? "Global Footer"
              : block?.type
                ? `${block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block`
                : "Settings"}
        </h3>
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full justify-start rounded-none border-b h-10 px-4 bg-transparent shrink-0 gap-2">
          <TabsTrigger value="content" className="text-xs uppercase font-bold tracking-wide data-[state=active]:text-primary">Content</TabsTrigger>
          <TabsTrigger value="style" className="text-xs uppercase font-bold tracking-wide data-[state=active]:text-primary">Style</TabsTrigger>
        </TabsList>

        {/* ── CONTENT TAB ─────────────────────────────────────────────────── */}
        <TabsContent value="content" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-5 space-y-5 pb-20">

              {/* HEADER */}
              {activeId === "header" && header && (
                <div className="space-y-5">
                  {/* Logo */}
                  <Field label="Logo Text">
                    <Input value={header.logoText} onChange={(e) => onUpdateHeader({ ...header, logoText: e.target.value })} placeholder="Brand" />
                  </Field>

                  <Field label="Logo Image URL">
                    <Input value={header.logoImage || ""} placeholder="https://..." onChange={(e) => onUpdateHeader({ ...header, logoImage: e.target.value })} />
                  </Field>

                  {/* Sticky */}
                  <div className="flex items-center justify-between">
                    <Label>Sticky Header</Label>
                    <Switch checked={header.sticky} onCheckedChange={(v) => onUpdateHeader({ ...header, sticky: v })} />
                  </div>

                  {/* CTA */}
                  <Card label="Call-to-Action Button" toggle={header.showCta ?? true} onToggle={(v) => onUpdateHeader({ ...header, showCta: v })}>
                    {(header.showCta ?? true) && (
                      <div className="space-y-2 mt-2">
                        <Input value={header.ctaText || ""} placeholder="Hire Me" className="h-8 text-xs" onChange={(e) => onUpdateHeader({ ...header, ctaText: e.target.value })} />
                        <Input value={header.ctaHref || ""} placeholder="#contact" className="h-8 text-xs" onChange={(e) => onUpdateHeader({ ...header, ctaHref: e.target.value })} />
                      </div>
                    )}
                  </Card>

                  {/* Nav Links */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Navigation Links</Label>
                      <Button variant="ghost" size="icon" className="h-6 w-6"
                        onClick={() => onUpdateHeader({ ...header, links: [...header.links, { label: "New", href: "#" }] })}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    {header.links.map((link, idx) => (
                      <div key={idx} className="flex gap-2 group">
                        <Input value={link.label} className="h-8 text-xs" placeholder="Label"
                          onChange={(e) => {
                            const links = [...header.links]; links[idx] = { ...link, label: e.target.value }
                            onUpdateHeader({ ...header, links })
                          }} />
                        <Input value={link.href} className="h-8 text-xs" placeholder="#href"
                          onChange={(e) => {
                            const links = [...header.links]; links[idx] = { ...link, href: e.target.value }
                            onUpdateHeader({ ...header, links })
                          }} />
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100"
                          onClick={() => onUpdateHeader({ ...header, links: header.links.filter((_, i) => i !== idx) })}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <SocialLinksEditor
                    links={header.socialLinks || []}
                    onChange={(links) => onUpdateHeader({ ...header, socialLinks: links })}
                  />
                </div>
              )}

              {/* FOOTER */}
              {activeId === "footer" && footer && (
                <div className="space-y-5">
                  <Field label="Copyright Text">
                    <Textarea value={footer.text} onChange={(e) => onUpdateFooter({ ...footer, text: e.target.value })} rows={3} />
                  </Field>
                  <div className="space-y-2">
                    <Label>Footer Layout</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["simple", "detailed"].map(l => (
                        <Button key={l} variant={footer.layout === l ? "secondary" : "outline"} className="h-8 text-xs capitalize" onClick={() => onUpdateFooter({ ...footer, layout: l as any })}>
                          {l}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCKS */}
              {typeof activeId === "string" && activeId !== "header" && activeId !== "footer" && block && (
                <div className="space-y-5">

                  {/* ── HERO Content ────────────────────────────────────── */}
                  {block.type === "hero" && (
                    <>
                      {/* Alignment */}
                      <div className="space-y-2">
                        <Label>Text Alignment</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {["left", "center", "right"].map(a => (
                            <Button key={a} variant={block.content.alignment === a ? "secondary" : "outline"} className="h-8 text-[10px] capitalize" onClick={() => handleFieldChange("alignment", a)}>
                              {a}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Headline */}
                      <Field label="Headline">
                        <Input value={block.content.title} onChange={(e) => handleFieldChange("title", e.target.value)} placeholder="I Design Digital Experiences" />
                      </Field>

                      {/* Subtitle */}
                      <Field label="Subheadline" action={<AIButton onClick={() => handleAI("subtitle", "tagline")} loading={generateAI.isPending} />}>
                        <Textarea value={block.content.subtitle} onChange={(e) => handleFieldChange("subtitle", e.target.value)} rows={3} placeholder="Creative designer crafting..." />
                      </Field>

                      {/* Avatar */}
                      <Field label="Profile Photo URL">
                        <Input value={block.content.avatarImage || ""} placeholder="https://..." onChange={(e) => handleFieldChange("avatarImage", e.target.value)} />
                      </Field>

                      {/* Primary Button */}
                      <Card label="Primary Button">
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={block.content.buttonText || ""} placeholder="See My Work" className="h-8 text-xs" onChange={(e) => handleFieldChange("buttonText", e.target.value)} />
                          <Input value={block.content.buttonHref || ""} placeholder="#gallery" className="h-8 text-xs" onChange={(e) => handleFieldChange("buttonHref", e.target.value)} />
                        </div>
                      </Card>

                      {/* Secondary Button */}
                      <Card label="Secondary Button" toggle={block.content.showSecondButton ?? false} onToggle={(v) => handleFieldChange("showSecondButton", v)}>
                        {block.content.showSecondButton && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <Input value={block.content.secondButtonText || ""} placeholder="Download CV" className="h-8 text-xs" onChange={(e) => handleFieldChange("secondButtonText", e.target.value)} />
                            <Input value={block.content.secondButtonHref || ""} placeholder="#" className="h-8 text-xs" onChange={(e) => handleFieldChange("secondButtonHref", e.target.value)} />
                          </div>
                        )}
                      </Card>
                    </>
                  )}

                  {/* ── ABOUT Content ────────────────────────────────────── */}
                  {block.type === "about" && (
                    <>
                      <Field label="Section Title">
                        <Input value={block.content.title} onChange={(e) => handleFieldChange("title", e.target.value)} placeholder="About Me" />
                      </Field>

                      <Field label="Bio" action={<AIButton onClick={() => handleAI("body", "bio")} loading={generateAI.isPending} />}>
                        <Textarea value={block.content.body || ""} onChange={(e) => handleFieldChange("body", e.target.value)} rows={6} placeholder="Tell your story..." />
                      </Field>

                      <Field label="Profile Photo URL">
                        <Input value={block.content.avatarImage || ""} placeholder="https://..." onChange={(e) => handleFieldChange("avatarImage", e.target.value)} />
                      </Field>

                      {/* Layout */}
                      <div className="space-y-2">
                        <Label>Layout</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[["imageLeft", "Image Left"], ["imageRight", "Image Right"], ["centered", "Centered"]].map(([v, l]) => (
                            <Button key={v} variant={block.content.layout === v ? "secondary" : "outline"} className="h-8 text-[10px]" onClick={() => handleFieldChange("layout", v)}>
                              {l}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Skills / Tags</Label>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleFieldChange("skills", [...(block.content.skills || []), "New Skill"])}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[36px] p-2 bg-secondary/20 rounded-lg">
                          {(block.content.skills || []).map((skill: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1 bg-white border rounded-full px-2.5 py-1 shadow-sm group">
                              <input
                                value={skill}
                                className="text-[10px] bg-transparent outline-none w-16"
                                onChange={(e) => {
                                  const skills = [...block.content.skills]
                                  skills[idx] = e.target.value
                                  handleFieldChange("skills", skills)
                                }}
                              />
                              <button className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleFieldChange("skills", block.content.skills.filter((_: any, i: number) => i !== idx))}>
                                <X className="h-2.5 w-2.5 text-destructive" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Social Links */}
                      <SocialLinksEditor
                        links={block.content.socialLinks || []}
                        onChange={(links) => handleFieldChange("socialLinks", links)}
                      />
                    </>
                  )}

                  {/* ── GALLERY Content ──────────────────────────────────── */}
                  {block.type === "gallery" && (
                    <>
                      <Field label="Section Title">
                        <Input value={block.content.title} onChange={(e) => handleFieldChange("title", e.target.value)} placeholder="My Work" />
                      </Field>
                      <Field label="Section Subtitle">
                        <Input value={block.content.subtitle || ""} placeholder="A selection of projects..." onChange={(e) => handleFieldChange("subtitle", e.target.value)} />
                      </Field>

                      {/* Columns */}
                      <div className="space-y-2">
                        <Label>Columns</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[2, 3, 4].map(c => (
                            <Button key={c} variant={block.content.columns === c ? "secondary" : "outline"} className="h-8 text-xs" onClick={() => handleFieldChange("columns", c)}>
                              {c} Cols
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Card Style */}
                      <div className="space-y-2">
                        <Label>Card Style</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["shadow", "bordered", "minimal", "overlay"].map(s => (
                            <Button key={s} variant={block.content.cardStyle === s ? "secondary" : "outline"} className="h-8 text-[10px] capitalize" onClick={() => handleFieldChange("cardStyle", s)}>
                              {s}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Show Project Subtitle</Label>
                        <Switch checked={block.content.showProjectSubtitle ?? true} onCheckedChange={(v) => handleFieldChange("showProjectSubtitle", v)} />
                      </div>

                      <div className="p-3 bg-secondary/20 rounded-lg text-center">
                        <p className="text-[10px] text-muted-foreground italic">Your projects from the dashboard will auto-populate here.</p>
                      </div>
                    </>
                  )}

                  {/* ── CONTACT Content ──────────────────────────────────── */}
                  {block.type === "contact" && (
                    <>
                      <Field label="Headline">
                        <Input value={block.content.title} onChange={(e) => handleFieldChange("title", e.target.value)} placeholder="Let's Work Together" />
                      </Field>
                      <Field label="Subtitle">
                        <Input value={block.content.subtitle || ""} placeholder="Have a project in mind?" onChange={(e) => handleFieldChange("subtitle", e.target.value)} />
                      </Field>

                      {/* Contact Info */}
                      <Card label="Contact Information">
                        <div className="space-y-2 mt-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <Input value={block.content.email || ""} placeholder="email@example.com" className="h-8 text-xs" onChange={(e) => handleFieldChange("email", e.target.value)} />
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <Input value={block.content.phone || ""} placeholder="+1 (555) 000-0000" className="h-8 text-xs" onChange={(e) => handleFieldChange("phone", e.target.value)} />
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <Input value={block.content.location || ""} placeholder="City, Country" className="h-8 text-xs" onChange={(e) => handleFieldChange("location", e.target.value)} />
                          </div>
                        </div>
                      </Card>

                      {/* Layout */}
                      <div className="space-y-2">
                        <Label>Layout</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[["twoColumn", "Two Column"], ["centered", "Centered"]].map(([v, l]) => (
                            <Button key={v} variant={block.content.layout === v ? "secondary" : "outline"} className="h-8 text-[10px]" onClick={() => handleFieldChange("layout", v)}>
                              {l}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Contact Form */}
                      <Card label="Contact Form" toggle={block.content.showForm ?? true} onToggle={(v) => handleFieldChange("showForm", v)}>
                        {(block.content.showForm ?? true) && (
                          <div className="space-y-2 mt-2">
                            <div className="space-y-1">
                              <span className="text-[10px] text-muted-foreground">Submit Button Text</span>
                              <Input value={block.content.formButtonText || "Send Message"} className="h-8 text-xs" onChange={(e) => handleFieldChange("formButtonText", e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-muted-foreground">Success Message</span>
                              <Input value={block.content.successMessage || ""} placeholder="Thanks for reaching out!" className="h-8 text-xs" onChange={(e) => handleFieldChange("successMessage", e.target.value)} />
                            </div>
                          </div>
                        )}
                      </Card>

                      {/* Social Links */}
                      <SocialLinksEditor
                        links={block.content.socialLinks || []}
                        onChange={(links) => handleFieldChange("socialLinks", links)}
                      />
                    </>
                  )}

                  {/* ── TEXT ANIMATION Content ────────────────────────────── */}
                  {block.type === "textanimation" && (
                    <>
                      <Field label="Animated Text">
                        <Input value={block.content.text} onChange={(e) => handleFieldChange("text", e.target.value)} placeholder="Design that moves..." />
                      </Field>

                      <div className="space-y-2">
                        <Label>Animation Type</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "typewriter", label: "Typewriter" },
                            { id: "gradient", label: "Gradient" },
                            { id: "reveal", label: "Reveal" },
                            { id: "glitch", label: "Glitch" },
                            { id: "scroll", label: "Scrolling" },
                            { id: "blink", label: "Blink" },
                          ].map((anim) => (
                            <Button key={anim.id} variant={block.content.animationType === anim.id ? "secondary" : "outline"} className="h-8 text-[10px]" onClick={() => handleFieldChange("animationType", anim.id)}>
                              {anim.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Animation Specific Settings */}
                      {block.content.animationType === "scroll" && (
                        <div className="space-y-3 p-3 bg-muted/20 rounded-xl">
                          <div className="flex justify-between">
                            <Label className="text-[10px]">Scroll Speed (Seconds)</Label>
                            <span className="text-[10px] text-muted-foreground">{block.content.scrollSpeed || 10}s</span>
                          </div>
                          <RangeInput min={2} max={30} step={1} value={block.content.scrollSpeed || 10} onChange={(v) => handleFieldChange("scrollSpeed", v)} />
                          <p className="text-[9px] text-muted-foreground italic text-center">Lower = Faster</p>
                        </div>
                      )}

                      {block.content.animationType === "blink" && (
                        <div className="space-y-3 p-3 bg-muted/20 rounded-xl">
                          <div className="flex justify-between">
                            <Label className="text-[10px]">Blink Cycle (Seconds)</Label>
                            <span className="text-[10px] text-muted-foreground">{block.content.blinkSpeed || 1}s</span>
                          </div>
                          <RangeInput min={0.1} max={3} step={0.1} value={block.content.blinkSpeed || 1} onChange={(v) => handleFieldChange("blinkSpeed", v)} />
                          <p className="text-[9px] text-muted-foreground italic text-center">Lower = More Rapid</p>
                        </div>
                      )}

                      {/* Global Animation Options */}
                      <div className="space-y-3 p-3 pt-4 border-t border-border/50">
                        <SectionLabel>Animation Options</SectionLabel>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-[11px]">Loop Animation</Label>
                          <Switch 
                            checked={block.content.loop ?? true} 
                            onCheckedChange={(v) => handleFieldChange("loop", v)} 
                          />
                        </div>

                        {(block.content.loop ?? true) && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label className="text-[10px]">Repeat Interval (Delay)</Label>
                              <span className="text-[10px] text-muted-foreground">{block.content.interval || 0}s</span>
                            </div>
                            <RangeInput 
                              min={0} 
                              max={10} 
                              step={0.5} 
                              value={block.content.interval || 0} 
                              onChange={(v) => handleFieldChange("interval", v)} 
                            />
                            <p className="text-[9px] text-muted-foreground italic">Rest period between loops</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Alignment</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {["left", "center", "right"].map(a => (
                            <Button key={a} variant={block.content.styles?.alignment === a ? "secondary" : "outline"} className="h-8 text-[10px] capitalize" onClick={() => updateStyle("alignment", a)}>
                              {a}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── SLIDER Content ────────────────────────────── */}
                  {block.type === "slider" && (
                    <>
                      <div className="space-y-4">
                        <SectionLabel>Slider Settings</SectionLabel>

                        <div className="space-y-2">
                          <Label>Transition Effect</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {["slide", "fade"].map((effect) => (
                              <Button key={effect} variant={block.content.effect === effect ? "secondary" : "outline"} className="h-8 text-[10px] capitalize" onClick={() => handleFieldChange("effect", effect)}>
                                {effect}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Slider Style</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { id: "imageOnly", label: "Image Only" },
                              { id: "imageWithText", label: "Image + Text" },
                              { id: "imageWithTextAndButton", label: "Image + Text + Button" },
                            ].map((style) => (
                              <Button key={style.id} variant={block.content.sliderStyle === style.id ? "secondary" : "outline"} className="h-8 text-[10px]" onClick={() => handleFieldChange("sliderStyle", style.id)}>
                                {style.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-[11px]">Autoplay</Label>
                          <Switch checked={block.content.autoplay ?? true} onCheckedChange={(v) => handleFieldChange("autoplay", v)} />
                        </div>

                        {(block.content.autoplay ?? true) && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label className="text-[10px]">Autoplay Interval (s)</Label>
                              <span className="text-[10px] text-muted-foreground">{block.content.autoplayInterval || 4}s</span>
                            </div>
                            <RangeInput min={1} max={10} step={0.5} value={block.content.autoplayInterval || 4} onChange={(v) => handleFieldChange("autoplayInterval", v)} />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <Label className="text-[11px]">Show Navigation Arrows</Label>
                          <Switch checked={block.content.showArrows ?? true} onCheckedChange={(v) => handleFieldChange("showArrows", v)} />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-[11px]">Show Dots</Label>
                          <Switch checked={block.content.showDots ?? true} onCheckedChange={(v) => handleFieldChange("showDots", v)} />
                        </div>

                      </div>

                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <SectionLabel>Slides</SectionLabel>
                          <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => handleFieldChange("items", [...(block.content.items || []), { id: Date.now().toString(), image: "", title: "New Slide", subtitle: "", buttonText: "", buttonHref: "" }])}>
                            <Plus className="h-3 w-3 mr-1" /> Add Slide
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {(block.content.items || []).map((item: any, i: number) => (
                            <Card key={item.id || i} label={`Slide ${i + 1}`}>
                              <div className="space-y-3 mt-2">
                                <div className="space-y-1">
                                  <span className="text-[10px] text-muted-foreground">Image URL</span>
                                  <Input value={item.image || ""} className="h-8 text-xs" onChange={(e) => {
                                    const newItems = [...block.content.items];
                                    newItems[i].image = e.target.value;
                                    handleFieldChange("items", newItems);
                                  }} />
                                </div>
                                {block.content.sliderStyle !== "imageOnly" && (
                                  <>
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-muted-foreground">Title</span>
                                      <Input value={item.title || ""} className="h-8 text-xs" onChange={(e) => {
                                        const newItems = [...block.content.items];
                                        newItems[i].title = e.target.value;
                                        handleFieldChange("items", newItems);
                                      }} />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-muted-foreground">Subtitle</span>
                                      <Textarea value={item.subtitle || ""} className="min-h-[60px] text-xs" onChange={(e) => {
                                        const newItems = [...block.content.items];
                                        newItems[i].subtitle = e.target.value;
                                        handleFieldChange("items", newItems);
                                      }} />
                                    </div>
                                  </>
                                )}
                                {block.content.sliderStyle === "imageWithTextAndButton" && (
                                  <>
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-muted-foreground">Button Text</span>
                                      <Input value={item.buttonText || ""} className="h-8 text-xs" onChange={(e) => {
                                        const newItems = [...block.content.items];
                                        newItems[i].buttonText = e.target.value;
                                        handleFieldChange("items", newItems);
                                      }} />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-muted-foreground">Button Link</span>
                                      <Input value={item.buttonHref || ""} className="h-8 text-xs" onChange={(e) => {
                                        const newItems = [...block.content.items];
                                        newItems[i].buttonHref = e.target.value;
                                        handleFieldChange("items", newItems);
                                      }} />
                                    </div>
                                  </>
                                )}
                                <Button variant="destructive" size="sm" className="w-full h-7 text-[10px]" onClick={() => {
                                  const newItems = [...block.content.items];
                                  newItems.splice(i, 1);
                                  handleFieldChange("items", newItems);
                                }}>
                                  Remove Slide
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>
          </ScrollArea>
        </TabsContent>

        {/* ── STYLE TAB ───────────────────────────────────────────────────── */}
        <TabsContent value="style" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-5 space-y-6 pb-20">

              {activeId === "header" && header && (
                <div className="space-y-6">
                  {/* Layout Style */}
                  <div className="space-y-3">
                    <SectionLabel>Header Layout</SectionLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { value: "classic",  label: "Classic",  desc: "Logo · Nav · CTA" },
                        { value: "centered", label: "Centered", desc: "Logo center · Links below" },
                        { value: "minimal",  label: "Minimal",  desc: "Logo · Slim links" },
                        { value: "split",    label: "Split",    desc: "Nav · Logo · CTA" },
                      ] as const).map(({ value, label, desc }) => (
                        <button
                          key={value}
                          onClick={() => onUpdateHeader({ ...header, style: value })}
                          className={cn(
                            "p-3 rounded-xl border-2 text-left transition-all",
                            (header.style || "classic") === value
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-muted-foreground/30"
                          )}
                        >
                          <p className="text-xs font-bold">{label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="space-y-3 pt-4 border-t">
                    <SectionLabel>Colors</SectionLabel>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input type="color" value={header.bgColor || "#ffffff"}
                          onChange={(e) => onUpdateHeader({ ...header, bgColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border cursor-pointer shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground mb-1">Background</p>
                          <Input value={header.bgColor || "#ffffff"} className="h-7 text-xs font-mono"
                            onChange={(e) => onUpdateHeader({ ...header, bgColor: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="color" value={header.textColor || "#0f172a"}
                          onChange={(e) => onUpdateHeader({ ...header, textColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border cursor-pointer shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground mb-1">Logo & Navigation Text</p>
                          <Input value={header.textColor || "#0f172a"} className="h-7 text-xs font-mono"
                            onChange={(e) => onUpdateHeader({ ...header, textColor: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button Colors */}
                  {(header.showCta ?? true) && (
                    <div className="space-y-3 pt-4 border-t">
                      <SectionLabel>CTA Button Colors</SectionLabel>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-muted-foreground">Button BG</p>
                          <div className="flex gap-1.5">
                            <input type="color" value={header.ctaBgColor || "#6366f1"}
                              onChange={(e) => onUpdateHeader({ ...header, ctaBgColor: e.target.value })}
                              className="w-8 h-8 rounded border cursor-pointer shrink-0" />
                            <Input value={header.ctaBgColor || "#6366f1"} className="h-8 text-xs font-mono"
                              onChange={(e) => onUpdateHeader({ ...header, ctaBgColor: e.target.value })} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-muted-foreground">Button Text</p>
                          <div className="flex gap-1.5">
                            <input type="color" value={header.ctaTextColor || "#ffffff"}
                              onChange={(e) => onUpdateHeader({ ...header, ctaTextColor: e.target.value })}
                              className="w-8 h-8 rounded border cursor-pointer shrink-0" />
                            <Input value={header.ctaTextColor || "#ffffff"} className="h-8 text-xs font-mono"
                              onChange={(e) => onUpdateHeader({ ...header, ctaTextColor: e.target.value })} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Effects */}
                  <div className="space-y-3 pt-4 border-t">
                    <SectionLabel>Effects</SectionLabel>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                        <div>
                          <p className="text-xs font-medium">Glass / Blur Effect</p>
                          <p className="text-[10px] text-muted-foreground">Semi-transparent background with blur</p>
                        </div>
                        <Switch checked={header.glass ?? false} onCheckedChange={(v) => onUpdateHeader({ ...header, glass: v })} />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                        <div>
                          <p className="text-xs font-medium">Bottom Border</p>
                          <p className="text-[10px] text-muted-foreground">Show a separator line below header</p>
                        </div>
                        <Switch checked={header.showBorder ?? true} onCheckedChange={(v) => onUpdateHeader({ ...header, showBorder: v })} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeId === "footer" && (
                <div className="p-4 bg-muted/30 rounded-xl text-center">
                  <p className="text-xs text-muted-foreground italic">Footer style settings coming soon.</p>
                </div>
              )}

              {typeof activeId === "string" && activeId !== "header" && activeId !== "footer" && block && (
                <>
                  {/* Layout & Sizing */}
                  <div className="space-y-3">
                    <SectionLabel>Layout & Sizing</SectionLabel>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-[11px]">Section Height</Label>
                        <span className="text-[10px] text-muted-foreground">{block.content.styles?.minHeight || 400}px</span>
                      </div>
                      <RangeInput min={100} max={1000} step={10} value={block.content.styles?.minHeight ?? 400} onChange={(v) => updateStyle("minHeight", v)} />
                    </div>
                  </div>

                  {/* Avatar Shape (About) */}
                  {block.type === "about" && (
                    <div className="space-y-2 pt-4 border-t">
                      <SectionLabel>Avatar</SectionLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {["circle", "rounded", "square"].map(shape => (
                          <Button key={shape} variant={block.content.avatarShape === shape ? "secondary" : "outline"} className="h-8 text-[10px] capitalize" onClick={() => handleFieldChange("avatarShape", shape)}>
                            {shape}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Typography */}
                  <div className="space-y-4 pt-4 border-t">
                    <SectionLabel>Typography</SectionLabel>

                    {/* Title */}
                    <div className="space-y-3 p-3 bg-muted/20 rounded-xl">
                      <p className="text-[11px] font-semibold text-primary">{block.type === "textanimation" ? "Animated Text" : "Main Title"}</p>
                      <div className="flex items-center gap-3">
                        <input type="color" value={block.content.styles?.titleColor || "#0f172a"} onChange={(e) => updateStyle("titleColor", e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <p className="text-[9px] text-muted-foreground">Size: {block.content.styles?.titleSize || 36}px</p>
                          </div>
                          <RangeInput min={12} max={120} value={block.content.styles?.titleSize || 36} onChange={(v) => updateStyle("titleSize", v)} />
                        </div>
                      </div>
                    </div>

                    {/* Subtitle / Body */}
                    {(block.type === "hero" || block.type === "about" || block.type === "contact" || block.type === "gallery") && (
                      <div className="space-y-3 p-3 bg-muted/20 rounded-xl">
                        <p className="text-[11px] font-semibold text-primary">
                          {block.type === "hero" ? "Subtitle" : block.type === "about" ? "Bio Text" : block.type === "gallery" ? "Subtitle" : "Contact Info"}
                        </p>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={
                              block.type === "hero" ? (block.content.styles?.subtitleColor || "#64748b")
                                : block.type === "about" ? (block.content.styles?.bodyColor || "#475569")
                                  : block.type === "gallery" ? (block.content.styles?.subtitleColor || "#64748b")
                                    : (block.content.styles?.subtitleColor || "#64748b")
                            }
                            onChange={(e) => {
                              const key = block.type === "about" ? "bodyColor" : "subtitleColor"
                              updateStyle(key, e.target.value)
                            }}
                            className="w-8 h-8 rounded cursor-pointer border"
                          />
                          <div className="flex-1 space-y-1">
                            <p className="text-[9px] text-muted-foreground">
                              Size: {block.type === "about" ? (block.content.styles?.bodySize || 16) : (block.content.styles?.subtitleSize || 16)}px
                            </p>
                            <RangeInput
                              min={10} max={64}
                              value={block.type === "about" ? (block.content.styles?.bodySize || 16) : (block.content.styles?.subtitleSize || 16)}
                              onChange={(v) => {
                                const key = block.type === "about" ? "bodySize" : "subtitleSize"
                                updateStyle(key, v)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Button Design */}
                  {(block.type === "hero" || block.type === "contact") && (
                    <div className="space-y-4 pt-4 border-t">
                      <SectionLabel>Button Design</SectionLabel>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-muted-foreground">Background</p>
                          <div className="flex gap-2">
                            <input type="color" value={block.content.styles?.buttonColor || "#6366f1"} onChange={(e) => updateStyle("buttonColor", e.target.value)} className="w-9 h-9 rounded border cursor-pointer" />
                            <Input value={block.content.styles?.buttonColor || "#6366f1"} className="h-9 text-xs" onChange={(e) => updateStyle("buttonColor", e.target.value)} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-muted-foreground">Text</p>
                          <div className="flex gap-2">
                            <input type="color" value={block.content.styles?.buttonTextColor || "#ffffff"} onChange={(e) => updateStyle("buttonTextColor", e.target.value)} className="w-9 h-9 rounded border cursor-pointer" />
                            <Input value={block.content.styles?.buttonTextColor || "#ffffff"} className="h-9 text-xs" onChange={(e) => updateStyle("buttonTextColor", e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <p className="text-[10px] text-muted-foreground">Button Scale</p>
                          <p className="text-[10px] text-muted-foreground">{block.content.styles?.buttonScale || 1}×</p>
                        </div>
                        <RangeInput min={0.5} max={2} step={0.05} value={block.content.styles?.buttonScale ?? 1} onChange={(v) => updateStyle("buttonScale", v)} />
                      </div>
                    </div>
                  )}

                  {/* About-specific: Skills & Social Colors */}
                  {block.type === "about" && (
                    <div className="space-y-3 pt-4 border-t">
                      <SectionLabel>Skills & Social</SectionLabel>
                      <div className="p-3 bg-muted/20 rounded-xl space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-[9px] text-muted-foreground">Tag Background</p>
                            <input type="color" value={block.content.styles?.skillsBg || "#f1f5f9"} onChange={(e) => updateStyle("skillsBg", e.target.value)} className="w-full h-8 rounded border cursor-pointer" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] text-muted-foreground">Tag Text / Icons</p>
                            <input type="color" value={block.content.styles?.skillsColor || "#6366f1"} onChange={(e) => { updateStyle("skillsColor", e.target.value); updateStyle("socialIconColor", e.target.value) }} className="w-full h-8 rounded border cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gallery-specific: Card Design */}
                  {block.type === "gallery" && (
                    <div className="space-y-3 pt-4 border-t">
                      <SectionLabel>Card Design</SectionLabel>
                      <div className="p-3 bg-muted/20 rounded-xl">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-[9px] text-muted-foreground">Card Background</p>
                            <input type="color" value={block.content.styles?.cardBg || "#ffffff"} onChange={(e) => updateStyle("cardBg", e.target.value)} className="w-full h-8 rounded border cursor-pointer" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] text-muted-foreground">Card Border</p>
                            <input type="color" value={block.content.styles?.cardBorderColor || "#e2e8f0"} onChange={(e) => updateStyle("cardBorderColor", e.target.value)} className="w-full h-8 rounded border cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact-specific: Form Design */}
                  {block.type === "contact" && (
                    <div className="space-y-3 pt-4 border-t">
                      <SectionLabel>Form Design</SectionLabel>
                      <div className="p-3 bg-muted/20 rounded-xl">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-[9px] text-muted-foreground">Form Background</p>
                            <input type="color" value={block.content.styles?.formBg || "#f8fafc"} onChange={(e) => updateStyle("formBg", e.target.value)} className="w-full h-8 rounded border cursor-pointer" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] text-muted-foreground">Input Border</p>
                            <input type="color" value={block.content.styles?.inputBorderColor || "#e2e8f0"} onChange={(e) => updateStyle("inputBorderColor", e.target.value)} className="w-full h-8 rounded border cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Background */}
                  <div className="space-y-4 pt-4 border-t">
                    <SectionLabel>Background</SectionLabel>
                    <Tabs
                      value={block.content.background?.type || "solid"}
                      onValueChange={(v) => updateBg({ type: v })}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-4 w-full h-8 p-1">
                        <TabsTrigger value="solid" className="text-[10px]">Solid</TabsTrigger>
                        <TabsTrigger value="gradient" className="text-[10px]">Gradient</TabsTrigger>
                        <TabsTrigger value="image" className="text-[10px]">Image</TabsTrigger>
                        <TabsTrigger value="pattern" className="text-[10px]">Pattern</TabsTrigger>
                      </TabsList>

                      {/* Solid */}
                      <TabsContent value="solid" className="mt-3 space-y-2">
                        <div className="flex gap-2">
                          <input type="color" value={block.content.background?.color || "#ffffff"} onChange={(e) => updateBg({ color: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" />
                          <Input value={block.content.background?.color || "#ffffff"} onChange={(e) => updateBg({ color: e.target.value })} />
                        </div>
                      </TabsContent>

                      {/* Gradient */}
                      <TabsContent value="gradient" className="mt-3 space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {["linear", "radial"].map(t => (
                            <Button key={t} variant={block.content.background?.gradient?.type === t ? "secondary" : "outline"} className="h-7 text-[10px] capitalize"
                              onClick={() => updateBg({ gradient: { ...block.content.background?.gradient, type: t } })}>
                              {t}
                            </Button>
                          ))}
                        </div>
                        {block.content.background?.gradient?.type !== "radial" && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <p className="text-[10px] text-muted-foreground">Angle</p>
                              <p className="text-[10px] text-muted-foreground">{block.content.background?.gradient?.angle ?? 135}°</p>
                            </div>
                            <RangeInput min={0} max={360} value={block.content.background?.gradient?.angle ?? 135}
                              onChange={(v) => updateBg({ gradient: { ...block.content.background?.gradient, angle: v } })} />
                          </div>
                        )}
                        <div className="space-y-2">
                          <p className="text-[10px] text-muted-foreground">Color Stops</p>
                          {(block.content.background?.gradient?.colors || ["#6366f1", "#a855f7"]).map((color: string, idx: number) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <input type="color" value={color} className="w-8 h-8 rounded border cursor-pointer"
                                onChange={(e) => {
                                  const colors = [...(block.content.background.gradient.colors || [])]
                                  colors[idx] = e.target.value
                                  updateBg({ gradient: { ...block.content.background.gradient, colors } })
                                }}
                              />
                              <Input value={color} className="h-8 text-[10px] font-mono"
                                onChange={(e) => {
                                  const colors = [...(block.content.background.gradient.colors || [])]
                                  colors[idx] = e.target.value
                                  updateBg({ gradient: { ...block.content.background.gradient, colors } })
                                }}
                              />
                              {idx > 1 && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"
                                  onClick={() => {
                                    const colors = block.content.background.gradient.colors.filter((_: any, i: number) => i !== idx)
                                    updateBg({ gradient: { ...block.content.background.gradient, colors } })
                                  }}>
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {(block.content.background?.gradient?.colors?.length || 0) < 5 && (
                            <Button variant="outline" size="sm" className="w-full h-7 gap-1 text-[10px] border-dashed"
                              onClick={() => {
                                const colors = [...(block.content.background?.gradient?.colors || []), "#ffffff"]
                                updateBg({ gradient: { ...block.content.background?.gradient, colors } })
                              }}>
                              <Plus className="h-3 w-3" /> Add Stop
                            </Button>
                          )}
                        </div>
                      </TabsContent>

                      {/* Image */}
                      <TabsContent value="image" className="mt-3 space-y-4">
                        <div className="space-y-2">
                          <p className="text-[10px] text-muted-foreground">Image URL</p>
                          <Input value={block.content.background?.image || ""} placeholder="https://..." onChange={(e) => updateBg({ image: e.target.value })} />
                        </div>
                        <SliderField label="Opacity" value={Math.round((block.content.background?.opacity ?? 1) * 100)} unit="%" min={0} max={100}
                          onChange={(v) => updateBg({ opacity: v / 100 })} />
                        <SliderField label="Scale" value={block.content.background?.scale ?? 1} unit="×" min={0.5} max={3} step={0.1}
                          onChange={(v) => updateBg({ scale: v })} />
                        <div className="grid grid-cols-2 gap-4">
                          <SliderField label={`X: ${block.content.background?.positionX ?? 50}%`} value={block.content.background?.positionX ?? 50} unit="" min={0} max={100}
                            onChange={(v) => updateBg({ positionX: v })} />
                          <SliderField label={`Y: ${block.content.background?.positionY ?? 50}%`} value={block.content.background?.positionY ?? 50} unit="" min={0} max={100}
                            onChange={(v) => updateBg({ positionY: v })} />
                        </div>
                      </TabsContent>

                      {/* Pattern */}
                      <TabsContent value="pattern" className="mt-3 space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          {["dots", "grid", "diagonal"].map(p => (
                            <Button key={p} variant={block.content.background?.pattern === p ? "secondary" : "outline"} className="h-7 text-[10px] capitalize"
                              onClick={() => updateBg({ pattern: p })}>
                              {p}
                            </Button>
                          ))}
                        </div>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={block.content.background?.patternColor || "#e5e7eb"} onChange={(e) => updateBg({ patternColor: e.target.value })} className="w-8 h-8 rounded border cursor-pointer" />
                          <Input value={block.content.background?.patternColor || "#e5e7eb"} className="text-xs font-mono" onChange={(e) => updateBg({ patternColor: e.target.value })} />
                        </div>
                        <SliderField label={`Size: ${block.content.background?.patternSize || 20}px`} value={block.content.background?.patternSize ?? 20} unit="" min={8} max={120}
                          onChange={(v) => updateBg({ patternSize: v })} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{children}</p>
}

function Field({ label, children, action }: { label: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        {action}
      </div>
      {children}
    </div>
  )
}

function Card({ label, children, toggle, onToggle }: { label: string; children?: React.ReactNode; toggle?: boolean; onToggle?: (v: boolean) => void }) {
  return (
    <div className="space-y-2 p-3 bg-muted/20 rounded-xl">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-primary">{label}</p>
        {onToggle !== undefined && <Switch checked={toggle ?? false} onCheckedChange={onToggle} />}
      </div>
      {children}
    </div>
  )
}

function AIButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <Button variant="ghost" size="sm" className="h-6 gap-1 text-[10px] uppercase font-bold text-primary" onClick={onClick} disabled={loading}>
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
      AI
    </Button>
  )
}

function RangeInput({ min, max, step = 1, value, onChange }: { min: number; max: number; step?: number; value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
    />
  )
}

function SliderField({ label, value, unit, min, max, step = 1, onChange }: { label: string; value: number; unit: string; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        {unit && <p className="text-[10px] text-muted-foreground">{value}{unit}</p>}
      </div>
      <RangeInput min={min} max={max} step={step} value={value} onChange={onChange} />
    </div>
  )
}

const PLATFORMS = ["github", "linkedin", "twitter", "instagram", "website"]

function SocialLinksEditor({ links, onChange }: { links: { platform: string; url: string }[]; onChange: (links: { platform: string; url: string }[]) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Social Links</Label>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onChange([...links, { platform: "github", url: "" }])}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <div key={idx} className="flex gap-2 items-center group">
            <select
              value={link.platform}
              onChange={(e) => { const l = [...links]; l[idx] = { ...l[idx], platform: e.target.value }; onChange(l) }}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs w-28 shrink-0"
            >
              {PLATFORMS.map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
            <Input
              value={link.url}
              placeholder="https://..."
              className="h-8 text-xs"
              onChange={(e) => { const l = [...links]; l[idx] = { ...l[idx], url: e.target.value }; onChange(l) }}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100"
              onClick={() => onChange(links.filter((_, i) => i !== idx))}>
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
