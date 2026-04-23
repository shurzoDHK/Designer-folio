"use client"

import React, { useState, useEffect } from "react"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { PageBlock } from "@/lib/types/editor"
import { cn } from "@/lib/utils"
import {
  GripVertical, Trash2, Eye, EyeOff,
  Mail, Phone, MapPin, Globe,
} from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"

// Robust SVG icons for brands
const GitHubIcon = ({ className, style }: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)

const LinkedInIcon = ({ className, style }: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

const TwitterIcon = ({ className, style }: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
)

const InstagramIcon = ({ className, style }: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  website: Globe,
}

interface SortableBlockProps {
  block: PageBlock
  isActive: boolean
  onClick: () => void
  onDelete: () => void
  onToggleVisibility: () => void
  isPreview?: boolean
}

export function SortableBlock({ 
  block, 
  isActive, 
  onClick, 
  onDelete, 
  onToggleVisibility,
  isPreview = false
}: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id, disabled: isPreview })

  const style = { transform: CSS.Transform.toString(transform), transition }

  if (!block.isVisible && isPreview) return null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative border-2 transition-all duration-200",
        isActive && !isPreview ? "border-primary ring-2 ring-primary/20" : "border-transparent",
        isDragging && "opacity-50 z-50 shadow-2xl",
        !block.isVisible && !isPreview && "grayscale opacity-50",
        !isPreview && "hover:border-primary/40"
      )}
      onClick={onClick}
    >
      {/* Block Controls */}
      {!isPreview && (
        <div className={cn(
          "absolute -left-12 top-2 flex flex-col gap-1.5 transition-all z-20",
          isActive || isDragging ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
        )}>
          <div
            {...attributes}
            {...listeners}
            className="p-1.5 bg-white border shadow-md rounded-lg cursor-grab active:cursor-grabbing hover:bg-slate-50"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <button
            className="p-1.5 bg-white border shadow-md rounded-lg hover:bg-slate-50 transition-colors"
            onClick={(e) => { e.stopPropagation(); onToggleVisibility() }}
          >
            {block.isVisible
              ? <Eye className="h-4 w-4 text-muted-foreground" />
              : <EyeOff className="h-4 w-4 text-muted-foreground" />}
          </button>
          <button
            className="p-1.5 bg-white border shadow-md rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Block Preview */}
      <div className="overflow-hidden w-full">
        {renderBlockPreview(block)}
      </div>
    </div>
  )
}

// ─── Shared Helpers ──────────────────────────────────────────────────────────



/**
 * Clamp a user-specified font size so it stays readable at all container widths.
 * Uses CSS clamp() so the browser does the math — no viewport queries needed.
 */
function clampFont(userPx: number | undefined, fallback: number): string {
  const full = userPx ?? fallback
  const min = Math.max(11, Math.round(full * 0.50))
  return `clamp(${min}px, ${full * 0.8}px + 1cqw, ${full}px)`
}

function buildBgStyle(content: any): React.CSSProperties {
  const bg = content.background || {}
  let backgroundImage: string | undefined

  if (bg.type === "gradient" && bg.gradient?.colors?.length) {
    const { type, angle, colors } = bg.gradient
    backgroundImage = type === "radial"
      ? `radial-gradient(circle, ${colors.join(", ")})`
      : `linear-gradient(${angle ?? 135}deg, ${colors.join(", ")})`
  } else if (bg.type === "image" && bg.image) {
    backgroundImage = `url(${bg.image})`
  } else if (bg.type === "pattern") {
    const c = bg.patternColor || "#e5e7eb"
    if (bg.pattern === "dots") backgroundImage = `radial-gradient(${c} 1px, transparent 1px)`
    else if (bg.pattern === "grid") backgroundImage = `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`
    else if (bg.pattern === "diagonal") backgroundImage = `linear-gradient(45deg, ${c} 25%, transparent 25%, transparent 75%, ${c} 75%, ${c}), linear-gradient(45deg, ${c} 25%, transparent 25%, transparent 75%, ${c} 75%, ${c})`
  }

  return {
    backgroundColor: bg.type === "solid" ? (bg.color || "#ffffff") : undefined,
    backgroundImage,
    backgroundSize:
      bg.type === "image" ? `${(bg.scale || 1) * 100}%`
        : bg.type === "pattern" ? `${bg.patternSize || 20}px ${bg.patternSize || 20}px`
          : "cover",
    backgroundPosition:
      bg.type === "image" ? `${bg.positionX ?? 50}% ${bg.positionY ?? 50}%` : "center",
    opacity: bg.type === "image" ? (bg.opacity ?? 1) : 1,
  }
}

// ─── Block Renderers ─────────────────────────────────────────────────────────

function SliderBlockPreview({ block }: { block: PageBlock }) {
  const { content } = block
  const items = content.items || []
  const effect = content.effect || "slide"
  const sliderStyle = content.sliderStyle || "imageWithTextAndButton"
  const autoplay = content.autoplay ?? true
  const intervalSeconds = content.autoplayInterval || 4
  const showArrows = content.showArrows ?? true
  const showDots = content.showDots ?? true
  
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!autoplay || items.length <= 1) return
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % items.length)
    }, intervalSeconds * 1000)
    return () => clearInterval(timer)
  }, [autoplay, intervalSeconds, items.length])

  if (items.length === 0) {
    return <div className="py-10 text-center text-muted-foreground">Add slides to the slider</div>
  }

  const currentItem = items[index]
  const s = content.styles || {}
  const minH = s.minHeight || 500

  return (
    <div className="relative overflow-hidden w-full group" style={{ minHeight: `${minH}px` }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={effect === "slide" ? { opacity: 0, x: 100 } : { opacity: 0 }}
          animate={effect === "slide" ? { opacity: 1, x: 0 } : { opacity: 1 }}
          exit={effect === "slide" ? { opacity: 0, x: -100 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${currentItem.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#000000",
            opacity: s.overlayOpacity ?? 0.3,
          }} />

          {/* Content */}
          {sliderStyle !== "imageOnly" && (
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "2rem",
              zIndex: 10,
            }}>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                style={{ color: s.titleColor || "#fff", fontSize: clampFont(s.titleSize, 48), fontWeight: 700, margin: "0 0 1rem 0" }}
              >
                {currentItem.title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ color: s.subtitleColor || "#eee", fontSize: clampFont(s.subtitleSize, 18), maxWidth: "600px", margin: "0 0 2rem 0" }}
              >
                {currentItem.subtitle}
              </motion.p>
              
              {sliderStyle === "imageWithTextAndButton" && currentItem.buttonText && (
                <motion.a
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                  href={currentItem.buttonHref || "#"}
                  style={{
                    backgroundColor: s.buttonColor || "#6366f1",
                    color: s.buttonTextColor || "#fff",
                    padding: "0.75rem 2.5rem",
                    borderRadius: s.borderRadius === "none" ? "0" : s.borderRadius === "sm" ? "0.25rem" : s.borderRadius === "md" ? "0.5rem" : s.borderRadius === "lg" ? "1rem" : "9999px",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  {currentItem.buttonText}
                </motion.a>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {showArrows && items.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex((index - 1 + items.length) % items.length) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all z-20 backdrop-blur-sm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex((index + 1) % items.length) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all z-20 backdrop-blur-sm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </>
      )}

      {showDots && items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex(i) }}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/75"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function renderBlockPreview(block: PageBlock) {
  const { type, content } = block

  switch (type) {

    // ── HERO ────────────────────────────────────────────────────────────────
    case "hero": {
      const bgStyle = buildBgStyle(content)
      const alignment = content.alignment || "center"
      const s = content.styles || {}
      const minH = s.minHeight || 500

      const alignStyle: React.CSSProperties = {
        alignItems: alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start",
        textAlign: alignment as React.CSSProperties["textAlign"],
      }

      return (
        /* container-type so child cqw units work */
        <div style={{ ...bgStyle, minHeight: `${minH}px`, containerType: "inline-size" }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(1rem, 2cqw, 1.75rem)",
            padding: "clamp(2.5rem, 6cqw, 5rem) clamp(1.5rem, 6cqw, 5rem)",
            maxWidth: "56rem",
            marginInline: alignment === "center" ? "auto" : alignment === "right" ? "0 auto" : undefined,
            ...alignStyle,
          }}>
            {/* Avatar */}
            {content.avatarImage && (
              <div style={{
                width: "clamp(3rem, 8cqw, 5rem)",
                height: "clamp(3rem, 8cqw, 5rem)",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.8)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                flexShrink: 0,
              }}>
                <img src={content.avatarImage} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {/* Headline */}
            <h1 style={{
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: s.titleColor || "#0f172a",
              fontSize: clampFont(s.titleSize, 48),
              margin: 0,
            }}>
              {content.title || "I Design Digital Experiences"}
            </h1>

            {/* Subtitle */}
            <p style={{
              color: s.subtitleColor || "#64748b",
              fontSize: clampFont(s.subtitleSize, 18),
              lineHeight: 1.6,
              maxWidth: "40rem",
              margin: 0,
            }}>
              {content.subtitle || "Creative designer crafting beautiful digital experiences."}
            </p>

            {/* Buttons — flex-wrap handles overflow */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(0.5rem, 2cqw, 0.75rem)",
              justifyContent: alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start",
            }}>
              <button style={{
                padding: "clamp(0.5rem, 1.5cqw, 0.75rem) clamp(1rem, 4cqw, 1.75rem)",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "clamp(0.75rem, 2cqw, 0.875rem)",
                backgroundColor: s.buttonColor || "#6366f1",
                color: s.buttonTextColor || "#ffffff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                transform: `scale(${s.buttonScale || 1})`,
                whiteSpace: "nowrap",
              }}>
                {content.buttonText || "See My Work"}
              </button>
              {content.showSecondButton && (
                <button style={{
                  padding: "clamp(0.5rem, 1.5cqw, 0.75rem) clamp(1rem, 4cqw, 1.75rem)",
                  borderRadius: "999px",
                  fontWeight: 600,
                  fontSize: "clamp(0.75rem, 2cqw, 0.875rem)",
                  backgroundColor: "transparent",
                  color: s.titleColor || "#0f172a",
                  border: `2px solid ${s.titleColor || "#0f172a"}`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>
                  {content.secondButtonText || "Download CV"}
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    // ── ABOUT ───────────────────────────────────────────────────────────────
    case "about": {
      const bgStyle = buildBgStyle(content)
      const layout = content.layout || "imageLeft"
      const s = content.styles || {}
      const minH = s.minHeight || 300
      const skills: string[] = content.skills || []
      const socialLinks: { platform: string; url: string }[] = content.socialLinks || []
      const avatarShape = content.avatarShape || "circle"

      const avatarRadius = avatarShape === "circle" ? "50%" : avatarShape === "rounded" ? "1.5rem" : "0.75rem"

      const Avatar = (isCentered: boolean) => (
        <div style={{
          flexShrink: 0,
          // flex-basis so it wraps when container is narrow
          flexBasis: isCentered ? undefined : "clamp(120px, 30cqw, 200px)",
          width: isCentered ? "clamp(100px, 20cqw, 160px)" : undefined,
          height: isCentered ? "clamp(100px, 20cqw, 160px)" : undefined,
          aspectRatio: "1",
          borderRadius: avatarRadius,
          overflow: "hidden",
          background: "linear-gradient(135deg, #e0e7ff, #f3e8ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "flex-start",
          maxWidth: isCentered ? undefined : "200px",
          maxHeight: isCentered ? undefined : "200px",
        }}>
          {content.avatarImage
            ? <img src={content.avatarImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "#a5b4fc" }}>
                {(content.title || "A").charAt(0)}
              </span>
          }
        </div>
      )

      const TextContent = (centered: boolean) => (
        <div style={{
          flex: "1 1 200px", // shrinks and grows, wraps below 200px free space
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.75rem, 2cqw, 1.25rem)",
          textAlign: centered ? "center" : "left",
          alignItems: centered ? "center" : "flex-start",
        }}>
          <h2 style={{
            fontWeight: 700,
            color: s.titleColor || "#0f172a",
            fontSize: clampFont(s.titleSize, 30),
            lineHeight: 1.2,
            margin: 0,
          }}>
            {content.title || "About Me"}
          </h2>
          <p style={{
            color: s.bodyColor || "#475569",
            fontSize: clampFont(s.bodySize, 15),
            lineHeight: 1.65,
            margin: 0,
          }}>
            {content.body || "I'm a passionate designer creating beautiful digital experiences."}
          </p>

          {skills.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: centered ? "center" : "flex-start" }}>
              {skills.map((skill, i) => (
                <span key={i} style={{
                  padding: "0.2rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "clamp(0.65rem, 1.5cqw, 0.75rem)",
                  fontWeight: 600,
                  backgroundColor: s.skillsBg || "#f1f5f9",
                  color: s.skillsColor || "#6366f1",
                  whiteSpace: "nowrap",
                }}>
                  {skill}
                </span>
              ))}
            </div>
          )}

          {socialLinks.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: centered ? "center" : "flex-start" }}>
              {socialLinks.map((link, i) => {
                const Icon = SOCIAL_ICONS[link.platform] || Globe
                return (
                  <div key={i} style={{
                    width: "2.25rem", height: "2.25rem",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: s.skillsBg || "#f1f5f9",
                    color: s.socialIconColor || "#6366f1",
                    flexShrink: 0,
                  }}>
                    <Icon className="h-4 w-4" />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )

      const padding = "clamp(1.5rem, 5cqw, 4rem) clamp(1rem, 5cqw, 4rem)"

      return (
        <div style={{ ...bgStyle, minHeight: `${minH}px`, containerType: "inline-size" }}>
          {layout === "centered" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding, textAlign: "center" }}>
              {Avatar(true)}
              {TextContent(true)}
            </div>
          ) : (
            // flex-wrap: when container < avatar_min + text_min = ~400px, wraps to column
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: layout === "imageRight" ? "row-reverse" : "row",
              alignItems: "center",
              gap: "clamp(1.25rem, 4cqw, 3rem)",
              padding,
            }}>
              {Avatar(false)}
              {TextContent(false)}
            </div>
          )}
        </div>
      )
    }

    // ── GALLERY ─────────────────────────────────────────────────────────────
    case "gallery": {
      const bgStyle = buildBgStyle(content)
      const s = content.styles || {}
      const minH = s.minHeight || 400
      const userCols: number = content.columns || 3
      const cardStyle = content.cardStyle || "shadow"
      return (
        <div style={{ ...bgStyle, minHeight: `${minH}px`, containerType: "inline-size" }}>
          <div style={{ padding: "clamp(1.5rem, 5cqw, 3.5rem) clamp(1rem, 5cqw, 4rem)" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "clamp(1rem, 3cqw, 2rem)" }}>
              <h2 style={{
                fontWeight: 700,
                color: s.titleColor || "#0f172a",
                fontSize: clampFont(s.titleSize, 30),
                margin: "0 0 0.4rem 0",
                lineHeight: 1.2,
              }}>
                {content.title || "My Work"}
              </h2>
              {content.subtitle && (
                <p style={{ color: s.subtitleColor || "#64748b", fontSize: clampFont(s.subtitleSize, 15), margin: 0 }}>
                  {content.subtitle}
                </p>
              )}
            </div>

            {/*
              Use repeat(N, 1fr) to enforce exactly the number of columns the user chose.
              minmax(0, 1fr) lets cells shrink to any size — keeps layout intact at all widths.
            */}
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${userCols}, minmax(0, 1fr))`,
              gap: "clamp(0.5rem, 2cqw, 1rem)",
            }}>
              {Array.from({ length: userCols * 2 }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "16/9",
                  borderRadius: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  overflow: "hidden",
                  backgroundColor:
                    cardStyle === "shadow" ? (s.cardBg || "#ffffff")
                      : cardStyle === "overlay" ? "rgba(99,102,241,0.08)"
                        : cardStyle === "minimal" ? "#f1f5f9"
                          : undefined,
                  border: cardStyle === "bordered" ? `2px solid ${s.cardBorderColor || "#e2e8f0"}`
                    : cardStyle === "overlay" ? "1px solid rgba(255,255,255,0.2)"
                      : "none",
                  boxShadow: cardStyle === "shadow" ? "0 2px 12px rgba(0,0,0,0.08)" : undefined,
                }}>
                  <div style={{
                    width: "clamp(1.75rem, 4cqw, 2.5rem)",
                    height: "clamp(1.75rem, 4cqw, 2.5rem)",
                    borderRadius: "0.6rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: s.skillsBg || "#f1f5f9",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontWeight: 700, fontSize: "0.75rem", color: s.skillsColor || "#6366f1" }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 500 }}>Project {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    // ── TEXT ANIMATION ───────────────────────────────────────────────────
    case "textanimation": {
      const bgStyle = buildBgStyle(content)
      const s = content.styles || {}
      const minH = s.minHeight || 200
      const text = content.text || "Animated Text"
      const anim = content.animationType || "typewriter"
      const alignment = s.alignment || "center"
      const isLoop = content.loop ?? true
      const interval = content.interval || 0
      
      const transition = {
        repeat: isLoop ? Infinity : 0,
        repeatDelay: interval,
        duration: anim === "typewriter" ? 2 : (anim === "reveal" ? 1 : (anim === "scroll" ? (content.scrollSpeed || 10) : (anim === "blink" ? (content.blinkSpeed || 1) : 4))),
        ease: anim === "scroll" ? "linear" : "easeInOut",
      }

      const animKey = `${anim}-${isLoop}-${interval}-${content.scrollSpeed}-${content.blinkSpeed}-${text}`

      return (
        <div style={{ ...bgStyle, minHeight: `${minH}px`, containerType: "inline-size" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start",
            padding: "clamp(2rem, 5cqw, 4rem)",
            minHeight: `${minH}px`,
            textAlign: alignment as any,
          }}>
            <div style={{ position: "relative", overflow: anim === "reveal" || anim === "scroll" ? "hidden" : "visible", width: anim === "scroll" ? "100%" : "auto" }}>
              
              {/* Typewriter */}
              {anim === "typewriter" && (
                <motion.h2
                  key={animKey}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={transition}
                  style={{
                    color: s.titleColor || "#0f172a",
                    fontSize: clampFont(s.titleSize, 48),
                    fontWeight: 800,
                    margin: 0,
                    overflow: "hidden",
                    borderRight: `3px solid ${s.titleColor || "#0f172a"}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {text}
                </motion.h2>
              )}

              {/* Gradient */}
              {anim === "gradient" && (
                <motion.h2
                  key={animKey}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ ...transition, duration: 8, ease: "linear" }}
                  style={{
                    fontSize: clampFont(s.titleSize, 48),
                    fontWeight: 800,
                    margin: 0,
                    background: `linear-gradient(270deg, ${s.titleColor || "#6366f1"}, #ec4899, #a855f7, ${s.titleColor || "#6366f1"})`,
                    backgroundSize: "400% 400%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {text}
                </motion.h2>
              )}

              {/* Reveal */}
              {anim === "reveal" && (
                <div style={{ overflow: "hidden" }}>
                  <motion.h2
                    key={animKey}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={transition}
                    style={{
                      color: s.titleColor || "#0f172a",
                      fontSize: clampFont(s.titleSize, 48),
                      fontWeight: 800,
                      margin: 0,
                    }}
                  >
                    {text}
                  </motion.h2>
                </div>
              )}

              {/* Glitch */}
              {anim === "glitch" && (
                <motion.h2
                  key={animKey}
                  animate={{ x: [-1, 1, -1, 0], y: [1, -1, 1, 0] }}
                  transition={{ ...transition, duration: 0.2, repeatType: "mirror" }}
                  style={{
                    color: s.titleColor || "#0f172a",
                    fontSize: clampFont(s.titleSize, 48),
                    fontWeight: 800,
                    margin: 0,
                  }}
                >
                  {text}
                </motion.h2>
              )}

              {/* Scroll */}
              {anim === "scroll" && (
                <motion.div
                  key={animKey}
                  initial={{ x: "100%" }}
                  animate={{ x: "-100%" }}
                  transition={transition}
                  style={{ whiteSpace: "nowrap", display: "inline-block" }}
                >
                  <h2 style={{
                    color: s.titleColor || "#0f172a",
                    fontSize: clampFont(s.titleSize, 48),
                    fontWeight: 800,
                    margin: 0,
                  }}>
                    {text}
                  </h2>
                </motion.div>
              )}

              {/* Blink */}
              {anim === "blink" && (
                <motion.h2
                  key={animKey}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ ...transition, times: [0, 0.5, 1], ease: "linear" }}
                  style={{
                    color: s.titleColor || "#0f172a",
                    fontSize: clampFont(s.titleSize, 48),
                    fontWeight: 800,
                    margin: 0,
                  }}
                >
                  {text}
                </motion.h2>
              )}

            </div>
          </div>
        </div>
      )
    }

    // ── CONTACT ─────────────────────────────────────────────────────────────

    case "contact": {
      const bgStyle = buildBgStyle(content)
      const s = content.styles || {}
      const minH = s.minHeight || 400
      const layout = content.layout || "twoColumn"
      const socialLinks: { platform: string; url: string }[] = content.socialLinks || []
      const showForm = content.showForm !== false

      type CI = { Icon: React.ComponentType<{ className?: string }>; value: string }
      const contactItems: CI[] = [
        content.email && { Icon: Mail, value: content.email },
        content.phone && { Icon: Phone, value: content.phone },
        content.location && { Icon: MapPin, value: content.location },
      ].filter(Boolean) as CI[]

      const InfoSection = (
        <div style={{ flex: "1 1 220px", minWidth: 0, display: "flex", flexDirection: "column", gap: "clamp(0.75rem, 2cqw, 1.5rem)" }}>
          <div>
            <h2 style={{
              fontWeight: 700,
              color: s.titleColor || "#0f172a",
              fontSize: clampFont(s.titleSize, 30),
              lineHeight: 1.2,
              margin: "0 0 0.5rem 0",
            }}>
              {content.title || "Let's Work Together"}
            </h2>
            {content.subtitle && (
              <p style={{ color: s.subtitleColor || "#64748b", fontSize: clampFont(s.subtitleSize, 15), margin: 0, lineHeight: 1.5 }}>
                {content.subtitle}
              </p>
            )}
          </div>

          {contactItems.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {contactItems.map(({ Icon, value }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{
                    width: "2.1rem", height: "2.1rem",
                    borderRadius: "0.6rem",
                    backgroundColor: s.skillsBg || "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: s.buttonColor || "#6366f1" }} />
                  </div>
                  <span style={{
                    fontSize: "clamp(0.7rem, 1.8cqw, 0.875rem)",
                    color: s.bodyColor || "#475569",
                    wordBreak: "break-all",
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {socialLinks.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {socialLinks.map((link, i) => {
                const Icon = SOCIAL_ICONS[link.platform] || Globe
                return (
                  <div key={i} style={{
                    width: "2.1rem", height: "2.1rem",
                    borderRadius: "50%",
                    backgroundColor: s.skillsBg || "#f1f5f9",
                    color: s.buttonColor || "#6366f1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )

      const FormSection = showForm ? (
        <div style={{
          flex: "1.2 1 260px", // wider preference, but wraps when needed
          minWidth: 0,
          padding: "clamp(1rem, 3cqw, 1.5rem)",
          borderRadius: "1rem",
          backgroundColor: s.formBg || "#f8fafc",
          display: "flex", flexDirection: "column", gap: "0.6rem",
        }}>
          {/* Name + Email — stack when inner container is tiny */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(130px, 100%), 1fr))",
            gap: "0.5rem",
          }}>
            <div style={{ height: "2.25rem", borderRadius: "0.5rem", border: `1px solid ${s.inputBorderColor || "#e2e8f0"}`, backgroundColor: "#fff" }} />
            <div style={{ height: "2.25rem", borderRadius: "0.5rem", border: `1px solid ${s.inputBorderColor || "#e2e8f0"}`, backgroundColor: "#fff" }} />
          </div>
          <div style={{ height: "2.25rem", borderRadius: "0.5rem", border: `1px solid ${s.inputBorderColor || "#e2e8f0"}`, backgroundColor: "#fff" }} />
          <div style={{ height: "5rem", borderRadius: "0.5rem", border: `1px solid ${s.inputBorderColor || "#e2e8f0"}`, backgroundColor: "#fff" }} />
          <button style={{
            width: "100%",
            padding: "0.625rem 1rem",
            borderRadius: "0.75rem",
            fontWeight: 600,
            fontSize: "0.875rem",
            backgroundColor: s.buttonColor || "#6366f1",
            color: s.buttonTextColor || "#ffffff",
            border: "none",
            cursor: "pointer",
            transform: `scale(${s.buttonScale || 1})`,
          }}>
            {content.formButtonText || "Send Message"}
          </button>
        </div>
      ) : null

      const padding = "clamp(1.5rem, 5cqw, 3.5rem) clamp(1rem, 5cqw, 4rem)"

      return (
        <div style={{ ...bgStyle, minHeight: `${minH}px`, containerType: "inline-size" }}>
          {layout === "centered" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", padding, maxWidth: "36rem", marginInline: "auto" }}>
              {InfoSection}
              {FormSection && <div style={{ width: "100%" }}>{FormSection}</div>}
            </div>
          ) : (
            // flex-wrap: when total < ~480px, stacks to column automatically
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1rem, 4cqw, 3rem)", padding, alignItems: "flex-start" }}>
              {InfoSection}
              {FormSection}
            </div>
          )}
        </div>
      )
    }

    // ── SLIDER ──────────────────────────────────────────────────────────────
    case "slider":
      return <SliderBlockPreview block={block} />

    // ── DEFAULT ──────────────────────────────────────────────────────────────
    default:
      return (
        <div className="text-center py-10 text-muted-foreground italic font-medium text-sm">
          {block.type.toUpperCase()} — Preview Coming Soon
        </div>
      )
  }
}
