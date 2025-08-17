# 🚀 Taikai.network Clone - Quick Start Guide

## 📋 Overview

This guide provides the simplest way to deploy your Taikai.network clone to an EC2 instance with a single command.

## 🎯 Prerequisites

### Before You Start
- EC2 instance with Ubuntu Server 22.04 LTS
- Instance must be running and accessible
- Security group must allow SSH (port 22) and HTTP (port 80)
- You have the SSH key file for the instance

### Recommended Instance Settings
- **Instance Type**: t3.medium or larger
- **Storage**: 30GB SSD or more
- **Security Group**: Open ports 22 (SSH) and 80 (HTTP)

## 🚀 One-Click Deployment

### Step 1: Get Your EC2 Instance Information
- **Public IP**: Your EC2 instance's public IP address
- **SSH Key**: Path to your SSH key file (.pem)

### Step 2: Run the Upload and Deploy Script
```bash
# Basic usage (if you have SSH key configured in ssh-agent)
./upload-and-deploy.sh YOUR_EC2_PUBLIC_IP

# With SSH key (recommended)
./upload-and-deploy.sh YOUR_EC2_PUBLIC_IP /path/to/your-key.pem
```

**Example:**
```bash
./upload-and-deploy.sh 54.123.45.67 /Users/username/Downloads/my-key.pem
```

### Step 3: Access Your Application
Once the deployment is complete, you can access your application at:
```
http://YOUR_EC2_PUBLIC_IP
```

## 📦 What Gets Deployed

### Complete Application Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js integration
- **Real-time**: Socket.IO for WebSocket support
- **Web3**: Ethers.js integration ready

### Production Infrastructure
- **Web Server**: Nginx reverse proxy
- **Process Management**: PM2 with cluster mode
- **Security**: UFW firewall with proper configuration
- **Monitoring**: Health checks and status scripts
- **Logging**: Centralized log management

## 🔧 Post-Deployment Management

### Access Your Server
```bash
# SSH into your instance
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Check Application Status
```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs taikai-clone

# Run health check
./health.sh

# View detailed status
./status.sh
```

### Useful Commands
```bash
# Restart application
pm2 restart taikai-clone

# Stop application
pm2 stop taikai-clone

# Start application
pm2 start taikai-clone

# Monitor application in real-time
pm2 monit

# Check system resources
htop

# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

## 🔒 Security Features

### Automatic Security Configuration
- **Firewall**: UFW enabled with only necessary ports open
- **Non-root User**: Application runs as 'ubuntu' user
- **Process Isolation**: PM2 runs applications in isolated processes
- **Security Headers**: Nginx configured with security headers

### Open Ports
- **22 (SSH)**: For server administration
- **80 (HTTP)**: For web application access
- **3000**: Internal application port (not publicly accessible)

## 📊 Monitoring

### Health Check Script
The deployment includes a comprehensive health check script:
```bash
./health.sh
```

This script checks:
- PM2 process status
- Port availability
- Nginx service status
- HTTP response codes

### Status Script
Detailed status information:
```bash
./status.sh
```

This script provides:
- System information (uptime, memory, disk)
- PM2 process status
- Nginx service status
- Recent application logs
- Network status

## 🚨 Troubleshooting

### Common Issues

#### 1. Application Not Accessible
```bash
# Check if application is running
pm2 status taikai-clone

# Check if Nginx is running
sudo systemctl status nginx

# Check port availability
sudo netstat -tlnp | grep :80
```

#### 2. SSH Connection Issues
```bash
# Check security group settings
# Ensure port 22 is open
# Verify SSH key permissions (chmod 400 your-key.pem)
```

#### 3. Application Errors
```bash
# View application logs
pm2 logs taikai-clone

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check system logs
sudo journalctl -xe
```

#### 4. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tlnp | grep :3000

# Kill the process if needed
sudo kill -9 PROCESS_ID
```

### Getting Help

If you encounter issues:
1. Check the health check script: `./health.sh`
2. Review application logs: `pm2 logs taikai-clone`
3. Check system resources: `htop`
4. Verify all services are running: `sudo systemctl status`
5. Restart the application: `pm2 restart taikai-clone`

## 🎯 Customization

### Environment Variables
You can customize the application by editing the environment file:
```bash
# SSH into the instance
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Edit environment file
nano ~/taikai-clone/.env
```

### Nginx Configuration
Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/taikai-clone
```

### PM2 Configuration
PM2 ecosystem configuration:
```bash
nano ~/taikai-clone/ecosystem.config.js
```

## 📈 Scaling

### Vertical Scaling
To increase instance performance:
1. Stop the EC2 instance
2. Change instance type to a larger one (t3.large, t3.xlarge, etc.)
3. Start the instance
4. Run `./status.sh` to verify everything is working

### Horizontal Scaling
For higher traffic, consider:
1. Using a load balancer
2. Running multiple instances
3. Setting up a proper domain name
4. Adding SSL certificates

## 🔧 Advanced Configuration

### Adding a Domain Name
If you later want to add a domain name:
1. Purchase a domain
2. Point DNS to your EC2 IP
3. Update Nginx configuration with the domain
4. Set up SSL with Let's Encrypt

### SSL Certificate
For HTTPS support:
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Database Migration
To switch to a production database:
1. Update the `DATABASE_URL` in `.env`
2. Run `npx prisma db push`
3. Restart the application: `pm2 restart taikai-clone`

## 🎉 Success!

Your Taikai.network clone is now deployed and running! 

### What You Have
- ✅ **Production-ready application** running on EC2
- ✅ **Complete hackathon platform** with all features
- ✅ **Process management** with PM2 for reliability
- ✅ **Web server** with Nginx for performance
- ✅ **Security** with firewall and best practices
- ✅ **Monitoring** with health checks and status scripts

### Next Steps
1. **Test the application**: Visit `http://YOUR_EC2_PUBLIC_IP`
2. **Verify functionality**: Test all features and pages
3. **Set up monitoring**: Configure alerts for critical issues
4. **Consider scaling**: Upgrade instance size if needed
5. **Add domain**: Consider adding a proper domain name

### Important URLs
- **Application**: `http://YOUR_EC2_PUBLIC_IP`
- **PM2 Monitor**: Run `pm2 monit` on the server
- **Health Check**: Run `./health.sh` on the server
- **Status**: Run `./status.sh` on the server

Your platform is ready to host hackathons and serve users! 🚀