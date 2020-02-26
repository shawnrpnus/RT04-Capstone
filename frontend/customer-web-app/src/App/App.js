import React from "react";
import "../assets/scss/material-kit-pro-react.scss?v=1.8.0";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { ConfirmProvider } from "material-ui-confirm";
import store from "./store";
import Routes from "./Routes";
import { createBrowserHistory } from "history";
import { SnackbarProvider } from "notistack";

let hist = createBrowserHistory();

function App() {
  return (
    <SnackbarProvider maxSnack={2}>
      <Provider store={store}>
        <ConfirmProvider>
          <Router history={hist}>
            <Routes />
          </Router>
        </ConfirmProvider>
      </Provider>
    </SnackbarProvider>
  );
}

export default App;
