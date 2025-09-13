#!/usr/bin/env node

import { createServer } from 'vite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Starting React-only Restaurant Management System...");
console.log("Removed all Node.js/Express server code");
console.log("Using external APIs via generic repository pattern");

async function startServer() {
  try {
    const projectRoot = join(__dirname, '..');
    const clientDir = join(projectRoot, 'client');

    // Create Vite development server with specified configuration
    const viteServer = await createServer({
      configFile: false, // Don't use config file, define inline
      root: clientDir,
      plugins: [
        react(),
        runtimeErrorOverlay(),
      ],
      resolve: {
        alias: {
          "@": join(clientDir, "./src"),
          "@assets": join(projectRoot, "./attached_assets"),
        },
      },
      server: {
        host: '0.0.0.0',
        port: 5000,
        strictPort: true
      }
    });

    // Start the server
    await viteServer.listen();
    
    console.log('\n✅ Vite server started successfully');
    viteServer.printUrls();

    // Graceful shutdown handlers
    const shutdownHandler = async (signal: string) => {
      console.log(`\n🔄 Received ${signal}, shutting down gracefully...`);
      await viteServer.close();
      console.log('✅ Server closed successfully');
    };

    process.on('SIGINT', () => shutdownHandler('SIGINT'));
    process.on('SIGTERM', () => shutdownHandler('SIGTERM'));

    // Keep the process alive indefinitely
    await new Promise(() => {});

  } catch (error) {
    console.error('❌ Failed to start Vite server:', error);
    // Don't call process.exit - let the process handle the error gracefully
  }
}

// Start the server
startServer();