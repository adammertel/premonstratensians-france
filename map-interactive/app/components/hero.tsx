import * as React from "react";

import { globals } from "./../index";

type HeroProps = {};

export const Hero: React.FC<HeroProps> = ({}) => {
  return (
    <div
      className="hero font-bold text-xl pt-12 pb-4 px-4 text-white bg-cover bg-repeat-round"
      data-testid="welcome-wrapper"
      style={{
        background: " cover",
        backgroundImage: `url(
            "https://cdn.muni.cz/media/3132847/out_gradient.png?mode=crop&center=0.54,0.86&rnd=131981761180000000&width=974&heightratio=0.23715"
          )`,
      }}
    >
      <h2 className="heading text-2xl text-white font-bold">
        Premonstratensian monasteries in France
      </h2>
      <h4 className="subheading text-lg text-white font-medium">
        (v. {globals.version})
      </h4>
    </div>
  );
};
