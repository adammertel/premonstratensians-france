import "./app.css";
import "./../node_modules/leaflet/dist/leaflet.css";

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

const data = fetch(
  "https://spreadsheets.google.com/feeds/cells/1ox_Uv9xYMullKudXLFnoOgiU52QO7Sl1Dk6G6F7gg5Y/1/public/full?alt=json"
)
  .then((response) => response.json())
  .then((data) => {
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

    console.log(colNames);
    console.log(rows[2]);

    const rowItems: {}[] = [];

    Object.keys(rows)
      .filter((rno) => rno !== "1")
      .map((rno) => {
        const rowCells = rows[rno];
        const rowItem = {};

        rowCells.forEach((rowCell) => {
          const colName = colNames.find((col) => col.c === rowCell.c).v;
          rowItem[colName] = parseColValue(colName, rowCell.v);
        });

        rowItems.push(rowItem);
      });

    globals.dates = [
      Math.min(
        ...rowItems
          .filter((r) => r["foundation_earliest"])
          .map((row) => row["foundation_earliest"])
      ),
      Math.max(
        ...rowItems
          .filter((r) => r["dissolution_latest"])
          .map((row) => row["dissolution_latest"])
      ),
    ];

    console.log(globals);
    globals.store = new Store(rowItems);

    ReactDOM.render(
      React.createElement(App, { store: globals["store"] }),
      document.getElementById("app")
    );
  });

export { globals };
