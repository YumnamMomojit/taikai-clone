"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  walletAddress?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithWallet: () => Promise<void>
  loginWithSocial: (provider: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        // Simulate checking local storage or API for existing session
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: "1",
        email,
        name: "Alex Johnson",
        role: "PARTICIPANT",
        avatar: "/api/placeholder/40/40"
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithWallet = async () => {
    setIsLoading(true)
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: "1",
        email: "wallet@example.com",
        name: "Wallet User",
        role: "PARTICIPANT",
        walletAddress: "0x123...abc",
        avatar: "/api/placeholder/40/40"
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Wallet login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithSocial = async (provider: string) => {
    setIsLoading(true)
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: "1",
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        role: "PARTICIPANT",
        avatar: "/api/placeholder/40/40"
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Social login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: "1",
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        role: userData.role.toUpperCase(),
        avatar: "/api/placeholder/40/40"
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    loginWithWallet,
    loginWithSocial,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}