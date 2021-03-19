module.exports = {
  apps : [{
    name: 'tiny-url',
    script: './dist/index.js',
    cwd: './',
    watch: false,
    instances: "max",
    autorestart: true,
    exec_interpreter: 'node',
    max_restarts: 10,
    error_file: './pm2logs/error.log',
    out_file: './pm2logs/out.log',
    env: {
      NODE_ENV: "development",
      PORT: process.env.PORT || 5000,
    },
    env_production: {
      NODE_ENV: "production",
      PORT: process.env.PORT || 5000,
    }
  }]
}