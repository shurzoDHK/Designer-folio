import { router } from "./trpc"
import { userRouter } from "./routers/user"
import { projectRouter } from "./routers/project"
import { messageRouter } from "./routers/message"

export const appRouter = router({
  user: userRouter,
  project: projectRouter,
  message: messageRouter,
})

export type AppRouter = typeof appRouter
