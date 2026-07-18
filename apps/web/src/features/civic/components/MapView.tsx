import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoJSONPoint } from '@civichub/shared';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  location?: GeoJSONPoint;
  onChange?: (location: GeoJSONPoint) => void;
  readOnly?: boolean;
  className?: string;
}

function LocationMarker({ position, onChange, readOnly }: { position: L.LatLng | null, onChange?: (pos: L.LatLng) => void, readOnly: boolean }) {
  useMapEvents({
    click(e) {
      if (!readOnly && onChange) {
        onChange(e.latlng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

export default function MapView({ location, onChange, readOnly = false, className = '' }: MapViewProps) {
  // Default to a central location if none provided (e.g., Civic Center)
  const defaultCenter: L.LatLngExpression = [37.7749, -122.4194]; 
  
  const currentPos: L.LatLng | null = location 
    ? L.latLng(location.coordinates[1], location.coordinates[0]) 
    : null;

  const handleLocationChange = (latlng: L.LatLng) => {
    if (onChange) {
      onChange({
        type: 'Point',
        coordinates: [latlng.lng, latlng.lat]
      });
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-glass border border-glass-border ${className}`}>
      <MapContainer 
        center={currentPos || defaultCenter} 
        zoom={13} 
        scrollWheelZoom={!readOnly}
        style={{ height: '100%', width: '100%', minHeight: '300px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={currentPos} onChange={handleLocationChange} readOnly={readOnly} />
      </MapContainer>
      {!readOnly && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[400] bg-glass p-2 rounded-lg backdrop-blur-md text-sm font-medium text-text-primary shadow-lg border border-glass-border pointer-events-none">
          Click on the map to set a location
        </div>
      )}
    </div>
  );
}
