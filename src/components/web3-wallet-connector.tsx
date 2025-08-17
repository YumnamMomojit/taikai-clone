"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  LogOut, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { ethers } from "ethers"

interface WalletState {
  address: string | null
  balance: string
  chainId: number | null
  isConnected: boolean
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
}

interface TokenBalance {
  symbol: string
  balance: string
  address: string
  decimals: number
}

export default function Web3WalletConnector() {
  const { toast } = useToast()
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: "0",
    chainId: null,
    isConnected: false,
    provider: null,
    signer: null
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [isLoadingTokens, setIsLoadingTokens] = useState(false)

  // Sample token contracts (in production, these would be fetched from an API)
  const tokenContracts = [
    {
      symbol: "HACK",
      address: "0x1234567890123456789012345678901234567890",
      decimals: 18
    },
    {
      symbol: "USDC",
      address: "0xA0b86a33E6417aAb7b6DbCBbe9FD4E89c0778a4B",
      decimals: 6
    },
    {
      symbol: "DAI",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18
    }
  ]

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
          
          // Load token balances
          loadTokenBalances(provider, accounts[0].address)
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
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Web3 wallet.",
        variant: "destructive"
      })
      return
    }

    setIsConnecting(true)
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
      
      // Load token balances
      await loadTokenBalances(provider, accounts[0])
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      })
      
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      })
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
    setTokenBalances([])
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  const loadTokenBalances = async (provider: ethers.BrowserProvider, address: string) => {
    setIsLoadingTokens(true)
    try {
      const balances: TokenBalance[] = []
      
      for (const token of tokenContracts) {
        try {
          // Create token contract instance
          const tokenContract = new ethers.Contract(
            token.address,
            [
              "function balanceOf(address owner) view returns (uint256)",
              "function decimals() view returns (uint8)",
              "function symbol() view returns (string)"
            ],
            provider
          )
          
          const [balance, decimals, symbol] = await Promise.all([
            tokenContract.balanceOf(address),
            tokenContract.decimals(),
            tokenContract.symbol()
          ])
          
          balances.push({
            symbol,
            balance: ethers.formatUnits(balance, decimals),
            address: token.address,
            decimals: Number(decimals)
          })
        } catch (error) {
          console.error(`Error loading balance for ${token.symbol}:`, error)
        }
      }
      
      setTokenBalances(balances)
    } catch (error) {
      console.error("Error loading token balances:", error)
    } finally {
      setIsLoadingTokens(false)
    }
  }

  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      })
    }
  }

  const openInExplorer = () => {
    if (walletState.address && walletState.chainId) {
      const explorers: { [key: number]: string } = {
        1: "https://etherscan.io",
        56: "https://bscscan.com",
        137: "https://polygonscan.com",
        43114: "https://snowtrace.io",
        42161: "https://arbiscan.io"
      }
      
      const explorer = explorers[walletState.chainId] || "https://etherscan.io"
      window.open(`${explorer}/address/${walletState.address}`, "_blank")
    }
  }

  const refreshBalance = async () => {
    if (walletState.provider && walletState.address) {
      try {
        const balance = await walletState.provider.getBalance(walletState.address)
        setWalletState(prev => ({
          ...prev,
          balance: ethers.formatEther(balance)
        }))
        
        // Refresh token balances
        await loadTokenBalances(walletState.provider, walletState.address)
        
        toast({
          title: "Balance Updated",
          description: "Your wallet balance has been refreshed.",
        })
      } catch (error) {
        console.error("Error refreshing balance:", error)
      }
    }
  }

  const getChainName = (chainId: number | null) => {
    const chains: { [key: number]: string } = {
      1: "Ethereum",
      56: "BSC",
      137: "Polygon",
      43114: "Avalanche",
      42161: "Arbitrum"
    }
    return chainId ? chains[chainId] || `Chain ${chainId}` : "Unknown"
  }

  return (
    <div className="w-full">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant={walletState.isConnected ? "outline" : "default"}>
            <Wallet className="w-4 h-4 mr-2" />
            {walletState.isConnected ? "Wallet Connected" : "Connect Wallet"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Web3 Wallet</DialogTitle>
            <DialogDescription>
              Connect your wallet to interact with the platform
            </DialogDescription>
          </DialogHeader>
          
          {!walletState.isConnected ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Web3 wallet to access all features
                </p>
              </div>
              
              <Button 
                onClick={connectWallet} 
                className="w-full" 
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect MetaMask
                  </>
                )}
              </Button>
              
              <div className="text-xs text-muted-foreground text-center">
                <p>Make sure you have MetaMask installed</p>
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download MetaMask
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Wallet Connected</span>
              </div>
              
              {/* Wallet Address */}
              <div>
                <Label>Wallet Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    value={walletState.address || ""} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button size="sm" variant="outline" onClick={copyAddress}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={openInExplorer}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Network Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Network</Label>
                  <div className="p-2 bg-muted rounded text-sm">
                    {getChainName(walletState.chainId)}
                  </div>
                </div>
                <div>
                  <Label>ETH Balance</Label>
                  <div className="p-2 bg-muted rounded text-sm font-medium">
                    {parseFloat(walletState.balance).toFixed(4)} ETH
                  </div>
                </div>
              </div>
              
              {/* Token Balances */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Token Balances</Label>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={refreshBalance}
                    disabled={isLoadingTokens}
                  >
                    {isLoadingTokens ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="space-y-2">
                  {tokenBalances.map((token) => (
                    <div key={token.address} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{token.symbol}</Badge>
                      </div>
                      <span className="text-sm font-medium">
                        {parseFloat(token.balance).toFixed(4)}
                      </span>
                    </div>
                  ))}
                  {tokenBalances.length === 0 && !isLoadingTokens && (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      No token balances found
                    </div>
                  )}
                </div>
              </div>
              
              {/* Disconnect Button */}
              <Button 
                onClick={disconnectWallet} 
                variant="outline" 
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect Wallet
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Wallet Status Badge (for header/navbar) */}
      {walletState.isConnected && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="hidden sm:flex">
            {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
          </Badge>
          <Badge variant="outline" className="hidden sm:flex">
            {parseFloat(walletState.balance).toFixed(3)} ETH
          </Badge>
        </div>
      )}
    </div>
  )
}