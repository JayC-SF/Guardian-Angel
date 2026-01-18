import express from 'express';
import http from 'http';
// import { ENV_VARS } from './configs/env';
// import { APIRoutes } from './routes/APIRoutes';
// import { SERVER_ART } from './configs/constants';
import path from 'path';
import { ExpressPeerServer } from 'peer';
// import Database from './configs/database';
// import { Logger } from './configs/logger';
const PORT = process.env.PORT || 3000;
function runServer() {

  // Create an instance of express
  const app = express();

  const server = http.createServer(app);

  // Require all requests to be made with JSON Middleware
  app.use(express.json());

  // Serve React static files
  const reactBuildPath = path.join(__dirname, '..', '..', 'guardian-angel-web', 'dist'); // Adjust path as needed
  app.use(express.static(reactBuildPath));

  const peerServer = ExpressPeerServer(server, {
    path: '/myapp',
  });

  app.use('/peerjs', peerServer);

  // Catch-all handler for non-API routes to serve React's index.html
  app.get('*', (_, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
  });

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  peerServer.on('connection', (client) => {
    console.log(`User connected with ID: ${client.getId()}`);
  });
}

runServer();