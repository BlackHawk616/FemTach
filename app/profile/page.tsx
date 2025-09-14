"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Calculator, Settings, LogOut, Edit, Save, X } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser, updateUser, logout } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

const lifestyleGoalOptions = [
  { id: "fitness", label: "Fitness & Exercise" },
  { id: "cycle-tracking", label: "Cycle Tracking" },
  { id: "mental-wellness", label: "Mental Wellness" },
  { id: "nutrition", label: "Nutrition & Diet" },
  { id: "sleep", label: "Sleep Quality" },
  { id: "stress-management", label: "Stress Management" },
]

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Form data for editing
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    dietPreference: "vegetarian" as "vegetarian" | "non-vegetarian" | "vegan",
    lifestyleGoals: [] as string[],
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsInitialLoading(true)
        setLoadError(null)
        
        const userData = await getCurrentUser()
        if (userData) {
          setUser(userData)
          setFormData({
            name: userData.name || "",
            age: userData.age?.toString() || "",
            height: userData.height?.toString() || "",
            weight: userData.weight?.toString() || "",
            dietPreference: userData.dietPreference || "vegetarian",
            lifestyleGoals: userData.lifestyleGoals || [],
          })
        } else {
          // User exists but no profile data - create default user object
          setUser({
            email: "user@example.com",
            name: "",
            age: null,
            height: null,
            weight: null,
            dietPreference: "vegetarian",
            lifestyleGoals: [],
            isOnboarded: false,
            createdAt: new Date().toISOString()
          })
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        setLoadError("Failed to load profile data")
        
        // Set fallback user data to prevent blank page
        setUser({
          email: "user@example.com",
          name: "",
          age: null,
          height: null,
          weight: null,
          dietPreference: "vegetarian",
          lifestyleGoals: [],
          isOnboarded: false,
          createdAt: new Date().toISOString()
        })
        
        toast({
          title: "Error",
          description: "Failed to load profile data. Using default values.",
          variant: "destructive",
        })
      } finally {
        setIsInitialLoading(false)
      }
    }
    
    loadUserData()
  }, [])

  const calculateBMI = (height?: string, weight?: string) => {
    const h = height ? parseFloat(height) : (user?.height || 0)
    const w = weight ? parseFloat(weight) : (user?.weight || 0)
    if (!h || !w || h <= 0 || w <= 0) return null
    const heightInMeters = h / 100
    const bmi = w / (heightInMeters * heightInMeters)
    return bmi.toFixed(1)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "bg-blue-100 text-blue-800" }
    if (bmi < 25) return { category: "Normal", color: "bg-green-100 text-green-800" }
    if (bmi < 30) return { category: "Overweight", color: "bg-yellow-100 text-yellow-800" }
    return { category: "Obese", color: "bg-red-100 text-red-800" }
  }

  const handleGoalToggle = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      lifestyleGoals: prev.lifestyleGoals.includes(goalId)
        ? prev.lifestyleGoals.filter((id) => id !== goalId)
        : [...prev.lifestyleGoals, goalId],
    }))
  }

  const validateInputs = () => {
    const errors = []
    
    if (!formData.name.trim()) {
      errors.push("Name is required")
    }
    
    const age = parseInt(formData.age)
    if (!formData.age || isNaN(age) || age <= 0 || age > 150) {
      errors.push("Please enter a valid age (1-150)")
    }
    
    const height = parseFloat(formData.height)
    if (!formData.height || isNaN(height) || height <= 0 || height > 300) {
      errors.push("Please enter a valid height in cm (1-300)")
    }
    
    const weight = parseFloat(formData.weight)
    if (!formData.weight || isNaN(weight) || weight <= 0 || weight > 500) {
      errors.push("Please enter a valid weight in kg (1-500)")
    }
    
    return errors
  }

  const handleSave = async () => {
    const validationErrors = validateInputs()
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(", "),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const updatedData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        dietPreference: formData.dietPreference,
        lifestyleGoals: formData.lifestyleGoals,
      }

      await updateUser(updatedData)

      // Refresh user data
      const refreshedUser = await getCurrentUser()
      if (refreshedUser) {
        setUser(refreshedUser)
        setFormData({
          name: refreshedUser.name || "",
          age: refreshedUser.age?.toString() || "",
          height: refreshedUser.height?.toString() || "",
          weight: refreshedUser.weight?.toString() || "",
          dietPreference: refreshedUser.dietPreference || "vegetarian",
          lifestyleGoals: refreshedUser.lifestyleGoals || [],
        })
      }
      setIsEditing(false)

      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved.",
      })
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age?.toString() || "",
        height: user.height?.toString() || "",
        weight: user.weight?.toString() || "",
        dietPreference: user.dietPreference || "vegetarian",
        lifestyleGoals: user.lifestyleGoals || [],
      })
    }
    setIsEditing(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      })
      router.push("/login")
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Calculate BMI based on current form data if editing, otherwise use user data
  const currentBMI = isEditing ? calculateBMI(formData.height, formData.weight) : calculateBMI()
  const bmiCategory = currentBMI ? getBMICategory(parseFloat(currentBMI)) : null

  // Show loading state during initial data fetch
  if (isInitialLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
                <User className="h-8 w-8 mr-3 text-primary" />
                Profile Settings
              </h1>
              <p className="text-muted-foreground">Loading your profile information...</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Loading skeleton for main content */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                          <div className="h-10 bg-muted rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Loading skeleton for sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-2/3 animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-3">
                      <div className="h-12 bg-muted rounded animate-pulse"></div>
                      <div className="h-6 bg-muted rounded w-1/2 mx-auto animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              <User className="h-8 w-8 mr-3 text-primary" />
              Profile Settings
            </h1>
            <p className="text-muted-foreground">Manage your personal information and preferences</p>
          </div>

          {/* Error Banner */}
          {loadError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <strong>Warning:</strong> {loadError}. You can still edit your profile, and changes will be saved when you click Save.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your profile details and preferences</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{user.name}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      {isEditing ? (
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                          min="1"
                          max="150"
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{user.age} years</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      {isEditing ? (
                        <Input
                          id="height"
                          type="number"
                          value={formData.height}
                          onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                          min="1"
                          max="300"
                          step="0.1"
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{user.height} cm</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      {isEditing ? (
                        <Input
                          id="weight"
                          type="number"
                          value={formData.weight}
                          onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                          min="1"
                          max="500"
                          step="0.1"
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{user.weight} kg</div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Diet Preference */}
                  <div className="space-y-3">
                    <Label>Diet Preference</Label>
                    {isEditing ? (
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
                          <RadioGroupItem value="vegetarian" id="edit-vegetarian" />
                          <Label htmlFor="edit-vegetarian">Vegetarian</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non-vegetarian" id="edit-non-vegetarian" />
                          <Label htmlFor="edit-non-vegetarian">Non-Vegetarian</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vegan" id="edit-vegan" />
                          <Label htmlFor="edit-vegan">Vegan</Label>
                        </div>
                      </RadioGroup>
                    ) : (
                      <Badge className="capitalize">{user.dietPreference}</Badge>
                    )}
                  </div>

                  <Separator />

                  {/* Lifestyle Goals */}
                  <div className="space-y-3">
                    <Label>Wellness Goals</Label>
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {lifestyleGoalOptions.map((goal) => (
                          <div key={goal.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-${goal.id}`}
                              checked={formData.lifestyleGoals.includes(goal.id)}
                              onCheckedChange={() => handleGoalToggle(goal.id)}
                            />
                            <Label htmlFor={`edit-${goal.id}`} className="text-sm font-normal">
                              {goal.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user.lifestyleGoals?.map((goalId: string) => {
                          const goal = lifestyleGoalOptions.find((g) => g.id === goalId)
                          return goal ? (
                            <Badge key={goalId} variant="secondary">
                              {goal.label}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* BMI Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    BMI Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentBMI ? (
                    <div className="text-center space-y-3">
                      <div className="text-3xl font-bold">{currentBMI}</div>
                      <Badge className={bmiCategory?.color}>{bmiCategory?.category}</Badge>
                      <p className="text-xs text-muted-foreground">BMI is calculated using your height and weight</p>
                      {isEditing && (
                        <p className="text-xs text-blue-600 italic">Updates as you edit height/weight</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Complete your height and weight to calculate BMI</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="p-2 bg-muted rounded-md text-sm">{user.email}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="p-2 bg-muted rounded-md text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Unknown'}
                    </div>
                  </div>

                  <Separator />

                  <Button variant="destructive" onClick={handleLogout} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
