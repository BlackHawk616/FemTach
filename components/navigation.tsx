"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Heart, Brain, User, LayoutDashboard, Users } from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Mental Health",
    href: "/mental-health",
    icon: Brain,
  },
  {
    name: "Community",
    href: "/community",
    icon: Users,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">Femtact</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
