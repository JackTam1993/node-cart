module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    exec_mode : "cluster",
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