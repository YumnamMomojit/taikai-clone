"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Users, Trophy, Clock, Search, Filter, Grid, List, MapPin, DollarSign } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function HackathonsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [prizeRange, setPrizeRange] = useState([0, 100000])
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("date")
  const [filteredHackathons, setFilteredHackathons] = useState([])

  // Mock data for hackathons
  const allHackathons = [
    {
      id: "1",
      title: "AI Innovation Challenge",
      description: "Build the future of artificial intelligence with cutting-edge tools and frameworks. Join us for an exciting journey into the world of machine learning and neural networks.",
      imageUrl: "/api/placeholder/400/200",
      participantCount: 342,
      prizePool: 50000,
      daysLeft: 12,
      status: "REGISTRATION_OPEN",
      categories: ["AI/ML", "Web3", "Mobile"],
      location: "Virtual",
      startDate: "2024-03-15",
      endDate: "2024-03-30",
      organizer: "TechCorp Inc.",
      difficulty: "Intermediate"
    },
    {
      id: "2",
      title: "Web3 Gaming Hackathon",
      description: "Create the next generation of blockchain games and decentralized applications. Explore the intersection of gaming and cryptocurrency.",
      imageUrl: "/api/placeholder/400/200",
      participantCount: 256,
      prizePool: 75000,
      daysLeft: 8,
      status: "ONGOING",
      categories: ["Gaming", "Web3", "DeFi"],
      location: "San Francisco, CA",
      startDate: "2024-03-10",
      endDate: "2024-03-25",
      organizer: "Blockchain Labs",
      difficulty: "Advanced"
    },
    {
      id: "3",
      title: "Sustainability Tech Challenge",
      description: "Develop innovative solutions for environmental sustainability and climate action. Make a difference with technology.",
      imageUrl: "/api/placeholder/400/200",
      participantCount: 189,
      prizePool: 40000,
      daysLeft: 20,
      status: "PUBLISHED",
      categories: ["Sustainability", "IoT", "Data Science"],
      location: "Virtual",
      startDate: "2024-04-01",
      endDate: "2024-04-15",
      organizer: "GreenTech Foundation",
      difficulty: "Beginner"
    },
    {
      id: "4",
      title: "FinTech Revolution Hackathon",
      description: "Revolutionize the financial industry with innovative technology solutions. Build the future of banking and finance.",
      imageUrl: "/api/placeholder/400/200",
      participantCount: 421,
      prizePool: 100000,
      daysLeft: 5,
      status: "REGISTRATION_OPEN",
      categories: ["FinTech", "AI/ML", "Blockchain"],
      location: "New York, NY",
      startDate: "2024-03-20",
      endDate: "2024-04-05",
      organizer: "Finance Innovation Hub",
      difficulty: "Advanced"
    },
    {
      id: "5",
      title: "HealthTech Innovation Challenge",
      description: "Improve healthcare outcomes through technology. Build solutions that make a real difference in people's lives.",
      imageUrl: "/api/placeholder/400/200",
      participantCount: 167,
      prizePool: 35000,
      daysLeft: 15,
      status: "PUBLISHED",
      categories: ["HealthTech", "AI/ML", "IoT"],
      location: "Virtual",
      startDate: "2024-04-10",
      endDate: "2024-04-25",
      organizer: "MedTech Institute",
      difficulty: "Intermediate"
    },
    {
      id: "6",
      title: "EdTech Learning Hackathon",
      description: "Transform education through innovative technology solutions. Create tools that enhance learning experiences.",
      imageUrl: "/api/placeholder/400/200",
      participantCount: 234,
      prizePool: 45000,
      daysLeft: 25,
      status: "PUBLISHED",
      categories: ["EdTech", "AI/ML", "Mobile"],
      location: "Boston, MA",
      startDate: "2024-04-20",
      endDate: "2024-05-05",
      organizer: "Education Innovation Lab",
      difficulty: "Beginner"
    }
  ]

  const categories = ["AI/ML", "Web3", "Mobile", "Gaming", "DeFi", "Sustainability", "IoT", "Data Science", "FinTech", "Blockchain", "HealthTech", "EdTech"]
  const locations = ["Virtual", "San Francisco, CA", "New York, NY", "Boston, MA", "Austin, TX", "Seattle, WA"]
  const statuses = ["PUBLISHED", "REGISTRATION_OPEN", "ONGOING", "JUDGING", "COMPLETED"]

  useEffect(() => {
    let filtered = allHackathons

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(hackathon =>
        hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hackathon.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(hackathon => hackathon.status === selectedStatus)
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(hackathon => hackathon.categories.includes(selectedCategory))
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(hackathon => hackathon.location === selectedLocation)
    }

    // Prize range filter
    filtered = filtered.filter(hackathon => 
      hackathon.prizePool >= prizeRange[0] && hackathon.prizePool <= prizeRange[1]
    )

    // Sorting
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    } else if (sortBy === "prize") {
      filtered.sort((a, b) => b.prizePool - a.prizePool)
    } else if (sortBy === "participants") {
      filtered.sort((a, b) => b.participantCount - a.participantCount)
    }

    setFilteredHackathons(filtered)
  }, [searchQuery, selectedStatus, selectedCategory, selectedLocation, prizeRange, sortBy])

  const getStatusColor = (status) => {
    switch (status) {
      case "REGISTRATION_OPEN": return "default"
      case "ONGOING": return "secondary"
      case "PUBLISHED": return "outline"
      case "JUDGING": return "destructive"
      case "COMPLETED": return "default"
      default: return "outline"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "REGISTRATION_OPEN": return "Registration Open"
      case "ONGOING": return "Ongoing"
      case "PUBLISHED": return "Published"
      case "JUDGING": return "Judging"
      case "COMPLETED": return "Completed"
      default: return status
    }
  }

  const formatPrize = (prize) => {
    if (prize >= 1000) {
      return `$${(prize / 1000).toFixed(0)}K`
    }
    return `$${prize}`
  }

  const HackathonCard = ({ hackathon }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
        <img 
          src={hackathon.imageUrl} 
          alt={hackathon.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg line-clamp-1">{hackathon.title}</CardTitle>
          <Badge variant={getStatusColor(hackathon.status)}>
            {getStatusText(hackathon.status)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{hackathon.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {hackathon.categories.slice(0, 3).map((category, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
            {hackathon.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{hackathon.categories.length - 3}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {hackathon.participantCount}
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              {formatPrize(hackathon.prizePool)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {hackathon.daysLeft}d left
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {hackathon.location}
            </div>
          </div>
          <Button className="w-full" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const HackathonListItem = ({ hackathon }) => (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-48 md:h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={hackathon.imageUrl} 
              alt={hackathon.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{hackathon.title}</h3>
                <p className="text-muted-foreground line-clamp-2">{hackathon.description}</p>
              </div>
              <Badge variant={getStatusColor(hackathon.status)}>
                {getStatusText(hackathon.status)}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {hackathon.categories.map((category, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {hackathon.participantCount} participants
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                {formatPrize(hackathon.prizePool)} prize pool
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {hackathon.daysLeft} days left
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {hackathon.location}
              </div>
            </div>
          </div>
          <div className="md:w-32 flex-shrink-0">
            <Button className="w-full">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Discover Hackathons</h1>
            <p className="text-xl text-muted-foreground">
              Find exciting opportunities to showcase your skills and compete with innovators worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hackathons, categories, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filter Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="lg:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Filter Hackathons</DialogTitle>
                  <DialogDescription>
                    Customize your search with advanced filters.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Status Filter */}
                  <div>
                    <Label>Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {statuses.map(status => (
                          <SelectItem key={status} value={status}>
                            {getStatusText(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <Label>Location</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Prize Range Filter */}
                  <div>
                    <Label>Prize Pool Range: ${prizeRange[0].toLocaleString()} - ${prizeRange[1].toLocaleString()}</Label>
                    <Slider
                      value={prizeRange}
                      onValueChange={setPrizeRange}
                      max={100000}
                      min={0}
                      step={5000}
                      className="mt-2"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="prize">Prize Pool</SelectItem>
                <SelectItem value="participants">Participants</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList>
                <TabsTrigger value="grid" className="px-3">
                  <Grid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {filteredHackathons.length} Hackathon{filteredHackathons.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          {filteredHackathons.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No hackathons found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              {filteredHackathons.map((hackathon) => (
                viewMode === "grid" ? (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} />
                ) : (
                  <HackathonListItem key={hackathon.id} hackathon={hackathon} />
                )
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}