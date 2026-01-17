import express from 'express';
// import { ENV_VARS } from './configs/env';
// import { APIRoutes } from './routes/APIRoutes';
// import { SERVER_ART } from './configs/constants';
import path from 'path';
// import Database from './configs/database';
// import { Logger } from './configs/logger';

function server() {

  // Create an instance of express
  const app = express();

  // // Display ascii art
  // console.log(SERVER_ART);
  // Require all requests to be made with JSON Middleware
  app.use(express.json());


  // Serve React static files
  const reactBuildPath = path.join(__dirname, '..', '..', 'guardian-angel-web', 'dist'); // Adjust path as needed
  app.use(express.static(reactBuildPath));

  // Catch-all handler for non-API routes to serve React's index.html
  app.get('*', (_, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
  });

  app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
  });
}

server();