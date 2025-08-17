"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { 
  Award, 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Share2, 
  ExternalLink,
  Calendar,
  Users,
  Trophy,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Eye,
  Copy
} from "lucide-react"
import { ethers } from "ethers"

interface NFTCertificate {
  id: string
  tokenId: string
  name: string
  description: string
  image: string
  attributes: {
    trait_type: string
    value: string
  }[]
  hackathonName: string
  hackathonDate: string
  participantName: string
  participantAddress: string
  rank?: string
  category: string
  mintedAt: string
  txHash?: string
  contractAddress: string
  isOwned: boolean
}

interface MintingData {
  hackathonName: string
  participantName: string
  achievement: string
  description: string
  rank?: string
  category: string
  imageUrl?: string
}

// ERC-721 NFT ABI (minimal for our needs)
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function mint(address to, string memory tokenURI) returns (uint256)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function approve(address to, uint256 tokenId)",
  "function setApprovalForAll(address operator, bool approved)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
]

export default function NFTMinter() {
  const { walletState, signMessage } = useWeb3()
  const { toast } = useToast()
  const [nfts, setNfts] = useState<NFTCertificate[]>([])
  const [isMinting, setIsMinting] = useState(false)
  const [isMintDialogOpen, setIsMintDialogOpen] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<NFTCertificate | null>(null)
  const [mintingData, setMintingData] = useState<MintingData>({
    hackathonName: "",
    participantName: "",
    achievement: "",
    description: "",
    rank: "",
    category: "",
    imageUrl: ""
  })

  // Sample NFT contract address
  const NFT_CONTRACT_ADDRESS = "0x9876543210987654321098765432109876543210"

  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      loadNFTs()
    }
  }, [walletState.isConnected])

  const loadNFTs = () => {
    // Sample NFT certificates (in production, these would be fetched from the blockchain)
    const sampleNFTs: NFTCertificate[] = [
      {
        id: "1",
        tokenId: "1",
        name: "DeFi Hackathon 2024 Participant",
        description: "Certificate of participation in DeFi Hackathon 2024",
        image: "/api/placeholder/400/400",
        attributes: [
          { trait_type: "Hackathon", value: "DeFi Hackathon 2024" },
          { trait_type: "Date", value: "2024-01-15" },
          { trait_type: "Category", value: "DeFi" },
          { trait_type: "Participants", value: "234" }
        ],
        hackathonName: "DeFi Hackathon 2024",
        hackathonDate: "2024-01-15",
        participantName: "John Doe",
        participantAddress: walletState.address || "0x123...456",
        rank: "Top 20",
        category: "DeFi",
        mintedAt: "2024-01-20T10:30:00Z",
        txHash: "0x1234567890123456789012345678901234567890123456789012345678901234",
        contractAddress: NFT_CONTRACT_ADDRESS,
        isOwned: true
      },
      {
        id: "2",
        tokenId: "2",
        name: "NFT Innovation Challenge - Finalist",
        description: "Finalist certificate for NFT Innovation Challenge",
        image: "/api/placeholder/400/400",
        attributes: [
          { trait_type: "Hackathon", value: "NFT Innovation Challenge" },
          { trait_type: "Date", value: "2024-02-01" },
          { trait_type: "Category", value: "NFT" },
          { trait_type: "Rank", value: "Finalist" }
        ],
        hackathonName: "NFT Innovation Challenge",
        hackathonDate: "2024-02-01",
        participantName: "John Doe",
        participantAddress: walletState.address || "0x123...456",
        rank: "Finalist",
        category: "NFT",
        mintedAt: "2024-02-05T14:20:00Z",
        txHash: "0x5678901234567890123456789012345678901234567890123456789012345678",
        contractAddress: NFT_CONTRACT_ADDRESS,
        isOwned: true
      },
      {
        id: "3",
        tokenId: "3",
        name: "Web3 Gaming Jam - Winner",
        description: "Winner certificate for Web3 Gaming Jam",
        image: "/api/placeholder/400/400",
        attributes: [
          { trait_type: "Hackathon", value: "Web3 Gaming Jam" },
          { trait_type: "Date", value: "2023-12-01" },
          { trait_type: "Category", value: "Gaming" },
          { trait_type: "Rank", value: "1st Place" },
          { trait_type: "Prize", value: "$5000" }
        ],
        hackathonName: "Web3 Gaming Jam",
        hackathonDate: "2023-12-01",
        participantName: "John Doe",
        participantAddress: walletState.address || "0x123...456",
        rank: "1st Place",
        category: "Gaming",
        mintedAt: "2023-12-10T16:45:00Z",
        txHash: "0x9012345678901234567890123456789012345678901234567890123456789012",
        contractAddress: NFT_CONTRACT_ADDRESS,
        isOwned: true
      }
    ]
    setNfts(sampleNFTs)
  }

  const mintNFT = async () => {
    if (!walletState.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint NFTs.",
        variant: "destructive"
      })
      return
    }

    if (!mintingData.hackathonName || !mintingData.participantName || !mintingData.achievement) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsMinting(true)
    try {
      // Sign message for NFT minting
      const message = `Mint NFT Certificate: ${mintingData.achievement} - ${mintingData.hackathonName}`
      const signature = await signMessage(message)

      // Create token metadata
      const metadata = {
        name: `${mintingData.hackathonName} - ${mintingData.achievement}`,
        description: mintingData.description,
        image: mintingData.imageUrl || "/api/placeholder/400/400",
        attributes: [
          { trait_type: "Hackathon", value: mintingData.hackathonName },
          { trait_type: "Achievement", value: mintingData.achievement },
          { trait_type: "Participant", value: mintingData.participantName },
          { trait_type: "Date", value: new Date().toISOString().split('T')[0] },
          { trait_type: "Category", value: mintingData.category }
        ]
      }

      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Create new NFT certificate
      const newNFT: NFTCertificate = {
        id: Date.now().toString(),
        tokenId: (nfts.length + 1).toString(),
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes,
        hackathonName: mintingData.hackathonName,
        hackathonDate: new Date().toISOString().split('T')[0],
        participantName: mintingData.participantName,
        participantAddress: walletState.address!,
        rank: mintingData.rank,
        category: mintingData.category,
        mintedAt: new Date().toISOString(),
        txHash: "0x" + Math.random().toString(16).substr(2, 64),
        contractAddress: NFT_CONTRACT_ADDRESS,
        isOwned: true
      }

      setNfts(prev => [newNFT, ...prev])
      setIsMintDialogOpen(false)
      setMintingData({
        hackathonName: "",
        participantName: "",
        achievement: "",
        description: "",
        rank: "",
        category: "",
        imageUrl: ""
      })

      toast({
        title: "NFT Minted Successfully!",
        description: `Your certificate "${metadata.name}" has been minted.`,
      })
    } catch (error) {
      console.error("Error minting NFT:", error)
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsMinting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Address copied to clipboard.",
    })
  }

  const openInExplorer = (txHash?: string) => {
    if (txHash) {
      window.open(`https://etherscan.io/tx/${txHash}`, "_blank")
    }
  }

  const downloadNFT = (nft: NFTCertificate) => {
    // In a real implementation, this would download the NFT image
    toast({
      title: "Download Started",
      description: "Downloading your NFT certificate...",
    })
  }

  const shareNFT = (nft: NFTCertificate) => {
    if (navigator.share) {
      navigator.share({
        title: nft.name,
        text: nft.description,
        url: window.location.href
      })
    } else {
      copyToClipboard(window.location.href)
    }
  }

  const getRankColor = (rank?: string) => {
    if (!rank) return "bg-gray-500"
    if (rank.includes("1st") || rank.includes("Winner")) return "bg-yellow-500"
    if (rank.includes("2nd")) return "bg-gray-400"
    if (rank.includes("3rd")) return "bg-orange-600"
    if (rank.includes("Finalist") || rank.includes("Top")) return "bg-blue-500"
    return "bg-green-500"
  }

  const ownedNFTs = nfts.filter(nft => nft.isOwned)
  const totalNFTs = nfts.length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total NFTs</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNFTs}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Owned</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownedNFTs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nfts.filter(nft => nft.rank && nft.rank.includes("1st")).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(nfts.map(nft => nft.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mint New NFT */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Mint Participation Certificate</CardTitle>
              <CardDescription>
                Create an NFT certificate for your hackathon participation and achievements
              </CardDescription>
            </div>
            <Dialog open={isMintDialogOpen} onOpenChange={setIsMintDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Mint NFT
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Mint NFT Certificate</DialogTitle>
                  <DialogDescription>
                    Create a unique NFT certificate for your hackathon achievement
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hackathonName">Hackathon Name *</Label>
                      <Input
                        id="hackathonName"
                        value={mintingData.hackathonName}
                        onChange={(e) => setMintingData({...mintingData, hackathonName: e.target.value})}
                        placeholder="DeFi Hackathon 2024"
                      />
                    </div>
                    <div>
                      <Label htmlFor="participantName">Participant Name *</Label>
                      <Input
                        id="participantName"
                        value={mintingData.participantName}
                        onChange={(e) => setMintingData({...mintingData, participantName: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="achievement">Achievement *</Label>
                      <Input
                        id="achievement"
                        value={mintingData.achievement}
                        onChange={(e) => setMintingData({...mintingData, achievement: e.target.value})}
                        placeholder="Participant, Finalist, Winner, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="rank">Rank (Optional)</Label>
                      <Input
                        id="rank"
                        value={mintingData.rank}
                        onChange={(e) => setMintingData({...mintingData, rank: e.target.value})}
                        placeholder="1st Place, Top 10, etc."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={mintingData.category}
                      onChange={(e) => setMintingData({...mintingData, category: e.target.value})}
                      placeholder="DeFi, NFT, Gaming, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={mintingData.description}
                      onChange={(e) => setMintingData({...mintingData, description: e.target.value})}
                      placeholder="Describe your achievement and participation..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                    <Input
                      id="imageUrl"
                      value={mintingData.imageUrl}
                      onChange={(e) => setMintingData({...mintingData, imageUrl: e.target.value})}
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsMintDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={mintNFT} disabled={isMinting}>
                      {isMinting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Minting...
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4 mr-2" />
                          Mint NFT
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* NFT Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Your NFT Certificates</CardTitle>
          <CardDescription>
            Your collection of hackathon participation and achievement certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {nfts.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No NFTs Yet</h3>
              <p className="text-muted-foreground mb-4">
                Mint your first participation certificate to get started
              </p>
              <Dialog open={isMintDialogOpen} onOpenChange={setIsMintDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Mint Your First NFT
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Mint NFT Certificate</DialogTitle>
                    <DialogDescription>
                      Create a unique NFT certificate for your hackathon achievement
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hackathonName">Hackathon Name *</Label>
                        <Input
                          id="hackathonName"
                          value={mintingData.hackathonName}
                          onChange={(e) => setMintingData({...mintingData, hackathonName: e.target.value})}
                          placeholder="DeFi Hackathon 2024"
                        />
                      </div>
                      <div>
                        <Label htmlFor="participantName">Participant Name *</Label>
                        <Input
                          id="participantName"
                          value={mintingData.participantName}
                          onChange={(e) => setMintingData({...mintingData, participantName: e.target.value})}
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="achievement">Achievement *</Label>
                        <Input
                          id="achievement"
                          value={mintingData.achievement}
                          onChange={(e) => setMintingData({...mintingData, achievement: e.target.value})}
                          placeholder="Participant, Finalist, Winner, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="rank">Rank (Optional)</Label>
                        <Input
                          id="rank"
                          value={mintingData.rank}
                          onChange={(e) => setMintingData({...mintingData, rank: e.target.value})}
                          placeholder="1st Place, Top 10, etc."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={mintingData.category}
                        onChange={(e) => setMintingData({...mintingData, category: e.target.value})}
                        placeholder="DeFi, NFT, Gaming, etc."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={mintingData.description}
                        onChange={(e) => setMintingData({...mintingData, description: e.target.value})}
                        placeholder="Describe your achievement and participation..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                      <Input
                        id="imageUrl"
                        value={mintingData.imageUrl}
                        onChange={(e) => setMintingData({...mintingData, imageUrl: e.target.value})}
                        placeholder="https://example.com/image.png"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsMintDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={mintNFT} disabled={isMinting}>
                        {isMinting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Minting...
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            Mint NFT
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 relative">
                    <img 
                      src={nft.image} 
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {nft.rank && (
                        <Badge className={`${getRankColor(nft.rank)} text-white border-0`}>
                          {nft.rank}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        {nft.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{nft.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {nft.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Hackathon:</span>
                          <span className="font-medium">{nft.hackathonName}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Date:</span>
                          <span>{new Date(nft.hackathonDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Token ID:</span>
                          <span className="font-mono">#{nft.tokenId}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedNFT(nft)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => downloadNFT(nft)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => shareNFT(nft)}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                        {nft.txHash && (
                          <Button size="sm" variant="outline" onClick={() => openInExplorer(nft.txHash)}>
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <Dialog open={!!selectedNFT} onOpenChange={() => setSelectedNFT(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedNFT.name}</DialogTitle>
              <DialogDescription>
                Certificate details and properties
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={selectedNFT.image} 
                  alt={selectedNFT.name}
                  className="w-full rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedNFT.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Properties</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedNFT.attributes.map((attr, index) => (
                      <div key={index} className="p-2 bg-muted rounded">
                        <div className="text-xs text-muted-foreground">{attr.trait_type}</div>
                        <div className="text-sm font-medium">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contract Address:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">
                          {selectedNFT.contractAddress.slice(0, 6)}...{selectedNFT.contractAddress.slice(-4)}
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(selectedNFT.contractAddress)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token ID:</span>
                      <span className="font-mono">#{selectedNFT.tokenId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token Standard:</span>
                      <span>ERC-721</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minted:</span>
                      <span>{new Date(selectedNFT.mintedAt).toLocaleDateString()}</span>
                    </div>
                    {selectedNFT.txHash && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction:</span>
                        <Button size="sm" variant="link" onClick={() => openInExplorer(selectedNFT.txHash)}>
                          View on Etherscan
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => downloadNFT(selectedNFT)} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={() => shareNFT(selectedNFT)} variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}