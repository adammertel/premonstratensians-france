import "./app.css";
import "./../node_modules/leaflet/dist/leaflet.css";

import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/app";
import Store from "./store";

var globals = {
  store: new Store(),
  version: process.env.npm_package_version,
};

ReactDOM.render(
  React.createElement(App, { store: globals["store"] }),
  document.getElementById("app")
);

export { globals };
