module.exports = {
    apps: [
        {
            name: 'alquimia-frontend',
            script: 'node_modules/.bin/serve',
            args: '-s dist -l 3001',
            cwd: __dirname,
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '150M',
            min_uptime: '10s',
            max_restarts: 10,
            restart_delay: 3000,
            out_file: './logs/out.log',
            error_file: './logs/error.log',
            merge_logs: true,
            time: true,
        },
    ],
};
