module.exports = {
  apps: [
    {
      name: 'bruss-floor',
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      interpreter: 'bun',
      env: {
        PORT: 1995,
        NODE_ENV: 'production',
      },
    },
  ],
};

