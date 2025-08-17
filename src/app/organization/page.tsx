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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  Users, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2, 
  Filter,
  Search,
  BarChart3,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

interface Hackathon {
  id: string
  title: string
  description: string
  status: "draft" | "published" | "ongoing" | "completed" | "cancelled"
  startDate: string
  endDate: string
  participants: number
  projects: number
  prizePool: number
  category: string
  organizer: string
  image?: string
}

interface Submission {
  id: string
  projectTitle: string
  teamName: string
  status: "pending" | "reviewed" | "rejected" | "selected"
  submittedAt: string
  score?: number
  reviewer?: string
}

export default function OrganizationDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null)

  const [hackathons, setHackathons] = useState<Hackathon[]>([
    {
      id: "1",
      title: "DeFi Hackathon 2024",
      description: "Build the future of decentralized finance",
      status: "ongoing",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      participants: 234,
      projects: 89,
      prizePool: 50000,
      category: "DeFi",
      organizer: "DeFi Alliance"
    },
    {
      id: "2",
      title: "NFT Innovation Challenge",
      description: "Create innovative NFT solutions",
      status: "published",
      startDate: "2024-02-01",
      endDate: "2024-03-01",
      participants: 156,
      projects: 45,
      prizePool: 30000,
      category: "NFT",
      organizer: "NFT Foundation"
    },
    {
      id: "3",
      title: "Web3 Gaming Jam",
      description: "Build the next generation of Web3 games",
      status: "completed",
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      participants: 189,
      projects: 67,
      prizePool: 25000,
      category: "Gaming",
      organizer: "GameFi Alliance"
    }
  ])

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      projectTitle: "DeFi Lending Protocol",
      teamName: "Crypto Builders",
      status: "pending",
      submittedAt: "2024-01-20",
      score: 85,
      reviewer: "John Doe"
    },
    {
      id: "2",
      projectTitle: "NFT Marketplace",
      teamName: "Digital Artists",
      status: "reviewed",
      submittedAt: "2024-01-19",
      score: 92,
      reviewer: "Jane Smith"
    },
    {
      id: "3",
      projectTitle: "Web3 Game Platform",
      teamName: "Game Changers",
      status: "selected",
      submittedAt: "2024-01-18",
      score: 88,
      reviewer: "Mike Johnson"
    }
  ])

  const [newHackathon, setNewHackathon] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    prizePool: "",
    category: "",
    maxParticipants: "",
    maxTeamSize: "",
    requirements: "",
    judgingCriteria: ""
  })

  const stats = {
    totalHackathons: hackathons.length,
    ongoingHackathons: hackathons.filter(h => h.status === "ongoing").length,
    totalParticipants: hackathons.reduce((sum, h) => sum + h.participants, 0),
    totalProjects: hackathons.reduce((sum, h) => sum + h.projects, 0),
    totalPrizePool: hackathons.reduce((sum, h) => sum + h.prizePool, 0)
  }

  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesSearch = hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hackathon.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || hackathon.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing": return "bg-green-500"
      case "published": return "bg-blue-500"
      case "completed": return "bg-purple-500"
      case "draft": return "bg-gray-500"
      case "cancelled": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500"
      case "reviewed": return "bg-blue-500"
      case "rejected": return "bg-red-500"
      case "selected": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ongoing": return <Clock className="w-4 h-4" />
      case "published": return <Eye className="w-4 h-4" />
      case "completed": return <CheckCircle className="w-4 h-4" />
      case "draft": return <AlertCircle className="w-4 h-4" />
      case "cancelled": return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleCreateHackathon = () => {
    if (!newHackathon.title || !newHackathon.description || !newHackathon.startDate || !newHackathon.endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    const hackathon: Hackathon = {
      id: Date.now().toString(),
      title: newHackathon.title,
      description: newHackathon.description,
      status: "draft",
      startDate: newHackathon.startDate,
      endDate: newHackathon.endDate,
      participants: 0,
      projects: 0,
      prizePool: parseInt(newHackathon.prizePool) || 0,
      category: newHackathon.category,
      organizer: "Your Organization"
    }

    setHackathons([...hackathons, hackathon])
    setIsCreateDialogOpen(false)
    setNewHackathon({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      prizePool: "",
      category: "",
      maxParticipants: "",
      maxTeamSize: "",
      requirements: "",
      judgingCriteria: ""
    })

    toast({
      title: "Success!",
      description: "Hackathon created successfully.",
    })
  }

  const updateHackathonStatus = (id: string, status: string) => {
    setHackathons(hackathons.map(h => 
      h.id === id ? { ...h, status: status as any } : h
    ))
    toast({
      title: "Status Updated",
      description: `Hackathon status changed to ${status}.`,
    })
  }

  const deleteHackathon = (id: string) => {
    setHackathons(hackathons.filter(h => h.id !== id))
    toast({
      title: "Deleted",
      description: "Hackathon deleted successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your hackathons, review submissions, and track performance metrics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hackathons</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHackathons}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ongoingHackathons}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalParticipants.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prize Pool</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalPrizePool.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Hackathons */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Hackathons</CardTitle>
                  <CardDescription>Your latest hackathon events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hackathons.slice(0, 5).map((hackathon) => (
                      <div key={hackathon.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(hackathon.status)}`} />
                          <div>
                            <h4 className="font-medium">{hackathon.title}</h4>
                            <p className="text-sm text-muted-foreground">{hackathon.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{hackathon.participants} participants</p>
                          <p className="text-xs text-muted-foreground">${hackathon.prizePool.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Submissions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>Latest project submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getSubmissionStatusColor(submission.status)}`} />
                          <div>
                            <h4 className="font-medium">{submission.projectTitle}</h4>
                            <p className="text-sm text-muted-foreground">{submission.teamName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium capitalize">{submission.status}</p>
                          {submission.score && (
                            <p className="text-xs text-muted-foreground">Score: {submission.score}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you can perform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Hackathon
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Hackathon</DialogTitle>
                        <DialogDescription>
                          Fill in the details to create a new hackathon event.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                              id="title"
                              value={newHackathon.title}
                              onChange={(e) => setNewHackathon({...newHackathon, title: e.target.value})}
                              placeholder="Hackathon title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select value={newHackathon.category} onValueChange={(value) => setNewHackathon({...newHackathon, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="DeFi">DeFi</SelectItem>
                                <SelectItem value="NFT">NFT</SelectItem>
                                <SelectItem value="Gaming">Gaming</SelectItem>
                                <SelectItem value="DAO">DAO</SelectItem>
                                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={newHackathon.description}
                            onChange={(e) => setNewHackathon({...newHackathon, description: e.target.value})}
                            placeholder="Describe your hackathon"
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={newHackathon.startDate}
                              onChange={(e) => setNewHackathon({...newHackathon, startDate: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="endDate">End Date *</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={newHackathon.endDate}
                              onChange={(e) => setNewHackathon({...newHackathon, endDate: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="prizePool">Prize Pool ($)</Label>
                            <Input
                              id="prizePool"
                              type="number"
                              value={newHackathon.prizePool}
                              onChange={(e) => setNewHackathon({...newHackathon, prizePool: e.target.value})}
                              placeholder="50000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="maxParticipants">Max Participants</Label>
                            <Input
                              id="maxParticipants"
                              type="number"
                              value={newHackathon.maxParticipants}
                              onChange={(e) => setNewHackathon({...newHackathon, maxParticipants: e.target.value})}
                              placeholder="500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="maxTeamSize">Max Team Size</Label>
                            <Input
                              id="maxTeamSize"
                              type="number"
                              value={newHackathon.maxTeamSize}
                              onChange={(e) => setNewHackathon({...newHackathon, maxTeamSize: e.target.value})}
                              placeholder="4"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="requirements">Requirements</Label>
                          <Textarea
                            id="requirements"
                            value={newHackathon.requirements}
                            onChange={(e) => setNewHackathon({...newHackathon, requirements: e.target.value})}
                            placeholder="List the requirements for participants"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="judgingCriteria">Judging Criteria</Label>
                          <Textarea
                            id="judgingCriteria"
                            value={newHackathon.judgingCriteria}
                            onChange={(e) => setNewHackathon({...newHackathon, judgingCriteria: e.target.value})}
                            placeholder="Describe the judging criteria"
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateHackathon}>
                            Create Hackathon
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View All Submissions
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hackathons" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Hackathons</CardTitle>
                    <CardDescription>Create, edit, and manage your hackathon events</CardDescription>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Hackathon
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Hackathon</DialogTitle>
                        <DialogDescription>
                          Fill in the details to create a new hackathon event.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                              id="title"
                              value={newHackathon.title}
                              onChange={(e) => setNewHackathon({...newHackathon, title: e.target.value})}
                              placeholder="Hackathon title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select value={newHackathon.category} onValueChange={(value) => setNewHackathon({...newHackathon, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="DeFi">DeFi</SelectItem>
                                <SelectItem value="NFT">NFT</SelectItem>
                                <SelectItem value="Gaming">Gaming</SelectItem>
                                <SelectItem value="DAO">DAO</SelectItem>
                                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={newHackathon.description}
                            onChange={(e) => setNewHackathon({...newHackathon, description: e.target.value})}
                            placeholder="Describe your hackathon"
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={newHackathon.startDate}
                              onChange={(e) => setNewHackathon({...newHackathon, startDate: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="endDate">End Date *</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={newHackathon.endDate}
                              onChange={(e) => setNewHackathon({...newHackathon, endDate: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="prizePool">Prize Pool ($)</Label>
                            <Input
                              id="prizePool"
                              type="number"
                              value={newHackathon.prizePool}
                              onChange={(e) => setNewHackathon({...newHackathon, prizePool: e.target.value})}
                              placeholder="50000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="maxParticipants">Max Participants</Label>
                            <Input
                              id="maxParticipants"
                              type="number"
                              value={newHackathon.maxParticipants}
                              onChange={(e) => setNewHackathon({...newHackathon, maxParticipants: e.target.value})}
                              placeholder="500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="maxTeamSize">Max Team Size</Label>
                            <Input
                              id="maxTeamSize"
                              type="number"
                              value={newHackathon.maxTeamSize}
                              onChange={(e) => setNewHackathon({...newHackathon, maxTeamSize: e.target.value})}
                              placeholder="4"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="requirements">Requirements</Label>
                          <Textarea
                            id="requirements"
                            value={newHackathon.requirements}
                            onChange={(e) => setNewHackathon({...newHackathon, requirements: e.target.value})}
                            placeholder="List the requirements for participants"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="judgingCriteria">Judging Criteria</Label>
                          <Textarea
                            id="judgingCriteria"
                            value={newHackathon.judgingCriteria}
                            onChange={(e) => setNewHackathon({...newHackathon, judgingCriteria: e.target.value})}
                            placeholder="Describe the judging criteria"
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateHackathon}>
                            Create Hackathon
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
                        placeholder="Search hackathons..."
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHackathons.map((hackathon) => (
                    <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(hackathon.status)}`} />
                            <Badge variant="secondary" className="capitalize">
                              {hackathon.status}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteHackathon(hackathon.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                        <CardDescription>{hackathon.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span>{hackathon.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Participants:</span>
                            <span>{hackathon.participants}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Projects:</span>
                            <span>{hackathon.projects}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Prize Pool:</span>
                            <span className="font-medium">${hackathon.prizePool.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Dates:</span>
                            <span>{new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            {hackathon.status === "draft" && (
                              <Button size="sm" onClick={() => updateHackathonStatus(hackathon.id, "published")}>
                                Publish
                              </Button>
                            )}
                            {hackathon.status === "published" && (
                              <Button size="sm" onClick={() => updateHackathonStatus(hackathon.id, "ongoing")}>
                                Start
                              </Button>
                            )}
                            {hackathon.status === "ongoing" && (
                              <Button size="sm" onClick={() => updateHackathonStatus(hackathon.id, "completed")}>
                                Complete
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Submissions</CardTitle>
                <CardDescription>Review and manage project submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.projectTitle}</TableCell>
                        <TableCell>{submission.teamName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{submission.score || "-"}</TableCell>
                        <TableCell>{submission.reviewer || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Participation Trends</CardTitle>
                  <CardDescription>Monthly participation statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>January 2024</span>
                      <span className="font-medium">234 participants</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex justify-between">
                      <span>December 2023</span>
                      <span className="font-medium">189 participants</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <div className="flex justify-between">
                      <span>November 2023</span>
                      <span className="font-medium">156 participants</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Projects by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>DeFi</span>
                      <span className="font-medium">89 projects</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    <div className="flex justify-between">
                      <span>NFT</span>
                      <span className="font-medium">45 projects</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    <div className="flex justify-between">
                      <span>Gaming</span>
                      <span className="font-medium">67 projects</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">4.2</div>
                    <div className="text-sm text-muted-foreground">Avg. Team Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">87%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">15%</div>
                    <div className="text-sm text-muted-foreground">Growth Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}