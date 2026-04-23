"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Palette, Share2, TrendingUp, Users, ChevronRight, Activity } from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { Button } from "@/components/ui/button"

const DATA = [
  { name: 'Mon', views: 400, inquiries: 240 },
  { name: 'Tue', views: 300, inquiries: 139 },
  { name: 'Wed', views: 200, inquiries: 980 },
  { name: 'Thu', views: 278, inquiries: 308 },
  { name: 'Fri', views: 189, inquiries: 480 },
  { name: 'Sat', views: 239, inquiries: 380 },
  { name: 'Sun', views: 349, inquiries: 430 },
]

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your portfolio.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" /> Share Profile
          </Button>
          <Button className="bg-black text-white hover:bg-black/90">
             Manage Store
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Profile Views" value="2,840" delta="+12%" icon={TrendingUp} />
        <StatCard title="Inquiries" value="24" delta="+5%" icon={Activity} />
        <StatCard title="Total Earnings" value="$15,200" delta="+18%" icon={TrendingUp} />
        <StatCard title="Completion" value="85%" delta="High" icon={Palette} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Profile Performance</CardTitle>
            <CardDescription>Views and inquiries for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="inquiries" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity / Completion Score */}
        <div className="col-span-3 space-y-6">
          <Card className="shadow-sm bg-primary text-primary-foreground">
            <CardHeader>
               <CardTitle className="text-lg">Profile Score: 85%</CardTitle>
               <CardDescription className="text-primary-foreground/80">Your profile is almost perfect! Add these to hit 100%:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                  <span className="text-sm">Add a testimonials block</span>
                  <ChevronRight className="h-4 w-4" />
               </div>
               <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                  <span className="text-sm">Link your social media</span>
                  <ChevronRight className="h-4 w-4" />
               </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg">Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-secondary shrink-0" />
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">Brand Identity for Web3</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                       </div>
                       <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, delta, icon: Icon }: any) {
  return (
    <Card className="shadow-sm border-none bg-secondary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
           <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Icon className="h-5 w-5 text-primary" />
           </div>
           <span className={cn(
             "text-xs font-bold px-2 py-1 rounded-full",
             delta.startsWith('+') ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
           )}>
             {delta}
           </span>
        </div>
        <div className="mt-4">
           <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
           <p className="text-3xl font-bold tracking-tight mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

import { cn } from "@/lib/utils"
