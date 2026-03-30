import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue with Vite bundler
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom green icon for selected center
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom blue icon for user location
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Default red icon for unselected centers
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Sub-component to recenter map when user location changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function ServiceCenterMap({ centers = [], selectedCenter, onSelectCenter, userLocation }) {
  const defaultCenter = [13.7563, 100.5018]; // Bangkok
  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <div className="rounded-lg border border-border overflow-hidden" style={{ height: '250px' }}>
      <MapContainer
        center={mapCenter}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={userLocation ? [userLocation.lat, userLocation.lng] : null} />

        {centers.map((c) => (
          <Marker
            key={c.id}
            position={[c.lat, c.lng]}
            icon={selectedCenter === c.id ? greenIcon : redIcon}
            eventHandlers={{ click: () => onSelectCenter(c.id) }}
          >
            <Popup>
              <div style={{ fontFamily: "'Sarabun', sans-serif", minWidth: 160 }}>
                <strong className="text-[12px]">{c.name}</strong>
                <p className="text-[10px] text-gray-600 mt-1">{c.address}</p>
                <p className="text-[10px] text-gray-600">{c.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={blueIcon}>
            <Popup>
              <span style={{ fontFamily: "'Sarabun', sans-serif" }} className="text-[12px] font-bold">ตำแหน่งของคุณ</span>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
