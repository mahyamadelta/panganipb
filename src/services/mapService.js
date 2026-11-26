/**
 * Map configuration and helper utilities for the Leaflet-based campus map.
 */

/** IPB University Dramaga campus centre (latitude, longitude). */
export const IPB_CENTER = [-6.5588, 106.7256];

/** Default zoom level for the campus map view. */
export const DEFAULT_ZOOM = 15;

/** OpenStreetMap tile layer URL template. */
export const TILE_URL =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

/** Attribution string required by OSM. */
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/**
 * Returns `true` when the given latitude and longitude are valid WGS-84
 * coordinates.
 */
export function isValidCoordinate(lat, lng) {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Returns `true` when the coordinate falls within the approximate bounding
 * box of the IPB Dramaga campus area.
 */
export function isInIPBArea(lat, lng) {
  return lat >= -6.62 && lat <= -6.53 && lng >= 106.70 && lng <= 106.76;
}
