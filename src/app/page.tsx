"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Users, Trophy, Clock, ArrowRight, Star, Quote } from "lucide-react"
import Link from "next/link"

export default function Home() {
  // Mock data for featured hackathons
  const featuredHackathons = [
    {
      id: "1",
      title: "AI Innovation Challenge",
      description: "Build the future of artificial intelligence with cutting-edge tools and frameworks.",
      imageUrl: "/api/placeholder/400/200",
      participantCount: 342,
      prizePool: "$50,000",
      daysLeft: 12,
      status: "Registration Open",
      categories: ["AI/ML", "Web3", "Mobile"]
    },
    {
      id: "2",
      title: "Web3 Gaming Hackathon",
      description: "Create the next generation of blockchain games and decentralized applications.",
      imageUrl: "/api/placeholder/400/200",
      participantCount: 256,
      prizePool: "$75,000",
      daysLeft: 8,
      status: "Ongoing",
      categories: ["Gaming", "Web3", "DeFi"]
    },
    {
      id: "3",
      title: "Sustainability Tech Challenge",
      description: "Develop innovative solutions for environmental sustainability and climate action.",
      imageUrl: "/api/placeholder/400/200",
      participantCount: 189,
      prizePool: "$40,000",
      daysLeft: 20,
      status: "Upcoming",
      categories: ["Sustainability", "IoT", "Data Science"]
    }
  ]

  // Mock testimonials
  const testimonials = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Winning Developer",
      content: "This platform helped me connect with amazing collaborators and build something truly innovative. The community support is incredible!",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      role: "Hackathon Organizer",
      content: "Organizing hackathons has never been easier. The tools provided streamline everything from registration to judging.",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: "3",
      name: "Emily Watson",
      role: "First-time Participant",
      content: "As someone new to hackathons, I found the platform incredibly welcoming and easy to navigate. Highly recommended!",
      avatar: "/api/placeholder/40/40"
    }
  ]

  // Mock statistics
  const stats = [
    { label: "Active Hackathons", value: "24", icon: CalendarDays },
    { label: "Participants", value: "12.5K", icon: Users },
    { label: "Projects Submitted", value: "3.2K", icon: Trophy },
    { label: "Prize Pool", value: "$850K", icon: Star }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Build the Future
              <span className="block text-primary">One Hackathon at a Time</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join a global community of innovators, developers, and creators. Compete, collaborate, and bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hackathons">
                <Button size="lg" className="text-lg px-8 py-3">
                  Explore Hackathons
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hackathons Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Hackathons</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover exciting opportunities to showcase your skills and win amazing prizes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHackathons.map((hackathon) => (
              <Card key={hackathon.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img 
                    src={hackathon.imageUrl} 
                    alt={hackathon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                    <Badge variant={hackathon.status === "Registration Open" ? "default" : hackathon.status === "Ongoing" ? "secondary" : "outline"}>
                      {hackathon.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{hackathon.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {hackathon.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {hackathon.participantCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        {hackathon.prizePool}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {hackathon.daysLeft}d left
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      <Link href={`/hackathons/${hackathon.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/hackathons">
              <Button variant="outline" size="lg">
                View All Hackathons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from participants, organizers, and winners about their experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="relative">
                <CardContent className="pt-8">
                  <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/20" />
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of innovators and start building your future today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/hackathons">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Explore Hackathons
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}