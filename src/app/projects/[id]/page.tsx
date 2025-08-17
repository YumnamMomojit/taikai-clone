"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Star, 
  Trophy, 
  Users, 
  Calendar, 
  Github, 
  ExternalLink, 
  Video,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Flag,
  Award
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ProjectShowcasePage() {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(156)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        avatar: "/api/placeholder/40/40",
        role: "UI/UX Designer"
      },
      content: "This is an incredible project! The user interface is so intuitive and the functionality is impressive. Great work!",
      timestamp: "2 hours ago",
      likes: 24,
      replies: [
        {
          id: "1-1",
          author: {
            name: "Mike Johnson",
            avatar: "/api/placeholder/40/40",
            role: "Developer"
          },
          content: "I agree! The attention to detail is amazing.",
          timestamp: "1 hour ago",
          likes: 8
        }
      ]
    },
    {
      id: "2",
      author: {
        name: "Alex Rodriguez",
        avatar: "/api/placeholder/40/40",
        role: "Product Manager"
      },
      content: "Love the innovative approach to solving this problem. The technical implementation is solid and the user experience is top-notch.",
      timestamp: "5 hours ago",
      likes: 18,
      replies: []
    },
    {
      id: "3",
      author: {
        name: "Emily Watson",
        avatar: "/api/placeholder/40/40",
        role: "Data Scientist"
      },
      content: "The data visualization components are particularly impressive. How did you manage to achieve such smooth performance?",
      timestamp: "1 day ago",
      likes: 12,
      replies: []
    }
  ])

  // Mock data for the project
  const project = {
    id: "1",
    title: "AI-Powered Health Monitoring System",
    description: "A comprehensive health monitoring platform that uses artificial intelligence to predict potential health issues before they become serious. The system integrates with wearable devices and provides real-time insights to users and healthcare providers.",
    longDescription: "This project represents a significant advancement in preventive healthcare technology. By leveraging machine learning algorithms and real-time data from wearable devices, our system can detect patterns and anomalies that may indicate developing health conditions. The platform features a user-friendly mobile app, a healthcare provider dashboard, and an API for integration with existing medical systems.",
    imageUrl: "/api/placeholder/800/400",
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/health-monitor",
    videoUrl: "https://youtube.com/watch?v=example",
    status: "WINNER",
    likes: 156,
    views: 2340,
    comments: 23,
    tags: ["AI/ML", "HealthTech", "Mobile", "IoT", "Data Science"],
    technologies: ["React Native", "Python", "TensorFlow", "MongoDB", "AWS", "Docker"],
    createdAt: "2024-03-15",
    updatedAt: "2024-03-20",
    hackathon: {
      id: "1",
      title: "HealthTech Innovation Challenge",
      prize: "1st Place - $20,000"
    },
    team: {
      name: "Health Innovators",
      members: [
        {
          name: "John Smith",
          role: "Team Lead",
          avatar: "/api/placeholder/60/60",
          skills: ["AI/ML", "Backend"]
        },
        {
          name: "Sarah Chen",
          role: "UI/UX Designer",
          avatar: "/api/placeholder/60/60",
          skills: ["Design", "Frontend"]
        },
        {
          name: "Mike Johnson",
          role: "Developer",
          avatar: "/api/placeholder/60/60",
          skills: ["Mobile", "Frontend"]
        },
        {
          name: "Emily Watson",
          role: "Data Scientist",
          avatar: "/api/placeholder/60/60",
          skills: ["Data Science", "AI/ML"]
        }
      ]
    },
    achievements: [
      { title: "1st Place", description: "HealthTech Innovation Challenge", icon: Trophy },
      { title: "Best UI/UX", description: "Outstanding user interface design", icon: Star },
      { title: "Most Innovative", description: "Creative use of AI technology", icon: Award }
    ],
    relatedProjects: [
      {
        id: "2",
        title: "Mental Health Tracker",
        description: "AI-powered mental health monitoring and support system",
        imageUrl: "/api/placeholder/300/200",
        likes: 89
      },
      {
        id: "3",
        title: "Fitness AI Coach",
        description: "Personalized fitness training using artificial intelligence",
        imageUrl: "/api/placeholder/300/200",
        likes: 124
      },
      {
        id: "4",
        title: "Smart Medication Reminder",
        description: "Intelligent medication management system",
        imageUrl: "/api/placeholder/300/200",
        likes: 67
      }
    ]
  }

  const handleLike = () => {
    if (liked) {
      setLiked(false)
      setLikeCount(likeCount - 1)
    } else {
      setLiked(true)
      setLikeCount(likeCount + 1)
    }
  }

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: {
          name: "Current User",
          avatar: "/api/placeholder/40/40",
          role: "Developer"
        },
        content: newComment,
        timestamp: "Just now",
        likes: 0,
        replies: []
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "WINNER": return "default"
      case "SUBMITTED": return "secondary"
      case "APPROVED": return "outline"
      default: return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5">
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="text-white max-w-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{project.status}</Badge>
                    <Badge variant="outline" className="text-white border-white">
                      {project.hackathon.prize}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-3">{project.title}</h1>
                  <p className="text-lg md:text-xl opacity-90">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-white border-white hover:bg-white hover:text-black"
                    onClick={handleLike}
                  >
                    <Heart className={`mr-2 h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                    {likeCount}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span>{likeCount} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span>{project.comments} comments</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{project.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Submitted {project.createdAt}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="demo">Demo</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">Project Overview</h3>
                      <p className="text-muted-foreground leading-relaxed">{project.longDescription}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold mb-3">Project Links</h4>
                      <div className="space-y-2">
                        {project.demoUrl && (
                          <Button variant="outline" className="w-full justify-start">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button variant="outline" className="w-full justify-start">
                            <Github className="mr-2 h-4 w-4" />
                            View Source Code
                          </Button>
                        )}
                        {project.videoUrl && (
                          <Button variant="outline" className="w-full justify-start">
                            <Video className="mr-2 h-4 w-4" />
                            Watch Video
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold mb-3">Achievements</h4>
                      <div className="grid gap-3">
                        {project.achievements.map((achievement, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <achievement.icon className="h-8 w-8 text-primary" />
                                <div>
                                  <div className="font-semibold">{achievement.title}</div>
                                  <div className="text-sm text-muted-foreground">{achievement.description}</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="demo" className="mt-6">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4">Project Demo</h3>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Demo video will be displayed here</p>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <Button size="lg" className="w-full">
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Try Live Demo
                      </Button>
                      <Button variant="outline" size="lg" className="w-full">
                        <Github className="mr-2 h-5 w-5" />
                        View on GitHub
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="mt-6">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4">Team {project.team.name}</h3>
                    <div className="grid gap-6">
                      {project.team.members.map((member, index) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold">{member.name}</h4>
                                <p className="text-muted-foreground">{member.role}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {member.skills.map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold">Comments ({comments.length})</h3>
                      <Button variant="outline">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Sort by
                      </Button>
                    </div>

                    {/* Add Comment */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src="/api/placeholder/40/40" alt="Current User" />
                            <AvatarFallback>CU</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Share your thoughts about this project..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="mb-3"
                            />
                            <div className="flex justify-end">
                              <Button onClick={handleCommentSubmit}>
                                Post Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <Card key={comment.id}>
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              <Avatar>
                                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                <AvatarFallback>{comment.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <span className="font-semibold">{comment.author.name}</span>
                                    <span className="text-sm text-muted-foreground ml-2">• {comment.author.role}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem>
                                          <Flag className="mr-2 h-4 w-4" />
                                          Report
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                <p className="text-muted-foreground mb-3">{comment.content}</p>
                                <div className="flex items-center gap-4">
                                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <ThumbsUp className="mr-1 h-4 w-4" />
                                    {comment.likes}
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <Reply className="mr-1 h-4 w-4" />
                                    Reply
                                  </Button>
                                </div>
                                
                                {/* Replies */}
                                {comment.replies.length > 0 && (
                                  <div className="mt-4 ml-6 space-y-3">
                                    {comment.replies.map((reply) => (
                                      <div key={reply.id} className="flex gap-3">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                                          <AvatarFallback className="text-xs">{reply.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">{reply.author.name}</span>
                                            <span className="text-xs text-muted-foreground">• {reply.timestamp}</span>
                                          </div>
                                          <p className="text-sm text-muted-foreground">{reply.content}</p>
                                          <Button variant="ghost" size="sm" className="text-muted-foreground p-0 h-auto text-xs">
                                            <ThumbsUp className="mr-1 h-3 w-3" />
                                            {reply.likes}
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Hackathon</div>
                    <div className="font-medium">{project.hackathon.title}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Submitted</div>
                    <div className="font-medium">{project.createdAt}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Team</div>
                    <div className="font-medium">{project.team.name}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Projects Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.relatedProjects.map((relatedProject, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-20 h-16 bg-muted rounded flex-shrink-0">
                        <img 
                          src={relatedProject.imageUrl} 
                          alt={relatedProject.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{relatedProject.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{relatedProject.description}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Heart className="h-3 w-3 text-primary" />
                          <span className="text-xs">{relatedProject.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={handleLike}>
                    <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                    {liked ? 'Liked' : 'Like Project'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Project
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Flag className="mr-2 h-4 w-4" />
                    Report Project
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}