// PM2 Process Manager Configuration for JanSetu Bihar Portal
module.exports = {
  apps: [
    {
      name: 'jansetu-bihar-portal',
      script: './backend/dist/index.js',
      cwd: './',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        MAX_UPLOAD_SIZE_MB: 200
      },
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      listen_timeout: 10000,
      kill_timeout: 5000,
      error_file: './backend/logs/pm2-err.log',
      out_file: './backend/logs/pm2-out.log',
      merge_logs: true,
      time: true
    }
  ]
};
