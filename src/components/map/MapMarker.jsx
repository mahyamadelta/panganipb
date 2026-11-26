import { Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';

export default function MapMarker({ restaurant, onSelect }) {
  const position = [restaurant.latitude, restaurant.longitude];

  return (
    <Marker position={position}>
      <Popup>
        <div className="min-w-[180px] space-y-2 p-1">
          <h3 className="font-bold text-gray-900 text-sm leading-tight">
            {restaurant.name || restaurant.vendor_name}
          </h3>

          {restaurant.category && (
            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
              {restaurant.category}
            </span>
          )}

          {(restaurant.address || restaurant.location) && (
            <p className="text-xs text-gray-500 flex items-start gap-1">
              <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
              {restaurant.address || restaurant.location}
            </p>
          )}

          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(restaurant)}
              className="w-full mt-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md transition-colors"
            >
              Lihat Detail
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
