import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { tModel } from './Model';

const mapboxAppKey = process.env.REACT_APP_MAPBOX_APP_KEY ?? '';
mapboxgl.accessToken = mapboxAppKey;

class Map {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapBoxMap: any;
  constructor() {
    this.mapBoxMap = null;
  }

  createMap(model: tModel) {
    const { container, style, center, zoom, pitch } = model;
    if (!container) return null;

    const map = new mapboxgl.Map({
      container,
      style,
      center,
      zoom,
      pitch,
    });
    return map;
  }

  update(model: tModel) {
    const { mapBoxMap } = this;
    const { container: passedContainer, pitch, zoom } = model;

    // PUT BACK WHEN READY
    // if (passedContainer && mapBoxMap === null) {
    //   this.mapBoxMap = this.createMap(model);
    // }

    if (!this.mapBoxMap) {
      return;
    }
    this.mapBoxMap.setPitch(pitch);
    this.mapBoxMap.setZoom(zoom);
  }
}

export default Map;
