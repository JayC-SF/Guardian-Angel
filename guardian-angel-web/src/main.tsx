import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-8575mxouxdzhyuo3.us.auth0.com';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'd3ZlK7kYL9hU9346mxadjQMIpKF4YhN7';

// Handle redirect after Auth0 login
const onRedirectCallback = (appState: any) => {
  window.location.href = appState?.returnTo || '/monitor';
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>
);

