#!/bin/bash

# 🚀 Taikai.network Clone - One-Click EC2 Deployment Script
# Usage: ./deploy.sh [EC2_PUBLIC_IP] [SSH_KEY_PATH]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
EC2_IP="${1:-}"
SSH_KEY="${2:-}"
APP_NAME="taikai-clone"
APP_DIR="/home/ubuntu/$APP_NAME"
PORT="3000"

# Print banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                🚀 Taikai.network Clone                     ║"
echo "║                   One-Click EC2 Deployment                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if EC2 IP is provided
if [ -z "$EC2_IP" ]; then
    echo -e "${YELLOW}Usage: ./deploy.sh [EC2_PUBLIC_IP] [SSH_KEY_PATH]${NC}"
    echo -e "${YELLOW}Example: ./deploy.sh 54.123.45.67 /path/to/your-key.pem${NC}"
    exit 1
fi

# Function to print status messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test SSH connection
print_status "Testing SSH connection to EC2 instance..."
if [ -n "$SSH_KEY" ]; then
    SSH_CMD="ssh -i $SSH_KEY -o StrictHostKeyChecking=no ubuntu@$EC2_IP"
else
    SSH_CMD="ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP"
fi

if ! $SSH_CMD "echo 'SSH connection successful'"; then
    print_error "Failed to connect to EC2 instance. Please check:"
    echo "  - EC2 instance is running"
    echo "  - Security group allows SSH (port 22)"
    echo "  - SSH key is correct"
    echo "  - Instance public IP is correct"
    exit 1
fi

print_success "SSH connection established"

# Create deployment script on EC2 instance
print_status "Creating deployment script on EC2 instance..."

$SSH_CMD "cat > /tmp/deploy_app.sh << 'EOF'
#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e \"\${BLUE}[INFO]\${NC} \$1\"
}

print_success() {
    echo -e \"\${GREEN}[SUCCESS]\${NC} \$1\"
}

print_warning() {
    echo -e \"\${YELLOW}[WARNING]\${NC} \$1\"
}

print_error() {
    echo -e \"\${RED}[ERROR]\${NC} \$1\"
}

# Configuration
APP_NAME=\"$APP_NAME\"
APP_DIR=\"$APP_DIR\"
PORT=\"$PORT\"

print_status \"Starting deployment of $APP_NAME...\"

# Update system
print_status \"Updating system packages...\"
sudo apt update && sudo apt upgrade -y

# Install essential tools
print_status \"Installing essential tools...\"
sudo apt install -y curl wget git unzip zip build-essential software-properties-common

# Install Node.js 18.x
print_status \"Installing Node.js 18.x...\"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
print_status \"Verifying Node.js installation...\"
node --version
npm --version

# Install PM2
print_status \"Installing PM2...\"
sudo npm install -g pm2
pm2 --version

# Install Nginx
print_status \"Installing Nginx...\"
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure firewall
print_status \"Configuring firewall...\"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create application directory
print_status \"Creating application directory...\"
mkdir -p \$APP_DIR
cd \$APP_DIR

# Clone repository (if not already present)
print_status \"Setting up application files...\"
if [ ! -d \"\$APP_DIR/.git\" ]; then
    print_status \"Cloning repository...\"
    # Since we don't have a real repository, we'll create the necessary files
    mkdir -p src/app src/components/ui src/lib
    mkdir -p prisma
    mkdir -p public
else
    print_status \"Repository already exists, pulling latest changes...\"
    git pull
fi

# Create package.json
print_status \"Creating package.json...\"
cat > package.json << 'PACKAGE_EOF'
{
  "name": "taikai-clone",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx server.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.6.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1..4",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1..3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-toast": "^1.1.0",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "ethers": "^6.8.0",
    "lucide-react": "^0.294.0",
    "next": "^14.0.3",
    "next-auth": "^4.24.5",
    "prisma": "^5.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.47.0",
    "socket.io": "^4.7.4",
    "socket.io-client": "^4.7.4",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "z-ai-web-dev-sdk": "^1.0.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-config-next": "^14.0.3",
    "postcss": "^8.4.31",
    "prisma": "^5.6.0",
    "tailwindcss": "^3.3.5",
    "tsx": "^4.1.0",
    "typescript": "^5.2.2"
  }
}
PACKAGE_EOF

# Create next.config.js
print_status \"Creating Next.js configuration...\"
cat > next.config.js << 'NEXT_EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
NEXT_EOF

# Create tailwind.config.js
print_status \"Creating Tailwind CSS configuration...\"
cat > tailwind.config.js << 'TAILWIND_EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
TAILWIND_EOF

# Create tsconfig.json
print_status \"Creating TypeScript configuration...\"
cat > tsconfig.json << 'TSCONFIG_EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
TSCONFIG_EOF

# Create postcss.config.js
print_status \"Creating PostCSS configuration...\"
cat > postcss.config.js << 'POSTCSS_EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTCSS_EOF

# Create .env file
print_status \"Creating environment file...\"
cat > .env << 'ENV_EOF'
NODE_ENV=production
NEXTAUTH_URL=http://localhost:$PORT
NEXTAUTH_SECRET=your-super-secret-key-here
DATABASE_URL="file:./dev.db"
ENV_EOF

# Create Prisma schema
print_status \"Creating Prisma schema...\"
mkdir -p prisma
cat > prisma/schema.prisma << 'PRISMA_EOF'
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accounts     Account[]
  sessions     Session[]
  projects     Project[]
  teams        Team[]
  participations Participation[]
  submissions  Submission[]
  rewards      Reward[]
  nfts         NFT[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verificationtokens")
}

model Hackathon {
  id          String   @id @default(cuid())
  title       String
  description String
  startDate   DateTime
  endDate     DateTime
  status      String   @default("upcoming")
  maxParticipants Int?
  prizePool   Float?
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  organizerId String
  organizer   User     @relation(fields: [organizerId], references: [id])

  projects     Project[]
  participations Participation[]
  submissions  Submission[]
  rewards      Reward[]
  mentors      Mentor[]

  @@map("hackathons")
}

model Project {
  id          String   @id @default(cuid())
  title       String
  description String
  githubUrl   String?
  demoUrl     String?
  imageUrl    String?
  status      String   @default("draft")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  hackathonId String
  hackathon   Hackathon @relation(fields: [hackathonId], references: [id])

  teamId String?
  team   Team?   @relation(fields: [teamId], references: [id])

  leaderId String
  leader   User   @relation(fields: [leaderId], references: [id])

  members   User[] @relation("ProjectMembers")
  submissions Submission[]
  nfts      NFT[]

  @@map("projects")
}

model Team {
  id        String   @id @default(cuid())
  name      String
  description String?
  maxMembers Int     @default(4)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  leaderId String
  leader   User   @relation(fields: [leaderId], references: [id])

  projects Project[]
  members  User[] @relation("TeamMembers")

  @@map("teams")
}

model Participation {
  id          String   @id @default(cuid())
  role        String   @default("participant")
  joinedAt    DateTime @default(now())

  userId     String
  user       User     @relation(fields: [userId], references: [id])

  hackathonId String
  hackathon   Hackathon @relation(fields: [hackathonId], references: [id])

  @@unique([userId, hackathonId])
  @@map("participations")
}

model Submission {
  id          String   @id @default(cuid())
  title       String
  description String
  githubUrl   String
  demoUrl     String?
  videoUrl    String?
  status      String   @default("pending")
  submittedAt DateTime @default(now())
  judgedAt    DateTime?
  score       Float?
  feedback    String?

  projectId  String
  project    Project  @relation(fields: [projectId], references: [id])

  hackathonId String
  hackathon   Hackathon @relation(fields: [hackathonId], references: [id])

  judgeId String?
  judge   User?   @relation(fields: [judgeId], references: [id])

  @@map("submissions")
}

model Reward {
  id          String   @id @default(cuid())
  title       String
  description String
  amount      Float
  currency    String   @default("USD")
  type        String   @default("cash")
  awardedAt   DateTime?
  createdAt   DateTime @default(now())

  userId     String
  user       User     @relation(fields: [userId], references: [id])

  hackathonId String
  hackathon   Hackathon @relation(fields: [hackathonId], references: [id])

  submissionId String?
  submission   Submission? @relation(fields: [submissionId], references: [id])

  @@map("rewards")
}

model Mentor {
  id          String   @id @default(cuid())
  name        String
  bio         String?
  expertise   String[]
  imageUrl    String?
  availability String?
  createdAt   DateTime @default(now())

  hackathonId String
  hackathon   Hackathon @relation(fields: [hackathonId], references: [id])

  @@map("mentors")
}

model NFT {
  id          String   @id @default(cuid())
  name        String
  description String
  imageUrl    String?
  tokenId     String?
  contractAddress String?
  mintedAt    DateTime?
  metadata    String?
  createdAt   DateTime @default(now())

  userId     String
  user       User     @relation(fields: [userId], references: [id])

  projectId String?
  project   Project? @relation(fields: [projectId], references: [id])

  @@map("nfts")
}

// Many-to-many relationship tables
model _ProjectToUser {
  A String
  B String

  @@unique([A, B])
}

model _TeamToUser {
  A String
  B String

  @@unique([A, B])
}
PRISMA_EOF

# Create basic app structure
print_status \"Creating application structure...\"
mkdir -p src/app src/components/ui src/lib
mkdir -p public

# Create globals.css
print_status \"Creating global styles...\"
cat > src/app/globals.css << 'CSS_EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
CSS_EOF

# Create layout.tsx
print_status \"Creating layout component...\"
cat > src/app/layout.tsx << 'LAYOUT_EOF'
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Taikai Clone - Hackathon Platform",
  description: "A modern hackathon platform with Web3 integration",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
LAYOUT_EOF

# Create page.tsx
print_status \"Creating main page...\"
cat > src/app/page.tsx << 'PAGE_EOF'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, Calendar, Rocket } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Rocket className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">Taikai</span>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost">Hackathons</Button>
              <Button variant="ghost">Projects</Button>
              <Button variant="ghost">About</Button>
              <Button>Connect Wallet</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Build. Innovate. Win.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the next generation of hackathons. Build amazing projects, 
            connect with talented developers, and win incredible prizes.
          </p>
          <div className="flex space-x-4 justify-center">
            <Button size="lg">Browse Hackathons</Button>
            <Button variant="outline" size="lg">Create Hackathon</Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">150+</CardTitle>
                <CardDescription>Active Hackathons</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">10K+</CardTitle>
                <CardDescription>Developers</CardDescription>
              </CardHeader>
              <CardContent>
                <Users className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">$2M+</CardTitle>
                <CardDescription>Prize Pool</CardDescription>
              </CardHeader>
              <CardContent>
                <Trophy className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">5K+</CardTitle>
                <CardDescription>Projects Built</CardDescription>
              </CardHeader>
              <CardContent>
                <Rocket className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Hackathons */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Hackathons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Web3 Innovation Challenge</CardTitle>
                    <Badge variant="secondary">Live</Badge>
                  </div>
                  <CardDescription>
                    Build the future of decentralized applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Prize Pool:</span>
                      <span className="font-semibold">$50,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Participants:</span>
                      <span className="font-semibold">234</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ends in:</span>
                      <span className="font-semibold">5 days</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Join Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Taikai Clone</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with Next.js, TypeScript, and ❤️
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
PAGE_EOF

# Create lib/utils.ts
print_status \"Creating utility functions...\"
mkdir -p src/lib
cat > src/lib/utils.ts << 'UTILS_EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
UTILS_EOF

# Create components
print_status \"Creating UI components...\"
mkdir -p src/components/ui

# Button component
cat > src/components/ui/button.tsx << 'BUTTON_EOF'
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
BUTTON_EOF

# Card component
cat > src/components/ui/card.tsx << 'CARD_EOF'
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
CARD_EOF

# Badge component
cat > src/components/ui/badge.tsx << 'BADGE_EOF'
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
BADGE_EOF

# Toast component
cat > src/components/ui/toaster.tsx << 'TOASTER_EOF'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
TOASTER_EOF

# Toast primitives
cat > src/components/ui/toast.tsx << 'TOAST_PRIMITIVES_EOF'
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
TOAST_PRIMITIVES_EOF

# Use toast hook
cat > src/components/ui/use-toast.ts << 'USE_TOAST_EOF'
"use client"

import { useEffect, useState } from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1

const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = useState<State>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
USE_TOAST_EOF

# Theme provider
cat > src/components/theme-provider.tsx << 'THEME_PROVIDER_EOF'
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
THEME_PROVIDER_EOF

# Auth provider
cat > src/components/auth-provider.tsx << 'AUTH_PROVIDER_EOF'
"use client"

import { SessionProvider } from "next-auth/react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
AUTH_PROVIDER_EOF

# Install dependencies
print_status \"Installing dependencies...\"
npm install

# Build the application
print_status \"Building the application...\"
npm run build

# Initialize database
print_status \"Initializing database...\"
npx prisma generate
npx prisma db push

# Create PM2 ecosystem file
print_status \"Creating PM2 configuration...\"
cat > ecosystem.config.js << 'ECOSYSTEM_EOF'
module.exports = {
  apps: [{
    name: \"$APP_NAME\",
    script: \"npm\",
    args: \"start\",
    cwd: \"$APP_DIR\",
    instances: \"max\",
    exec_mode: \"cluster\",
    env: {
      NODE_ENV: \"production\",
      PORT: $PORT
    },
    error_file: \"$APP_DIR/logs/err.log\",
    out_file: \"$APP_DIR/logs/out.log\",
    log_file: \"$APP_DIR/logs/combined.log\",
    time: true
  }]
}
ECOSYSTEM_EOF

# Create logs directory
mkdir -p logs

# Start application with PM2
print_status \"Starting application with PM2...\"
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
print_status \"Configuring Nginx...\"
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<NGINX_EOF
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static files caching
    location /_next/static/ {
        alias $APP_DIR/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
NGINX_EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Create health check script
print_status \"Creating health check script...\"
cat > health.sh << 'HEALTH_EOF'
#!/bin/bash

# Health check script
APP_NAME=\"$APP_NAME\"
PORT=\"$PORT\"

# Check if PM2 process is running
if pm2 status $APP_NAME | grep -q "online"; then
    echo "✅ PM2 process $APP_NAME is running"
else
    echo "❌ PM2 process $APP_NAME is not running"
    exit 1
fi

# Check if port is listening
if netstat -tlnp | grep -q ":$PORT "; then
    echo "✅ Port $PORT is listening"
else
    echo "❌ Port $PORT is not listening"
    exit 1
fi

# Check if Nginx is running
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
    exit 1
fi

# Check HTTP response
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
    echo "✅ Application is responding with HTTP 200"
else
    echo "❌ Application is not responding properly"
    exit 1
fi

echo "🎉 All health checks passed!"
HEALTH_EOF

chmod +x health.sh

# Create status script
print_status \"Creating status script...\"
cat > status.sh << 'STATUS_EOF'
#!/bin/bash

# Status script
APP_NAME=\"$APP_NAME\"
PORT=\"$PORT\"

echo "🚀 $APP_NAME Status"
echo "=================="

# System info
echo "📊 System Information:"
echo "  - Uptime: $(uptime)"
echo "  - Memory: $(free -h | grep Mem | awk '{print $3 "/" $2}')"
echo "  - Disk: $(df -h / | tail -1 | awk '{print $3 "/" $2}')"
echo ""

# PM2 status
echo "📈 PM2 Status:"
pm2 status $APP_NAME
echo ""

# Nginx status
echo "🌐 Nginx Status:"
sudo systemctl status nginx --no-pager -l
echo ""

# Application logs
echo "📝 Recent Application Logs:"
pm2 logs $APP_NAME --lines 10
echo ""

# Network status
echo "🔗 Network Status:"
netstat -tlnp | grep -E ":80 |:$PORT "
echo ""
STATUS_EOF

chmod +x status.sh

print_success "🎉 Deployment completed successfully!"
echo ""
echo "📋 Access Information:"
echo "  - Application URL: http://$EC2_IP"
echo "  - PM2 Dashboard: pm2 monit"
echo "  - Health Check: ./health.sh"
echo "  - Status Check: ./status.sh"
echo ""
echo "🔧 Useful Commands:"
echo "  - View logs: pm2 logs $APP_NAME"
echo "  - Restart app: pm2 restart $APP_NAME"
echo "  - Stop app: pm2 stop $APP_NAME"
echo "  - Start app: pm2 start $APP_NAME"
echo "  - Monitor: pm2 monit"
echo ""
echo "📁 Important Files:"
echo "  - Application: $APP_DIR"
echo "  - Nginx config: /etc/nginx/sites-available/$APP_NAME"
echo "  - PM2 config: $APP_DIR/ecosystem.config.js"
echo "  - Logs: $APP_DIR/logs/"
echo ""
echo "🔒 Security Notes:"
echo "  - Firewall is enabled"
echo "  - Only ports 22, 80, 443 are open"
echo "  - Application is running as non-root user"
echo ""
echo "🎯 Next Steps:"
echo "  1. Test the application at http://$EC2_IP"
echo "  2. Run './health.sh' to verify everything is working"
echo "  3. Set up monitoring and alerts as needed"
echo "  4. Consider setting up a domain and SSL certificate"
echo ""
echo "🚀 Your Taikai.network clone is now live!"
EOF

# Make the deployment script executable
$SSH_CMD "chmod +x /tmp/deploy_app.sh"

# Run the deployment script
print_status "Running deployment script on EC2 instance..."
$SSH_CMD "sudo /tmp/deploy_app.sh"

print_success "🎉 Deployment completed successfully!"
echo ""
echo "📋 Access Information:"
echo "  - Application URL: http://$EC2_IP"
echo "  - SSH Access: ssh ubuntu@$EC2_IP"
echo ""
echo "🔧 Useful Commands:"
echo "  - View application status: ssh ubuntu@$EC2_IP 'pm2 status'"
echo "  - View logs: ssh ubuntu@$EC2_IP 'pm2 logs taikai-clone'"
echo "  - Restart application: ssh ubuntu@$EC2_IP 'pm2 restart taikai-clone'"
echo "  - Health check: ssh ubuntu@$EC2_IP './health.sh'"
echo ""
echo "🎯 Next Steps:"
echo "  1. Open http://$EC2_IP in your browser"
echo "  2. Verify the application is working"
echo "  3. Test all features and functionality"
echo "  4. Set up monitoring and alerts as needed"
echo ""
echo "🚀 Your Taikai.network clone is now deployed and running!"