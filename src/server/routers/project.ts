import { z } from "zod"
import { router, protectedProcedure } from "../trpc"
import { db } from "@/lib/db"
import { getPresignedPostUrl } from "@/lib/s3-client"

export const projectRouter = router({
  saveContent: protectedProcedure
    .input(z.object({
      blocks: z.any(),
      header: z.any(),
      footer: z.any(),
      theme: z.any(),
    }))
    .mutation(async ({ input, ctx }) => {
      return await db.designerProfile.update({
        where: { userId: ctx.user.id },
        data: {
          theme: JSON.stringify(input.theme),
          headerConfig: JSON.stringify(input.header),
          footerConfig: JSON.stringify(input.footer),
          pageBlocks: {
            deleteMany: {},
            create: (input.blocks as any[]).map((b, i) => ({
              id: b.id,
              type: b.type,
              content: JSON.stringify(b.content),
              order: i,
            }))
          }
        }
      })
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const designer = await db.designerProfile.findUnique({
      where: { userId: ctx.user.id },
    })
    
    if (!designer) return []

    return db.project.findMany({
      where: { profileId: designer.id },
      orderBy: { createdAt: "desc" },
    })
  }),

  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      coverImage: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const designer = await db.designerProfile.findUnique({
        where: { userId: ctx.user.id },
      })

      if (!designer) throw new Error("Designer profile not found")

      return db.project.create({
        data: {
          title: input.title,
          description: input.description,
          coverImage: input.coverImage,
          category: input.category,
          tags: input.tags.join(","),
          profileId: designer.id,
          mediaItems: JSON.stringify([]),
          tools: "",
        },
      })
    }),

  getUploadUrl: protectedProcedure
    .input(z.object({ fileName: z.string(), fileType: z.string() }))
    .mutation(async ({ input }) => {
      return getPresignedPostUrl(input.fileName, input.fileType)
    }),
})
