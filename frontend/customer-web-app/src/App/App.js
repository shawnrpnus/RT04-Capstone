import React, { useEffect } from "react";
import "../assets/scss/material-kit-pro-react.scss?v=1.8.0";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Router } from "react-router-dom";
import { ConfirmProvider } from "material-ui-confirm";
import store from "./store";
import Routes from "./Routes";
import { createBrowserHistory } from "history";
import { SnackbarProvider } from "notistack";
import { refreshCustomer } from "redux/actions/customerActions";

const _ = require("lodash");
let hist = createBrowserHistory();

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
          <GlobalTimer>
            <Router history={hist}>
              <Routes />
            </Router>
          </GlobalTimer>
        </ConfirmProvider>
      </Provider>
    </SnackbarProvider>
  );
}

export default App;

function GlobalTimer(props) {
  const customer = useSelector(
    state => state.customer.loggedInCustomer,
    _.isEqual
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let customerTimer = null;
    if (customer) {
      customerTimer = setInterval(
        () => dispatch(refreshCustomer(customer.email)),
        60000
      );
    }
    if (customerTimer) {
      return () => clearInterval(customerTimer);
    }
  }, [customer]);

  return props.children;
}
