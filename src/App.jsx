import React, { useEffect } from "react";

// routes
// import ProvidedRoutes from "./routes/ProvidedRoutes";
// import Routing from "./routes/Routing";
import { BrowserRouter, useLocation } from "react-router-dom";
import Routes from "./router/Routes";
import { Toaster } from "react-hot-toast";
import Routing from "./router/Routing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles

// styles
import "./styles/selectField.scss";
import { useDispatch } from "react-redux";
import { setMarketing } from "./redux/features/marketing";
import Reminders from "./pages/Reminders/Reminders";
import { NotificationProvider } from "./context/notification";

function App() {
  return (
    <>
      <NotificationProvider>
        <BrowserRouter>
          <Toaster position="top-right" reverseOrder={false} />
          <ToastContainer position="top-center" />
          <Routes />
          <Reminders />
        </BrowserRouter>
      </NotificationProvider>
    </>
  );
}

export default App;
