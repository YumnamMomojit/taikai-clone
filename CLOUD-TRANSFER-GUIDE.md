# 🚀 Cloud Transfer Guide: Next.js Hackerthon Platform

## 📋 Overview
This guide will walk you through transferring your Next.js hackerthon platform to the cloud. We'll cover the most popular cloud providers with step-by-step instructions.

## 🎯 Recommended Cloud Providers

### 1. **AWS EC2** (Most Popular)
- ✅ Reliable and scalable
- ✅ Free tier available
- ✅ Global infrastructure
- ✅ Comprehensive services

### 2. **DigitalOcean** (Easiest)
- ✅ Simple to use
- ✅ Affordable pricing
- ✅ Developer-friendly
- ✅ Good documentation

### 3. **Google Cloud Platform** (Advanced)
- ✅ Advanced features
- ✅ Google integration
- ✅ Machine learning tools

---

## 🛠 Option 1: AWS EC2 Deployment

### Step 1: Create AWS Account
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Follow the registration process
4. Add payment method (required for free tier)

### Step 2: Launch EC2 Instance

#### 2.1 Go to EC2 Dashboard
1. Login to AWS Console
2. Search for "EC2" and select it
3. Click "Launch Instance"

#### 2.2 Configure Instance
- **Name**: `hackerthon-platform`
- **AMI**: Ubuntu Server 22.04 LTS
- **Instance Type**: `t2.micro` (Free tier) or `t3.small` (Recommended)
- **Key Pair**: Create new key pair (download .pem file)

#### 2.3 Configure Security Group
Click "Edit security groups" and add:
- **SSH**: Port 22 (Your IP only)
- **HTTP**: Port 80 (Anywhere)
- **HTTPS**: Port 443 (Anywhere)

#### 2.4 Launch Instance
1. Click "Launch Instance"
2. Wait for instance to be running
3. Note the Public IP address

### Step 3: Connect to Server

#### 3.1 Connect via SSH
```bash
# Set permissions for key file
chmod 400 your-key-pair.pem

# Connect to server
ssh -i your-key-pair.pem ubuntu@your-public-ip
```

#### 3.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Step 4: Deploy Application

#### 4.1 Install Dependencies
```bash
# Install Node.js and Nginx
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Install PM2
sudo npm install -g pm2
```

#### 4.2 Clone Your Project
```bash
# Clone your repository (replace with your repo URL)
git clone https://github.com/your-username/hackerthon-platform.git
cd hackerthon-platform

# Install dependencies
npm install

# Build the project
npm run build
```

#### 4.3 Setup Environment
```bash
# Copy environment example
cp .env.production.example .env.production

# Edit environment file
nano .env.production
```

Add your configuration:
```env
NODE_ENV="production"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="https://your-domain.com"
DATABASE_URL="file:./dev.db"
ZAI_API_KEY="your-z-ai-api-key"
```

#### 4.4 Start Application
```bash
# Start with PM2
pm2 start npm --name "hackerthon-platform" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 5: Configure Nginx

#### 5.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/hackerthon-platform
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
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

#### 5.2 Enable Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/hackerthon-platform /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6: Setup SSL Certificate

#### 6.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### 6.2 Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### 6.3 Setup Auto-renewal
```bash
sudo crontab -e
```

Add this line:
```cron
0 12 * * * /usr/bin/certbot renew --quiet
```

### Step 7: Configure Domain

#### 7.1 Update DNS
1. Go to your domain registrar
2. Go to DNS management
3. Add A record:
   - **Name**: `@` or `your-domain.com`
   - **Value**: Your EC2 public IP
4. Add CNAME record:
   - **Name**: `www`
   - **Value**: `your-domain.com`

#### 7.2 Wait for Propagation
DNS changes can take 24-48 hours to propagate.

---

## 🌊 Option 2: DigitalOcean Deployment

### Step 1: Create DigitalOcean Account
1. Go to [digitalocean.com](https://digitalocean.com)
2. Sign up for an account
3. Add payment method
4. Get $200 free credit (usually available)

### Step 2: Create Droplet

#### 2.1 Create Droplet
1. Click "Create" → "Droplets"
2. Choose image: **Ubuntu 22.04 LTS**
3. Choose plan: **Basic** → **Regular Intel** → **$6/month** (or higher)
4. Choose datacenter region (closest to your users)
5. Authentication: **SSH Key** (add your SSH key)
6. Finalize: **1 Droplet** → **Create Droplet**

### Step 3: Connect and Deploy

#### 3.1 Connect to Droplet
```bash
ssh root@your-droplet-ip
```

#### 3.2 Follow Same Steps as AWS
Follow steps 3-7 from the AWS EC2 guide above.

---

## 🔧 Option 3: Using Our Automated Scripts

### Quick Setup with Scripts

#### 1. Download Scripts
```bash
# On your server
wget https://raw.githubusercontent.com/your-username/hackerthon-platform/main/deploy.sh
wget https://raw.githubusercontent.com/your-username/hackerthon-platform/main/setup-env.sh
wget https://raw.githubusercontent.com/your-username/hackerthon-platform/main/ssl-setup.sh
```

#### 2. Make Scripts Executable
```bash
chmod +x deploy.sh setup-env.sh ssl-setup.sh
```

#### 3. Run Deployment
```bash
sudo ./deploy.sh
```

The script will:
- Update system
- Install dependencies
- Clone your project
- Setup environment
- Configure Nginx
- Setup SSL
- Start application

---

## 📊 Post-Deployment Checklist

### ✅ Verify Deployment
```bash
# Check application status
pm2 status

# Check application logs
pm2 logs hackerthon-platform

# Check Nginx status
sudo systemctl status nginx

# Check SSL certificate
sudo certbot certificates
```

### ✅ Test Website
1. Visit `http://your-domain.com` (should redirect to HTTPS)
2. Visit `https://your-domain.com`
3. Test all pages and features
4. Test mobile responsiveness

### ✅ Setup Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop

# Monitor system resources
htop

# Monitor application
pm2 monit
```

### ✅ Setup Backups
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
APP_DIR="/home/ubuntu/hackerthon-platform"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C $APP_DIR .
cp $APP_DIR/dev.db $BACKUP_DIR/database_$DATE.db
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
echo "Backup completed: $DATE"
EOF

chmod +x backup.sh

# Add to crontab
echo "0 2 * * * /home/ubuntu/hackerthon-platform/backup.sh" | crontab -
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Application Not Starting
```bash
# Check Node.js version
node --version

# Check if port 3000 is available
sudo netstat -tulpn | grep :3000

# Check PM2 logs
pm2 logs hackerthon-platform
```

#### 2. Nginx 502 Error
```bash
# Check if application is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

#### 3. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Force renew certificate
sudo certbot renew --force-renewal

# Check Nginx configuration
sudo nginx -t
```

#### 4. Domain Not Resolving
```bash
# Check DNS propagation
nslookup your-domain.com

# Check domain registrar settings
# Ensure A record points to correct IP
```

---

## 📈 Cost Optimization

### AWS EC2 Cost Tips
- Use **t2.micro** for free tier (750 hours/month)
- Use **t3.small** for better performance (~$15/month)
- Enable **Auto Scaling** for traffic spikes
- Use **Spot Instances** for cost savings

### DigitalOcean Cost Tips
- Start with **$6/month** droplet
- Enable **Backups** ($1/month)
- Monitor bandwidth usage
- Use **Floating IPs** for easy migration

---

## 🎯 Final Steps

### 1. **Test Everything**
- All pages load correctly
- Forms work properly
- Database connections work
- Web3 features function
- Mobile responsiveness

### 2. **Setup Monitoring**
- Application health checks
- Server resource monitoring
- Error tracking
- Performance metrics

### 3. **Document Everything**
- Save all credentials securely
- Document deployment process
- Create maintenance procedures
- Setup emergency contacts

### 4. **Go Live!**
- Announce your platform
- Monitor traffic
- Gather user feedback
- Plan for scaling

---

## 📞 Support Resources

### Documentation
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [DigitalOcean Documentation](https://docs.digitalocean.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/)

### Communities
- Stack Overflow
- Reddit r/webdev
- Discord communities
- GitHub issues

### Tools
- **Monitoring**: PM2, htop, Netdata
- **Logging**: pm2 logs, journalctl
- **Security**: UFW, Fail2ban
- **Backup**: rsync, cron jobs

---

**🎉 Congratulations!** Your Next.js hackerthon platform is now ready for cloud deployment. Choose your preferred provider and follow the steps above to get your platform live!