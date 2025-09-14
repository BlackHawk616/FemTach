"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Smile, Meh, Frown, Calendar, TrendingUp, BookOpen, Brain, Zap, Coffee, Wind, Battery, Sparkles, MessageSquare, BarChart3, Target } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

type MoodType = "happy" | "neutral" | "sad" | "calm" | "anxious" | "stressed" | "energetic" | "tired" | "excited"

type ActivityType = "work" | "family" | "friends" | "exercise" | "sleep" | "other"

interface MoodEntry {
  id: string
  mood: MoodType
  note: string
  date: string
  timestamp: number
  activities?: ActivityType[]
  insight?: string
}

const moodOptions = [
  { type: "happy" as MoodType, emoji: "😊", label: "Happy", color: "bg-green-100 text-green-800 hover:bg-green-200" },
  { type: "excited" as MoodType, emoji: "🤩", label: "Excited", color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  { type: "energetic" as MoodType, emoji: "⚡", label: "Energetic", color: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
  { type: "calm" as MoodType, emoji: "😌", label: "Calm", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { type: "neutral" as MoodType, emoji: "😐", label: "Neutral", color: "bg-gray-100 text-gray-800 hover:bg-gray-200" },
  { type: "tired" as MoodType, emoji: "😴", label: "Tired", color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200" },
  { type: "anxious" as MoodType, emoji: "😰", label: "Anxious", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
  { type: "stressed" as MoodType, emoji: "😤", label: "Stressed", color: "bg-red-100 text-red-800 hover:bg-red-200" },
  { type: "sad" as MoodType, emoji: "😢", label: "Sad", color: "bg-pink-100 text-pink-800 hover:bg-pink-200" },
]

const activityOptions = [
  { type: "work" as ActivityType, label: "Work", icon: "💼" },
  { type: "family" as ActivityType, label: "Family", icon: "👨‍👩‍👧‍👦" },
  { type: "friends" as ActivityType, label: "Friends", icon: "👥" },
  { type: "exercise" as ActivityType, label: "Exercise", icon: "🏃‍♀️" },
  { type: "sleep" as ActivityType, label: "Sleep", icon: "💤" },
  { type: "other" as ActivityType, label: "Other", icon: "📝" },
]

const guidedPrompts = [
  "What made you feel this way today?",
  "What are three things you're grateful for right now?",
  "How did your body feel when you experienced this mood?",
  "What would you tell a friend feeling the same way?",
  "What's one small thing that could improve your mood?",
]

export default function MentalHealthPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [journalEntry, setJournalEntry] = useState("")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedActivities, setSelectedActivities] = useState<ActivityType[]>([])
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [showInsight, setShowInsight] = useState(false)
  const [currentInsight, setCurrentInsight] = useState("")
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly')
  const [showAITips, setShowAITips] = useState<string | null>(null)
  const [aiTips, setAiTips] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const userData = getCurrentUser()
    setUser(userData)

    // Load mood entries from localStorage
    const savedEntries = localStorage.getItem("moodEntries")
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries))
    }
  }, [])

  const generatePersonalizedInsight = (mood: MoodType) => {
    const insights = {
      happy: "You're radiating positive energy today! Consider sharing this joy with someone you care about.",
      excited: "Your excitement is contagious! Channel this energy into something creative or meaningful.",
      energetic: "Great energy today! This might be the perfect time to tackle that task you've been putting off.",
      calm: "Your inner peace is showing. Take a moment to appreciate this tranquil state of mind.",
      neutral: "Neutral days are perfectly normal. Sometimes it's okay to just be present and observe.",
      tired: "Your body and mind need rest. Consider some gentle self-care or an early bedtime tonight.",
      anxious: "Feeling anxious? Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8.",
      stressed: "Stress is your body's signal to slow down. Take 5 minutes for deep breathing or a short walk.",
      sad: "It's okay to feel sad. Allow yourself to process these emotions - they're valid and temporary."
    }
    return insights[mood] || "Every emotion is valid. Take care of yourself today."
  }

  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const insight = generatePersonalizedInsight(selectedMood)
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: selectedMood,
        note: journalEntry,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        activities: selectedActivities,
        insight
      }

      const updatedEntries = [newEntry, ...moodEntries]
      setMoodEntries(updatedEntries)
      localStorage.setItem("moodEntries", JSON.stringify(updatedEntries))

      // Show insight
      setCurrentInsight(insight)
      setShowInsight(true)

      // Reset form
      setSelectedMood(null)
      setJournalEntry("")
      setSelectedActivities([])
      setCurrentPrompt("")

      toast({
        title: "Mood logged successfully!",
        description: "Your entry has been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMoodStats = (days: number = 7) => {
    const timeframe = moodEntries.filter((entry) => Date.now() - entry.timestamp < days * 24 * 60 * 60 * 1000)

    const moodCounts: Record<MoodType, number> = {
      happy: 0, excited: 0, energetic: 0, calm: 0, neutral: 0,
      tired: 0, anxious: 0, stressed: 0, sad: 0
    }

    timeframe.forEach(entry => {
      moodCounts[entry.mood]++
    })

    const total = timeframe.length
    const dominant = total > 0
      ? Object.entries(moodCounts).reduce((a, b) => 
          moodCounts[a[0] as MoodType] > moodCounts[b[0] as MoodType] ? a : b
        )[0] as MoodType
      : "neutral" as MoodType

    // Calculate streak
    const positiveNeutralMoods = ['happy', 'excited', 'energetic', 'calm', 'neutral']
    let streak = 0
    const sortedEntries = [...moodEntries].sort((a, b) => b.timestamp - a.timestamp)
    
    for (const entry of sortedEntries) {
      if (positiveNeutralMoods.includes(entry.mood)) {
        streak++
      } else {
        break
      }
    }

    return { moodCounts, total, dominant, streak, timeframe }
  }

  const getAITips = async (mood: MoodType) => {
    setShowAITips(mood)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `I'm feeling ${mood} today. Can you give me 3 specific, actionable coping strategies or wellness tips?`,
          context: "You are a mental health wellness assistant. Provide supportive, evidence-based coping strategies. Keep responses concise and practical."
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiTips(data.response)
      } else {
        setAiTips("Unable to get tips right now. Try some deep breathing or gentle movement.")
      }
    } catch (error) {
      setAiTips("Unable to get tips right now. Try some deep breathing or gentle movement.")
    }
  }

  useEffect(() => {
    if (selectedMood && !currentPrompt) {
      setCurrentPrompt(guidedPrompts[Math.floor(Math.random() * guidedPrompts.length)])
    }
  }, [selectedMood])

  if (!user) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              <Brain className="h-8 w-8 mr-3 text-primary" />
              Mental Health Tracker
            </h1>
            <p className="text-muted-foreground">Track your mood and reflect on your mental wellness journey</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mood Tracker Widget */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>How are you feeling today?</CardTitle>
                  <CardDescription>
                    Select your current mood and add any thoughts you'd like to remember
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mood Selection */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Select your mood:</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {moodOptions.map((option) => {
                        return (
                          <button
                            key={option.type}
                            onClick={() => setSelectedMood(option.type)}
                            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                              selectedMood === option.type
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <span className="text-2xl mb-1">{option.emoji}</span>
                            <span className="text-xs font-medium text-center">{option.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Activity Tags */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">What influenced your mood? (Optional):</h3>
                    <div className="flex flex-wrap gap-2">
                      {activityOptions.map((activity) => (
                        <button
                          key={activity.type}
                          onClick={() => {
                            setSelectedActivities(prev => 
                              prev.includes(activity.type)
                                ? prev.filter(a => a !== activity.type)
                                : [...prev, activity.type]
                            )
                          }}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm border transition-all ${
                            selectedActivities.includes(activity.type)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:border-primary/50"
                          }`}
                        >
                          <span>{activity.icon}</span>
                          <span>{activity.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guided Prompt */}
                  {selectedMood && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium">Reflection Prompt:</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCurrentPrompt(guidedPrompts[Math.floor(Math.random() * guidedPrompts.length)])}
                        >
                          New Prompt
                        </Button>
                      </div>
                      <div className="p-3 bg-muted rounded-lg mb-3">
                        <p className="text-sm text-muted-foreground">
                          {currentPrompt || guidedPrompts[Math.floor(Math.random() * guidedPrompts.length)]}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Journal Entry */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Journal Entry (Optional):</h3>
                    <Textarea
                      placeholder="How was your day? What's on your mind? Write down your thoughts..."
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleMoodSubmit} disabled={isLoading || !selectedMood} className="w-full">
                    {isLoading ? "Saving..." : "Log Mood Entry"}
                  </Button>

                  {/* Personalized Insight */}
                  {showInsight && currentInsight && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Personal Insight</h4>
                          <p className="text-sm text-blue-800">{currentInsight}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowInsight(false)}
                            className="mt-2 text-blue-600 hover:text-blue-800"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Mood Analysis */}
            <div className="space-y-6">
              {/* Mood Trends */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Mood Trends
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant={viewMode === 'weekly' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setViewMode('weekly')}
                      >
                        Week
                      </Button>
                      <Button 
                        variant={viewMode === 'monthly' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setViewMode('monthly')}
                      >
                        Month
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const days = viewMode === 'weekly' ? 7 : 30
                    const stats = getMoodStats(days)
                    return stats.total > 0 ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{stats.total}</div>
                          <div className="text-sm text-muted-foreground">
                            entries this {viewMode === 'weekly' ? 'week' : 'month'}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {Object.entries(stats.moodCounts)
                            .filter(([_, count]) => count > 0)
                            .sort(([_, a], [__, b]) => b - a)
                            .slice(0, 5)
                            .map(([mood, count]) => {
                              const option = moodOptions.find(o => o.type === mood)
                              return (
                                <div key={mood} className="flex justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    <span>{option?.emoji}</span>
                                    <span className="text-sm capitalize">{mood}</span>
                                  </div>
                                  <Badge className={option?.color}>{count}</Badge>
                                </div>
                              )
                            })}
                        </div>

                        <div className="pt-4 border-t space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Most common: <span className="font-medium capitalize">{stats.dominant}</span>
                          </p>
                          {stats.streak > 0 && (
                            <div className="flex items-center space-x-2">
                              <Target className="h-4 w-4 text-green-600" />
                              <p className="text-sm text-green-700">
                                {stats.streak} day positive streak! 🎉
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <BookOpen className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Start logging your mood to see trends and insights</p>
                      </div>
                    )
                  })()
                  }
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Past Mood Logs */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Your Mood History
              </CardTitle>
              <CardDescription>Review your past entries and reflect on your journey</CardDescription>
            </CardHeader>
            <CardContent>
              {moodEntries.length > 0 ? (
                <div className="space-y-4">
                  {moodEntries.slice(0, 10).map((entry) => {
                    const moodOption = moodOptions.find((option) => option.type === entry.mood)

                    return (
                      <div key={entry.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{moodOption?.emoji}</span>
                            <Badge className={moodOption?.color}>{moodOption?.label}</Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{entry.date}</span>
                        </div>
                        
                        {entry.activities && entry.activities.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.activities.map(activity => {
                              const activityOption = activityOptions.find(a => a.type === activity)
                              return (
                                <span key={activity} className="text-xs px-2 py-1 bg-muted rounded-full flex items-center space-x-1">
                                  <span>{activityOption?.icon}</span>
                                  <span>{activityOption?.label}</span>
                                </span>
                              )
                            })}
                          </div>
                        )}
                        
                        {entry.note && <p className="text-sm text-foreground">{entry.note}</p>}
                        
                        {entry.insight && (
                          <div className="text-xs text-muted-foreground italic border-l-2 border-blue-200 pl-2">
                            {entry.insight}
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => getAITips(entry.mood)}
                            className="text-xs"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Get Coping Tips
                          </Button>
                        </div>
                        
                        {showAITips === entry.mood && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-blue-900 mb-1">AI Wellness Tips</h5>
                                <p className="text-xs text-blue-800 whitespace-pre-line">{aiTips || "Loading tips..."}</p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setShowAITips(null)}
                                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Close
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {moodEntries.length > 10 && (
                    <div className="text-center">
                      <Button variant="outline" size="sm">
                        View All Entries ({moodEntries.length})
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No mood entries yet. Start by logging how you feel today!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
