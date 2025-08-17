"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Wallet, 
  Github, 
  Twitter, 
  Google, 
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState("email")
  const [walletConnected, setWalletConnected] = useState(false)
  const [authStep, setAuthStep] = useState("login") // login, register, verify

  const handleEmailLogin = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
    }, 2000)
  }

  const handleSocialLogin = (provider) => {
    setIsLoading(true)
    // Simulate OAuth flow
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
    }, 2000)
  }

  const handleWalletConnect = async () => {
    setIsLoading(true)
    // Simulate wallet connection
    setTimeout(() => {
      setIsLoading(false)
      setWalletConnected(true)
      setLoginMethod("wallet")
    }, 2000)
  }

  const handleWalletSign = async () => {
    setIsLoading(true)
    // Simulate wallet signature
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
    }, 2000)
  }

  const handleRegister = async () => {
    setIsLoading(true)
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      setAuthStep("verify")
    }, 2000)
  }

  const handleVerification = async () => {
    setIsLoading(true)
    // Simulate email verification
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Branding */}
          <div className="hidden md:flex flex-col justify-center space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary mb-4">HackathonHub</h1>
              <p className="text-xl text-muted-foreground">
                Join the global community of innovators, developers, and creators.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-muted-foreground">Participate in exciting hackathons</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-muted-foreground">Win amazing prizes and recognition</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-muted-foreground">Connect with talented collaborators</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-muted-foreground">Build your portfolio and career</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">Secure & Trusted</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your data is protected with industry-standard encryption and security measures.
              </p>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {authStep === "login" && (
                  <>
                    {/* Quick Auth Options */}
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleWalletConnect()}
                        disabled={isLoading}
                      >
                        {walletConnected ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Wallet Connected
                          </>
                        ) : (
                          <>
                            <Wallet className="mr-2 h-4 w-4" />
                            Connect Wallet
                          </>
                        )}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSocialLogin("github")}
                          disabled={isLoading}
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSocialLogin("twitter")}
                          disabled={isLoading}
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSocialLogin("google")}
                          disabled={isLoading}
                        >
                          <Google className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Email Login */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your password"
                            disabled={isLoading}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="remember"
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="remember" className="text-sm">Remember me</Label>
                        </div>
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Forgot password?
                        </Button>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={handleEmailLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">Don't have an account? </span>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm"
                        onClick={() => setAuthStep("register")}
                      >
                        Sign up
                      </Button>
                    </div>
                  </>
                )}

                {authStep === "register" && (
                  <>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="Enter your first name"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Enter your last name"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="regEmail">Email address</Label>
                        <Input 
                          id="regEmail" 
                          type="email" 
                          placeholder="Enter your email"
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="regPassword">Password</Label>
                        <Input 
                          id="regPassword" 
                          type="password" 
                          placeholder="Create a password"
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          placeholder="Confirm your password"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">I am a...</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="participant">Participant</SelectItem>
                            <SelectItem value="organizer">Organizer</SelectItem>
                            <SelectItem value="mentor">Mentor</SelectItem>
                            <SelectItem value="judge">Judge</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="terms"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <Button variant="link" className="p-0 h-auto text-sm">
                            Terms of Service
                          </Button>{" "}
                          and{" "}
                          <Button variant="link" className="p-0 h-auto text-sm">
                            Privacy Policy
                          </Button>
                        </Label>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={handleRegister}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">Already have an account? </span>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm"
                        onClick={() => setAuthStep("login")}
                      >
                        Sign in
                      </Button>
                    </div>
                  </>
                )}

                {authStep === "verify" && (
                  <>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Check your email</h3>
                        <p className="text-sm text-muted-foreground">
                          We've sent a verification link to your email address.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <Input 
                          id="verificationCode" 
                          placeholder="Enter 6-digit code"
                          disabled={isLoading}
                        />
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={handleVerification}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <div className="text-center">
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Didn't receive the code? Resend
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Wallet Authentication Modal */}
            {walletConnected && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Authentication
                  </CardTitle>
                  <CardDescription>
                    Sign the message to verify your wallet ownership
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-mono">
                      HackathonHub Authentication: {new Date().toISOString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>This does not cost any gas fees</span>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleWalletSign}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing...
                      </>
                    ) : (
                      <>
                        Sign Message
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setWalletConnected(false)}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}