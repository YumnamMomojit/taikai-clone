"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Plus, X, Upload, Users, Trophy, Code, Palette, Lightbulb } from "lucide-react"

interface TeamMember {
  name: string
  email: string
  role: string
  wallet?: string
}

interface ProjectData {
  basicInfo: {
    title: string
    description: string
    category: string
    tags: string[]
    githubUrl?: string
    demoUrl?: string
  }
  teamInfo: {
    teamName: string
    members: TeamMember[]
  }
  additionalInfo: {
    challenges: string[]
    technologies: string[]
    features: string[]
    futurePlans: string
  }
  submission: {
    hackathonId: string
    files: File[]
    additionalNotes: string
  }
}

export default function SubmitProject() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newChallenge, setNewChallenge] = useState("")
  const [newTechnology, setNewTechnology] = useState("")
  const [newFeature, setNewFeature] = useState("")

  const [projectData, setProjectData] = useState<ProjectData>({
    basicInfo: {
      title: "",
      description: "",
      category: "",
      tags: [],
      githubUrl: "",
      demoUrl: ""
    },
    teamInfo: {
      teamName: "",
      members: [{ name: "", email: "", role: "", wallet: "" }]
    },
    additionalInfo: {
      challenges: [],
      technologies: [],
      features: [],
      futurePlans: ""
    },
    submission: {
      hackathonId: "",
      files: [],
      additionalNotes: ""
    }
  })

  const steps = [
    { id: 1, title: "Basic Info", icon: Lightbulb },
    { id: 2, title: "Team Info", icon: Users },
    { id: 3, title: "Project Details", icon: Code },
    { id: 4, title: "Submission", icon: Trophy }
  ]

  const categories = [
    "DeFi", "NFT", "Gaming", "DAO", "Infrastructure", 
    "Social", "Education", "Healthcare", "Sustainability", "Other"
  ]

  const roles = ["Lead Developer", "Frontend Developer", "Backend Developer", "Smart Contract Developer", "Designer", "Product Manager", "Other"]

  const updateBasicInfo = (field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value }
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !projectData.basicInfo.tags.includes(newTag.trim())) {
      setProjectData(prev => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          tags: [...prev.basicInfo.tags, newTag.trim()]
        }
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setProjectData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        tags: prev.basicInfo.tags.filter(tag => tag !== tagToRemove)
      }
    }))
  }

  const updateTeamInfo = (field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      teamInfo: { ...prev.teamInfo, [field]: value }
    }))
  }

  const updateTeamMember = (index: number, field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      teamInfo: {
        ...prev.teamInfo,
        members: prev.teamInfo.members.map((member, i) => 
          i === index ? { ...member, [field]: value } : member
        )
      }
    }))
  }

  const addTeamMember = () => {
    setProjectData(prev => ({
      ...prev,
      teamInfo: {
        ...prev.teamInfo,
        members: [...prev.teamInfo.members, { name: "", email: "", role: "", wallet: "" }]
      }
    }))
  }

  const removeTeamMember = (index: number) => {
    if (projectData.teamInfo.members.length > 1) {
      setProjectData(prev => ({
        ...prev,
        teamInfo: {
          ...prev.teamInfo,
          members: prev.teamInfo.members.filter((_, i) => i !== index)
        }
      }))
    }
  }

  const addChallenge = () => {
    if (newChallenge.trim()) {
      setProjectData(prev => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          challenges: [...prev.additionalInfo.challenges, newChallenge.trim()]
        }
      }))
      setNewChallenge("")
    }
  }

  const removeChallenge = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        challenges: prev.additionalInfo.challenges.filter((_, i) => i !== index)
      }
    }))
  }

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setProjectData(prev => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          technologies: [...prev.additionalInfo.technologies, newTechnology.trim()]
        }
      }))
      setNewTechnology("")
    }
  }

  const removeTechnology = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        technologies: prev.additionalInfo.technologies.filter((_, i) => i !== index)
      }
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setProjectData(prev => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          features: [...prev.additionalInfo.features, newFeature.trim()]
        }
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        features: prev.additionalInfo.features.filter((_, i) => i !== index)
      }
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setProjectData(prev => ({
      ...prev,
      submission: {
        ...prev.submission,
        files: [...prev.submission.files, ...files]
      }
    }))
  }

  const removeFile = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      submission: {
        ...prev.submission,
        files: prev.submission.files.filter((_, i) => i !== index)
      }
    }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return projectData.basicInfo.title.trim() && 
               projectData.basicInfo.description.trim() && 
               projectData.basicInfo.category
      case 2:
        return projectData.teamInfo.teamName.trim() && 
               projectData.teamInfo.members.every(member => 
                 member.name.trim() && member.email.trim() && member.role
               )
      case 3:
        return projectData.additionalInfo.challenges.length > 0 && 
               projectData.additionalInfo.technologies.length > 0
      case 4:
        return projectData.submission.hackathonId && 
               projectData.submission.files.length > 0
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      })
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Success!",
        description: "Your project has been submitted successfully.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Your Project</h1>
          <p className="text-muted-foreground">
            Share your innovative project with the community and compete for amazing prizes.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Project Title *</Label>
                      <Input
                        id="title"
                        value={projectData.basicInfo.title}
                        onChange={(e) => updateBasicInfo("title", e.target.value)}
                        placeholder="Enter your project title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={projectData.basicInfo.category} onValueChange={(value) => updateBasicInfo("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={projectData.basicInfo.description}
                    onChange={(e) => updateBasicInfo("description", e.target.value)}
                    placeholder="Describe your project in detail..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      value={projectData.basicInfo.githubUrl}
                      onChange={(e) => updateBasicInfo("githubUrl", e.target.value)}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="demoUrl">Demo URL</Label>
                    <Input
                      id="demoUrl"
                      value={projectData.basicInfo.demoUrl}
                      onChange={(e) => updateBasicInfo("demoUrl", e.target.value)}
                      placeholder="https://your-demo-url.com"
                    />
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projectData.basicInfo.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Team Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Team Information</h2>
                  <div>
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input
                      id="teamName"
                      value={projectData.teamInfo.teamName}
                      onChange={(e) => updateTeamInfo("teamName", e.target.value)}
                      placeholder="Enter your team name"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Team Members *</h3>
                    <Button onClick={addTeamMember} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {projectData.teamInfo.members.map((member, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{member.name.charAt(0) || "?"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">Team Member {index + 1}</h4>
                                <p className="text-sm text-muted-foreground">{member.role || "No role assigned"}</p>
                              </div>
                            </div>
                            {projectData.teamInfo.members.length > 1 && (
                              <Button
                                onClick={() => removeTeamMember(index)}
                                variant="outline"
                                size="sm"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Name *</Label>
                              <Input
                                value={member.name}
                                onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                                placeholder="Full name"
                              />
                            </div>
                            <div>
                              <Label>Email *</Label>
                              <Input
                                value={member.email}
                                onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                                placeholder="Email address"
                                type="email"
                              />
                            </div>
                            <div>
                              <Label>Role *</Label>
                              <Select value={member.role} onValueChange={(value) => updateTeamMember(index, "role", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Wallet Address (Optional)</Label>
                              <Input
                                value={member.wallet}
                                onChange={(e) => updateTeamMember(index, "wallet", e.target.value)}
                                placeholder="0x..."
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Project Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Challenges Addressed *</h3>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newChallenge}
                          onChange={(e) => setNewChallenge(e.target.value)}
                          placeholder="Describe a challenge your project solves"
                          onKeyPress={(e) => e.key === 'Enter' && addChallenge()}
                        />
                        <Button onClick={addChallenge} variant="outline" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {projectData.additionalInfo.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <span>{challenge}</span>
                            <Button
                              onClick={() => removeChallenge(index)}
                              variant="outline"
                              size="sm"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Technologies Used *</h3>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTechnology}
                          onChange={(e) => setNewTechnology(e.target.value)}
                          placeholder="Add a technology (e.g., React, Solidity, etc.)"
                          onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                        />
                        <Button onClick={addTechnology} variant="outline" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {projectData.additionalInfo.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tech}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTechnology(index)} />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Key Features *</h3>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Describe a key feature"
                          onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                        />
                        <Button onClick={addFeature} variant="outline" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {projectData.additionalInfo.features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <span>{feature}</span>
                            <Button
                              onClick={() => removeFeature(index)}
                              variant="outline"
                              size="sm"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="futurePlans">Future Plans</Label>
                      <Textarea
                        id="futurePlans"
                        value={projectData.additionalInfo.futurePlans}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          additionalInfo: {
                            ...prev.additionalInfo,
                            futurePlans: e.target.value
                          }
                        }))}
                        placeholder="Describe your future plans for this project..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Submission */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Final Submission</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="hackathonId">Select Hackathon *</Label>
                      <Select value={projectData.submission.hackathonId} onValueChange={(value) => setProjectData(prev => ({
                        ...prev,
                        submission: { ...prev.submission, hackathonId: value }
                      }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hackathon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">DeFi Hackathon 2024</SelectItem>
                          <SelectItem value="2">NFT Innovation Challenge</SelectItem>
                          <SelectItem value="3">Web3 Gaming Jam</SelectItem>
                          <SelectItem value="4">DAO Builder Summit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Upload Files *</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          Drag and drop your files here or click to browse
                        </p>
                        <Input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button asChild variant="outline">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            Choose Files
                          </label>
                        </Button>
                      </div>
                      
                      {projectData.submission.files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="font-medium">Uploaded Files:</h4>
                          {projectData.submission.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-3">
                                <Palette className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={() => removeFile(index)}
                                variant="outline"
                                size="sm"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        value={projectData.submission.additionalNotes}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          submission: { ...prev.submission, additionalNotes: e.target.value }
                        }))}
                        placeholder="Any additional information for the judges..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Submission Summary</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <strong>Project:</strong> {projectData.basicInfo.title}
                            </div>
                            <div>
                              <strong>Team:</strong> {projectData.teamInfo.teamName}
                            </div>
                            <div>
                              <strong>Category:</strong> {projectData.basicInfo.category}
                            </div>
                            <div>
                              <strong>Team Members:</strong> {projectData.teamInfo.members.length}
                            </div>
                            <div>
                              <strong>Technologies:</strong> {projectData.additionalInfo.technologies.join(", ")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Project"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}