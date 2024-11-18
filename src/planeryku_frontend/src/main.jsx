import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { AuthClient } from "@dfinity/auth-client";

const init = async () => {
  const authClient = await AuthClient.create();
  const handleRender = async (authClient) => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  };
  if (await authClient.isAuthenticated()) {
    handleRender(authClient);
    return;
  }
  authClient.login({
    identityProvider: "https://identity.ic0.app/#authorize",
    onSuccess: async () => {
      handleRender(authClient);
    },
    onError: (error) => {
      console.log("Error logging in", error);
    },
  });
};
