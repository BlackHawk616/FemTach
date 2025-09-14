"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Flame, Calendar, Droplets, MessageCircle, Send, Heart, Moon, MapPin, Brain, Shield } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser } from "@/lib/auth"

// Mock data for demo purposes
const mockHealthData = {
  steps: 7842,
  stepsGoal: 10000,
  calories: 324,
  caloriesGoal: 500,
  hydration: 6,
  hydrationGoal: 8,
  cycleDay: 14,
  cycleLength: 28,
  nextPeriod: "2025-01-05",
  sleepHours: 7.3,
  sleepGoal: 8,
  distance: 5.2,
  stressLevel: "Medium",
  anxietyScore: 4,
}

const motivationalQuotes = [
  "Your body can do it. It's your mind you need to convince.",
  "Health is not about the weight you lose, but about the life you gain.",
  "Take care of your body. It's the only place you have to live.",
  "Every small step counts towards your wellness journey.",
  "You are stronger than you think and more capable than you imagine.",
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hi! I'm your wellness assistant. How can I help you today?" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [currentQuote, setCurrentQuote] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('📊 Dashboard: Loading user data...')
        const userData = await getCurrentUser()
        console.log('📊 Dashboard: User data loaded:', userData)
        setUser(userData || { name: 'User', email: 'user@example.com' }) // Fallback user
      } catch (error) {
        console.error('❌ Dashboard: Error loading user:', error)
        // Set fallback user to prevent infinite loading
        setUser({ name: 'User', email: 'user@example.com' })
      }
    }
    
    loadUser()

    // Set random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setCurrentQuote(randomQuote)
  }, [])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = { role: "user", content: newMessage }
    setChatMessages((prev) => [...prev, userMessage])
    
    // Add loading message
    const loadingMessage = { role: "assistant", content: "..." }
    setChatMessages((prev) => [...prev, loadingMessage])

    setNewMessage("")

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          context: "You are a wellness assistant for women's health. Provide helpful, supportive advice about health, fitness, nutrition, mental wellness, and lifestyle. Keep responses concise and encouraging."
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Remove loading message and add actual response
      setChatMessages((prev) => {
        const withoutLoading = prev.slice(0, -1)
        return [...withoutLoading, { role: "assistant", content: data.response }]
      })

    } catch (error) {
      console.error('Chat error:', error)
      // Remove loading message and add error message
      setChatMessages((prev) => {
        const withoutLoading = prev.slice(0, -1)
        return [...withoutLoading, { role: "assistant", content: "Error: Please try again later." }]
      })
    }
  }

  const getCyclePhase = () => {
    const day = mockHealthData.cycleDay
    if (day <= 5) return { phase: "Menstrual", color: "bg-red-100 text-red-800" }
    if (day <= 13) return { phase: "Follicular", color: "bg-green-100 text-green-800" }
    if (day <= 15) return { phase: "Ovulation", color: "bg-blue-100 text-blue-800" }
    return { phase: "Luteal", color: "bg-purple-100 text-purple-800" }
  }

  const cyclePhase = getCyclePhase()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Good morning, {user.name || 'User'}! 👋</h1>
          <p className="text-muted-foreground">Here's your wellness overview for today</p>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Metrics Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Steps Counter */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Steps Today</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockHealthData.steps.toLocaleString()}</div>
                  <Progress value={(mockHealthData.steps / mockHealthData.stepsGoal) * 100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Goal: {mockHealthData.stepsGoal.toLocaleString()} steps
                  </p>
                </CardContent>
              </Card>

              {/* Calories Burned */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockHealthData.calories}</div>
                  <Progress value={(mockHealthData.calories / mockHealthData.caloriesGoal) * 100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">Goal: {mockHealthData.caloriesGoal} calories</p>
                </CardContent>
              </Card>

              {/* Cycle Tracker */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cycle Tracker</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Day {mockHealthData.cycleDay}</div>
                  <Badge className={`mt-2 ${cyclePhase.color}`}>{cyclePhase.phase} Phase</Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Next period: {new Date(mockHealthData.nextPeriod).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              {/* Hydration Reminder */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hydration</CardTitle>
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockHealthData.hydration}/{mockHealthData.hydrationGoal} glasses
                  </div>
                  <Progress value={(mockHealthData.hydration / mockHealthData.hydrationGoal) * 100} className="mt-2" />
                  <Button size="sm" className="mt-2">
                    Log Water
                  </Button>
                </CardContent>
              </Card>

              {/* Sleep Tracking */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sleep</CardTitle>
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.floor(mockHealthData.sleepHours)}h {Math.round((mockHealthData.sleepHours % 1) * 60)}m
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Goal: {mockHealthData.sleepGoal}h
                  </p>
                  <Progress value={(mockHealthData.sleepHours / mockHealthData.sleepGoal) * 100} className="mt-2" />
                </CardContent>
              </Card>

              {/* Distance Covered */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Distance</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockHealthData.distance} km</div>
                  <p className="text-xs text-muted-foreground">
                    Today's journey
                  </p>
                </CardContent>
              </Card>

              {/* Stress Level */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockHealthData.stressLevel}</div>
                  <div className="mt-2">
                    <div className="flex space-x-1">
                      <div className={`h-2 w-full rounded ${mockHealthData.stressLevel === 'Low' ? 'bg-green-200' : 'bg-gray-200'}`} />
                      <div className={`h-2 w-full rounded ${mockHealthData.stressLevel === 'Medium' ? 'bg-yellow-200' : 'bg-gray-200'}`} />
                      <div className={`h-2 w-full rounded ${mockHealthData.stressLevel === 'High' ? 'bg-red-200' : 'bg-gray-200'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Anxiety Level */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Anxiety Level</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockHealthData.anxietyScore}/10</div>
                  <p className="text-xs text-muted-foreground">
                    {mockHealthData.anxietyScore <= 3 ? 'Low anxiety' : 
                     mockHealthData.anxietyScore <= 6 ? 'Moderate anxiety' : 'High anxiety'}
                  </p>
                  <Progress value={mockHealthData.anxietyScore * 10} className="mt-2" />
                </CardContent>
              </Card>

              {/* Motivational Quote */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-primary" />
                    Daily Motivation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg italic text-foreground">"{currentQuote}"</blockquote>
                </CardContent>
              </Card>
            </div>

            {/* AI Wellness Assistant Sidebar */}
            <div className="lg:col-span-1">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Wellness Assistant
                  </CardTitle>
                  <CardDescription>Ask me about health, diet, or wellness tips!</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0 p-4">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] p-3 rounded-lg text-sm break-words ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="flex space-x-2 flex-shrink-0">
                    <Input
                      placeholder="Ask me anything..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleSendMessage} className="flex-shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}
