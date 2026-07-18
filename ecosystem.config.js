module.exports = {
  apps: [
    {
      name: 'arcade_back',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 9090,
      },
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_merge: true,
      time: true
    },
  ],
};