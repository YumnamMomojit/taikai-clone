"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { ethers } from "ethers"

interface WalletState {
  address: string | null
  balance: string
  chainId: number | null
  isConnected: boolean
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
}

interface Web3ContextType {
  walletState: WalletState
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isConnecting: boolean
  error: string | null
  switchNetwork: (chainId: number) => Promise<void>
  signMessage: (message: string) => Promise<string>
  sendTransaction: (to: string, amount: string) => Promise<string>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: "0",
    chainId: null,
    isConnected: false,
    provider: null,
    signer: null
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
      
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const balance = await provider.getBalance(accounts[0].address)
          const network = await provider.getNetwork()
          
          setWalletState({
            address: accounts[0].address,
            balance: ethers.formatEther(balance),
            chainId: Number(network.chainId),
            isConnected: true,
            provider,
            signer
          })
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      // Update with new account
      connectWallet()
    }
  }

  const handleChainChanged = (chainId: string) => {
    // Reload the page on chain change
    window.location.reload()
  }

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("Please install MetaMask or another Web3 wallet.")
      return
    }

    setIsConnecting(true)
    setError(null)
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const balance = await provider.getBalance(accounts[0])
      const network = await provider.getNetwork()
      
      setWalletState({
        address: accounts[0],
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        isConnected: true,
        provider,
        signer
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      balance: "0",
      chainId: null,
      isConnected: false,
      provider: null,
      signer: null
    })
    setError(null)
  }

  const switchNetwork = async (chainId: number) => {
    if (!window.ethereum) {
      setError("Wallet not found")
      return
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added to wallet
        setError("Network not added to wallet. Please add it manually.")
      } else {
        setError("Failed to switch network. Please try again.")
      }
    }
  }

  const signMessage = async (message: string): Promise<string> => {
    if (!walletState.signer) {
      throw new Error("Wallet not connected")
    }

    try {
      return await walletState.signer.signMessage(message)
    } catch (error) {
      console.error("Error signing message:", error)
      throw new Error("Failed to sign message")
    }
  }

  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    if (!walletState.signer) {
      throw new Error("Wallet not connected")
    }

    try {
      const tx = await walletState.signer.sendTransaction({
        to,
        value: ethers.parseEther(amount)
      })
      
      return tx.hash
    } catch (error) {
      console.error("Error sending transaction:", error)
      throw new Error("Failed to send transaction")
    }
  }

  const value: Web3ContextType = {
    walletState,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
    switchNetwork,
    signMessage,
    sendTransaction
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

// Type definitions for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}