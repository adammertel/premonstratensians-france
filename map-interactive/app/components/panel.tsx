import * as React from "react";

import { Hero } from "./hero";
import { Legend } from "./legend";
type Props = {};

export const Panel: React.FC<Props> = ({}) => {
  return (
    <div className="panel bg-primary" data-testid="panel-wrapper">
      <Hero />
      <div className="panel-content px-4"></div>

      <Legend />
    </div>
  );
};
