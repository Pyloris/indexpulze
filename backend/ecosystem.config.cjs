module.exports = {
    apps: [
        {
            name: "backend",
            script: "src/app.js",
            instances: 1,
            exec_mode: "cluster",
            autorestart: false,
            max_memory_restart: "8G",
            watch: false,
        }
    ]
}

