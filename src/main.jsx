// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import "./index.css";
// import App from "./App";
// import { ThemeProvider } from "./context/ThemeContext";
// import {
//   NotificationProvider,
// } from "./context/NotificationContext";
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//   <BrowserRouter>
//   <NotificationProvider>
//     <ThemeProvider>
//       <App />
//       <ToastContainer
//         position="top-right"
//         autoClose={2500}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="colored"
//       />
//     </ThemeProvider>
//     </NotificationProvider>
//   </BrowserRouter>
// </React.StrictMode>
// );


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import App from "./App";

import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { CompareProvider } from "./context/CompareContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <ThemeProvider>
          <CompareProvider>
            <App />

            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              theme="colored"
            />
          </CompareProvider>
        </ThemeProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);