#!/bin/bash

# SSL证书设置脚本
# 用于Let's Encrypt证书的自动获取和配置

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为root用户
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要root权限运行"
        exit 1
    fi
}

# 获取用户输入
get_user_input() {
    echo "请输入SSL证书配置信息："
    read -p "域名 (例如: example.com): " DOMAIN_NAME
    read -p "管理员邮箱 (用于证书通知): " ADMIN_EMAIL
    read -p "是否包含www子域名? (y/n): " INCLUDE_WWW
    
    if [[ "$INCLUDE_WWW" == "y" || "$INCLUDE_WWW" == "Y" ]]; then
        DOMAINS="$DOMAIN_NAME www.$DOMAIN_NAME"
    else
        DOMAINS="$DOMAIN_NAME"
    fi
}

# 安装Certbot
install_certbot() {
    log_info "安装Certbot..."
    
    # 更新包列表
    apt update
    
    # 安装Certbot和Nginx插件
    apt install -y certbot python3-certbot-nginx
    
    log_success "Certbot安装完成"
}

# 获取SSL证书
get_ssl_certificate() {
    log_info "获取SSL证书..."
    
    # 构建域名参数
    DOMAIN_ARGS=""
    for domain in $DOMAINS; do
        DOMAIN_ARGS="$DOMAIN_ARGS -d $domain"
    done
    
    # 获取证书
    certbot --nginx $DOMAIN_ARGS --email "$ADMIN_EMAIL" --non-interactive --agree-tos --redirect --hsts --staple-ocsp
    
    log_success "SSL证书获取完成"
}

# 配置自动续期
setup_auto_renewal() {
    log_info "配置证书自动续期..."
    
    # 创建续期脚本
    cat > /etc/cron.daily/certbot-renew << EOF
#!/bin/bash
# SSL证书自动续期脚本

# 续期证书
certbot renew --quiet

# 重启Nginx
systemctl reload nginx

# 记录日志
echo "SSL证书续期完成: \$(date)" >> /var/log/certbot-renew.log
EOF
    
    # 设置执行权限
    chmod +x /etc/cron.daily/certbot-renew
    
    # 测试续期
    certbot renew --dry-run
    
    log_success "自动续期配置完成"
}

# 配置SSL强化
setup_ssl_hardening() {
    log_info "配置SSL强化..."
    
    # 创建SSL配置文件
    cat > /etc/nginx/conf.d/ssl.conf << EOF
# SSL强化配置
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
ssl_stapling_cache shared:SSL_OCSP:10m;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# OCSP Stapling
ssl_trusted_certificate /etc/letsencrypt/live/$DOMAIN_NAME/chain.pem;

# 安全头
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
EOF
    
    log_success "SSL强化配置完成"
}

# 验证证书
verify_certificate() {
    log_info "验证SSL证书..."
    
    # 检查证书文件
    if [[ -f "/etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem" ]]; then
        log_success "证书文件存在"
        
        # 检查证书有效期
        openssl x509 -in /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem -text -noout | grep "Not After"
        
        # 测试HTTPS连接
        if command -v curl &> /dev/null; then
            curl -I "https://$DOMAIN_NAME" --connect-timeout 10
        fi
        
        log_success "SSL证书验证完成"
    else
        log_error "证书文件不存在"
        exit 1
    fi
}

# 显示证书信息
show_certificate_info() {
    log_info "SSL证书信息："
    echo
    echo "📋 证书详情："
    echo "  域名: $DOMAINS"
    echo "  证书路径: /etc/letsencrypt/live/$DOMAIN_NAME/"
    echo "  全链证书: /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem"
    echo "  私钥: /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem"
    echo "  配置文件: /etc/nginx/sites-available/hackerthon-platform"
    echo
    echo "🔧 管理命令："
    echo "  查看证书状态: certbot certificates"
    echo "  手动续期证书: certbot renew"
    echo "  测试续期: certbot renew --dry-run"
    echo "  撤销证书: certbot revoke --cert-path /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem"
    echo
    echo "📊 监控："
    echo "  证书有效期: openssl x509 -in /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem -text -noout | grep 'Not After'"
    echo "  SSL测试: https://www.ssllabs.com/ssltest/"
    echo
    echo "🔄 自动续期："
    echo "  续期脚本: /etc/cron.daily/certbot-renew"
    echo "  续期日志: /var/log/certbot-renew.log"
    echo "  续期测试: certbot renew --dry-run"
}

# 主函数
main() {
    echo "🔒 开始SSL证书设置..."
    echo
    
    check_root
    get_user_input
    install_certbot
    get_ssl_certificate
    setup_ssl_hardening
    setup_auto_renewal
    verify_certificate
    show_certificate_info
    
    echo
    log_success "✅ SSL证书设置完成！"
    echo "🌐 您的网站现在支持HTTPS: https://$DOMAIN_NAME"
}

# 运行主函数
main "$@"