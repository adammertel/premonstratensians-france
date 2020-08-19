import "./app.css";
import "./../node_modules/leaflet/dist/leaflet.css";
//import "./../node_modules/react-leaflet-markercluster/dist/styles.min.css";

import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/app";
import Store from "./store";

var globals: { version; store; dates } = {
  version: process.env.npm_package_version,
  store: false,
  dates: [],
};

const parsingColsRules = {
  id: (val) => parseInt(val),
  x_coordinates: (val) => parseFloat(val),
  y_coordinates: (val) => parseFloat(val),
  dissolution_earliest: (val) => parseInt(val),
  dissolution_latest: (val) => parseInt(val),
  foundation_earliest: (val) => parseInt(val),
  foundation_latest: (val) => parseInt(val),
};

const parseColValue = (col, val) => {
  if (col in parsingColsRules) {
    return parsingColsRules[col](val);
  } else {
    return val;
  }
};
const notInFranceIds = [2, 106, 150, 174];
const data = fetch(
  "https://spreadsheets.google.com/feeds/cells/1ox_Uv9xYMullKudXLFnoOgiU52QO7Sl1Dk6G6F7gg5Y/1/public/full?alt=json"
)
  .then((response) => response.json())
  .then((data) => {
    // parse JSON
    const cells = data.feed.entry.map((e) => e.gs$cell);

    const rows = {};
    cells.forEach((cell) => {
      const rowNo = cell.row;
      if (!(rowNo in rows)) {
        rows[rowNo] = [];
      }
      rows[rowNo].push({
        c: parseInt(cell.col),
        v: cell.inputValue,
      });
    });

    const colNames = rows[1].map((r) => r);

    const allRowItems: {}[] = [];

    Object.keys(rows)
      .filter((rno) => rno !== "1")
      .map((rno) => {
        const rowCells = rows[rno];
        const rowItem = {};

        rowCells.forEach((rowCell) => {
          const colName = colNames.find((col) => col.c === rowCell.c).v;
          rowItem[colName] = parseColValue(colName, rowCell.v);
        });

        allRowItems.push(rowItem);
      });

    const rowItems = allRowItems.filter(
      (i) =>
        i["y_coordinates"] &&
        i["x_coordinates"] &&
        i["foundation_earliest"] &&
        !notInFranceIds.includes(i["id"])
    );

    globals.dates = [
      Math.min(...rowItems.map((row) => row["foundation_earliest"])),
      2020,
    ];

    console.log(globals);
    globals.store = new Store(rowItems);

    ReactDOM.render(
      React.createElement(App, { store: globals["store"] }),
      document.getElementById("app")
    );
  });

export { globals };
