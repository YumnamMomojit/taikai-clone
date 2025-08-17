# Taikai.network Clone - EC2 Deployment Guide (No Domain)

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [EC2 Instance Setup](#ec2-instance-setup)
3. [Server Configuration](#server-configuration)
4. [Node.js Environment Setup](#nodejs-environment-setup)
5. [Application Deployment](#application-deployment)
6. [Nginx Configuration](#nginx-configuration)
7. [Self-Signed SSL Certificate Setup](#self-signed-ssl-certificate-setup)
8. [Process Management](#process-management)
9. [Security Hardening](#security-hardening)
10. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

Before starting the deployment, ensure you have:

- AWS account with appropriate permissions
- Basic knowledge of Linux command line
- SSH access to the EC2 instance
- EC2 public IP address (will be used instead of domain)

## EC2 Instance Setup

### 1. Launch EC2 Instance

1. **Log in to AWS Console** and navigate to EC2
2. **Click "Launch Instance"**
3. **Choose AMI**: Ubuntu Server 22.04 LTS (64-bit x86)
4. **Choose Instance Type**: 
   - **Development**: t2.micro (Free tier eligible)
   - **Production**: t3.medium or larger (recommended for production)
5. **Configure Instance**:
   - **VPC**: Default or custom VPC
   - **Subnet**: Public subnet
   - **Auto-assign Public IP**: Enable
   - **Storage**: 30 GB SSD (minimum)

6. **Security Group**:
   ```bash
   # Inbound Rules
   Type        Protocol Port Range Source         Description
   SSH         TCP      22         0.0.0.0/0      Allow SSH access
   HTTP        TCP      80         0.0.0.0/0      Allow HTTP
   HTTPS       TCP      443        0.0.0.0/0      Allow HTTPS
   Custom TCP  TCP      3000       0.0.0.0/0      Development server
   ```

7. **Key Pair**: Create or use existing key pair for SSH access
8. **Launch Instance**

### 2. Connect to EC2 Instance

```bash
# Connect via SSH
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-ip

# Update system packages
sudo apt update && sudo apt upgrade -y
```

## Server Configuration

### 1. Basic System Setup

```bash
# Set hostname (replace with your domain)
sudo hostnamectl set-hostname hackathon-platform

# Create application user
sudo adduser --system --group --home /opt/hackathon-platform appuser

# Install essential packages
sudo apt install -y curl wget git build-essential
```

### 2. Firewall Configuration

```bash
# Install UFW (Uncomplicated Firewall)
sudo apt install -y ufw

# Configure firewall rules
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 3000/tcp  # For development access

# Enable firewall
sudo ufw enable
```

## Node.js Environment Setup

### 1. Install Node.js and npm

```bash
# Install Node.js 18 LTS using NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Activate NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install Node.js 18 LTS
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version
npm --version
```

### 2. Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
mkdir -p /opt/hackathon-platform
```

## Application Deployment

### 1. Clone and Setup Application

```bash
# Switch to application directory
cd /opt/hackathon-platform

# Clone your repository (replace with your repo URL)
sudo git clone https://github.com/yourusername/taikai-clone.git .

# Set ownership
sudo chown -R appuser:appuser /opt/hackathon-platform

# Install dependencies
npm install

# Build the application
npm run build
```

### 2. Environment Configuration

```bash
# Create environment file
sudo nano .env

# Add the following configuration (modify as needed):
```

```env
# Application Settings
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database Settings (SQLite for this project)
DATABASE_URL="file:./db/custom.db"

# NextAuth Settings
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://your-ec2-public-ip"

# Web3 Settings (if using)
ETHEREUM_RPC_URL="https://mainnet.infura.io/v3/YOUR-PROJECT-ID"
CONTRACT_ADDRESS="0xYourContractAddress"

# Optional: Analytics and Monitoring
GOOGLE_ANALYTICS_ID="UA-XXXXXXXXX-X"
SENTRY_DSN="your-sentry-dsn"
```

### 3. Database Setup

```bash
# Create database directory
mkdir -p db

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Set proper permissions
sudo chown -R appuser:appuser db/
```

### 4. Create PM2 Configuration

```bash
# Create ecosystem file
sudo nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'hackathon-platform',
    script: 'npm',
    args: 'start',
    cwd: '/opt/hackathon-platform',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/hackathon-error.log',
    out_file: '/var/log/pm2/hackathon-out.log',
    log_file: '/var/log/pm2/hackathon-combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

### 5. Start Application

```bash
# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown appuser:appuser /var/log/pm2

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Nginx Configuration

### 1. Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Configure Nginx for the Application (IP-based)

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/hackathon-platform
```

```nginx
server {
    listen 80;
    server_name your-ec2-public-ip _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate max-age=0 auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # Main application
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Security: Block access to sensitive files
    location ~* \.(env|log|conf)$ {
        deny all;
        return 404;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://localhost:3000/api/health;
    }
}

# HTTPS server with self-signed certificate (optional but recommended for Web3)
server {
    listen 443 ssl http2;
    server_name your-ec2-public-ip _;

    # Self-signed SSL certificate (will be generated in next section)
    ssl_certificate /etc/nginx/ssl/hackathon-platform.crt;
    ssl_certificate_key /etc/nginx/ssl/hackathon-platform.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate max-age=0 auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # Main application
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Security: Block access to sensitive files
    location ~* \.(env|log|conf)$ {
        deny all;
        return 404;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://localhost:3000/api/health;
    }
}
```

### 3. Enable Nginx Configuration

```bash
# Remove default configuration
sudo rm /etc/nginx/sites-enabled/default

# Enable site configuration
sudo ln -s /etc/nginx/sites-available/hackathon-platform /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Self-Signed SSL Certificate Setup

Since we're deploying without a domain, we'll use a self-signed SSL certificate for HTTPS. This is particularly important for Web3 functionality as many wallet connections require HTTPS.

### 1. Create SSL Directory and Generate Certificate

```bash
# Create SSL directory
sudo mkdir -p /etc/nginx/ssl
cd /etc/nginx/ssl

# Generate private key
sudo openssl genrsa -out hackathon-platform.key 2048

# Generate certificate signing request (CSR)
sudo openssl req -new -key hackathon-platform.key -out hackathon-platform.csr

# Generate self-signed certificate
sudo openssl x509 -req -days 365 -in hackathon-platform.csr -signkey hackathon-platform.key -out hackathon-platform.crt

# Set proper permissions
sudo chmod 600 hackathon-platform.key
sudo chmod 644 hackathon-platform.crt
```

When generating the CSR, you'll be prompted for information. Fill it out as follows:
```
Country Name (2 letter code): US
State or Province Name: YourState
Locality Name: YourCity
Organization Name: YourOrganization
Organizational Unit Name: IT
Common Name (your EC2 public IP): your-ec2-public-ip
Email Address: your-email@example.com
```

### 2. Verify Certificate

```bash
# Verify certificate contents
sudo openssl x509 -in hackathon-platform.crt -text -noout

# Check certificate expiration
sudo openssl x509 -enddate -noout -in hackathon-platform.crt
```

### 3. Configure Browser Trust (Optional)

For development purposes, you can add the self-signed certificate to your browser's trusted certificates:

**Chrome/Firefox:**
1. Visit `https://your-ec2-public-ip`
2. Click "Advanced" or "Proceed with caution"
3. Click "Proceed to your-ec2-public-ip (unsafe)"

**For production use, consider obtaining a proper SSL certificate through:**
- AWS Certificate Manager (ACM) with Elastic Load Balancer
- Cloudflare (free tier available)
- Purchase a domain and use Let's Encrypt

### 4. Certificate Renewal

Self-signed certificates expire after 1 year. Set up a reminder to renew:

```bash
# Create renewal script
sudo nano /opt/renew-ssl.sh
```

```bash
#!/bin/bash

# SSL certificate renewal script
cd /etc/nginx/ssl

# Backup current certificate
sudo cp hackathon-platform.crt hackathon-platform.crt.backup

# Generate new certificate
sudo openssl x509 -req -days 365 -in hackathon-platform.csr -signkey hackathon-platform.key -out hackathon-platform.crt

# Reload Nginx
sudo systemctl reload nginx

echo "SSL certificate renewed on $(date)"
```

```bash
# Make script executable
sudo chmod +x /opt/renew-ssl.sh

# Set up annual reminder (manual execution)
echo "Remember to run /opt/renew-ssl.sh annually to renew SSL certificate"
```

## Process Management

### 1. PM2 Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs hackathon-platform

# Restart application
pm2 restart hackathon-platform

# Stop application
pm2 stop hackathon-platform

# Monitor resources
pm2 monit
```

### 2. Systemd Service (Alternative to PM2)

If you prefer systemd over PM2:

```bash
# Create systemd service file
sudo nano /etc/systemd/system/hackathon-platform.service
```

```ini
[Unit]
Description=Hackathon Platform Node.js Application
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/hackathon-platform
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

# Logging
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=hackathon-platform

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable hackathon-platform
sudo systemctl start hackathon-platform

# Check status
sudo systemctl status hackathon-platform
```

## Security Hardening

### 1. System Security Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Configure automatic updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Enable automatic updates
sudo systemctl enable unattended-upgrades
sudo systemctl start unattended-upgrades
```

### 2. SSH Security

```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config
```

Update the following settings:
```config
# Disable root login
PermitRootLogin no

# Disable password authentication (use key-based only)
PasswordAuthentication no

# Change default port (optional)
Port 2222

# Allow only specific users
AllowUsers ubuntu appuser
```

```bash
# Restart SSH service
sudo systemctl restart sshd
```

### 3. Application Security

```bash
# Install fail2ban
sudo apt install -y fail2ban

# Create jail configuration
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
```

```bash
# Start fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. File Permissions

```bash
# Set proper file permissions
sudo find /opt/hackathon-platform -type f -exec chmod 644 {} \;
sudo find /opt/hackathon-platform -type d -exec chmod 755 {} \;
sudo chmod 600 /opt/hackathon-platform/.env
sudo chown -R appuser:appuser /opt/hackathon-platform
```

## Monitoring and Maintenance

### 1. Log Management

```bash
# Create log rotation configuration
sudo nano /etc/logrotate.d/hackathon-platform
```

```conf
/opt/hackathon-platform/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 appuser appuser
    postrotate
        pm2 reload hackathon-platform
    endscript
}
```

### 2. Monitoring Setup

```bash
# Install htop for system monitoring
sudo apt install -y htop

# Install Node.js monitoring tools
npm install -g clinicjs

# Run diagnostics (when needed)
clinicjs doctor -- node server.js
```

### 3. Backup Strategy

```bash
# Create backup script
sudo nano /opt/backup-hackathon.sh
```

```bash
#!/bin/bash

# Backup configuration
BACKUP_DIR="/opt/backups"
APP_DIR="/opt/hackathon-platform"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/hackathon_$DATE.tar.gz -C $APP_DIR .

# Backup database
cp $APP_DIR/db/custom.db $BACKUP_DIR/database_$DATE.db

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.db" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make script executable
sudo chmod +x /opt/backup-hackathon.sh

# Setup daily backup cron job
sudo crontab -e
```

Add the following line:
```bash
# Daily backup at 2 AM
0 2 * * * /opt/backup-hackathon.sh
```

### 4. Performance Monitoring

```bash
# Install monitoring tools
sudo apt install -y sysstat iotop

# Enable sysstat
sudo systemctl enable sysstat
sudo systemctl start sysstat

# Monitor system resources
htop
iostat -x 1
vmstat 1
```

## Troubleshooting

### Common Issues and Solutions:

1. **Application won't start**:
   ```bash
   # Check logs
   pm2 logs hackathon-platform
   
   # Check port availability
   sudo netstat -tulpn | grep :3000
   
   # Restart application
   pm2 restart hackathon-platform
   ```

2. **Nginx 502 Bad Gateway**:
   ```bash
   # Check if application is running
   pm2 status
   
   # Test Nginx configuration
   sudo nginx -t
   
   # Check Nginx error logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **SSL Certificate Issues**:
   ```bash
   # Check certificate status
   sudo openssl x509 -in /etc/nginx/ssl/hackathon-platform.crt -text -noout
   
   # Check certificate expiration
   sudo openssl x509 -enddate -noout -in /etc/nginx/ssl/hackathon-platform.crt
   
   # Verify Nginx SSL configuration
   sudo nginx -t
   
   # Check if port 443 is open
   sudo netstat -tulpn | grep :443
   ```

4. **Database Connection Issues**:
   ```bash
   # Check database file permissions
   ls -la /opt/hackathon-platform/db/
   
   # Verify database URL in .env file
   cat /opt/hackathon-platform/.env
   
   # Regenerate Prisma client
   cd /opt/hackathon-platform && npx prisma generate
   ```

## Maintenance Commands

### Regular Maintenance Tasks:

```bash
# Update application
cd /opt/hackathon-platform
sudo git pull origin main
npm install
npm run build
pm2 restart hackathon-platform

# Update system packages
sudo apt update && sudo apt upgrade -y

# Check disk space
df -h

# Check application logs
pm2 logs hackathon-platform --lines 100

# Monitor system resources
htop

# Check Nginx status
sudo systemctl status nginx

# Renew SSL certificates (manual process for self-signed)
# Run: /opt/renew-ssl.sh (when certificate expires)
```

## Conclusion

This deployment guide provides a comprehensive setup for running the Taikai.network clone on Ubuntu Server with EC2 without a domain name. The configuration includes:

- ✅ Secure server setup with firewall
- ✅ Node.js environment with process management
- ✅ Nginx reverse proxy with self-signed SSL
- ✅ IP-based access configuration
- ✅ Security hardening measures
- ✅ Monitoring and backup solutions
- ✅ Performance optimization

### Access Points

Your application will be accessible at:
- **HTTP**: `http://your-ec2-public-ip`
- **HTTPS**: `https://your-ec2-public-ip` (with browser warning for self-signed certificate)

### Important Notes

1. **Self-signed SSL Warning**: Browsers will show a security warning for HTTPS. This is normal for self-signed certificates. Users will need to click "Advanced" and "Proceed" to access the site.

2. **Web3 Wallet Connection**: Some wallet connections may require additional configuration to work with self-signed certificates. Consider using a proper SSL certificate for production Web3 applications.

3. **IP Changes**: If your EC2 instance is stopped and restarted, the public IP may change. Consider using an Elastic IP for consistent access.

4. **Production Considerations**: For production deployment, consider:
   - Purchasing a domain name
   - Using AWS Certificate Manager with Load Balancer
   - Setting up proper DNS records
   - Implementing proper monitoring and alerting

The platform is now production-ready and can handle hackathon events with Web3 integration capabilities. Regular maintenance and monitoring will ensure optimal performance and security.