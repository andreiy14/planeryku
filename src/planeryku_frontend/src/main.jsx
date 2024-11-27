import "./index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./routes/layout";
import ProjectTask from "./routes/pages/ProjectTask";
import { createTheme, ThemeProvider } from "@mui/material";

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <ProjectTask />,
		}
	],
	{
		future: {
			v7_relativeSplatPath: true,
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_partialHydration: true,
			v7_skipActionErrorRevalidation: true,
		},
	}
);

const theme = createTheme({
	palette: {
		primary: {
			main: '#3730a3',
		},
	},
});

// const init = async () => {
//   const authClient = await AuthClient.create();
//   console.log('auth', authClient)
//   const handleRender = async (authClient) => {
//     return ReactDOM.createRoot(document.getElementById("root")).render(
//       <React.StrictMode>
//         <App />
//       </React.StrictMode>
//     );
//   };
//   if (await authClient.isAuthenticated()) {
//     handleRender(authClient);
//     return;
//   }
//   await authClient.login({
//     identityProvider: "https://identity.ic0.app/#authorize",
//     onSuccess: async () => {
//       handleRender(authClient);
//     },
//     onError: (error) => {
//       console.log("Error logging in", error);
//     },
//   });
// };

// init();
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<Layout>
				<RouterProvider router={router} />
			</Layout>
		</ThemeProvider>
	</React.StrictMode>
);
