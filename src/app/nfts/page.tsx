"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import NFTMinter from "@/components/nft-minter"
import { Award, Shield, Globe, Star } from "lucide-react"

export default function NFTsPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">NFT Certificates</h1>
          <p className="text-muted-foreground">
            Mint, collect, and showcase your hackathon achievements as unique NFT certificates.
          </p>
        </div>

        {/* Hero Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Your Achievements, Immortalized</h2>
                <p className="text-muted-foreground mb-6">
                  Transform your hackathon participation and achievements into unique, verifiable NFT certificates 
                  that live forever on the blockchain. Showcase your accomplishments and build your Web3 reputation.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Unique & Verifiable</h3>
                      <p className="text-sm text-muted-foreground">Blockchain-verified certificates</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Tamper-Proof</h3>
                      <p className="text-sm text-muted-foreground">Secure and immutable records</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Globally Accessible</h3>
                      <p className="text-sm text-muted-foreground">Showcase anywhere, anytime</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Trade & Collect</h3>
                      <p className="text-sm text-muted-foreground">Build your achievement portfolio</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-6 border border-primary/20">
                    <div className="text-center mb-4">
                      <Award className="w-12 h-12 mx-auto mb-2 text-primary" />
                      <h3 className="text-lg font-semibold">NFT Standards</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Standard</span>
                        <span className="font-medium">ERC-721</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blockchain</span>
                        <span className="font-medium">Ethereum</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Metadata</span>
                        <span className="font-medium">IPFS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verification</span>
                        <span className="font-medium">On-chain</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NFT Minter Component */}
        <NFTMinter />
      </div>
    </div>
  )
}