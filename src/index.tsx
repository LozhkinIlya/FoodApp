import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import './index.scss';
import App from './components/app/App';
import store from './store';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
