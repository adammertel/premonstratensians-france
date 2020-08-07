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
  Popup,
  ScaleControl,
} from "react-leaflet";

type Props = {
  data: { id; y_coordinates; x_coordinates }[];
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
    <div key={item.id} className="tooltip">
      <div key="id" className="tooltip-heading">
        [{item.id}] <b className="name">{item.name}</b>
        <i> ({item.localisation_precision})</i>
      </div>
      <div key="time" className="tooltip-line">
        <i className="icon icon-clock"></i>
        <span className="text">
          {`${item.foundation_earliest}/${item.foundation_latest} – ${item.dissolution_earliest}/${item.dissolution_latest}`}
        </span>
      </div>
      <div key="place" className="tooltip-line">
        <i className="icon icon-location"></i>
        <span className="text">{`departement ${item.departement}`}</span>
      </div>
      <div key="dedication" className="tooltip-line">
        <i className="icon icon-place-of-worship"></i>
        <span className="text">
          {`patrocinium ${
            item.patrocinium ? item.patrocinium.split("#").join(", ") : ""
          }`}
        </span>
      </div>
      {(item.wiki_en_reference || item.wiki_fr_reference) && (
        <div key="links" className="tooltip-line">
          <i className="icon icon-wikipedia-w"></i>
          <span className="text">
            {item.wiki_en_reference && (
              <span className="text-part">
                <a target="_blank" href={item.wiki_en_reference}>
                  en
                </a>
              </span>
            )}
            {item.wiki_fr_reference && (
              <span className="text-part">
                <a target="_blank" href={item.wiki_fr_reference}>
                  fr
                </a>
              </span>
            )}
          </span>
        </div>
      )}
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
          <ScaleControl />
          <LayersControl position="bottomright">
            <LayersControl.BaseLayer
              name="Ancient World Mapping Center"
              checked={true}
            >
              <TileLayer
                key="awmc"
                maxNativeZoom={15}
                attribution="<a href='http://awmc.unc.edu/wordpress/'>Ancient World Mapping Center</a>"
                url="http://a.tiles.mapbox.com/v3/isawnyu.map-knmctlkh/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Cassini map">
              <TileLayer
                key="cassini"
                maxNativeZoom={15}
                attribution="<a href='chartae-antiquae.cz'>chartae-antiquae.cz</a>"
                url="http://www.chartae-antiquae.cz/TMS/Francie/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Open Street Maps">
              <TileLayer
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Open Topo Maps">
              <TileLayer
                attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name="Stamen labels" checked={true}>
              <TileLayer
                key="stamen"
                attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}"
                subdomains="abcd"
                ext="png"
              />
            </LayersControl.Overlay>
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
                    <Popup>
                      <div className="tooltip-content">
                        {createTooltip(item)}
                      </div>
                    </Popup>
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
