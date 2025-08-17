"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  CalendarDays, 
  Users, 
  Trophy, 
  Clock, 
  MapPin, 
  DollarSign, 
  Target, 
  BookOpen, 
  HelpCircle,
  Share2,
  Heart,
  User,
  Building,
  Award,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HackathonDetailPage() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false)

  // Mock data for the hackathon
  const hackathon = {
    id: "1",
    title: "AI Innovation Challenge 2024",
    description: "Join us for the most exciting AI hackathon of the year! Build cutting-edge artificial intelligence solutions using the latest tools and frameworks. This is your chance to showcase your skills, collaborate with top talent, and win amazing prizes.",
    longDescription: "The AI Innovation Challenge 2024 is a month-long virtual hackathon designed to push the boundaries of artificial intelligence. Participants will work on real-world problems in areas such as machine learning, natural language processing, computer vision, and neural networks. With mentorship from industry experts and access to cutting-edge tools, this is the perfect opportunity to innovate and create impactful AI solutions.",
    imageUrl: "/api/placeholder/800/400",
    participantCount: 342,
    maxParticipants: 500,
    prizePool: 50000,
    registrationFee: 0,
    daysLeft: 12,
    status: "REGISTRATION_OPEN",
    categories: ["AI/ML", "Web3", "Mobile", "Data Science"],
    location: "Virtual",
    startDate: "2024-03-15",
    endDate: "2024-03-30",
    registrationDeadline: "2024-03-14",
    organizer: {
      name: "TechCorp Inc.",
      logo: "/api/placeholder/60/60",
      description: "Leading technology company focused on innovation and AI research."
    },
    difficulty: "Intermediate",
    timeline: [
      { date: "2024-03-01", event: "Registration Opens", status: "completed" },
      { date: "2024-03-14", event: "Registration Closes", status: "upcoming" },
      { date: "2024-03-15", event: "Hackathon Begins", status: "upcoming" },
      { date: "2024-03-22", event: "Mid-point Check-in", status: "upcoming" },
      { date: "2024-03-29", event: "Submission Deadline", status: "upcoming" },
      { date: "2024-03-30", event: "Judging & Winners Announcement", status: "upcoming" }
    ],
    prizes: [
      { position: "1st Place", prize: "$20,000", description: "Cash prize + mentorship opportunity" },
      { position: "2nd Place", prize: "$15,000", description: "Cash prize + tech goodies" },
      { position: "3rd Place", prize: "$10,000", description: "Cash prize + certificate" },
      { position: "Special Recognition", prize: "$5,000", description: "For most innovative solution" }
    ],
    rules: [
      "Teams must consist of 1-4 members",
      "All code must be written during the hackathon period",
      "Participants must use at least one AI/ML technology",
      "Projects must be submitted with source code and documentation",
      "Plagiarism is strictly prohibited and will result in disqualification",
      "Participants must respect the code of conduct"
    ],
    judges: [
      { name: "Dr. Sarah Johnson", title: "AI Research Director", company: "TechCorp", avatar: "/api/placeholder/40/40" },
      { name: "Prof. Michael Chen", title: "Computer Science Professor", company: "MIT", avatar: "/api/placeholder/40/40" },
      { name: "Lisa Rodriguez", title: "CTO", company: "AI Startup Labs", avatar: "/api/placeholder/40/40" }
    ],
    sponsors: [
      { name: "TechCorp", logo: "/api/placeholder/80/40", tier: "Platinum" },
      { name: "AI Cloud Services", logo: "/api/placeholder/80/40", tier: "Gold" },
      { name: "DataTools Inc.", logo: "/api/placeholder/80/40", tier: "Silver" },
      { name: "DevHub", logo: "/api/placeholder/80/40", tier: "Bronze" }
    ],
    faqs: [
      {
        question: "Who can participate in this hackathon?",
        answer: "Anyone with an interest in AI and programming can participate. Students, professionals, and hobbyists are all welcome."
      },
      {
        question: "Is there a registration fee?",
        answer: "No, this hackathon is completely free to participate in."
      },
      {
        question: "Can I participate as part of a team?",
        answer: "Yes, teams of 1-4 members are allowed. You can form teams during or after registration."
      },
      {
        question: "What technologies can I use?",
        answer: "You can use any AI/ML technologies, frameworks, and tools. Popular choices include TensorFlow, PyTorch, scikit-learn, and cloud AI services."
      },
      {
        question: "How will projects be judged?",
        answer: "Projects will be judged based on innovation, technical complexity, impact, and presentation quality."
      }
    ]
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "default"
      case "upcoming": return "secondary"
      case "ongoing": return "destructive"
      default: return "outline"
    }
  }

  const formatPrize = (prize) => {
    if (prize >= 1000) {
      return `$${(prize / 1000).toFixed(0)}K`
    }
    return `$${prize}`
  }

  const handleRegister = () => {
    setShowRegistrationDialog(true)
  }

  const handleRegistrationSubmit = () => {
    setIsRegistered(true)
    setShowRegistrationDialog(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5">
          <img 
            src={hackathon.imageUrl} 
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <div className="flex justify-center mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {hackathon.status === "REGISTRATION_OPEN" ? "Registration Open" : hackathon.status}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{hackathon.title}</h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">{hackathon.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isRegistered ? (
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Registered
                  </Button>
                ) : (
                  <Button size="lg" className="text-lg px-8 py-3" onClick={handleRegister}>
                    Register Now
                  </Button>
                )}
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-black">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-black"
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart className={`mr-2 h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? 'Favorited' : 'Favorite'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{hackathon.participantCount}/{hackathon.maxParticipants}</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
            <div className="text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{formatPrize(hackathon.prizePool)}</div>
              <div className="text-sm text-muted-foreground">Prize Pool</div>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{hackathon.daysLeft}</div>
              <div className="text-sm text-muted-foreground">Days Left</div>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{hackathon.location}</div>
              <div className="text-sm text-muted-foreground">Location</div>
            </div>
            <div className="text-center">
              <CalendarDays className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{hackathon.difficulty}</div>
              <div className="text-sm text-muted-foreground">Difficulty</div>
            </div>
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{hackathon.registrationFee === 0 ? 'Free' : `$${hackathon.registrationFee}`}</div>
              <div className="text-sm text-muted-foreground">Fee</div>
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
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="prizes">Prizes</TabsTrigger>
                  <TabsTrigger value="rules">Rules</TabsTrigger>
                  <TabsTrigger value="judges">Judges</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">About This Hackathon</h3>
                      <p className="text-muted-foreground leading-relaxed">{hackathon.longDescription}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold mb-3">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {hackathon.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold mb-3">Important Dates</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Registration Deadline:</span>
                          <span className="font-medium">{hackathon.registrationDeadline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hackathon Start:</span>
                          <span className="font-medium">{hackathon.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hackathon End:</span>
                          <span className="font-medium">{hackathon.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold mb-4">Event Timeline</h3>
                    {hackathon.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Badge variant={getStatusColor(event.status)}>
                            {event.status === "completed" ? "✓" : event.status === "upcoming" ? "↑" : "→"}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{event.date}</div>
                          <div className="text-muted-foreground">{event.event}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="prizes" className="mt-6">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4">Prizes & Rewards</h3>
                    <div className="text-3xl font-bold text-primary mb-6">
                      Total Prize Pool: {formatPrize(hackathon.prizePool)}
                    </div>
                    <div className="grid gap-4">
                      {hackathon.prizes.map((prize, index) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-xl font-semibold">{prize.position}</h4>
                                <p className="text-muted-foreground">{prize.description}</p>
                              </div>
                              <div className="text-2xl font-bold text-primary">{prize.prize}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rules" className="mt-6">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4">Hackathon Rules</h3>
                    <div className="space-y-3">
                      {hackathon.rules.map((rule, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold">Important Notice</h4>
                            <p className="text-sm text-muted-foreground">
                              All participants must adhere to the code of conduct. Violations may result in disqualification.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="judges" className="mt-6">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4">Judging Panel</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hackathon.judges.map((judge, index) => (
                        <Card key={index}>
                          <CardContent className="p-6 text-center">
                            <Avatar className="w-20 h-20 mx-auto mb-4">
                              <AvatarImage src={judge.avatar} alt={judge.name} />
                              <AvatarFallback>{judge.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <h4 className="text-lg font-semibold">{judge.name}</h4>
                            <p className="text-muted-foreground">{judge.title}</p>
                            <p className="text-sm text-muted-foreground">{judge.company}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="faq" className="mt-6">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {hackathon.faqs.map((faq, index) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <h4 className="text-lg font-semibold mb-2">{faq.question}</h4>
                            <p className="text-muted-foreground">{faq.answer}</p>
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
              {/* Organizer Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Organizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={hackathon.organizer.logo} alt={hackathon.organizer.name} />
                      <AvatarFallback>{hackathon.organizer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{hackathon.organizer.name}</div>
                      <div className="text-sm text-muted-foreground">{hackathon.organizer.description}</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Sponsors Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Sponsors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {hackathon.sponsors.map((sponsor, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-muted rounded p-3 mb-2">
                          <div className="text-xs font-medium">{sponsor.name}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{sponsor.tier}</div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Become a Sponsor
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={handleRegister}>
                    {isRegistered ? 'View Registration' : 'Register Now'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Event
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Info className="mr-2 h-4 w-4" />
                    Contact Organizer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register for {hackathon.title}</DialogTitle>
            <DialogDescription>
              Fill out the form below to register for this hackathon.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your full name" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="team">Team Preference</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="How would you like to participate?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="team">Join a team</SelectItem>
                  <SelectItem value="create-team">Create a team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="motivation">Why do you want to participate?</Label>
              <Textarea id="motivation" placeholder="Tell us about your motivation..." />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleRegistrationSubmit} className="flex-1">
                Register Now
              </Button>
              <Button variant="outline" onClick={() => setShowRegistrationDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}