#!/bin/bash

# 环境变量设置脚本
# 用于生产环境的环境变量配置

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

# 生成随机密钥
generate_secret() {
    openssl rand -base64 32
}

# 获取用户输入
get_user_input() {
    echo "请输入环境变量配置信息："
    echo
    
    # 基础配置
    read -p "域名 (例如: example.com): " DOMAIN_NAME
    read -p "端口 (默认: 3000): " PORT
    PORT=${PORT:-3000}
    
    # 认证配置
    log_info "认证配置："
    NEXTAUTH_SECRET=$(generate_secret)
    echo "生成的NextAuth密钥: $NEXTAUTH_SECRET"
    
    # Web3配置
    log_info "Web3配置："
    read -p "是否启用Web3功能? (y/n, 默认: y): " WEB3_ENABLED
    WEB3_ENABLED=${WEB3_ENABLED:-y}
    
    if [[ "$WEB3_ENABLED" == "y" || "$WEB3_ENABLED" == "Y" ]]; then
        read -p "Infura项目ID: " INFURA_PROJECT_ID
        read -p "Infura项目密钥: " INFURA_PROJECT_SECRET
        read -p "网络ID (默认: 1): " NETWORK_ID
        NETWORK_ID=${NETWORK_ID:-1}
        read -p "网络名称 (默认: Ethereum Mainnet): " NETWORK_NAME
        NETWORK_NAME=${NETWORK_NAME:-"Ethereum Mainnet"}
    fi
    
    # AI SDK配置
    log_info "AI SDK配置："
    read -p "Z-AI API密钥: " ZAI_API_KEY
    
    # 邮件配置
    log_info "邮件配置："
    read -p "是否配置邮件发送? (y/n, 默认: n): " CONFIG_EMAIL
    CONFIG_EMAIL=${CONFIG_EMAIL:-n}
    
    if [[ "$CONFIG_EMAIL" == "y" || "$CONFIG_EMAIL" == "Y" ]]; then
        read -p "SMTP主机 (默认: smtp.gmail.com): " SMTP_HOST
        SMTP_HOST=${SMTP_HOST:-"smtp.gmail.com"}
        read -p "SMTP端口 (默认: 587): " SMTP_PORT
        SMTP_PORT=${SMTP_PORT:-587}
        read -p "SMTP用户: " SMTP_USER
        read -p "SMTP密码: " SMTP_PASS
        read -p "发送者邮箱: " EMAIL_FROM
    fi
    
    # OAuth配置
    log_info "OAuth配置："
    read -p "是否配置OAuth登录? (y/n, 默认: n): " CONFIG_OAUTH
    CONFIG_OAUTH=${CONFIG_OAUTH:-n}
    
    if [[ "$CONFIG_OAUTH" == "y" || "$CONFIG_OAUTH" == "Y" ]]; then
        read -p "Google客户端ID: " GOOGLE_CLIENT_ID
        read -p "Google客户端密钥: " GOOGLE_CLIENT_SECRET
        read -p "GitHub客户端ID: " GITHUB_ID
        read -p "GitHub客户端密钥: " GITHUB_SECRET
    fi
    
    # 监控配置
    log_info "监控配置："
    read -p "是否配置错误监控? (y/n, 默认: n): " CONFIG_MONITORING
    CONFIG_MONITORING=${CONFIG_MONITORING:-n}
    
    if [[ "$CONFIG_MONITORING" == "y" || "$CONFIG_MONITORING" == "Y" ]]; then
        read -p "Sentry DSN: " SENTRY_DSN
        read -p "Google Analytics ID: " GOOGLE_ANALYTICS_ID
    fi
}

# 创建环境变量文件
create_env_file() {
    log_info "创建环境变量文件..."
    
    cat > .env.production << EOF
# ===========================================
# 黑客松平台生产环境配置
# ===========================================

# 应用基础配置
NODE_ENV="production"
PORT="$PORT"
HOST="0.0.0.0"

# 数据库配置
DATABASE_URL="file:./dev.db"

# ===========================================
# 认证配置
# ===========================================

# NextAuth.js 配置
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="https://$DOMAIN_NAME"

# OAuth 提供商配置
EOF

    # 添加OAuth配置
    if [[ "$CONFIG_OAUTH" == "y" || "$CONFIG_OAUTH" == "Y" ]]; then
        cat >> .env.production << EOF
GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET"
GITHUB_ID="$GITHUB_ID"
GITHUB_SECRET="$GITHUB_SECRET"

EOF
    fi

    # 添加Web3配置
    if [[ "$WEB3_ENABLED" == "y" || "$WEB3_ENABLED" == "Y" ]]; then
        cat >> .env.production << EOF
# ===========================================
# Web3 配置
# ===========================================

# Web3 功能开关
NEXT_PUBLIC_WEB3_ENABLED="true"

# Infura 配置
INFURA_PROJECT_ID="$INFURA_PROJECT_ID"
INFURA_PROJECT_SECRET="$INFURA_PROJECT_SECRET"

# 网络配置
NEXT_PUBLIC_NETWORK_ID="$NETWORK_ID"
NEXT_PUBLIC_NETWORK_NAME="$NETWORK_NAME"

EOF
    fi

    # 添加AI SDK配置
    cat >> .env.production << EOF
# ===========================================
# AI SDK 配置
# ===========================================

# Z-AI Web Dev SDK
ZAI_API_KEY="$ZAI_API_KEY"

EOF

    # 添加邮件配置
    if [[ "$CONFIG_EMAIL" == "y" || "$CONFIG_EMAIL" == "Y" ]]; then
        cat >> .env.production << EOF
# ===========================================
# 邮件配置
# ===========================================

# SMTP 配置
SMTP_HOST="$SMTP_HOST"
SMTP_PORT="$SMTP_PORT"
SMTP_USER="$SMTP_USER"
SMTP_PASS="$SMTP_PASS"

# 邮件发送者
EMAIL_FROM="$EMAIL_FROM"

EOF
    fi

    # 添加监控配置
    if [[ "$CONFIG_MONITORING" == "y" || "$CONFIG_MONITORING" == "Y" ]]; then
        cat >> .env.production << EOF
# ===========================================
# 监控配置
# ===========================================

# 错误监控
SENTRY_DSN="$SENTRY_DSN"

# 分析工具
GOOGLE_ANALYTICS_ID="$GOOGLE_ANALYTICS_ID"

EOF
    fi

    # 添加基础配置
    cat >> .env.production << EOF
# ===========================================
# 文件上传配置
# ===========================================

# 文件大小限制 (MB)
MAX_FILE_SIZE="10"

# 允许的文件类型
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,image/webp,application/pdf"

# 上传路径
UPLOAD_PATH="./uploads"

# ===========================================
# 缓存配置
# ===========================================

# 缓存时间 (秒)
CACHE_TTL="3600"

# ===========================================
# 安全配置
# ===========================================

# CORS 配置
ALLOWED_ORIGINS="https://$DOMAIN_NAME,https://www.$DOMAIN_NAME"

# CSRF 保护
CSRF_SECRET="$(generate_secret)"

# 速率限制
RATE_LIMIT_WINDOW="900000"
RATE_LIMIT_MAX="100"

# ===========================================
# 开发者配置
# ===========================================

# 调试模式
DEBUG="false"

# 日志级别
LOG_LEVEL="info"

# 健康检查
HEALTH_CHECK_ENABLED="true"
HEALTH_CHECK_PATH="/api/health"
EOF

    log_success "环境变量文件创建完成"
}

# 验证环境变量
validate_env() {
    log_info "验证环境变量..."
    
    # 检查必需的环境变量
    required_vars=("NODE_ENV" "NEXTAUTH_SECRET" "NEXTAUTH_URL" "ZAI_API_KEY")
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" .env.production; then
            log_error "缺少必需的环境变量: $var"
            exit 1
        fi
    done
    
    log_success "环境变量验证完成"
}

# 设置文件权限
set_permissions() {
    log_info "设置文件权限..."
    
    chmod 600 .env.production
    log_success "文件权限设置完成"
}

# 显示配置信息
show_config_info() {
    log_info "环境变量配置完成！"
    echo
    echo "📋 配置摘要："
    echo "  域名: $DOMAIN_NAME"
    echo "  端口: $PORT"
    echo "  Web3功能: $([[ "$WEB3_ENABLED" == "y" ]] && echo "启用" || echo "禁用")"
    echo "  OAuth登录: $([[ "$CONFIG_OAUTH" == "y" ]] && echo "启用" || echo "禁用")"
    echo "  邮件发送: $([[ "$CONFIG_EMAIL" == "y" ]] && echo "启用" || echo "禁用")"
    echo "  错误监控: $([[ "$CONFIG_MONITORING" == "y" ]] && echo "启用" || echo "禁用")"
    echo
    echo "🔧 配置文件："
    echo "  环境变量: .env.production"
    echo "  文件权限: 600 (仅所有者可读写)"
    echo
    echo "🚨 重要提醒："
    echo "  1. 请妥善保管 .env.production 文件"
    echo "  2. 不要将此文件提交到版本控制"
    echo "  3. 定期轮换密钥和密码"
    echo "  4. 在生产环境中使用强密码"
    echo "  5. 考虑使用密钥管理服务"
}

# 主函数
main() {
    echo "🔧 开始环境变量配置..."
    echo
    
    get_user_input
    create_env_file
    validate_env
    set_permissions
    show_config_info
    
    echo
    log_success "✅ 环境变量配置完成！"
    echo "📁 配置文件已创建: .env.production"
}

# 运行主函数
main "$@"