"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated()
        setIsAuthed(authenticated)

        if (requireAuth && !authenticated) {
          router.push("/login")
          return
        }

        if (!requireAuth && authenticated) {
          router.push("/dashboard")
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsLoading(false)
        if (requireAuth) {
          router.push("/login")
        }
      }
    }

    checkAuth()
  }, [requireAuth, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthed) {
    return null
  }

  if (!requireAuth && isAuthed) {
    return null
  }

  return <>{children}</>
}
