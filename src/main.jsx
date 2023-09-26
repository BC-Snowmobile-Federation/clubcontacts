import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import Dashboard from "./components/Dashboard.jsx";
import store from "../store.js";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="81890068107-6mmaokhjb1dlh1tia6r2u8osanav7otu.apps.googleusercontent.com" scopes={['email']}>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
