import "./app.css";
import "./../node_modules/leaflet/dist/leaflet.css";
//import "./../node_modules/react-leaflet-markercluster/dist/styles.min.css";

import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/app";
import Store from "./store";

import data from "./data.json";

var globals: { version; store; dates; shapes } = {
  version: process.env.npm_package_version,
  store: false,
  dates: [],
  shapes: {
    circle: 9679,
    rectangle: 9632,
    triangle: 9650,
    diamond: 9670,
  },
};

const notInFranceIds = [2, 106, 150, 174];

const parsedData = data
  .filter(
    (dataRow: any) =>
      dataRow.id &&
      !notInFranceIds.includes(dataRow.id) &&
      dataRow.y_coordinates &&
      dataRow.x_coordinates
  )
  .map((dataRow: any) => {
    return {
      ...dataRow,
      id: parseInt(dataRow.id),
      x_coordinates: parseFloat(dataRow.x_coordinates),
      y_coordinates: parseFloat(dataRow.y_coordinates),
      dissolution_earliest: parseInt(dataRow.dissolution_earliest),
      dissolution_latest: parseInt(dataRow.dissolution_latest),
      foundation_earliest: parseInt(dataRow.foundation_earliest),
      foundation_latest: parseInt(dataRow.foundation_latest),
    };
  });

console.log(parsedData);

globals.store = new Store(parsedData);
globals.dates = [
  //Math.min(...data.map((row) => row["foundation_earliest"])),
  1100,
  2020,
];
ReactDOM.render(
  React.createElement(App, { store: globals["store"] }),
  document.getElementById("app")
);
export { globals };
