import { supabase } from './supabase'

export interface User {
  email: string
  name?: string
  age?: number
  height?: number
  weight?: number
  dietPreference?: "vegetarian" | "non-vegetarian" | "vegan"
  lifestyleGoals?: string[]
  isOnboarded: boolean
  createdAt: string
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return {
    email: user.email || '',
    name: profile.name,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    dietPreference: profile.diet_preference,
    lifestyleGoals: profile.lifestyle_goals,
    isOnboarded: profile.is_onboarded,
    createdAt: profile.created_at
  }
}

export async function updateUser(userData: Partial<User>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('profiles')
    .update({
      name: userData.name,
      age: userData.age,
      height: userData.height,
      weight: userData.weight,
      diet_preference: userData.dietPreference,
      lifestyle_goals: userData.lifestyleGoals,
      is_onboarded: userData.isOnboarded,
    })
    .eq('id', user.id)

  if (error) {
    throw error
  }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut()
}

export async function isAuthenticated(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}
