/* eslint-disable no-param-reassign */
import * as d3 from 'd3';
import L from 'leaflet';
import { tContainerAttrs } from '../sharedTypes';

class LeafletGenerator {
  updateSVG(container: tContainerAttrs) {
    const { html, map } = container;
    if (map) {
      return;
    }

    // Important! If you copy this code to another project you need to make
    // sure that you include the leaflet css file in your index.html (see leaflet website)
    // and the div called container here has a css height value and the
    // height of 100% being added to the custom-map-element child div here
    // is mandatory or the map won't appear - it might have a height when you
    // inspect it but it won't have a width!
    const mapContainer = d3
      .select(html)
      .append('div')
      .classed('custom-map-element', true)
      .style('height', '100%')
      .node();

    if (!mapContainer) {
      throw new Error('Map container should not be null here!');
    }

    // attrs.map = L.map(mapContainer).setView(position, zoom);
    container.map = L.map(mapContainer).setView([54.9783, -1.6178], 8);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
      // id: viewType,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(container.map);

    L.svg().addTo(container.map);

    const overlay = d3.select(container.map.getPanes().overlayPane);
    container.svg = overlay.select('svg');
    container.svg.append('g').classed('map-group', true);
  }
}

export { LeafletGenerator };
