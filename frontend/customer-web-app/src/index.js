import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App/App";

import _ from "lodash";
window._ = _;

ReactDOM.render(<App />, document.getElementById("root"));
