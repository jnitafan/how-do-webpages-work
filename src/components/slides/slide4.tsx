// components/slides/Slide4.tsx
"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  FC,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import Map, { Source, Layer, MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./slides.module.scss";

type Location = { name?: string; lat: number; lng: number };

const MapGL = React.memo(function MapGL({
  locations,
  cableUrl,
}: {
  locations: Location[];
  cableUrl: string;
}) {
  const COLORS = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"];

  // Facilities GeoJSON
  const facilityGeoJson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: locations.map((loc, idx) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [loc.lng, loc.lat] },
        properties: {
          name: loc.name,
          color: COLORS[idx % COLORS.length],
        },
      })),
    }),
    [locations, COLORS]
  );

  // Cables GeoJSON
  const [cableGeoJson, setCableGeoJson] = useState<any>(null);
  useEffect(() => {
    fetch(cableUrl)
      .then((res) => res.json())
      .then((data) => {
        const feats = data.features.map((feat: any, idx: number) => ({
          ...feat,
          properties: {
            ...feat.properties,
            color: COLORS[idx % COLORS.length],
          },
        }));
        setCableGeoJson({ ...data, features: feats });
      })
      .catch(console.error);
  }, [cableUrl]);

  // ref to React-Map-GL Map, use getMap() for MapLibre.Map
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance || !cableGeoJson) return;

    let facilityPopup: maplibregl.Popup | null = null;
    let cablePopup: maplibregl.Popup | null = null;

    // FACILITY handlers
    const onFacilityEnter = (e: maplibregl.MapLayerMouseEvent) => {
      mapInstance.getCanvas().style.cursor = "pointer";
      const { lng, lat } = e.lngLat;
      const props = e.features?.[0]?.properties as any;
      facilityPopup?.remove();
      facilityPopup = new maplibregl.Popup({
        offset: 10,
        focusAfterOpen: false,
        closeButton: false,
        closeOnClick: false,
      })
        .setLngLat([lng, lat])
        .setHTML(
          `<div class=${styles.s4__info}><strong>Facility:</strong> ${props.name}</div>`
        )
        .addTo(mapInstance);
    };
    const onFacilityLeave = () => {
      mapInstance.getCanvas().style.cursor = "";
      facilityPopup?.remove();
      facilityPopup = null;
    };

    // CABLE handlers
    const onCableEnter = (e: maplibregl.MapLayerMouseEvent) => {
      mapInstance.getCanvas().style.cursor = "pointer";
      const { lng, lat } = e.lngLat;
      const props = e.features?.[0]?.properties as any;
      cablePopup?.remove();
      cablePopup = new maplibregl.Popup({
        offset: 10,
        focusAfterOpen: false,
        closeButton: false,
        closeOnClick: false,
      })
        .setLngLat([lng, lat])
        .setHTML(
          `<div class=${styles.s4__info}><strong>Cable:</strong> ${
            props.name ?? props.id
          }</div>`
        )
        .addTo(mapInstance);
    };
    const onCableLeave = () => {
      mapInstance.getCanvas().style.cursor = "";
      cablePopup?.remove();
      cablePopup = null;
    };

    mapInstance.on("mouseenter", "facilities", onFacilityEnter);
    mapInstance.on("mouseleave", "facilities", onFacilityLeave);
    mapInstance.on("mouseenter", "cables", onCableEnter);
    mapInstance.on("mouseleave", "cables", onCableLeave);

    return () => {
      mapInstance.off("mouseenter", "facilities", onFacilityEnter);
      mapInstance.off("mouseleave", "facilities", onFacilityLeave);
      mapInstance.off("mouseenter", "cables", onCableEnter);
      mapInstance.off("mouseleave", "cables", onCableLeave);
    };
  }, [cableGeoJson, facilityGeoJson]);

  return (
    <Map
      ref={mapRef}
      mapLib={maplibregl}
      mapStyle="/map-style.json"
      initialViewState={{ longitude: 0, latitude: 0, zoom: 1.3 }}
      style={{ width: "100%", height: "100%" }}
      interactiveLayerIds={["cables", "facilities"]}
    >
      {cableGeoJson && (
        <Source id="cables" type="geojson" data={cableGeoJson}>
          <Layer
            id="cables"
            type="line"
            paint={{
              "line-color": ["get", "color"],
              "line-width": 2,
            }}
          />
        </Source>
      )}
      <Source id="facilities" type="geojson" data={facilityGeoJson}>
        <Layer
          id="facilities"
          type="circle"
          paint={{
            "circle-radius": 4,
            "circle-color": ["get", "color"],
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 1,
          }}
        />
      </Source>
    </Map>
  );
});

const cableUrl = "/cable-geo.json";
const facilityUrl = "/facilities.json";

const CableMap: FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetch(facilityUrl)
      .then((res) => res.json())
      .then((data) => {
        setLocations(
          data.data.map((f: any) => ({
            name: f.name,
            lat: f.latitude,
            lng: f.longitude,
          }))
        );
      })
      .catch(console.error);
  }, []);

  return (
    <div
      className={styles.worldMap}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <MapGL locations={locations} cableUrl={cableUrl} />
    </div>
  );
};

const Slide4 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide} style={{ height: "100vh" }}>
      <CableMap />
    </div>
  );
});

export default Slide4;
