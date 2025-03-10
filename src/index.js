import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store/store';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './auth/authConfig';
import { MsalProvider } from '@azure/msal-react';
const root = ReactDOM.createRoot(document.getElementById('root'));
const msalInstance = new PublicClientApplication(msalConfig);
await msalInstance.initialize();

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <MsalProvider instance={msalInstance}>
                    <App />
                </MsalProvider>
            </Router>
        </Provider>
    </React.StrictMode>
);
