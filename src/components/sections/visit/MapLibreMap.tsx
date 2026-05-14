"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const COORDS: [number, number] = [-6.6307, 38.886]; // [lng, lat]
const FINAL_ZOOM = 15.6;
const INITIAL_ZOOM = 11;

// Custom dark style built on top of OpenStreetMap's free Carto-style "voyager
// dark" basemap. We pin the colours so water / streets / parks fall inside
// our brand palette. Loads from demotiles.maplibre.org which is the canonical
// CDN MapLibre uses for sample tiles — fast and free.
const STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "osm-raster": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap, © Carto",
    },
    "osm-labels": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
    },
  },
  layers: [
    { id: "bg", type: "background", paint: { "background-color": "#0E0C14" } },
    {
      id: "tiles",
      type: "raster",
      source: "osm-raster",
      paint: {
        "raster-saturation": -0.5,
        "raster-brightness-min": 0.15,
        "raster-brightness-max": 0.6,
        "raster-hue-rotate": 250,
        "raster-opacity": 0.95,
      },
    },
    {
      id: "labels",
      type: "raster",
      source: "osm-labels",
      paint: { "raster-opacity": 0.55 },
    },
  ],
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
};

export function MapLibreMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      center: COORDS,
      zoom: INITIAL_ZOOM,
      attributionControl: false,
      cooperativeGestures: true,
      maxZoom: 18,
      minZoom: 9,
    });
    mapRef.current = map;

    map.on("load", () => {
      // Smooth zoom-in animation that frames the restaurant — gives the
      // first-load moment a "premium" feel without external libs.
      map.flyTo({
        center: COORDS,
        zoom: FINAL_ZOOM,
        speed: 0.7,
        curve: 1.4,
        easing: (t) => t * (2 - t),
      });

      // 5-minute walking circle (~400m radius). Stroke only — fill is
      // distracting on a dark map.
      const radiusMeters = 400;
      const lat = COORDS[1];
      const metersPerDegree = 111_320 * Math.cos((lat * Math.PI) / 180);
      const deltaLng = radiusMeters / metersPerDegree;
      const deltaLat = radiusMeters / 111_320;
      const circle = polygonCircle(COORDS, deltaLng, deltaLat, 64);

      map.addSource("walking-circle", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [circle] } },
      });
      map.addLayer({
        id: "walking-circle-stroke",
        type: "line",
        source: "walking-circle",
        paint: {
          "line-color": "#A87BFF",
          "line-width": 1.5,
          "line-opacity": 0.55,
          "line-dasharray": [4, 3],
        },
      });
      map.addLayer({
        id: "walking-circle-fill",
        type: "fill",
        source: "walking-circle",
        paint: {
          "fill-color": "#8B4DFF",
          "fill-opacity": 0.07,
        },
      });

      // Custom HR+ pin — DOM marker so we can use SVG with gradient + glow.
      const el = document.createElement("div");
      el.style.cursor = "pointer";
      el.innerHTML = `
        <svg width="44" height="56" viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 12px rgba(255,90,31,0.4));">
          <defs>
            <linearGradient id="pin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38B6FF"/>
              <stop offset="100%" stop-color="#A87BFF"/>
            </linearGradient>
          </defs>
          <path d="M22 0 C 9.85 0 0 9.85 0 22 C 0 38.5 22 56 22 56 C 22 56 44 38.5 44 22 C 44 9.85 34.15 0 22 0 Z" fill="url(#pin-grad)"/>
          <circle cx="22" cy="22" r="14" fill="#07060A"/>
          <text x="22" y="22" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#F6F1E8" font-family="Georgia, serif">HR</text>
          <text x="22" y="32" text-anchor="middle" dominant-baseline="central" font-size="9" fill="#A87BFF" font-family="Georgia, serif">+</text>
        </svg>
      `;
      new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat(COORDS).addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 [&_.maplibregl-canvas]:!outline-none" />
      <span className="absolute bottom-2 right-2 z-10 inline-block rounded-full bg-ink-950/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-bone-100/55 backdrop-blur-sm">
        © OSM · Carto
      </span>
    </div>
  );
}

// Approximate a circle as a 64-segment polygon. Good enough at city zoom.
function polygonCircle(
  center: [number, number],
  deltaLng: number,
  deltaLat: number,
  steps: number
): Array<[number, number]> {
  const ring: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    ring.push([center[0] + deltaLng * Math.cos(angle), center[1] + deltaLat * Math.sin(angle)]);
  }
  return ring;
}
