// src/tests/helpers/setup.js
import { exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';

const execAsync = promisify(exec);
const MAX_RETRIES = 30;
const RETRY_INTERVAL = 1000;
const PORT = 3000;

async function isServerRunning() {
  try {
    const response = await fetch(`http://localhost:${PORT}`);
    return response.status === 200;
  } catch {
    return false;
  }
}

async function waitForServer() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    if (await isServerRunning()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
  }
  throw new Error('Server failed to start');
}

async function startDevServer() {
  try {
    // Check if server is already running
    if (await isServerRunning()) {
      console.log('Server already running');
      return;
    }

    // Start the dev server
    const serverProcess = exec('npm run dev');
    console.log('Starting dev server...');

    // Handle server output
    serverProcess.stdout?.on('data', (data) => console.log(data));
    serverProcess.stderr?.on('data', (data) => console.error(data));

    // Wait for server to be ready
    await waitForServer();
    console.log('Server is ready');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Run setup
startDevServer().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});