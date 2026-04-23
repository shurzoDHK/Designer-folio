import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function PublicProfilePage({ params }: { params: { slug: string } }) {
  const profile = await db.designerProfile.findUnique({
    where: { slug: params.slug },
    include: {
      pageBlocks: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!profile || !profile.isPublished) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen" style={getThemeStyles(profile.theme)}>
      {profile.pageBlocks.map((block) => (
        <section key={block.id} className="w-full">
           {renderPublicBlock(block)}
        </section>
      ))}
    </div>
  )
}

function renderPublicBlock(block: any) {
  const { type, content } = block
  
  switch (type) {
    case "hero":
      return (
        <section className="py-24 md:py-32 flex flex-col items-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
            {content.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl">
            {content.subtitle}
          </p>
          <Button size="lg" className="rounded-full px-8 h-12 text-lg">
            {content.buttonText || "Work With Me"}
          </Button>
        </section>
      )
    case "about":
      return (
        <section className="py-20 md:py-32 bg-secondary/20 flex flex-col items-center">
           <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <h2 className="text-3xl font-bold">{content.title}</h2>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                    {content.body}
                 </p>
              </div>
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden shadow-xl" />
           </div>
        </section>
      )
    default:
      return null
  }
}

function getThemeStyles(theme: any) {
    // Apply theme logic here
    return {}
}
