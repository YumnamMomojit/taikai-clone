"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Trophy, 
  Target, 
  Users, 
  Bell, 
  Settings, 
  Plus,
  Clock,
  TrendingUp,
  DollarSign,
  Gift,
  Star,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MessageCircle
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for dashboard
  const dashboardData = {
    stats: {
      totalHackathons: 12,
      activeProjects: 3,
      achievements: 15,
      totalPrizeMoney: 25000,
      upcomingDeadlines: 2,
      notifications: 5
    },
    upcomingHackathons: [
      {
        id: "1",
        title: "FinTech Revolution Hackathon",
        date: "2024-04-15",
        daysLeft: 12,
        status: "REGISTERED",
        prizePool: "$100,000",
        imageUrl: "/api/placeholder/200/100"
      },
      {
        id: "2",
        title: "EdTech Innovation Challenge",
        date: "2024-05-01",
        daysLeft: 28,
        status: "INTERESTED",
        prizePool: "$45,000",
        imageUrl: "/api/placeholder/200/100"
      }
    ],
    activeProjects: [
      {
        id: "1",
        title: "AI-Powered Health Monitoring",
        hackathon: "HealthTech Innovation Challenge",
        progress: 85,
        deadline: "2024-03-29",
        status: "IN_PROGRESS",
        lastUpdated: "2 hours ago"
      },
      {
        id: "2",
        title: "Smart City Traffic Optimizer",
        hackathon: "Sustainability Tech Challenge",
        progress: 60,
        deadline: "2024-04-15",
        status: "IN_PROGRESS",
        lastUpdated: "1 day ago"
      },
      {
        id: "3",
        title: "Blockchain Voting System",
        hackathon: "Web3 Governance Hackathon",
        progress: 45,
        deadline: "2024-04-20",
        status: "IN_PROGRESS",
        lastUpdated: "3 days ago"
      }
    ],
    recentAchievements: [
      {
        id: "1",
        title: "Hackathon Champion",
        description: "Won 1st place in HealthTech Challenge",
        date: "2024-03-30",
        icon: Trophy,
        rarity: "legendary"
      },
      {
        id: "2",
        title: "Team Player",
        description: "Completed 10+ team projects",
        date: "2024-03-25",
        icon: Users,
        rarity: "rare"
      },
      {
        id: "3",
        title: "Quick Starter",
        description: "Registered for 5 hackathons in a month",
        date: "2024-03-20",
        icon: Clock,
        rarity: "common"
      }
    ],
    notifications: [
      {
        id: "1",
        type: "deadline",
        title: "Project Submission Due",
        message: "Your AI Health Monitoring project is due in 2 days",
        time: "2 hours ago",
        read: false,
        action: "/projects/1"
      },
      {
        id: "2",
        type: "achievement",
        title: "New Achievement Unlocked",
        message: "You've earned the 'Hackathon Champion' badge!",
        time: "1 day ago",
        read: false,
        action: "/profile"
      },
      {
        id: "3",
        type: "hackathon",
        title: "New Hackathon Available",
        message: "FinTech Revolution Hackathon is now open for registration",
        time: "2 days ago",
        read: true,
        action: "/hackathons/1"
      },
      {
        id: "4",
        type: "team",
        title: "Team Invitation",
        message: "Sarah invited you to join 'Innovators' team",
        time: "3 days ago",
        read: true,
        action: "/teams/1"
      },
      {
        id: "5",
        type: "prize",
        title: "Prize Money Received",
        message: "$20,000 has been credited to your account",
        time: "1 week ago",
        read: true,
        action: "/profile"
      }
    ],
    upcomingDeadlines: [
      {
        id: "1",
        title: "HealthTech Project Submission",
        date: "2024-03-29",
        timeLeft: "2 days",
        priority: "high"
      },
      {
        id: "2",
        title: "Team Formation Deadline",
        date: "2024-04-05",
        timeLeft: "8 days",
        priority: "medium"
      }
    ]
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "REGISTERED": return "default"
      case "INTERESTED": return "secondary"
      case "IN_PROGRESS": return "default"
      case "COMPLETED": return "outline"
      default: return "outline"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "outline"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-muted-foreground">Here's what's happening with your hackathon journey</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{dashboardData.stats.totalHackathons}</div>
              <div className="text-sm text-muted-foreground">Hackathons</div>
            </div>
            <div className="text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{dashboardData.stats.activeProjects}</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{dashboardData.stats.achievementsEarned}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">${dashboardData.stats.totalPrizeMoney.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Prize Money</div>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{dashboardData.stats.upcomingDeadlines}</div>
              <div className="text-sm text-muted-foreground">Deadlines</div>
            </div>
            <div className="text-center">
              <Bell className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{dashboardData.stats.notifications}</div>
              <div className="text-sm text-muted-foreground">Notifications</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Upcoming Hackathons */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Hackathons</CardTitle>
                      <CardDescription>
                        Hackathons you're registered for or interested in
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {dashboardData.upcomingHackathons.map((hackathon) => (
                        <div key={hackathon.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0">
                            <img 
                              src={hackathon.imageUrl} 
                              alt={hackathon.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{hackathon.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{formatDate(hackathon.date)}</span>
                              <span>{hackathon.prizePool}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusColor(hackathon.status)}>
                              {hackathon.status}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {hackathon.daysLeft} days left
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="text-center pt-4">
                        <Link href="/hackathons">
                          <Button variant="outline">
                            Explore More Hackathons
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Deadlines */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Upcoming Deadlines
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {dashboardData.upcomingDeadlines.map((deadline) => (
                        <div key={deadline.id} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(deadline.priority) === 'destructive' ? 'bg-red-500' : getPriorityColor(deadline.priority) === 'default' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{deadline.title}</div>
                            <div className="text-xs text-muted-foreground">{deadline.timeLeft}</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Project
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Join a Team
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Gift className="mr-2 h-4 w-4" />
                        View Rewards
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Active Projects ({dashboardData.activeProjects.length})</h2>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </div>
                
                <div className="grid gap-6">
                  {dashboardData.activeProjects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{project.title}</h3>
                              <Badge variant="outline">{project.status}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{project.hackathon}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                          </div>
                          <div className="md:w-48 space-y-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Deadline: </span>
                              <span className="font-medium">{formatDate(project.deadline)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Last updated: </span>
                              <span className="font-medium">{project.lastUpdated}</span>
                            </div>
                            <Button className="w-full" size="sm">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Project
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Recent Achievements</h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.recentAchievements.map((achievement) => (
                    <Card key={achievement.id} className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <achievement.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(achievement.date)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Link href="/profile">
                    <Button variant="outline">
                      View All Achievements
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Notifications ({dashboardData.notifications.length})</h2>
                  <Button variant="outline" size="sm">
                    Mark all as read
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.notifications.map((notification) => (
                    <Card key={notification.id} className={!notification.read ? "border-primary" : ""}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              {notification.type === "deadline" && <Clock className="h-5 w-5 text-primary" />}
                              {notification.type === "achievement" && <Trophy className="h-5 w-5 text-primary" />}
                              {notification.type === "hackathon" && <Calendar className="h-5 w-5 text-primary" />}
                              {notification.type === "team" && <Users className="h-5 w-5 text-primary" />}
                              {notification.type === "prize" && <Gift className="h-5 w-5 text-primary" />}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <span className="text-sm text-muted-foreground">{notification.time}</span>
                            </div>
                            <p className="text-muted-foreground mb-3">{notification.message}</p>
                            <Link href={notification.action}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}