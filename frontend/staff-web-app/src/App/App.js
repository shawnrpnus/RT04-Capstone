import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import '../scss/app.scss';
import ScrollToTop from "./ScrollToTop";
import store from "./store"

function App() {
  return (
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop>
              <Router/>
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
  )
}

export default App;
