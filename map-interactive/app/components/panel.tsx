import * as React from "react";

type Props = {};

export const Panel: React.FC<Props> = ({}) => {
  return (
    <div className="panel bg-primary" data-testid="panel-wrapper">
      <div className="content absolute">
        <h1 className="heading text-muni">Map</h1>

        <button className="primary">primary button</button>
        <button className="secondary">secondary button</button>
        <button className="danger">danger button</button>
        <button className="success">success button</button>
      </div>
    </div>
  );
};
