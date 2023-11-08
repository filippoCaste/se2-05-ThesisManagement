import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
    domain="thesis-management-05.eu.auth0.com"
    clientId="xpgBOCiQdqCuxjLl5EM69x85Yh4kIXi9"
    authorizationParams={{
      redirect_uri: "http://localhost:5173/student",
    }}
  >
        <App />
    </Auth0Provider>
  </React.StrictMode>,
)
