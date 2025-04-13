"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import styles from "./page.module.scss";
import { FC, useEffect, useState, useCallback } from "react";
import { Tooltip } from "react-tooltip";

type Location = {
  name?: string;
  lat: number;
  lng: number;
};

interface MapSVGProps {
  locations: Location[];
  cableUrl: string;
  geoUrl: string;
  // Callback for cable hover
  onHoverCable: (cableName: string | undefined) => void;
  onLeaveCable: () => void;
  // Callback for marker hover
  onHoverMarker: (locationName: string | undefined) => void;
  onLeaveMarker: () => void;
}

// Memoize so that it doesn’t re-render on every tooltip update
const MapSVG: React.FC<MapSVGProps> = React.memo(function MapSVG(props) {
  const {
    locations,
    cableUrl,
    geoUrl,
    onHoverCable,
    onLeaveCable,
    onHoverMarker,
    onLeaveMarker,
  } = props;

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 120, center: [0, 0] }}
      style={{ width: "100%", height: "auto" }}
    >
      {/* 1) Normal Geographies for the world map. */}
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: { outline: "none" },
                hover: { outline: "none" },
                pressed: { outline: "none" },
              }}
            />
          ))
        }
      </Geographies>

      {/* 2) Second Geographies block for submarine cables. */}
      <Geographies geography={cableUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="none"
              stroke="steelblue"
              strokeWidth={2}
              onMouseEnter={() => onHoverCable(geo.properties.name)}
              onMouseLeave={onLeaveCable}
              data-tooltip-id="marker-tooltip"
            />
          ))
        }
      </Geographies>

      {/* 3) Markers for facilities (or city/country locations, etc.) */}
      {locations.map((loc, index) => (
        <Marker
          key={index}
          coordinates={[loc.lng, loc.lat]}
          data-tooltip-id="marker-tooltip"
          onMouseEnter={() => onHoverMarker(loc.name)}
          onMouseLeave={onLeaveMarker}
          suppressHydrationWarning
        >
          <circle r={4} fill="#FF5533" stroke="#fff" strokeWidth={1} />
        </Marker>
      ))}
    </ComposableMap>
  );
});

const geoUrl = "/world-110m.json";
const cableUrl = "/cable-geo.json";
const facilityUrl = "/fac.json";

type facilityLocation = {
  name?: string;
  latitude: number;
  longitude: number;
};

const HomePage: FC = () => {
  const [locations, setLocations] = useState<
    { name?: string; lat: number; lng: number }[]
  >([]);

  // This holds the tooltip text.
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    fetch(facilityUrl)
      .then((response) => response.json())
      .then((facilityData) => {
        // Convert the JSON { data: [{ name, latitude, longitude }, ...] }
        // to an array of { name, lat, lng }
        const locs = facilityData.data.map((x: facilityLocation) => {
          return { name: x.name, lat: x.latitude, lng: x.longitude };
        });
        setLocations(locs);
      })
      .catch((error) => {
        console.error("Error fetching fac.json:", error);
      });
  }, []);

  // Callbacks to handle hover events.
  // useCallback ensures these function references remain stable
  // (so MapSVG doesn't re-render if these don't change).
  const handleHoverCable = useCallback((cableName?: string) => {
    setTooltipContent(`Cable: ${cableName ?? "N/A"}`);
  }, []);

  const handleLeaveCable = useCallback(() => {
    setTooltipContent("");
  }, []);

  const handleHoverMarker = useCallback((locName?: string) => {
    setTooltipContent(`Place: ${locName ?? "N/A"}`);
  }, []);

  const handleLeaveMarker = useCallback(() => {
    setTooltipContent("");
  }, []);

  return (
    <div className={styles.worldMap} style={{ position: "relative" }}>
      {/*
        Pass the minimal set of props into the memoized MapSVG. 
        Changing tooltipContent in the parent won't cause MapSVG to re-render.
      */}
      <MapSVG
        geoUrl={geoUrl}
        cableUrl={cableUrl}
        locations={locations}
        onHoverCable={handleHoverCable}
        onLeaveCable={handleLeaveCable}
        onHoverMarker={handleHoverMarker}
        onLeaveMarker={handleLeaveMarker}
      />

      {/*
        The <Tooltip> is rendered in the parent. 
        It's controlled by 'tooltipContent' state only, 
        so the map won't re-render on every mouse move.
      */}
      <Tooltip id="marker-tooltip" content={tooltipContent} />
    </div>
  );
};

export default HomePage;
