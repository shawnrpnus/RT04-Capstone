import React from "react";
import "../assets/scss/material-kit-pro-react.scss?v=1.8.0";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { ConfirmProvider } from "material-ui-confirm";
import store from "./store";
import Routes from "./Routes";
import { createBrowserHistory } from "history";
import { SnackbarProvider } from "notistack";
import { Elements } from "@stripe/react-stripe-js";
import config from "../config/default.json";
import { loadStripe } from "@stripe/stripe-js";

let hist = createBrowserHistory();

const stripePromise = loadStripe(config.stripePublicKey);

function App() {
  return (
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
    >
      <Provider store={store}>
        <ConfirmProvider>
          <Elements stripe={stripePromise}>
            <Router history={hist}>
              <Routes />
            </Router>
          </Elements>
        </ConfirmProvider>
      </Provider>
    </SnackbarProvider>
  );
}

export default App;
