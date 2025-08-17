# 🚀 Taikai.network Clone - EC2 Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Application Deployment](#application-deployment)
4. [Nginx Configuration](#nginx-configuration)
5. [SSL Certificate Setup](#ssl-certificate-setup)
6. [Process Management](#process-management)
7. [Environment Variables](#environment-variables)
8. [Security Best Practices](#security-best-practices)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)

## 🔧 Prerequisites

### Before Starting
- EC2 instance with Ubuntu Server 22.04 LTS
- Domain name pointed to your EC2 instance
- SSH access to your EC2 instance
- Basic knowledge of Linux command line

### System Requirements
- **Instance Type**: t3.medium or larger (recommended)
- **Storage**: 30GB SSD or more
- **RAM**: 4GB minimum, 8GB recommended
- **Ports**: 22 (SSH), 80 (HTTP), 443 (HTTPS)

## 🖥️ Server Setup

### 1. Connect to Your EC2 Instance
```bash
# Connect via SSH
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-ip

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git unzip zip build-essential
```

### 2. Install Node.js and npm
```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x
```

### 3. Install PM2 (Process Manager)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify PM2 installation
pm2 --version
```

### 4. Install Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify Nginx status
sudo systemctl status nginx
```

## 📦 Application Deployment

### 1. Clone Your Repository
```bash
# Navigate to home directory
cd ~

# Clone your repository (replace with your actual repo URL)
git clone https://github.com/your-username/taikai-clone.git

# Navigate to project directory
cd taikai-clone
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install additional dependencies if needed
npm install pm2 -g
```

### 3. Build the Application
```bash
# Build the Next.js application
npm run build

# Verify build success
ls -la .next/
```

### 4. Configure Environment Variables
```bash
# Create environment file
cp .env.example .env

# Edit environment variables
nano .env
```

Add your environment variables:
```env
# Application
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret

# Database
DATABASE_URL="file:./dev.db"

# Web3 (if using)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-project-id
```

## 🌐 Nginx Configuration

### 1. Create Nginx Configuration File
```bash
# Create Nginx config file
sudo nano /etc/nginx/sites-available/taikai-clone
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (will be added in next step)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to Next.js application
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

    # Static files caching
    location /_next/static/ {
        alias /home/ubuntu/taikai-clone/.next/static/;
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
```

### 2. Enable the Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/taikai-clone /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If successful, reload Nginx
sudo systemctl reload nginx
```

## 🔒 SSL Certificate Setup

### 1. Install Certbot
```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

### 2. Obtain SSL Certificate
```bash
# Obtain and install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts to complete the installation
```

### 3. Verify SSL Certificate
```bash
# Test certificate renewal
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates
```

### 4. Set Up Auto-Renewal
```bash
# Add cron job for auto-renewal
sudo crontab -e

# Add the following line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔄 Process Management

### 1. Create PM2 Configuration
```bash
# Create ecosystem.config.js file
nano ecosystem.config.js
```

Add the following configuration:
```javascript
module.exports = {
  apps: [{
    name: 'taikai-clone',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/taikai-clone',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/ubuntu/taikai-clone/logs/err.log',
    out_file: '/home/ubuntu/taikai-clone/logs/out.log',
    log_file: '/home/ubuntu/taikai-clone/logs/combined.log',
    time: true
  }]
};
```

### 2. Create Logs Directory
```bash
# Create logs directory
mkdir -p /home/ubuntu/taikai-clone/logs
```

### 3. Start Application with PM2
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### 4. Monitor Application
```bash
# Check application status
pm2 status

# View logs
pm2 logs taikai-clone

# Monitor resources
pm2 monit
```

## 🔧 Environment Variables

### 1. Production Environment Setup
```bash
# Create production environment file
nano .env.production
```

Add production-specific variables:
```env
# Application Configuration
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-here

# Database Configuration
DATABASE_URL="file:./production.db"

# Web3 Configuration (if applicable)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id
NEXT_PUBLIC_INFURA_ID=your-infura-project-id

# Email Configuration (if applicable)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com

# Security Configuration
CORS_ORIGIN=https://your-domain.com
```

### 2. Secure Your Environment
```bash
# Set proper permissions
chmod 600 .env .env.production

# Add to .gitignore if not already there
echo ".env*" >> .gitignore
```

## 🔒 Security Best Practices

### 1. Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Check firewall status
sudo ufw status
```

### 2. SSH Security
```bash
# Disable root login
sudo nano /etc/ssh/sshd_config

# Change: PermitRootLogin yes to PermitRootLogin no
# Change: PasswordAuthentication yes to PasswordAuthentication no

# Restart SSH service
sudo systemctl restart sshd
```

### 3. System Updates and Security
```bash
# Install security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Set up automatic security updates
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

### 4. Application Security
```bash
# Install fail2ban for intrusion prevention
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📊 Monitoring and Maintenance

### 1. Set Up Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Create monitoring script
nano monitor.sh
```

Add monitoring script:
```bash
#!/bin/bash

# System monitoring script
echo "=== System Monitoring ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Memory Usage:"
free -h
echo "Disk Usage:"
df -h
echo "Process Status:"
pm2 status
echo "Nginx Status:"
sudo systemctl status nginx --no-pager
```

### 2. Log Management
```bash
# Set up log rotation
sudo nano /etc/logrotate.d/taikai-clone
```

Add log rotation configuration:
```bash
/home/ubuntu/taikai-clone/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
}
```

### 3. Backup Strategy
```bash
# Create backup script
nano backup.sh
```

Add backup script:
```bash
#!/bin/bash

# Backup script
BACKUP_DIR="/home/ubuntu/backups"
APP_DIR="/home/ubuntu/taikai-clone"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C $APP_DIR .

# Backup database
cp $APP_DIR/production.db $BACKUP_DIR/db_backup_$DATE.db

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.db" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### 4. Performance Optimization
```bash
# Optimize Node.js performance
echo 'export NODE_OPTIONS="--max-old-space-size=4096"' >> ~/.bashrc

# Optimize system limits
echo '* soft nofile 65536' | sudo tee -a /etc/security/limits.conf
echo '* hard nofile 65536' | sudo tee -a /etc/security/limits.conf
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] EC2 instance is running and accessible
- [ ] Domain name is pointed to EC2 IP
- [ ] SSH access is configured
- [ ] All prerequisites are installed

### Deployment
- [ ] Repository is cloned to server
- [ ] Dependencies are installed
- [ ] Application is built successfully
- [ ] Environment variables are configured
- [ ] Nginx is configured and running
- [ ] SSL certificate is installed
- [ ] PM2 is configured and application is running

### Post-Deployment
- [ ] Application is accessible via HTTPS
- [ ] All pages are loading correctly
- [ ] Database connections are working
- [ ] Authentication is functioning
- [ ] Web3 features are working (if applicable)
- [ ] Monitoring is set up
- [ ] Backup strategy is implemented
- [ ] Security measures are in place

## 🆘 Troubleshooting

### Common Issues

#### 1. Application Not Starting
```bash
# Check PM2 logs
pm2 logs taikai-clone

# Check Node.js version
node --version

# Check port availability
sudo netstat -tulpn | grep :3000
```

#### 2. Nginx Configuration Issues
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Reload Nginx
sudo systemctl reload nginx
```

#### 3. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Force renew certificate
sudo certbot renew --force-renewal

# Check certificate files
ls -la /etc/letsencrypt/live/your-domain.com/
```

#### 4. Database Issues
```bash
# Check database file
ls -la /home/ubuntu/taikai-clone/production.db

# Check database permissions
ls -la /home/ubuntu/taikai-clone/

# Test database connection
sqlite3 /home/ubuntu/taikai-clone/production.db ".tables"
```

### Getting Help

If you encounter any issues:
1. Check the logs in `/home/ubuntu/taikai-clone/logs/`
2. Review Nginx error logs in `/var/log/nginx/error.log`
3. Check system logs with `journalctl -xe`
4. Verify all services are running with `systemctl status`
5. Consult the official documentation for each component

---

## 🎉 Congratulations!

Your Taikai.network clone is now deployed and running on your EC2 instance! 

### Next Steps:
1. **Test thoroughly**: Ensure all features work as expected
2. **Set up monitoring**: Configure alerts for critical issues
3. **Implement CI/CD**: Set up automated deployment pipelines
4. **Scale as needed**: Monitor performance and scale resources accordingly
5. **Regular maintenance**: Keep your system updated and secure

Your platform is now ready to host hackathons with full Web3 integration! 🚀