import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import "primereact/resources/themes/nova-colored/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/app.scss";
import ScrollToTop from "./ScrollToTop";
import store from "./store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmProvider } from "material-ui-confirm";

toast.configure({
  autoClose: 5000
});

function App() {
  return (
    <Provider store={store}>
      <ConfirmProvider>
        <BrowserRouter>
          <ScrollToTop>
            <Router />
          </ScrollToTop>
        </BrowserRouter>
      </ConfirmProvider>
    </Provider>
  );
}

export default App;
