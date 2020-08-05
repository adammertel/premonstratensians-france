import * as React from "react";
import { MapComponent } from "./map";
import { Panel } from "./panel";
import { observer } from "mobx-react";

type Props = {
  store: any;
};

export const App: React.FC<Props> = observer(({ store }) => {
  return (
    <div>
      <MapComponent
        handleMapMoved={store.mapMoved.bind(store)}
        center={store.center}
        zoom={store.zoom}
      />
      <Panel />
    </div>
  );
});
