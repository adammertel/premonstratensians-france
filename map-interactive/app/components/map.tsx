import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react";
import L, { divIcon } from "leaflet";

import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.markercluster.placementstrategies";

import {
  Map,
  Marker,
  TileLayer,
  LayersControl,
  LayerGroup,
  Tooltip,
} from "react-leaflet";

type Props = {
  data: { y_coordinates; x_coordinates }[];
  center: Array<Number>;
  zoom: Number;
  handleMapMoved: Function;
};

const iconSize = [20, 20];
const createIcon = (item) => {
  let iconShape = "⏹";
  if (item["status_or_type"] === "abbey") {
    iconShape = "⏺";
  } else if (item["status_or_type"] === "priory") {
    iconShape = "▲";
  }

  return divIcon({
    html: `<span class="icon gender-${item.gender}" style="font-size:${iconSize[0]}px">${iconShape}</span>`,
    className: "marker-icon",
    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
    iconSize: iconSize,
  });
};

const createTooltip = (item) => {
  return (
    <div key={item.id}>
      [{item.id}] <b className="name">{item.name}</b>
      <br />
      <i className="icon icon-clock"></i>{" "}
      {`${item.foundation_earliest}/${item.foundation_latest} – ${item.dissolution_earliest}/${item.dissolution_latest}`}
      <br />
    </div>
  );
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
        <Map
          center={center}
          zoom={zoom}
          ref={mapRef}
          onViewportChanged={handleMapMove}
          maxZoom={11}
          minZoom={6}
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
            <MarkerClusterGroup
              showCoverageOnHover={false}
              spiderLegPolylineOptions={{ weight: 0 }}
              clockHelpingCircleOptions={{
                weight: 0.7,
                opacity: 1,
                color: "black",
                fillOpacity: 0,
                dashArray: "10 5",
              }}
              elementsPlacementStrategy="clock-concentric"
              helpingCircles={true}
              maxClusterRadius={25}
              iconCreateFunction={(cluster) => {
                return divIcon({
                  html: `<div class="outer"><div class="inner"><span class="label">${cluster.getChildCount()}</span></div></div>`,
                  className: "marker-cluster",
                  iconSize: [20, 20],
                });
              }}
            >
              {data.map((item, ii) => {
                return (
                  <Marker
                    key={ii}
                    position={[item.y_coordinates, item.x_coordinates]}
                    icon={createIcon(item)}
                  >
                    <Tooltip direction="right">
                      <div className="tooltip-content">
                        {createTooltip(item)}
                      </div>
                    </Tooltip>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </LayerGroup>
        </Map>
      </div>
    );
  }
);
