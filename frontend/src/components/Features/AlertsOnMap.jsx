import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IoArrowBackCircle, IoInformationCircleOutline } from "react-icons/io5";
import L from "leaflet";
import "./AlertOnMap.css"; // Ensure this CSS file exists and contains your desired styling

const customMarkerIcon = new L.Icon({
  iconUrl: "marker-icon.png", // Ensure these icon URLs point to the correct path in your project
  iconRetinaUrl: "marker-icon-2x.png",
  shadowUrl: "marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const AlertsOnMap = ({ setActiveComponent }) => {
  // Set the default position to Pune, India coordinates
  const position = [18.5204303, 73.8567437];

  return (
    <div className="alert-map-container relative">
      <button
        onClick={() => setActiveComponent("")}
        className="back-button mb-4 inline-flex items-center text-lg font-semibold text-blue-700 hover:text-blue-800 transition duration-300 ease-in-out"
      >
        <IoArrowBackCircle className="mr-2" size={24} />
        Back
      </button>

      {/* Heading and Information */}
      <div className="map-heading-container">
        <h1 className="map-heading">Real-time Alert Map</h1>
        <p className="map-info">
          View and interact with the latest alerts reported across the region. This map
          provides a visual representation of incidents to help enhance community awareness and safety.
        </p>
      </div>
      
      {/* Alert Icon and Location Indicator */}
      <div className="alert-indicator absolute z-10 top-20 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-white shadow-md rounded-full p-2">
        <IoInformationCircleOutline className="text-2xl text-red-700 animate-pulse" />
        <p className="ml-2 text-red-700 font-semibold">Click on markers for details</p>
      </div>

      {/* Map Container */}
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="map-container" // Adjust your CSS class for size and design
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={customMarkerIcon}>
          <Popup>
            A danger alert has been reported here.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default AlertsOnMap;
