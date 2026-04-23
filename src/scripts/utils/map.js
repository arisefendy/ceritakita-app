import { map, tileLayer, Icon, icon, marker, popup, latLng, layerGroup, control } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import CONFIG from '../config';

export default class Map {
  #zoom = 5;
  #map = null;
  #storyLocationLayer = null;

  #activeMarker = null;
  #defaultIcon = null;
  #activeIcon = null;

  static async getPlaceNameByCoordinate(latitude, longitude) {
    try {
      const url = new URL(`https://api.maptiler.com/geocoding/${longitude},${latitude}.json`);
      url.searchParams.set('key', CONFIG.MAP_SERVICE_API_KEY);
      url.searchParams.set('language', 'id');
      url.searchParams.set('limit', '1');

      const response = await fetch(url);
      const json = await response.json();

      const place = json.features[0].place_name.split(', ');
      return [place.at(-2), place.at(-1)].map((name) => name).join(', ');
    } catch (error) {
      console.error('getPlaceNameByCoordinate: error:', error);
      return `${latitude}, ${longitude}`;
    }
  }

  static isGeolocationAvailable() {
    return 'geolocation' in navigator;
  }

  static getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!Map.isGeolocationAvailable()) {
        reject('Geolocation API unsupported');
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  static async build(selector, options = {}) {
    if ('center' in options && options.center) {
      return new Map(selector, options);
    }

    const jakartaCoordinate = [-6.2, 106.816666];

    // Using Geolocation API
    if ('locate' in options && options.locate) {
      try {
        const position = await Map.getCurrentPosition();
        const coordinate = [position.coords.latitude, position.coords.longitude];

        return new Map(selector, {
          ...options,
          center: coordinate,
        });
      } catch (error) {
        console.error('build: error:', error);

        return new Map(selector, {
          ...options,
          center: jakartaCoordinate,
        });
      }
    }

    return new Map(selector, {
      ...options,
      center: jakartaCoordinate,
    });
  }

  constructor(selector, options = {}) {
    this.#zoom = options.zoom ?? this.#zoom;
    this.#storyLocationLayer = layerGroup();

    // Tile layers
    const tileOsm = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    });
    const tileSatellite = tileLayer(
      `https://api.maptiler.com/maps/hybrid-v4/{z}/{x}/{y}.png?key=${CONFIG.MAP_SERVICE_API_KEY}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> ' +
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      },
    );

    this.#map = map(document.querySelector(selector), {
      zoom: this.#zoom,
      scrollWheelZoom: false,
      layers: [tileOsm, this.#storyLocationLayer],
      ...options,
    });

    const baseMaps = {
      Peta: tileOsm,
      Satelit: tileSatellite,
    };

    const overlayMaps = {
      'Lokasi Cerita': this.#storyLocationLayer,
    };

    const layerControl = control.layers(baseMaps, overlayMaps);
    layerControl.addTo(this.#map);

    // Default icon marker
    this.#defaultIcon = this.createIcon({
      iconRetinaUrl: '/images/icons/marker-icon-2x-blue.png',
      iconUrl: '/images/icons/marker-icon-blue.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });

    // Active icon marker
    this.#activeIcon = this.createIcon({
      iconRetinaUrl: '/images/icons/marker-icon-2x-orange.png',
      iconUrl: '/images/icons/marker-icon-orange.png',
      iconSize: [35, 55],
      iconAnchor: [17, 55],
      popupAnchor: [0, -55],
    });
  }

  changeCamera(coordinate, zoomLevel = null) {
    if (!zoomLevel) {
      this.#map.setView(latLng(coordinate), this.#zoom);
      return;
    }

    this.#map.setView(latLng(coordinate), zoomLevel);
  }

  getCenter() {
    const { lat, lng } = this.#map.getCenter();
    return {
      latitude: lat,
      longitude: lng,
    };
  }

  createIcon(options = {}) {
    return icon({
      ...Icon.Default.prototype.options,
      iconRetinaUrl: options.iconRetinaUrl || markerIcon2x,
      iconUrl: options.iconUrl || markerIcon,
      shadowUrl: markerShadow,
      iconSize: options.iconSize || [25, 41],
      ...options,
    });
  }

  addMarker(coordinates, markerOptions = {}, popupOptions = null, interactive = true) {
    if (typeof markerOptions !== 'object') {
      throw new Error('markerOptions must be an object');
    }

    const newMarker = marker(coordinates, {
      icon: this.#defaultIcon,
      ...markerOptions,
    });

    if (popupOptions) {
      if (typeof popupOptions !== 'object') {
        throw new Error('popupOptions must be an object');
      }

      if (!('content' in popupOptions)) {
        throw new Error('popupOptions must include `content` property.');
      }

      const newPopup = popup(coordinates, popupOptions);
      newMarker.bindPopup(newPopup);
    }

    newMarker.addTo(this.#storyLocationLayer);

    // Interactive mode with highlight marker active
    if (interactive) {
      newMarker.on('click', () => {
        if (this.#activeMarker && this.#activeMarker !== newMarker) {
          this.#activeMarker.setIcon(this.#defaultIcon);
        }

        newMarker.setIcon(this.#activeIcon);
        this.#activeMarker = newMarker;
      });

      newMarker.on('popupclose', () => {
        if (this.#activeMarker === newMarker) {
          newMarker.setIcon(this.#defaultIcon);
          this.#activeMarker = null;
        }
      });
    }

    return newMarker;
  }

  clearMarkers() {
    this.#storyLocationLayer.clearLayers();
    this.#activeMarker = null;
  }

  addMapEventListener(eventName, callback) {
    this.#map.addEventListener(eventName, callback);
  }
}
