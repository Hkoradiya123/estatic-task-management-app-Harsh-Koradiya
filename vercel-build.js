const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

// Install dependencies and build client
console.log('Installing client dependencies...');
execSync('cd client && npm install', { stdio: 'inherit' });

console.log('Building client...');
execSync('cd client && npm run build', { stdio: 'inherit' });

// Install server dependencies
console.log('Installing server dependencies...');
execSync('cd server && npm install --production', { stdio: 'inherit' });

console.log('Build process completed successfully!');
