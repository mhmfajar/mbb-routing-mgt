import { useState, useCallback } from "react";
import Map, { NavigationControl, GeolocateControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { config } from "~/config";

const INITIAL_VIEW = {
  longitude: 106.8456,
  latitude: -6.2088,
  zoom: 12,
  pitch: 45,
  bearing: 0,
};

export default function Home() {
  const [viewState, setViewState] = useState(INITIAL_VIEW);

  const handleResetView = useCallback(() => {
    setViewState(INITIAL_VIEW);
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Map */}
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={config.mapbox.accessToken}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl position="bottom-right" />
      </Map>

      {/* Floating Sidebar */}
      <div className="absolute top-4 left-4 w-80 max-h-[calc(100vh-2rem)] flex flex-col gap-4">
        {/* Header Card */}
        <div className="bg-background-secondary/90 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <span className="text-xl">🗺️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Routing Manager</h1>
              <p className="text-xs text-text-muted">Plan your routes efficiently</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search location..."
              className="w-full bg-background/80 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-background-secondary/90 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/10">
          <h2 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">
            Map Info
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Latitude</p>
              <p className="text-sm font-mono text-white">
                {viewState.latitude.toFixed(4)}°
              </p>
            </div>
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Longitude</p>
              <p className="text-sm font-mono text-white">
                {viewState.longitude.toFixed(4)}°
              </p>
            </div>
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Zoom Level</p>
              <p className="text-sm font-mono text-white">
                {viewState.zoom.toFixed(1)}x
              </p>
            </div>
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Bearing</p>
              <p className="text-sm font-mono text-white">
                {viewState.bearing.toFixed(0)}°
              </p>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-background-secondary/90 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/10">
          <h2 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleResetView}
              className="w-full flex items-center gap-3 bg-background/50 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-xl px-4 py-3 text-sm text-white transition-all group"
            >
              <span className="w-8 h-8 rounded-lg bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center transition-colors">
                🏠
              </span>
              <span>Reset to Default View</span>
            </button>
            <button className="w-full flex items-center gap-3 bg-background/50 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-xl px-4 py-3 text-sm text-white transition-all group">
              <span className="w-8 h-8 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 flex items-center justify-center transition-colors">
                📍
              </span>
              <span>Add New Marker</span>
            </button>
            <button className="w-full flex items-center gap-3 bg-background/50 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-xl px-4 py-3 text-sm text-white transition-all group">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 flex items-center justify-center transition-colors">
                🛣️
              </span>
              <span>Plan Route</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background-secondary/90 backdrop-blur-xl rounded-full px-6 py-2 shadow-2xl border border-white/10 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-text-muted">Connected</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-xs text-text-muted">
          © {new Date().getFullYear()} Routing Manager
        </span>
      </div>
    </div>
  );
}
