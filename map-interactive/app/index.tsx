import "./app.css";
import "./../node_modules/leaflet/dist/leaflet.css";

import React, { Fragment } from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/app";
import Store from "./store";

window["store"] = new Store();
ReactDOM.render(
  React.createElement(App, { store: window["store"] }),
  document.getElementById("app")
);
