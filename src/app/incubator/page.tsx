"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  Rocket, 
  Users, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Eye, 
  Edit, 
  Filter,
  Search,
  BarChart3,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Lightbulb,
  Target,
  Zap,
  Star,
  Globe,
  Github,
  ExternalLink
} from "lucide-react"

interface IncubatorProject {
  id: string
  title: string
  description: string
  status: "application" | "accepted" | "in-progress" | "graduated" | "rejected"
  category: string
  team: {
    name: string
    members: number
    leader: string
    avatar?: string
  }
  progress: number
  funding?: number
  milestones: {
    completed: number
    total: number
  }
  startDate: string
  expectedGraduation: string
  mentor?: string
  technologies: string[]
  achievements: string[]
  githubUrl?: string
  demoUrl?: string
  website?: string
}

interface Mentor {
  id: string
  name: string
  role: string
  company: string
  expertise: string[]
  avatar?: string
  available: boolean
  projects: number
}

interface Resource {
  id: string
  title: string
  type: "article" | "video" | "tool" | "template"
  category: string
  description: string
  url?: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

export default function IncubatorPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)

  const [projects, setProjects] = useState<IncubatorProject[]>([
    {
      id: "1",
      title: "DeFi Lending Protocol",
      description: "A decentralized lending protocol with innovative risk management features",
      status: "in-progress",
      category: "DeFi",
      team: {
        name: "Crypto Builders",
        members: 4,
        leader: "John Doe",
        avatar: "/api/placeholder/40/40"
      },
      progress: 65,
      funding: 50000,
      milestones: {
        completed: 3,
        total: 5
      },
      startDate: "2024-01-15",
      expectedGraduation: "2024-06-15",
      mentor: "Dr. Sarah Chen",
      technologies: ["Solidity", "React", "Node.js", "IPFS"],
      achievements: ["Smart Contract Audit Passed", "Beta Version Released", "First 100 Users"],
      githubUrl: "https://github.com/cryptobuilders/defi-lending",
      demoUrl: "https://defi-lending-demo.com",
      website: "https://defi-lending.com"
    },
    {
      id: "2",
      title: "NFT Marketplace",
      description: "Next-generation NFT marketplace with gasless transactions and royalties",
      status: "accepted",
      category: "NFT",
      team: {
        name: "Digital Artists",
        members: 3,
        leader: "Jane Smith",
        avatar: "/api/placeholder/40/40"
      },
      progress: 25,
      funding: 30000,
      milestones: {
        completed: 1,
        total: 6
      },
      startDate: "2024-02-01",
      expectedGraduation: "2024-07-01",
      mentor: "Mike Johnson",
      technologies: ["React", "Solidity", "IPFS", "The Graph"],
      achievements: ["Team Formation Complete"],
      githubUrl: "https://github.com/digitalartists/nft-marketplace"
    },
    {
      id: "3",
      title: "Web3 Gaming Platform",
      description: "Cross-chain gaming platform with NFT integration and play-to-earn mechanics",
      status: "graduated",
      category: "Gaming",
      team: {
        name: "Game Changers",
        members: 5,
        leader: "Alice Brown",
        avatar: "/api/placeholder/40/40"
      },
      progress: 100,
      funding: 75000,
      milestones: {
        completed: 8,
        total: 8
      },
      startDate: "2023-09-01",
      expectedGraduation: "2024-01-01",
      mentor: "Dr. Emily Davis",
      technologies: ["Unity", "Solidity", "React", "Polygon"],
      achievements: ["Mainnet Launch", "10,000+ Users", "Partnership with Game Studio", "Seed Round Raised"],
      githubUrl: "https://github.com/gamechangers/web3-gaming",
      demoUrl: "https://web3gaming.com",
      website: "https://web3gaming.com"
    }
  ])

  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: "1",
      name: "Dr. Sarah Chen",
      role: "Blockchain Architect",
      company: "Crypto Ventures",
      expertise: ["DeFi", "Smart Contracts", "Security"],
      available: true,
      projects: 3
    },
    {
      id: "2",
      name: "Mike Johnson",
      role: "Product Manager",
      company: "NFT Labs",
      expertise: ["NFT", "Product Strategy", "UX/UI"],
      available: true,
      projects: 2
    },
    {
      id: "3",
      name: "Dr. Emily Davis",
      role: "Technical Lead",
      company: "GameFi Studios",
      expertise: ["Gaming", "Smart Contracts", "Unity"],
      available: false,
      projects: 5
    }
  ])

  const [resources, setResources] = useState<Resource[]>([
    {
      id: "1",
      title: "Smart Contract Security Best Practices",
      type: "article",
      category: "Security",
      description: "Comprehensive guide to securing your smart contracts",
      url: "https://example.com/security-guide",
      difficulty: "intermediate"
    },
    {
      id: "2",
      title: "DeFi Protocol Development",
      type: "video",
      category: "DeFi",
      description: "Step-by-step tutorial on building DeFi protocols",
      url: "https://example.com/defi-tutorial",
      difficulty: "advanced"
    },
    {
      id: "3",
      title: "NFT Marketplace Template",
      type: "template",
      category: "NFT",
      description: "Ready-to-use NFT marketplace smart contract template",
      url: "https://github.com/example/nft-template",
      difficulty: "beginner"
    }
  ])

  const [applicationData, setApplicationData] = useState({
    projectName: "",
    projectDescription: "",
    teamSize: "",
    teamExperience: "",
    projectStage: "",
    fundingNeeded: "",
    timeline: "",
    mentorshipAreas: "",
    additionalInfo: ""
  })

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === "in-progress").length,
    graduatedProjects: projects.filter(p => p.status === "graduated").length,
    totalFunding: projects.reduce((sum, p) => sum + (p.funding || 0), 0),
    availableMentors: mentors.filter(m => m.available).length
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.team.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress": return "bg-blue-500"
      case "accepted": return "bg-green-500"
      case "graduated": return "bg-purple-500"
      case "application": return "bg-yellow-500"
      case "rejected": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-progress": return <Clock className="w-4 h-4" />
      case "accepted": return <CheckCircle className="w-4 h-4" />
      case "graduated": return <Award className="w-4 h-4" />
      case "application": return <AlertCircle className="w-4 h-4" />
      case "rejected": return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleApply = () => {
    if (!applicationData.projectName || !applicationData.projectDescription) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    const newProject: IncubatorProject = {
      id: Date.now().toString(),
      title: applicationData.projectName,
      description: applicationData.projectDescription,
      status: "application",
      category: "Other",
      team: {
        name: "Your Team",
        members: parseInt(applicationData.teamSize) || 1,
        leader: "You"
      },
      progress: 0,
      funding: parseInt(applicationData.fundingNeeded) || 0,
      milestones: {
        completed: 0,
        total: 5
      },
      startDate: new Date().toISOString().split('T')[0],
      expectedGraduation: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      technologies: [],
      achievements: []
    }

    setProjects([...projects, newProject])
    setIsApplyDialogOpen(false)
    setApplicationData({
      projectName: "",
      projectDescription: "",
      teamSize: "",
      teamExperience: "",
      projectStage: "",
      fundingNeeded: "",
      timeline: "",
      mentorshipAreas: "",
      additionalInfo: ""
    })

    toast({
      title: "Application Submitted!",
      description: "Your incubator application has been submitted successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hackathon Incubator</h1>
          <p className="text-muted-foreground">
            Transform your hackathon project into a successful startup with our incubation program.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Rocket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Graduated</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.graduatedProjects}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalFunding.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Mentors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableMentors}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Program Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Program Benefits</CardTitle>
                  <CardDescription>What we offer to incubator participants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Funding Support</h4>
                        <p className="text-sm text-muted-foreground">Access to seed funding and investment opportunities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Expert Mentorship</h4>
                        <p className="text-sm text-muted-foreground">Guidance from industry experts and successful founders</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Workspace & Resources</h4>
                        <p className="text-sm text-muted-foreground">Co-working space and development resources</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-orange-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Network Access</h4>
                        <p className="text-sm text-muted-foreground">Connections to investors, partners, and potential customers</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Process */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Process</CardTitle>
                  <CardDescription>How to join our incubator program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Submit Application</h4>
                        <p className="text-sm text-muted-foreground">Fill out the application form with project details</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Review Process</h4>
                        <p className="text-sm text-muted-foreground">Our team evaluates your project and potential</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Interview</h4>
                        <p className="text-sm text-muted-foreground">Meet with our selection committee</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Onboarding</h4>
                        <p className="text-sm text-muted-foreground">Join the incubator and start your journey</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Success Stories */}
            <Card>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>Projects that graduated from our incubator</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projects.filter(p => p.status === "graduated").slice(0, 3).map((project) => (
                    <Card key={project.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                          <Badge variant="secondary" className="capitalize">
                            {project.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.team.name}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Funding Raised:</span>
                            <span className="font-medium">${project.funding?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Team Size:</span>
                            <span>{project.team.members} members</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {project.achievements.slice(0, 2).map((achievement, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-4">
                            {project.website && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.website} target="_blank" rel="noopener noreferrer">
                                  <Globe className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Apply Button */}
            <div className="text-center">
              <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Rocket className="w-5 h-5 mr-2" />
                    Apply to Incubator
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Apply to Incubator Program</DialogTitle>
                    <DialogDescription>
                      Tell us about your project and why you'd like to join our incubator program.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="projectName">Project Name *</Label>
                        <Input
                          id="projectName"
                          value={applicationData.projectName}
                          onChange={(e) => setApplicationData({...applicationData, projectName: e.target.value})}
                          placeholder="Your project name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="teamSize">Team Size</Label>
                        <Input
                          id="teamSize"
                          type="number"
                          value={applicationData.teamSize}
                          onChange={(e) => setApplicationData({...applicationData, teamSize: e.target.value})}
                          placeholder="Number of team members"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="projectDescription">Project Description *</Label>
                      <Textarea
                        id="projectDescription"
                        value={applicationData.projectDescription}
                        onChange={(e) => setApplicationData({...applicationData, projectDescription: e.target.value})}
                        placeholder="Describe your project in detail..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="projectStage">Project Stage</Label>
                        <Select value={applicationData.projectStage} onValueChange={(value) => setApplicationData({...applicationData, projectStage: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="idea">Idea Stage</SelectItem>
                            <SelectItem value="prototype">Prototype</SelectItem>
                            <SelectItem value="mvp">MVP</SelectItem>
                            <SelectItem value="launched">Launched</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="fundingNeeded">Funding Needed ($)</Label>
                        <Input
                          id="fundingNeeded"
                          type="number"
                          value={applicationData.fundingNeeded}
                          onChange={(e) => setApplicationData({...applicationData, fundingNeeded: e.target.value})}
                          placeholder="50000"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="teamExperience">Team Experience</Label>
                      <Textarea
                        id="teamExperience"
                        value={applicationData.teamExperience}
                        onChange={(e) => setApplicationData({...applicationData, teamExperience: e.target.value})}
                        placeholder="Describe your team's experience and background..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="timeline">Project Timeline</Label>
                      <Textarea
                        id="timeline"
                        value={applicationData.timeline}
                        onChange={(e) => setApplicationData({...applicationData, timeline: e.target.value})}
                        placeholder="Describe your project timeline and milestones..."
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="mentorshipAreas">Mentorship Areas</Label>
                      <Textarea
                        id="mentorshipAreas"
                        value={applicationData.mentorshipAreas}
                        onChange={(e) => setApplicationData({...applicationData, mentorshipAreas: e.target.value})}
                        placeholder="What areas would you like mentorship in?..."
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        value={applicationData.additionalInfo}
                        onChange={(e) => setApplicationData({...applicationData, additionalInfo: e.target.value})}
                        placeholder="Any additional information you'd like to share..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleApply}>
                        Submit Application
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Incubator Projects</CardTitle>
                    <CardDescription>Track progress of projects in the incubator</CardDescription>
                  </div>
                  <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Rocket className="w-4 h-4 mr-2" />
                        Apply to Incubator
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Apply to Incubator Program</DialogTitle>
                        <DialogDescription>
                          Tell us about your project and why you'd like to join our incubator program.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="projectName">Project Name *</Label>
                            <Input
                              id="projectName"
                              value={applicationData.projectName}
                              onChange={(e) => setApplicationData({...applicationData, projectName: e.target.value})}
                              placeholder="Your project name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="teamSize">Team Size</Label>
                            <Input
                              id="teamSize"
                              type="number"
                              value={applicationData.teamSize}
                              onChange={(e) => setApplicationData({...applicationData, teamSize: e.target.value})}
                              placeholder="Number of team members"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="projectDescription">Project Description *</Label>
                          <Textarea
                            id="projectDescription"
                            value={applicationData.projectDescription}
                            onChange={(e) => setApplicationData({...applicationData, projectDescription: e.target.value})}
                            placeholder="Describe your project in detail..."
                            rows={4}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="projectStage">Project Stage</Label>
                            <Select value={applicationData.projectStage} onValueChange={(value) => setApplicationData({...applicationData, projectStage: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select stage" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="idea">Idea Stage</SelectItem>
                                <SelectItem value="prototype">Prototype</SelectItem>
                                <SelectItem value="mvp">MVP</SelectItem>
                                <SelectItem value="launched">Launched</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="fundingNeeded">Funding Needed ($)</Label>
                            <Input
                              id="fundingNeeded"
                              type="number"
                              value={applicationData.fundingNeeded}
                              onChange={(e) => setApplicationData({...applicationData, fundingNeeded: e.target.value})}
                              placeholder="50000"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="teamExperience">Team Experience</Label>
                          <Textarea
                            id="teamExperience"
                            value={applicationData.teamExperience}
                            onChange={(e) => setApplicationData({...applicationData, teamExperience: e.target.value})}
                            placeholder="Describe your team's experience and background..."
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="timeline">Project Timeline</Label>
                          <Textarea
                            id="timeline"
                            value={applicationData.timeline}
                            onChange={(e) => setApplicationData({...applicationData, timeline: e.target.value})}
                            placeholder="Describe your project timeline and milestones..."
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="mentorshipAreas">Mentorship Areas</Label>
                          <Textarea
                            id="mentorshipAreas"
                            value={applicationData.mentorshipAreas}
                            onChange={(e) => setApplicationData({...applicationData, mentorshipAreas: e.target.value})}
                            placeholder="What areas would you like mentorship in?..."
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="additionalInfo">Additional Information</Label>
                          <Textarea
                            id="additionalInfo"
                            value={applicationData.additionalInfo}
                            onChange={(e) => setApplicationData({...applicationData, additionalInfo: e.target.value})}
                            placeholder="Any additional information you'd like to share..."
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleApply}>
                            Submit Application
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="application">Application</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="DeFi">DeFi</SelectItem>
                      <SelectItem value="NFT">NFT</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="DAO">DAO</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                            <Badge variant="secondary" className="capitalize">
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback>{project.team.leader.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{project.team.name}</p>
                              <p className="text-xs text-muted-foreground">{project.team.leader} • {project.team.members} members</p>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Milestones:</span>
                            <span>{project.milestones.completed}/{project.milestones.total}</span>
                          </div>
                          
                          {project.funding && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Funding:</span>
                              <span className="font-medium">${project.funding.toLocaleString()}</span>
                            </div>
                          )}
                          
                          {project.mentor && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Mentor:</span>
                              <span>{project.mentor}</span>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            {project.githubUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                            {project.demoUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                            {project.website && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.website} target="_blank" rel="noopener noreferrer">
                                  <Globe className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Mentors</CardTitle>
                <CardDescription>Connect with experienced professionals who can guide your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((mentor) => (
                    <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{mentor.name}</CardTitle>
                            <CardDescription>{mentor.role} at {mentor.company}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${mentor.available ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-sm text-muted-foreground">
                            {mentor.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm mb-2">Expertise</h4>
                            <div className="flex flex-wrap gap-1">
                              {mentor.expertise.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Active Projects:</span>
                            <span>{mentor.projects}</span>
                          </div>
                          
                          <Button 
                            className="w-full" 
                            disabled={!mentor.available}
                            variant={mentor.available ? "default" : "outline"}
                          >
                            {mentor.available ? 'Request Mentorship' : 'Unavailable'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
                <CardDescription>Curated resources to help you build your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource) => (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                            <CardDescription>{resource.category}</CardDescription>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {resource.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                          
                          <div className="flex justify-between items-center">
                            <Badge variant="secondary" className="capitalize">
                              {resource.difficulty}
                            </Badge>
                            {resource.url && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}