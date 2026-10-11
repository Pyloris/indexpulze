module.exports = {
    apps: [
        {
            name: "backend",
            script: "src/app.js",
            instances: 1,
            exec_mode: "fork",
            autorestart: false,
            max_memory_restart: "1G",
            watch: false,
            node_args: "--env-file=../.env",
        }
    ]
}

