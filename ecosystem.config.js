module.exports = {
  apps : [{
    name: "app",
    script: "./bin/www",
    exec_mode : "fork",
    watch: true,
    env: {
      "PORT": 3000,
      NODE_ENV: "development",
    },
    env_production: {
      "PORT": 3000,
      NODE_ENV: "production",
    }
  }]
}