import * as React from "react";

import { Hero } from "./hero";
import { Legend } from "./legend";
import { Footer } from "./footer";

type PanelProps = {
  store;
};

export const Panel: React.FC<PanelProps> = ({ store }) => {
  return (
    <div className="panel bg-primary" data-testid="panel-wrapper">
      <Hero />
      <div className="panel-content px-4">
        <Legend store={store} />
      </div>
      <div className="counter italic px-8">
        displaying {store.activeData.length} / {store.data.length} monasteries
      </div>
      <div className="buttonset m-2">
        <button
          className="text-base primary"
          onClick={() => {
            store.toggleWelcome();
          }}
        >
          <i className="mr-2 icon icon-info" />
          info
        </button>
        <button className="text-base primary">
          <a
            href="https://docs.google.com/spreadsheets/d/1ox_Uv9xYMullKudXLFnoOgiU52QO7Sl1Dk6G6F7gg5Y/edit?usp=sharing"
            target="_blank"
          >
            <i className="mr-2 icon icon-database" />
            dataset
          </a>
        </button>
      </div>
      <Footer store={store} />
    </div>
  );
};
