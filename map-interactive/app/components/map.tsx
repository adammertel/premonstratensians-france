import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react";
import L, { divIcon } from "leaflet";

import {
  Map,
  Marker,
  TileLayer,
  LayersControl,
  LayerGroup,
} from "react-leaflet";

type Props = {
  data: { y_coordinates; x_coordinates }[];
  center: Array<Number>;
  zoom: Number;
  handleMapMoved: Function;
};

const iconSize = [12, 12];
const createIcon = (item) => {
  let iconShape = "⏹";
  if (item["status_or_type"] === "abbey") {
    iconShape = "⏺";
  } else if (item["status_or_type"] === "priory") {
    iconShape = "▲";
  }

  return divIcon({
    html: `<span class="icon gender-${item.gender}">${iconShape}</span>`,
    className: "marker-icon",
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    iconSize: iconSize,
  });
};

export const MapComponent: React.FC<Props> = observer(
  ({ data, center, zoom, handleMapMoved }) => {
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
            {data.map((item, ii) => {
              return (
                <Marker
                  key={ii}
                  position={[item.y_coordinates, item.x_coordinates]}
                  icon={createIcon(item)}
                />
              );
            })}
          </LayerGroup>
        </Map>
      </div>
    );
  }
);
