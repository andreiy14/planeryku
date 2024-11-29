import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import Layout from './routes/layout';
import ProjectTask from './routes/pages/ProjectTask';
import LoginPage from './routes/pages/Login';
import { createTheme, ThemeProvider } from '@mui/material';
import { AuthClient } from '@dfinity/auth-client';

const islogin = true;
const ProtectedRoute = ({ children }) => {
  return islogin ?

    (
      <Layout>
        {children}
      </Layout>
    )


    : <Navigate to="/" />;
};

const router = createBrowserRouter(
  [
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>

          <ProjectTask />
        </ProtectedRoute>
      ),
    },
    {
      path: '/',
      element: <LoginPage />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#3730a3',
    },
  },
});

const init = async () => {
  const authClient = await AuthClient.create();
  console.log('auth', await authClient.isAuthenticated());
  const handleRender = (authClient) => {
    return ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          {/* <Layout> */}
          <RouterProvider router={router} />
          {/* </Layout> */}
        </ThemeProvider>
      </React.StrictMode>,
    );
  };

  handleRender(authClient)
  // if (await authClient.isAuthenticated()) {
  //   handleRender(authClient);
  // } else {
  //   await authClient.login({
  //     identityProvider: 'https://identity.ic0.app/#authorize',
  //     onSuccess: async () => {
  //       handleRender(authClient);
  //     },
  //     onError: (error) => {
  //       console.log('Error logging in', error);
  //     },
  //   });
  // }

  // await authClient.login({
  //   identityProvider: "https://identity.ic0.app/#authorize",
  //   onSuccess: async () => {
  //     handleRender(authClient);
  //   },
  //   onError: (error) => {
  //     console.log("Error logging in", error);
  //   },
  // });
};

init();
