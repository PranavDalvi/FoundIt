import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "./MapStyle.scss";
import "leaflet/dist/leaflet.css";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import userLocation from "../../assets/user-location-fill.svg";
import searchIcon from "../../assets/search-2-fill.svg";

import L from "leaflet";
import "leaflet-control-geocoder";
import { TextField } from "@mui/material";
import { LostForm } from "../lostForm/LostForm";


export const GeoLocation = () => {
  const geocoder = L.Control.Geocoder.nominatim();
  const [latitude, setLatitude] = useState("19.0213777");
  const [longitude, setLongitude] = useState("72.8310904874894");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([
    {
      name: "search to get places",
      center: {
        lat: 19.0213777,
        lng: 72.8310904874894,
      },
    },
  ]);
  const mapRef = useRef(null);
  const zoomLevel = 18;
  const buttonHeight = 55;
  const buttonGroupWidth = "100%";
  const buttonGroupHeight = "1vh";
  const dynamicDiv = searchResults.length * 45;

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      if (mapRef.current) {
        mapRef.current.flyTo(
          [position.coords.latitude, position.coords.longitude],
          zoomLevel
        );
      }
    });
  };

  const handleSearch = () => {
    geocoder.geocode(searchQuery, (results) => {
      if (results.length == 0) {
        alert(`Cannot Find Requested Location! ${searchQuery}`);
      } else {
        setSearchResults(results);
      }
    });
  };

  const handleSearchClick = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], zoomLevel);
    }
  };

  const GetPosition = () => {
    const map = useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });
  };

  return (
    <div>
      <div className="flex">
    <div className="map-container">
      <h2>Lost Object Location</h2>

      <MapContainer
        ref={mapRef}
        center={[latitude, longitude]}
        zoom={zoomLevel}
        style={{ height: "70vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GetPosition />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <p>
              Latitude: {latitude} Longitude: {longitude}
            </p>
          </Popup>
        </Marker>
      </MapContainer>
      <div>
        <div className="topControl">
          <Button
            variant="outlined"
            onClick={handleClick}
            sx={{
              height: buttonHeight,
            }}
          >
            <img src={userLocation} />
          </Button>

          <TextField
            id="outlined-basic"
            label="Search for a location"
            variant="outlined"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              borderColor: `#1976d2`,
            }}
          />
          <Button
            variant="outlined"
            onClick={handleSearch}
            sx={{
              height: buttonHeight,
            }}
          >
            <img src={searchIcon} />
          </Button>
        </div>
        {searchResults !== null && (
          <div
            style={{
              height: `${dynamicDiv}px`,
            }}
          >
            <ButtonGroup
              orientation="vertical"
              aria-label="vertical outlined button group"
              sx={{
                width: buttonGroupWidth,
                height: buttonGroupHeight,
              }}
            >
              {searchResults.map((searchResult) => (
                <Button
                  key={searchResult.name}
                  onClick={() => {
                    handleSearchClick(
                      searchResult.center.lat,
                      searchResult.center.lng
                    );
                  }}
                >
                  {searchResult.name}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        )}
      </div>
      <LostForm lat={latitude} lng={longitude} />
    </div>
    </div>
    </div>
  );
};
