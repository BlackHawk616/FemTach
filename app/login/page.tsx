"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log('Login attempt started with email:', email)

    try {
      // First, try to sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Sign in result:', { signInData, signInError })

      if (signInError && signInError.message === 'Invalid login credentials') {
        console.log('User not found, attempting signup...')
        // User doesn't exist, so create a new account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) {
          throw signUpError
        }

        console.log('Sign up result:', { signUpData, signUpError })

        if (signUpData.user) {
          toast({
            title: "Account created successfully!",
            description: "Welcome to Femtech. Let's get you set up.",
          })

          console.log('Redirecting to onboarding...')
          router.push("/onboarding")
        }
      } else if (signInError) {
        throw signInError
      } else if (signInData.user) {
        // User signed in successfully
        console.log('User signed in successfully:', signInData.user.email)
        
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        })

        console.log('Redirecting to onboarding...')
        router.push("/onboarding")
      }
    } catch (error: any) {
      console.error('Authentication error:', error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Femtech</CardTitle>
          <CardDescription>Your personal health and wellness companion</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Please wait..." : "Sign In / Sign Up"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            New to Femtech? We'll automatically create your account!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
