module.exports = {
  apps: [
    {
      name: 'aos-bouknadel',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/aos-bouknadel',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/aos-bouknadel/error.log',
      out_file: '/var/log/aos-bouknadel/out.log',
      log_file: '/var/log/aos-bouknadel/combined.log',
      time: true,
    },
  ],
};
