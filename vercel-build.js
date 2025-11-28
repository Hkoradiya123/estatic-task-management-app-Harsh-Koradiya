const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, cwd = '.', errorMessage = 'Command failed') {
  try {
    console.log(`📝 [${cwd}] $ ${command}`);
    execSync(command, { 
      stdio: 'inherit', 
      cwd: path.resolve(process.cwd(), cwd),
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    return true;
  } catch (error) {
    console.error(`❌ ${errorMessage}:`, error.message);
    console.error(`💡 Command that failed: ${command} in ${cwd}`);
    process.exit(1);
  }
}

console.log('🚀 Starting Vercel build process...');

// 1. Install root dependencies
console.log('\n🔧 [1/4] Installing root dependencies...');
runCommand('npm install', '.', 'Failed to install root dependencies');

// 2. Install and build client
console.log('\n🔧 [2/4] Setting up client...');
runCommand('npm install --legacy-peer-deps', 'client', 'Failed to install client dependencies');
runCommand('npm run build', 'client', 'Client build failed');

// 3. Install server dependencies
console.log('\n🔧 [3/4] Setting up server...');
runCommand('npm install --production', 'server', 'Failed to install server dependencies');

// 4. Verify build outputs
console.log('\n🔍 [4/4] Verifying build outputs...');
const clientDist = path.join('client', 'dist');
const serverDir = path.join('server');

if (!fs.existsSync(clientDist)) {
  console.error(`❌ Client build verification failed: ${clientDist} directory not found`);
  process.exit(1);
}

if (!fs.existsSync(path.join(serverDir, 'node_modules'))) {
  console.error(`❌ Server dependencies verification failed: node_modules not found in ${serverDir}`);
  process.exit(1);
}

console.log('\n✅ Build process completed successfully!');
console.log('📦 Client build output:', path.resolve(clientDist));
console.log('🚀 Server ready in:', path.resolve(serverDir));

// Create a vercel.json if it doesn't exist
const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
  console.log('\nℹ️  Creating default vercel.json configuration...');
  fs.writeFileSync(
    vercelConfigPath,
    JSON.stringify({
      version: 2,
      builds: [
        { src: 'client/package.json', use: '@vercel/static-build', config: { distDir: 'dist' } },
        { src: 'server/index.js', use: '@vercel/node' }
      ],
      routes: [
        { src: '/api/(.*)', dest: '/server/index.js' },
        { src: '/(.*)', dest: '/client/dist/$1' }
      ]
    }, null, 2)
  );
}
