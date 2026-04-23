import { z } from "zod"
import { router, protectedProcedure } from "../trpc"
import { db } from "@/lib/db"

export const messageRouter = router({
  listConversations: protectedProcedure.query(async ({ ctx }) => {
    // In a real app, we'd have a Conversation model. 
    // Here we'll group messages by conversationId or between users.
    // Simplifying: Get all messages where user is sender or receiver.
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: ctx.user.id },
          // { receiverId: ctx.user.id }, // Need to add receiverId to schema if not using Conversation model
        ],
      },
      orderBy: { createdAt: "desc" },
    })

    return messages
  }),

  sendMessage: protectedProcedure
    .input(z.object({
      receiverId: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Create a message. In this simple schema, we'll use a combined ID for conversation
      const conversationId = [ctx.user.id, input.receiverId].sort().join("-")
      
      return db.message.create({
        data: {
          conversationId,
          senderId: ctx.user.id,
          content: input.content,
        },
      })
    }),

  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input }) => {
      return db.message.findMany({
        where: { conversationId: input.conversationId },
        orderBy: { createdAt: "asc" },
      })
    }),
})
