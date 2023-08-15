import React from "react";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

export const OpenMap = (props) => {
  const zoomLevel = 18;
  return (
    <div style={{ display: "flex", justifyContent: "center", padding:"10px" }}>
      <MapContainer
        center={[props.lat, props.lng]}
        zoom={zoomLevel}
        style={{ height: "50svh", width: "50svw" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[props.lat, props.lng]}>
          <Popup>
            <p>Last Seen At: {props.lastSeen}</p>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
