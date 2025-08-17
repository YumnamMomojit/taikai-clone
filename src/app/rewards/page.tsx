"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TokenRewards from "@/components/token-rewards"
import { Coins, Trophy, Gift, TrendingUp } from "lucide-react"

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Token Rewards</h1>
          <p className="text-muted-foreground">
            Earn, claim, and manage your reward tokens from hackathon participation and achievements.
          </p>
        </div>

        {/* Hero Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Earn Tokens for Your Achievements</h2>
                <p className="text-muted-foreground mb-6">
                  Participate in hackathons, submit projects, help the community, and earn valuable tokens 
                  that can be used for platform benefits, traded, or staked.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Compete & Win</h3>
                      <p className="text-sm text-muted-foreground">Earn tokens for top performances</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Gift className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Claim Rewards</h3>
                      <p className="text-sm text-muted-foreground">Redeem your earned tokens</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Grow Your Portfolio</h3>
                      <p className="text-sm text-muted-foreground">Trade and stake your tokens</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Exclusive Benefits</h3>
                      <p className="text-sm text-muted-foreground">Unlock platform features</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-6 border border-primary/20">
                    <div className="text-center mb-4">
                      <Coins className="w-12 h-12 mx-auto mb-2 text-primary" />
                      <h3 className="text-lg font-semibold">Token Economy</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>HACK Token</span>
                        <span className="font-medium">Governance & Rewards</span>
                      </div>
                      <div className="flex justify-between">
                        <span>REWARD Token</span>
                        <span className="font-medium">Community Incentives</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Supply</span>
                        <span className="font-medium">100M HACK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Staking APY</span>
                        <span className="font-medium">Up to 15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Rewards Component */}
        <TokenRewards />
      </div>
    </div>
  )
}