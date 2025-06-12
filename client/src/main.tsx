import "./index.css"
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router';
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName  = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName  = "X-XSRF-TOKEN";
console.log("main");
  try {
    await axios.get("/api/csrf-token");
    console.log(" CSRF cookie set");
  } catch (err) {
    console.error(" CSRF init failed:", err);
  }
  const root = ReactDOM.createRoot(document.getElementById("root")!);
  root.render(
    // <React.StrictMode>
      <AppRouter />
    // </React.StrictMode>
  );

