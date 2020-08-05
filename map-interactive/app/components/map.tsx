import React, { useRef, useEffect } from "react";
import * as L from "leaflet";
import { observer } from "mobx-react";
import { classnames } from "tailwindcss-classnames";

import {
  Map,
  Marker,
  TileLayer,
  LayersControl,
  LayerGroup,
} from "react-leaflet";

type Props = {
  center: Array<Number>;
  zoom: Number;
  handleMapMoved: Function;
};

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [25, 40],
  iconAnchor: [12, 40],
});

export const MapComponent: React.FC<Props> = observer(
  ({ center, zoom, handleMapMoved }) => {
    const mapRef = useRef<any | null>(null);
    let mapEl: L.Map | false = false;

    useEffect(() => {
      if (mapRef) {
        if (mapRef.current && mapRef.current.leafletElement)
          mapEl = mapRef.current?.leafletElement;
        setTimeout(() => {
          mapEl.invalidateSize();
        }, 0);
      }
    });

    const handleMapMove = (e) => {
      if (mapEl) {
        handleMapMoved(e.center, e.zoom, mapEl.getBounds());
      }
    };

    return (
      <div className="map" data-testid="map-wrapper">
        <div className="info">{center && center.join("-")}</div>
        <Map
          center={center}
          zoom={zoom}
          ref={mapRef}
          onViewportChanged={handleMapMove}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer
              name="OpenStreetMap.BlackAndWhite"
              checked={true}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="OpenStreetMap.Mapnik">
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <LayerGroup>
            <Marker position={[48.93, 18.15]} icon={icon} />
          </LayerGroup>
        </Map>
      </div>
    );
  }
);
