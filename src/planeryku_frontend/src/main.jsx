import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import './index.css';
import { AuthClient } from '@dfinity/auth-client';
import { BrowserRouter, Routes, Route } from 'react-router';

const init = async () => {
  const authClient = await AuthClient.create();

  const data = 'test' === 'tes';
  const handleRender = async (authClient) => {
    return ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>,
    );
  };
  if (await authClient.isAuthenticated()) {
    handleRender(authClient);
    return;
  }
  await authClient.login({
    identityProvider: 'https://identity.ic0.app/#authorize',
    onSuccess: async () => {
      handleRender(authClient);
    },
    onError: (error) => {
      console.log('Error logging in', error);
    },
  });
};

init();
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
