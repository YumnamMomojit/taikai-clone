"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Trophy, 
  Star, 
  Award, 
  Github, 
  ExternalLink, 
  Users, 
  Target,
  Settings,
  Edit,
  Share2,
  Heart,
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Gift
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Mock data for the user profile
  const userProfile = {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Full-stack developer passionate about AI, blockchain, and creating innovative solutions to real-world problems. Love participating in hackathons and collaborating with talented teams.",
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
    github: "https://github.com/alexjohnson",
    twitter: "@alexjohnson",
    linkedin: "linkedin.com/in/alexjohnson",
    avatar: "/api/placeholder/200/200",
    joinDate: "2023-01-15",
    role: "PARTICIPANT",
    stats: {
      hackathonsParticipated: 12,
      projectsSubmitted: 8,
      achievements: 15,
      totalPrizeMoney: 25000,
      followers: 342,
      following: 128
    },
    skills: [
      { name: "React", level: 95 },
      { name: "Node.js", level: 90 },
      { name: "Python", level: 85 },
      { name: "AI/ML", level: 80 },
      { name: "Blockchain", level: 75 },
      { name: "UI/UX Design", level: 70 }
    ],
    achievements: [
      {
        id: "1",
        title: "Hackathon Champion",
        description: "Won 1st place in AI Innovation Challenge",
        icon: Trophy,
        date: "2024-03-30",
        rarity: "legendary"
      },
      {
        id: "2",
        title: "Rising Star",
        description: "Top 10% of participants in 2024",
        icon: Star,
        date: "2024-01-01",
        rarity: "rare"
      },
      {
        id: "3",
        title: "Team Player",
        description: "Participated in 10+ team projects",
        icon: Users,
        date: "2023-12-15",
        rarity: "common"
      },
      {
        id: "4",
        title: "Innovation Award",
        description: "Most creative solution in HealthTech Challenge",
        icon: Award,
        date: "2023-11-20",
        rarity: "epic"
      },
      {
        id: "5",
        title: "Community Hero",
        description: "Helped 50+ participants with their projects",
        icon: Heart,
        date: "2023-10-10",
        rarity: "rare"
      }
    ],
    projects: [
      {
        id: "1",
        title: "AI-Powered Health Monitoring System",
        description: "Comprehensive health monitoring platform using AI and wearable devices",
        imageUrl: "/api/placeholder/300/200",
        status: "WINNER",
        likes: 156,
        comments: 23,
        hackathon: "HealthTech Innovation Challenge",
        prize: "$20,000"
      },
      {
        id: "2",
        title: "Blockchain Voting System",
        description: "Secure and transparent voting platform built on Ethereum",
        imageUrl: "/api/placeholder/300/200",
        status: "APPROVED",
        likes: 89,
        comments: 12,
        hackathon: "Web3 Governance Hackathon",
        prize: "$5,000"
      },
      {
        id: "3",
        title: "Smart City Traffic Optimizer",
        description: "AI-based traffic management system for smart cities",
        imageUrl: "/api/placeholder/300/200",
        status: "SUBMITTED",
        likes: 234,
        comments: 34,
        hackathon: "Sustainability Tech Challenge",
        prize: null
      }
    ],
    upcomingHackathons: [
      {
        id: "1",
        title: "FinTech Revolution Hackathon",
        date: "2024-04-15",
        location: "New York, NY",
        prizePool: "$100,000",
        status: "REGISTERED"
      },
      {
        id: "2",
        title: "EdTech Innovation Challenge",
        date: "2024-05-01",
        location: "Virtual",
        prizePool: "$45,000",
        status: "INTERESTED"
      }
    ],
    recentActivity: [
      {
        type: "project",
        action: "submitted project",
        target: "AI-Powered Health Monitoring System",
        time: "2 hours ago",
        icon: Target
      },
      {
        type: "achievement",
        action: "earned achievement",
        target: "Hackathon Champion",
        time: "1 day ago",
        icon: Trophy
      },
      {
        type: "hackathon",
        action: "registered for",
        target: "FinTech Revolution Hackathon",
        time: "3 days ago",
        icon: Calendar
      },
      {
        type: "project",
        action: "commented on",
        target: "Blockchain Voting System",
        time: "1 week ago",
        icon: MessageCircle
      }
    ],
    nfts: [
      {
        id: "1",
        name: "HealthTech Champion 2024",
        image: "/api/placeholder/100/100",
        description: "Winner of HealthTech Innovation Challenge",
        contractAddress: "0x123...abc",
        tokenId: "1"
      },
      {
        id: "2",
        name: "AI Innovator Badge",
        image: "/api/placeholder/100/100",
        description: "For outstanding AI project contributions",
        contractAddress: "0x456...def",
        tokenId: "42"
      }
    ]
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "legendary": return "bg-gradient-to-r from-yellow-400 to-orange-500"
      case "epic": return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "rare": return "bg-gradient-to-r from-blue-500 to-cyan-500"
      case "common": return "bg-gradient-to-r from-gray-400 to-gray-600"
      default: return "bg-gray-500"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "WINNER": return "default"
      case "APPROVED": return "secondary"
      case "SUBMITTED": return "outline"
      default: return "outline"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 md:w-40 md:h-40">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="text-3xl">{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{userProfile.name}</h1>
                  <Badge variant="outline" className="w-fit">
                    @{userProfile.email.split('@')[0]}
                  </Badge>
                </div>
                
                <p className="text-lg text-muted-foreground mb-4 max-w-2xl">
                  {userProfile.bio}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center md:justify-start mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {userProfile.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDate(userProfile.joinDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {userProfile.stats.followers} followers
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button onClick={() => setShowEditDialog(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Profile
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{userProfile.stats.hackathonsParticipated}</div>
              <div className="text-sm text-muted-foreground">Hackathons</div>
            </div>
            <div className="text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{userProfile.stats.projectsSubmitted}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{userProfile.stats.achievements}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">${userProfile.stats.totalPrizeMoney.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Prize Money</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{userProfile.stats.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{userProfile.stats.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="nfts">NFTs</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="mt-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Projects ({userProfile.projects.length})</h2>
                    <Button variant="outline">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View All
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProfile.projects.map((project) => (
                      <Card key={project.id} className="group hover:shadow-lg transition-all duration-300">
                        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                            <Badge variant={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Hackathon:</span> {project.hackathon}
                            </div>
                            {project.prize && (
                              <div className="text-sm text-muted-foreground">
                                <span className="font-medium">Prize:</span> {project.prize}
                              </div>
                            )}
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {project.likes}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                {project.comments}
                              </div>
                            </div>
                            <Button className="w-full" size="sm">
                              View Project
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Achievements ({userProfile.achievements.length})</h2>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProfile.achievements.map((achievement) => (
                      <Card key={achievement.id} className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6 text-center">
                          <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${getRarityColor(achievement.rarity)} flex items-center justify-center`}>
                            <achievement.icon className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(achievement.date)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Technical Skills</h2>
                  
                  <div className="grid gap-6">
                    {userProfile.skills.map((skill, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{skill.name}</h3>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Recent Activity</h2>
                  
                  <div className="space-y-4">
                    {userProfile.recentActivity.map((activity, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <activity.icon className="h-5 w-5 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">You</span> {activity.action} <span className="font-medium">{activity.target}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="nfts" className="mt-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">NFT Collection ({userProfile.nfts.length})</h2>
                    <Button variant="outline">
                      <Gift className="mr-2 h-4 w-4" />
                      Mint New
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {userProfile.nfts.map((nft) => (
                      <Card key={nft.id} className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6 text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Gift className="h-12 w-12 text-white" />
                          </div>
                          <h3 className="font-medium mb-2">{nft.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{nft.description}</p>
                          <div className="text-xs text-muted-foreground">
                            Token ID: {nft.tokenId}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={userProfile.name} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={userProfile.email} />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" defaultValue={userProfile.bio} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue={userProfile.location} />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" defaultValue={userProfile.website} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" defaultValue={userProfile.github} />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" defaultValue={userProfile.twitter} />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" defaultValue={userProfile.linkedin} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}