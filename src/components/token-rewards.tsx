"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { 
  Coins, 
  Gift, 
  TrendingUp, 
  Award, 
  Calendar, 
  Users, 
  Plus, 
  Send,
  History,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink
} from "lucide-react"
import { ethers } from "ethers"

interface TokenBalance {
  symbol: string
  balance: string
  address: string
  decimals: number
  name: string
}

interface Transaction {
  id: string
  type: "reward" | "transfer" | "purchase" | "staking"
  amount: string
  token: string
  timestamp: string
  status: "pending" | "completed" | "failed"
  description: string
  txHash?: string
}

interface Reward {
  id: string
  title: string
  description: string
  tokenAmount: string
  tokenSymbol: string
  requirements: string[]
  category: string
  expiresAt?: string
  claimed: boolean
  claimedAt?: string
}

// ERC-20 Token ABI (minimal for our needs)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
]

export default function TokenRewards() {
  const { walletState, signMessage, sendTransaction } = useWeb3()
  const { toast } = useToast()
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClaiming, setIsClaiming] = useState<string | null>(null)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [transferData, setTransferData] = useState({
    to: "",
    amount: "",
    tokenAddress: ""
  })

  // Sample token contracts (in production, these would be deployed contracts)
  const tokenContracts = [
    {
      name: "Hackathon Token",
      symbol: "HACK",
      address: "0x1234567890123456789012345678901234567890",
      decimals: 18
    },
    {
      name: "Reward Token",
      symbol: "REWARD",
      address: "0xABCDEF123456789012345678901234567890ABCD",
      decimals: 18
    }
  ]

  useEffect(() => {
    if (walletState.isConnected && walletState.provider) {
      loadTokenBalances()
      loadRewards()
      loadTransactions()
    }
  }, [walletState.isConnected])

  const loadTokenBalances = async () => {
    if (!walletState.provider || !walletState.address) return

    setIsLoading(true)
    try {
      const balances: TokenBalance[] = []
      
      for (const token of tokenContracts) {
        try {
          const contract = new ethers.Contract(token.address, ERC20_ABI, walletState.provider)
          const [balance, decimals, symbol, name] = await Promise.all([
            contract.balanceOf(walletState.address),
            contract.decimals(),
            contract.symbol(),
            contract.name()
          ])
          
          balances.push({
            symbol,
            balance: ethers.formatUnits(balance, decimals),
            address: token.address,
            decimals: Number(decimals),
            name
          })
        } catch (error) {
          console.error(`Error loading balance for ${token.symbol}:`, error)
        }
      }
      
      setTokenBalances(balances)
    } catch (error) {
      console.error("Error loading token balances:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRewards = () => {
    // Sample rewards data
    const sampleRewards: Reward[] = [
      {
        id: "1",
        title: "First Hackathon Participation",
        description: "Reward for participating in your first hackathon",
        tokenAmount: "100",
        tokenSymbol: "HACK",
        requirements: ["Complete profile", "Join a hackathon"],
        category: "Participation",
        claimed: false
      },
      {
        id: "2",
        title: "Project Submission",
        description: "Reward for submitting a project to a hackathon",
        tokenAmount: "250",
        tokenSymbol: "HACK",
        requirements: ["Submit complete project", "Meet all requirements"],
        category: "Achievement",
        claimed: false
      },
      {
        id: "3",
        title: "Top 10 Finisher",
        description: "Reward for finishing in the top 10 of a hackathon",
        tokenAmount: "500",
        tokenSymbol: "HACK",
        requirements: ["Finish in top 10", "Project meets criteria"],
        category: "Competition",
        claimed: false,
        expiresAt: "2024-12-31"
      },
      {
        id: "4",
        title: "Community Contributor",
        description: "Reward for contributing to the community",
        tokenAmount: "150",
        tokenSymbol: "REWARD",
        requirements: ["Help other participants", "Provide valuable feedback"],
        category: "Community",
        claimed: true,
        claimedAt: "2024-01-15"
      }
    ]
    setRewards(sampleRewards)
  }

  const loadTransactions = () => {
    // Sample transaction history
    const sampleTransactions: Transaction[] = [
      {
        id: "1",
        type: "reward",
        amount: "100",
        token: "HACK",
        timestamp: "2024-01-20T10:30:00Z",
        status: "completed",
        description: "First Hackathon Participation",
        txHash: "0x1234567890123456789012345678901234567890123456789012345678901234"
      },
      {
        id: "2",
        type: "transfer",
        amount: "50",
        token: "HACK",
        timestamp: "2024-01-19T15:45:00Z",
        status: "completed",
        description: "Transfer to 0xABC...123",
        txHash: "0x5678901234567890123456789012345678901234567890123456789012345678"
      },
      {
        id: "3",
        type: "reward",
        amount: "150",
        token: "REWARD",
        timestamp: "2024-01-18T09:15:00Z",
        status: "completed",
        description: "Community Contributor",
        txHash: "0x9012345678901234567890123456789012345678901234567890123456789012"
      }
    ]
    setTransactions(sampleTransactions)
  }

  const claimReward = async (reward: Reward) => {
    if (!walletState.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim rewards.",
        variant: "destructive"
      })
      return
    }

    setIsClaiming(reward.id)
    try {
      // Sign message for reward claim
      const message = `Claim reward: ${reward.title} - ${reward.tokenAmount} ${reward.tokenSymbol}`
      const signature = await signMessage(message)
      
      // Simulate API call to claim reward
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update reward status
      setRewards(prev => prev.map(r => 
        r.id === reward.id 
          ? { ...r, claimed: true, claimedAt: new Date().toISOString() }
          : r
      ))
      
      // Add transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "reward",
        amount: reward.tokenAmount,
        token: reward.tokenSymbol,
        timestamp: new Date().toISOString(),
        status: "completed",
        description: reward.title
      }
      setTransactions(prev => [newTransaction, ...prev])
      
      // Update token balance (simulate)
      setTokenBalances(prev => prev.map(token => 
        token.symbol === reward.tokenSymbol
          ? { ...token, balance: (parseFloat(token.balance) + parseFloat(reward.tokenAmount)).toString() }
          : token
      ))
      
      toast({
        title: "Reward Claimed!",
        description: `You have successfully claimed ${reward.tokenAmount} ${reward.tokenSymbol}.`,
      })
    } catch (error) {
      console.error("Error claiming reward:", error)
      toast({
        title: "Claim Failed",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsClaiming(null)
    }
  }

  const handleTransfer = async () => {
    if (!walletState.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to transfer tokens.",
        variant: "destructive"
      })
      return
    }

    if (!transferData.to || !transferData.amount || !transferData.tokenAddress) {
      toast({
        title: "Validation Error",
        description: "Please fill in all transfer fields.",
        variant: "destructive"
      })
      return
    }

    try {
      const token = tokenBalances.find(t => t.address === transferData.tokenAddress)
      if (!token) {
        toast({
          title: "Invalid Token",
          description: "Please select a valid token.",
          variant: "destructive"
        })
        return
      }

      if (parseFloat(transferData.amount) > parseFloat(token.balance)) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough tokens for this transfer.",
          variant: "destructive"
        })
        return
      }

      // Create token contract instance
      const contract = new ethers.Contract(
        transferData.tokenAddress,
        ERC20_ABI,
        walletState.signer
      )

      // Transfer tokens
      const tx = await contract.transfer(
        transferData.to,
        ethers.parseUnits(transferData.amount, token.decimals)
      )

      // Wait for transaction to be mined
      await tx.wait()

      // Add transaction to history
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "transfer",
        amount: transferData.amount,
        token: token.symbol,
        timestamp: new Date().toISOString(),
        status: "completed",
        description: `Transfer to ${transferData.to.slice(0, 6)}...${transferData.to.slice(-4)}`,
        txHash: tx.hash
      }
      setTransactions(prev => [newTransaction, ...prev])

      // Update balances
      await loadTokenBalances()

      // Reset form and close dialog
      setTransferData({ to: "", amount: "", tokenAddress: "" })
      setIsTransferDialogOpen(false)

      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${transferData.amount} ${token.symbol}.`,
      })
    } catch (error) {
      console.error("Error transferring tokens:", error)
      toast({
        title: "Transfer Failed",
        description: "Failed to transfer tokens. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "reward": return <Gift className="w-4 h-4" />
      case "transfer": return <Send className="w-4 h-4" />
      case "purchase": return <Coins className="w-4 h-4" />
      case "staking": return <TrendingUp className="w-4 h-4" />
      default: return <Coins className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600"
      case "pending": return "text-yellow-600"
      case "failed": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const totalRewards = rewards.reduce((sum, reward) => sum + parseFloat(reward.tokenAmount), 0)
  const claimedRewards = rewards.filter(r => r.claimed).reduce((sum, reward) => sum + parseFloat(reward.tokenAmount), 0)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tokenBalances.reduce((sum, token) => sum + parseFloat(token.balance), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rewards</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewards.filter(r => !r.claimed).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimed Rewards</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimedRewards.toFixed(0)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRewards * 0.1).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Token Balances */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Token Balances</CardTitle>
              <CardDescription>Your token holdings and rewards</CardDescription>
            </div>
            <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Transfer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Transfer Tokens</DialogTitle>
                  <DialogDescription>
                    Send tokens to another wallet address
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="token">Token</Label>
                    <Select 
                      value={transferData.tokenAddress} 
                      onValueChange={(value) => setTransferData({...transferData, tokenAddress: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokenBalances.map((token) => (
                          <SelectItem key={token.address} value={token.address}>
                            {token.name} ({token.symbol}) - {token.balance}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="to">Recipient Address</Label>
                    <Input
                      id="to"
                      value={transferData.to}
                      onChange={(e) => setTransferData({...transferData, to: e.target.value})}
                      placeholder="0x..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={transferData.amount}
                      onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                      placeholder="0.0"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleTransfer}>
                      Transfer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tokenBalances.map((token) => (
                <Card key={token.address}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{token.name}</h3>
                        <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      </div>
                      <Badge variant="secondary">{token.symbol}</Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">{token.balance}</div>
                    <div className="text-xs text-muted-foreground">
                      Contract: {token.address.slice(0, 6)}...{token.address.slice(-4)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
          <CardDescription>Claim your earned rewards and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className={reward.claimed ? "opacity-60" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{reward.tokenAmount} {reward.tokenSymbol}</div>
                      <Badge variant={reward.claimed ? "secondary" : "default"}>
                        {reward.claimed ? "Claimed" : "Available"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                      <div className="space-y-1">
                        {reward.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{reward.category}</Badge>
                        {reward.expiresAt && (
                          <span className="text-xs text-muted-foreground">
                            Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {!reward.claimed ? (
                        <Button 
                          onClick={() => claimReward(reward)}
                          disabled={isClaiming === reward.id}
                          size="sm"
                        >
                          {isClaiming === reward.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Gift className="w-4 h-4 mr-2" />
                              Claim
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Claimed on {new Date(reward.claimedAt!).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent token transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {transaction.amount} {transaction.token}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {transaction.txHash && (
                      <Button size="sm" variant="outline" asChild>
                        <a 
                          href={`https://etherscan.io/tx/${transaction.txHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}