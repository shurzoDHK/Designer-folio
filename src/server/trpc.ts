import { initTRPC, TRPCError } from "@trpc/server"
// import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure

const isClerkAuthed = t.middleware(async ({ next }) => {
  // MOCK: Return a dummy userId for preview
  return next({
    ctx: { userId: "user_2P6bY8V8U3f3J7gHqN5" },
  })
})

const isAuthed = t.middleware(async ({ next }) => {
  const userId = "user_2P6bY8V8U3f3J7gHqN5"
  
  // MOCK: Find or create a dummy user in database for preview
  let user = await db.user.findFirst({
    where: { role: "DESIGNER" }
  })

  // If no designer exists, we'll use a placeholder or create one
  if (!user) {
    user = await db.user.upsert({
      where: { email: "preview@designfolio.com" },
      update: {},
      create: {
        clerkId: userId,
        email: "preview@designfolio.com",
        role: "DESIGNER",
      }
    })
  }

  return next({
    ctx: {
      userId,
      user,
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthed)
export const clerkProcedure = t.procedure.use(isClerkAuthed)
