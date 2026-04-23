import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
// import { auth } from "@clerk/nextjs/server"

export default function Home() {
  // const { userId } = auth()
  const userId = "user_2P6bY8V8U3f3J7gHqN5" // Mocked for preview

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <Link className="flex items-center justify-center font-bold text-2xl tracking-tighter" href="/">
          DesignFolio
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/explore">
            Explore
          </Link>
          {userId ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <div className="h-8 w-8 rounded-full bg-secondary border animate-pulse flex items-center justify-center text-[10px] font-bold">JD</div>
            </div>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center text-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Where Elite Talent Meets <span className="text-primary">Visionary Projects</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Build a breathtaking portfolio in minutes. Hire world-class designers directly. The all-in-one ecosystem for the creative industry.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/sign-up">
                  <Button size="lg" className="px-8 bg-black text-white hover:bg-black/90 transition-all">
                    Designers: Build Your Site
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" size="lg" className="px-8">
                    Clients: Discover Talent
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Placeholder for Featured Designers */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50 flex justify-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Featured Creators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl border bg-background p-2 transition-all hover:shadow-2xl">
                   <div className="aspect-[16/9] w-full bg-muted rounded-lg animate-pulse" />
                   <div className="p-4 space-y-2">
                     <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                     <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 border-t flex items-center justify-center px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2026 DesignFolio Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}
