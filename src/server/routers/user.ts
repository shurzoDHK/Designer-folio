import { z } from "zod"
import { router, publicProcedure, protectedProcedure, clerkProcedure } from "../trpc"
import { db } from "@/lib/db"
import { TRPCError } from "@trpc/server"

export const userRouter = router({
  aiMatch: publicProcedure
    .input(z.object({
      brief: z.string(),
      budget: z.number().optional(),
      category: z.string().optional(),
    }))
    .query(async ({ input }) => {
      // LOGIC PLACEHOLDER: In production, we'd send this brief to OpenAI 
      // to extract keywords and then search the database.
      // For now, return top designers.
      return db.user.findMany({
        where: { role: "DESIGNER" },
        include: { designerProfile: true },
        take: 3,
      })
    }),

  generateContent: protectedProcedure
    .input(z.object({
      prompt: z.string(),
      type: z.string(), // bio|tagline|description
    }))
    .mutation(async ({ input }) => {
      // LOGIC PLACEHOLDER: In production, we'd call OpenAI.
      // For the preview, we'll return sophisticated mocked creative copy.
      const mocks: Record<string, string> = {
        bio: "A multidisciplinary designer based in London, focused on crafting minimal digital experiences and timeless brand identities for forward-thinking startups and tech companies.",
        tagline: "Crafting digital legacies with precision and heart.",
        description: "This project explores the intersection of brutalist architecture and fluid digital interfaces. We utilized a monochromatic palette paired with sharp typography to convey strength and clarity."
      }
      
      return { text: mocks[input.type] || "Crafting unique visual stories that resonate." }
    }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    return db.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        designerProfile: {
          include: {
            pageBlocks: { orderBy: { order: "asc" } }
          }
        }
      }
    })
  }),

  sync: clerkProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx
    
    let user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      // Get user email from Clerk (mocked for now, usually from webhook or Clerk client)
      // For now, we'll assume the email is available or handled by the caller
      user = await db.user.create({
        data: {
          clerkId: userId,
          email: `user_${userId}@placeholder.com`, // Replace with actual email logic
        },
      })
    }

    return user
  }),

  onboard: clerkProcedure
    .input(z.object({
      role: z.enum(["DESIGNER", "CLIENT"]),
      displayName: z.string(),
      slug: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      let user = await db.user.findUnique({
        where: { clerkId: userId },
      })

      if (!user) {
        user = await db.user.create({
          data: {
            clerkId: userId,
            email: `user_${userId}@placeholder.com`,
          },
        })
      }

      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: { role: input.role },
      })

      if (input.role === "DESIGNER") {
        const slug = input.slug || input.displayName.toLowerCase().replace(/\s+/g, "-")
        
        await db.designerProfile.create({
          data: {
            userId: user.id,
            displayName: input.displayName,
            slug,
          },
        })
      }

      return updatedUser
    }),

  getProfile: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const profile = await db.designerProfile.findUnique({
        where: { slug: input.slug },
        include: {
          pageBlocks: { orderBy: { order: "asc" } },
          projects: { orderBy: { createdAt: "desc" } },
        },
      })

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      return profile
    }),
})
