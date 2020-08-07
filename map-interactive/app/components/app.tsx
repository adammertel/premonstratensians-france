import * as React from "react";
import { MapComponent } from "./map";
import { Panel } from "./panel";
import { Welcome } from "./welcome";
import { observer } from "mobx-react";

type Props = {
  store: any;
};

export const App: React.FC<Props> = observer(({ store }) => {
  return (
    <div>
      {store.openWelcome && <Welcome store={store} />}
      <MapComponent
        handleMapMoved={store.mapMoved.bind(store)}
        center={store.center}
        zoom={store.zoom}
        data={store.activeData}
      />
      <Panel store={store} />
    </div>
  );
});
