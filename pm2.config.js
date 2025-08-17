// PM2配置文件 - 黑客松平台
// 用于生产环境进程管理

module.exports = {
  apps: [{
    name: 'hackerthon-platform',
    script: 'npm',
    args: 'start',
    cwd: './',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // 日志配置
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    time: true,
    // 监控配置
    merge_logs: true,
    source_map_support: true,
    disable_logs: false,
    // 性能配置
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G',
    // 健康检查
    health_check: {
      path: '/api/health',
      interval: 30000,
      timeout: 5000,
      unhealthy_threshold: 3,
      healthy_threshold: 1
    }
  }],
  
  // 部署配置
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'your-repo-url',
      path: '/home/ubuntu/hackerthon-platform',
      'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
};