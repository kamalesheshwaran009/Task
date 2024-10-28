export const environment = {
  production: process.env["NODE_ENV"] === 'production', // This will be `true` in production
  apiUrl: process.env["NODE_ENV"] === 'production'
    ? 'https://task-manager-3lqc.onrender.com/api'
    : 'http://localhost:5000/api'
};
