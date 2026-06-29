import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './store/store';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Provider store={store}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </Provider>
        </GoogleOAuthProvider>
    </StrictMode>
);
