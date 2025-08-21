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
      <BrowserRouter>
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerStyle={{
            zIndex: 9999999,
          }}
          toastOptions={{
            style: {
              zIndex: 9999999,
            },
          }}
        />

        <ToastContainer
          position="top-center"
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          style={{ zIndex: 9999999 }}
        />

        <Routes />
      </BrowserRouter>
    </>
  );
}

export default App;
