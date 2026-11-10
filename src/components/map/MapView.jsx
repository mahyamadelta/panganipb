import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import MapMarker from './MapMarker';

// Fix default marker icon issue with Leaflet in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const IPB_CENTER = [-6.5588, 106.7256];
const DEFAULT_ZOOM = 15;

export default function MapView({ vendors, height, onSelectVendor }) {
  const mapHeight = height || '500px';

  const validVendors = (vendors || []).filter(
    (v) => v.latitude != null && v.longitude != null
  );

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200" style={{ height: mapHeight }}>
      <MapContainer
        center={IPB_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validVendors.map((vendor) => (
          <MapMarker
            key={vendor.id || `${vendor.latitude}-${vendor.longitude}`}
            restaurant={vendor}
            onSelect={onSelectVendor}
          />
        ))}
      </MapContainer>
    </div>
  );
}
