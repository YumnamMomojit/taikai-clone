# Deployment Guide: Taikai.network Clone on Ubuntu EC2

This guide provides comprehensive, step-by-step instructions for deploying the hackathon platform application to an AWS EC2 instance running Ubuntu Server.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [EC2 Instance Setup](#ec2-instance-setup)
3. [Server Environment Configuration](#server-environment-configuration)
4. [Database Setup (PostgreSQL)](#database-setup-postgresql)
5. [Application Deployment](#application-deployment)
6. [Running with PM2](#running-with-pm2)
7. [Nginx Reverse Proxy](#nginx-reverse-proxy)
8. [Securing with SSL (Let's Encrypt)](#securing-with-ssl-lets-encrypt)
9. [Managing Environment Variables](#managing-environment-variables)
10. [Security, Monitoring, and Maintenance](#security-monitoring-and-maintenance)


## Prerequisites

Before starting the deployment, ensure you have:

- An AWS account with permissions to create EC2 instances.
- A registered domain name.
- Basic knowledge of the Linux command line.


## EC2 Instance Setup

### 1. Launch EC2 Instance

1. **Log in to AWS Console** and navigate to EC2.
2. **Click "Launch Instance"**.
3. **Choose AMI**: Select `Ubuntu Server 22.04 LTS`.
4. **Choose Instance Type**: 
   - **Development**: `t2.micro` (Free tier eligible).
   - **Production**: `t3.small` or larger is recommended.
5. **Security Group**: Create a new security group with the following inbound rules:
   ```
   Type        Protocol Port Range Source      Description
   --------------------------------------------------------------------
   SSH         TCP      22         Your IP     Allow SSH access from your IP
   HTTP        TCP      80         0.0.0.0/0   Allow HTTP for Let's Encrypt
   HTTPS       TCP      443        0.0.0.0/0   Allow HTTPS for web traffic
   ```
6. **Key Pair**: Create or use an existing key pair for SSH access.
7. **Launch Instance**.

### 2. Associate an Elastic IP

To prevent the server's public IP from changing on reboot, associate an Elastic IP with your instance from the EC2 dashboard.

### 3. Configure DNS

Go to your domain registrar's DNS settings and create an `A` record pointing your domain (e.g., `yourdomain.com`) to the Elastic IP address of your EC2 instance.

### 4. Connect to EC2 Instance

```bash
# Connect via SSH
ssh -i /path/to/your-key.pem ubuntu@your-elastic-ip

# Update system packages
sudo apt update && sudo apt upgrade -y
```

---

## Server Environment Configuration

### 1. Install Essential Packages
```bash
sudo apt install -y curl wget git build-essential nginx
```

### 2. Install Node.js using NVM
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc

# Install Node.js 18 LTS
nvm install 18
nvm use 18
```

### 3. Install PM2 (Process Manager)
```bash
# Install PM2 globally
sudo npm install -g pm2
```

---

## Database Setup (PostgreSQL)

For a production environment, PostgreSQL is highly recommended for its robustness and scalability.

### 1. Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User
```bash
# Access the PostgreSQL prompt
sudo -u postgres psql

# Run these SQL commands
CREATE DATABASE hackathondb;
CREATE USER hackathonuser WITH ENCRYPTED PASSWORD 'your-super-strong-password';
GRANT ALL PRIVILEGES ON DATABASE hackathondb TO hackathonuser;
\q
```

### 3. Update Prisma Schema

In your local project codebase, open `prisma/schema.prisma` and update the datasource provider to `postgresql`.

```prisma
datasource db {
  provider = "postgresql" // Change this from "sqlite"
  url      = env("DATABASE_URL")
}
```
**Commit and push this change to your Git repository.**

---

## Application Deployment

### 1. Clone the Repository
```bash
# Clone your repository
git clone https://github.com/your-username/your-repo.git hackathon-platform
cd hackathon-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file by copying the example and filling in your values.
```bash
# Create the .env file
nano .env
```
See [Part 9: Managing Environment Variables](#managing-environment-variables) for the full template. **Ensure your `DATABASE_URL` is set correctly.**

### 4. Run Database Migrations
```bash
# Apply the schema to the new PostgreSQL database
npx prisma migrate deploy
```

### 5. Build the Application
```bash
npm run build
```

---

## Running with PM2

### 1. Create Logs Directory
The provided `pm2.config.js` expects a `logs` directory.
```bash
mkdir logs
```

### 2. Start the Application
```bash
# Start the app using the config file
pm2 start pm2.config.js
```

### 3. Save and Automate Startup
```bash
# Save the process list
pm2 save

# Create a startup script to run on server boot
pm2 startup
# (Follow the command's output to complete)
```

---

## Nginx Reverse Proxy

### 1. Create Nginx Configuration
```bash
# Create a new Nginx config file
sudo nano /etc/nginx/sites-available/hackathon-platform
```
Paste the following configuration, replacing `yourdomain.com` with your domain.

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certs will be added by Certbot in the next step

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Enable the Nginx Site
```bash
# Enable the new site by creating a symlink
sudo ln -s /etc/nginx/sites-available/hackathon-platform /etc/nginx/sites-enabled/

# Test the configuration for syntax errors
sudo nginx -t

# Restart Nginx to apply changes
sudo systemctl restart nginx
```

---

## Securing with SSL (Let's Encrypt)

### 1. Install Certbot
```bash
# Install Certbot and the Nginx plugin
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain an SSL Certificate
```bash
# Run Certbot to get a cert and auto-configure Nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot will ask a few questions and, upon success, will automatically edit your Nginx configuration to include the SSL certificate and set up a cron job for automatic renewal.

---

## Managing Environment Variables

Create a `.env` file in the root of the project on the server. **Never commit this file to Git.**

```env
# .env

# --- Database ---
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://hackathonuser:your-super-strong-password@localhost:5432/hackathondb"

# --- NextAuth ---
# Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET="your-32-byte-random-string-here"
NEXTAUTH_URL="https://yourdomain.com"

# --- Application ---
NODE_ENV="production"
PORT="3000"

# --- Web3 (Optional) ---
# Add any other required secrets or API keys
# ETHEREUM_RPC_URL="https://mainnet.infura.io/v3/YOUR_PROJECT_ID"
# TOKEN_CONTRACT_ADDRESS="0x..."
```

---

## Security, Monitoring, and Maintenance

The previous version of this guide contained excellent, detailed sections on security, monitoring, and maintenance. These practices are highly recommended for any production server. Please refer to a dedicated server administration guide for in-depth tutorials on:

- **Firewall Configuration (`ufw`)**: Restricting ports to only what's necessary.
- **Security Hardening**: Disabling password-based SSH, setting up `fail2ban`.
- **Monitoring**: Using `htop`, `pm2 monit`, and setting up log rotation.
- **Backups**: Creating regular backups of your database and application files.

Your application is now deployed and accessible at `https://yourdomain.com`.