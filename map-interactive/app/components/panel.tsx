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
      <Footer />
    </div>
  );
};
