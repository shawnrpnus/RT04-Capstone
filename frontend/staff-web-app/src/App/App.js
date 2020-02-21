import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/app.scss";
import ScrollToTop from "./ScrollToTop";
import store from "./store";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure({
  autoClose: 3000
})

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop>
          <Router />
        </ScrollToTop>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
