"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, ArrowRight, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateUser } from "@/lib/auth"

const steps = [
  { id: 1, title: "Personal Information", description: "Tell us about yourself" },
  { id: 2, title: "Health Preferences", description: "Your dietary and lifestyle preferences" },
  { id: 3, title: "Wellness Goals", description: "What would you like to focus on?" },
]

const lifestyleGoalOptions = [
  { id: "fitness", label: "Fitness & Exercise" },
  { id: "cycle-tracking", label: "Cycle Tracking" },
  { id: "mental-wellness", label: "Mental Wellness" },
  { id: "nutrition", label: "Nutrition & Diet" },
  { id: "sleep", label: "Sleep Quality" },
  { id: "stress-management", label: "Stress Management" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    dietPreference: "vegetarian" as "vegetarian" | "non-vegetarian" | "vegan",
    lifestyleGoals: [] as string[],
  })

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGoalToggle = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      lifestyleGoals: prev.lifestyleGoals.includes(goalId)
        ? prev.lifestyleGoals.filter((id) => id !== goalId)
        : [...prev.lifestyleGoals, goalId],
    }))
  }

  const testRedirect = () => {
    console.log('🧪 Testing direct redirect to dashboard...')
    router.push("/dashboard")
  }

  const handleComplete = () => {
    console.log('🚀 Starting onboarding completion...')
    console.log('📋 Form data:', formData)
    
    setIsLoading(true)
    
    toast({
      title: "Redirecting...",
      description: "Taking you to your dashboard",
    })

    console.log('🔄 Attempting redirect to dashboard...')
    
    // Use immediate redirect without async
    setTimeout(() => {
      console.log('⏰ Timeout executed, redirecting now...')
      router.push("/dashboard")
      setIsLoading(false)
    }, 500)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.height && formData.weight
      case 2:
        return formData.dietPreference
      case 3:
        return formData.lifestyleGoals.length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Femtact</h1>
            <p className="text-muted-foreground">Let's personalize your wellness journey</p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter your height"
                      value={formData.height}
                      onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter your weight"
                      value={formData.weight}
                      onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <Label>Diet Preference</Label>
                  <RadioGroup
                    value={formData.dietPreference}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        dietPreference: value as "vegetarian" | "non-vegetarian" | "vegan",
                      }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegetarian" id="vegetarian" />
                      <Label htmlFor="vegetarian">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-vegetarian" id="non-vegetarian" />
                      <Label htmlFor="non-vegetarian">Non-Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegan" id="vegan" />
                      <Label htmlFor="vegan">Vegan</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <Label>What are your wellness goals? (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lifestyleGoalOptions.map((goal) => (
                      <div key={goal.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal.id}
                          checked={formData.lifestyleGoals.includes(goal.id)}
                          onCheckedChange={() => handleGoalToggle(goal.id)}
                        />
                        <Label htmlFor={goal.id} className="text-sm font-normal">
                          {goal.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {/* Test button for debugging */}
                  <Button variant="secondary" onClick={testRedirect}>
                    Test Redirect
                  </Button>
                  
                  {currentStep < steps.length ? (
                    <Button onClick={handleNext} disabled={!canProceed()}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleComplete} disabled={!canProceed() || isLoading}>
                      {isLoading ? "Setting up..." : "Complete Setup"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
