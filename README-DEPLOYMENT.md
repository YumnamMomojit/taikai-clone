# 🚀 One-Click EC2 Deployment

## 📋 Overview

This guide provides a simple, one-click deployment solution for your Taikai.network clone on an EC2 instance without requiring a domain name.

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

## 🚀 Quick Start

### 1. Get Your EC2 Instance Information
- **Public IP**: Your EC2 instance's public IP address
- **SSH Key**: Path to your SSH key file (.pem)

### 2. Run the Deployment Script
```bash
# Basic usage
./deploy.sh YOUR_EC2_PUBLIC_IP

# With SSH key (recommended)
./deploy.sh YOUR_EC2_PUBLIC_IP /path/to/your-key.pem
```

**Example:**
```bash
./deploy.sh 54.123.45.67 /Users/username/Downloads/my-key.pem
```

### 3. Access Your Application
Once the deployment is complete, you can access your application at:
```
http://YOUR_EC2_PUBLIC_IP
```

## 📦 What Gets Installed

### System Components
- **Node.js 18.x LTS**: JavaScript runtime environment
- **PM2**: Process manager for Node.js applications
- **Nginx**: Web server and reverse proxy
- **UFW Firewall**: Security firewall

### Application Components
- **Next.js 14**: React framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library
- **Prisma**: Database ORM
- **SQLite**: Database

### Features Included
- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Automatic theme switching
- **Hackathon Platform**: Complete hackathon management system
- **User Authentication**: Multiple login methods
- **Real-time Features**: WebSocket support via Socket.IO
- **Database**: SQLite with Prisma ORM
- **Process Management**: PM2 for production reliability

## 🔧 Post-Deployment

### Check Application Status
```bash
# SSH into your instance
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

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

# View system resources
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

Your platform is ready to host hackathons and serve users! 🚀