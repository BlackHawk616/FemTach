"use client"

import { Navigation } from "@/components/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon, 
  Video, 
  Users, 
  TrendingUp,
  UserPlus,
  Hash,
  Calendar,
  MapPin,
  MoreHorizontal
} from "lucide-react"
import { useState } from "react"

// Dummy data
const communityStats = {
  followers: 1247,
  following: 892,
  trendingGroups: 15
}

const dummyPosts = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      username: "@sarah_j",
      avatar: "/placeholder-user.jpg"
    },
    timestamp: "2h",
    content: "Just had an amazing session with my therapist today! Remember, it's okay to not be okay sometimes. Taking care of your mental health is just as important as physical health. 💚",
    likes: 24,
    comments: 8,
    shares: 3,
    hasImage: false
  },
  {
    id: 2,
    user: {
      name: "Dr. Emily Chen",
      username: "@dr_emily",
      avatar: "/placeholder-user.jpg"
    },
    timestamp: "4h",
    content: "New research shows that regular meditation can reduce anxiety by up to 40%. Here's a simple 5-minute breathing exercise you can try today:",
    likes: 156,
    comments: 23,
    shares: 45,
    hasImage: true,
    imageUrl: "/placeholder.jpg"
  },
  {
    id: 3,
    user: {
      name: "Maya Patel",
      username: "@maya_wellness",
      avatar: "/placeholder-user.jpg"
    },
    timestamp: "6h",
    content: "Sharing my journey with PCOS. It's been challenging but finding this community has made all the difference. Thank you for the support! 🙏",
    likes: 89,
    comments: 34,
    shares: 12,
    hasImage: false
  }
]

const suggestedUsers = [
  {
    name: "Dr. Lisa Wang",
    username: "@dr_lisa_wellness",
    specialty: "Mental Health Expert",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Wellness Coach Amy",
    username: "@coach_amy",
    specialty: "Fitness & Nutrition",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Mindful Maria",
    username: "@mindful_maria",
    specialty: "Meditation Guide",
    avatar: "/placeholder-user.jpg"
  }
]

const trendingHashtags = [
  "#MentalHealthAwareness",
  "#WomensHealth",
  "#SelfCare",
  "#Mindfulness",
  "#HealthyLiving",
  "#WellnessJourney"
]

const announcements = [
  {
    title: "Weekly Wellness Webinar",
    date: "Tomorrow, 7 PM",
    description: "Join Dr. Sarah for a session on managing stress"
  },
  {
    title: "New Support Group",
    date: "Starting Monday",
    description: "PCOS support group - open to all members"
  }
]

export default function CommunityPage() {
  const [postContent, setPostContent] = useState("")
  const [selectedPostType, setSelectedPostType] = useState("text")

  const handleCreatePost = () => {
    if (postContent.trim()) {
      // Handle post creation logic here
      console.log("Creating post:", postContent)
      setPostContent("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - Community Stats */}
          <div className="lg:col-span-1">
            <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Followers</span>
                  <span className="font-semibold text-lg">{communityStats.followers.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Following</span>
                  <span className="font-semibold text-lg">{communityStats.following.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trending Groups</span>
                  <span className="font-semibold text-lg">{communityStats.trendingGroups}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find Friends
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Join Groups
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Main Feed */}
          <div className="lg:col-span-2">
            {/* Create Post Card */}
            <Card className="rounded-xl shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <Textarea
                      placeholder="What's on your mind? Share your wellness journey..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="min-h-[100px] resize-none border-0 focus-visible:ring-0 text-base"
                    />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          variant={selectedPostType === "text" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setSelectedPostType("text")}
                        >
                          Text
                        </Button>
                        <Button
                          variant={selectedPostType === "image" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setSelectedPostType("image")}
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Image
                        </Button>
                        <Button
                          variant={selectedPostType === "video" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setSelectedPostType("video")}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Video
                        </Button>
                      </div>
                      
                      <Button 
                        onClick={handleCreatePost}
                        disabled={!postContent.trim()}
                        className="px-6"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-6">
                {dummyPosts.map((post) => (
                  <Card key={post.id} className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={post.user.avatar} />
                            <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{post.user.name}</h4>
                              <span className="text-muted-foreground text-sm">{post.user.username}</span>
                              <span className="text-muted-foreground text-sm">·</span>
                              <span className="text-muted-foreground text-sm">{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-sm leading-relaxed">{post.content}</p>
                        {post.hasImage && (
                          <div className="mt-3 rounded-lg overflow-hidden">
                            <img 
                              src={post.imageUrl} 
                              alt="Post content" 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-red-500">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-blue-500">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-green-500">
                          <Share2 className="h-4 w-4" />
                          <span>{post.shares}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Sidebar - Suggestions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Suggested Users */}
            <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Who to Follow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.specialty}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Hashtags */}
            <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingHashtags.map((hashtag, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="font-medium text-sm">{announcement.title}</h4>
                    <p className="text-xs text-primary">{announcement.date}</p>
                    <p className="text-xs text-muted-foreground">{announcement.description}</p>
                    {index < announcements.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
