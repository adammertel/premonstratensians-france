import React, { useState } from "react";
import { MapComponent } from "./map";
import { Panel } from "./panel";
import { Welcome } from "./welcome";
import { observer } from "mobx-react";

type Props = {
  store: any;
};

export const App: React.FC<Props> = observer(({ store }) => {
  const [panelDisplay, setPanelDisplay] = useState(true);
  return (
    <div className={panelDisplay ? "panel-on" : "panel-off"}>
      {store.openWelcome && <Welcome store={store} />}
      {panelDisplay ? (
        <button
          className="m-0 panel-hider on text-base muni bg-black"
          onClick={() => {
            setPanelDisplay(false);
          }}
          title="toggle panel"
        >
          <i className="text-bold icon icon-arrow-alt-from-left" />
        </button>
      ) : (
        <button
          className=" m-0 panel-hider off text-base muni bg-black"
          onClick={() => {
            setPanelDisplay(true);
          }}
          title="toggle panel"
        >
          <i className="text-bold icon icon-arrow-alt-from-right" />
        </button>
      )}
      <MapComponent
        handleMapMoved={store.mapMoved.bind(store)}
        center={store.center}
        zoom={store.zoom}
        data={store.activeData}
      />
      {panelDisplay && <Panel store={store} />}
    </div>
  );
});
