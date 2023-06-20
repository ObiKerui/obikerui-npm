/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import * as L from 'leaflet';
import rfdc from 'rfdc';
import ContainerAttrs from './attributes/container';
import AttrsGenerator from './generators/attributeGenerator';

function Container() {
  const obj = rfdc()(ContainerAttrs);
  const plots: CallableFunction[] = [];

  function buildMap(container: HTMLElement) {
    const { zoom, position } = obj;

    // Important! If you copy this code to another project you need to make
    // sure that you include the leaflet css file in your index.html (see leaflet website)
    // and the div called container here has a css height value and the
    // height of 100% being added to the custom-map-element child div here
    // is mandatory or the map won't appear - it might have a height when you
    // inspect it but it won't have a width!
    const mapContainer = d3
      .select(container)
      .append('div')
      .classed('custom-map-element', true)
      .style('height', '100%')
      .node();

    if (!mapContainer) {
      throw new Error('Map container should not be null here!');
    }

    obj.map = L.map(mapContainer).setView(position, zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
      // id: viewType,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(obj.map);

    L.svg().addTo(obj.map);
  }

  function buildSVG() {
    const { map } = obj;

    if (!map) {
      throw new Error('Error! map should not be null');
    }

    const overlay = d3.select(map.getPanes().overlayPane);
    obj.svg = overlay.select('svg');
    obj.svg.append('g').classed('map-group', true);
  }
  function toExport(htmlSelection: d3.Selection<HTMLElement, unknown, null, undefined>) {
    const node = htmlSelection.node();
    if (!node) {
      return;
    }

    if (!obj.map) {
      buildMap(node);
    }

    if (!obj.svg) {
      buildSVG();
    }

    if (obj.map) {
      obj.map.on('zoomend', () => {
        plots.forEach((plot: CallableFunction) => {
          plot(obj);
        });
      });
    }

    plots.forEach((plot: CallableFunction) => {
      plot(obj);
    });

    if (obj.legend) obj.legend(obj, plots);

    if (obj.showMargins && obj.svg) {
      obj.svg.style('background-color', 'rgba(255, 0, 0, .2)');
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  toExport.plot = function (x: any): any {
    if (Number.isInteger(x) && plots.length > 0) {
      return plots[x];
    }
    if (typeof x === 'string') {
      const labels = plots.filter((elem: any) => elem.tag() === x);
      if (labels.length > 0) {
        return labels[0];
      }
      return null;
    }
    plots.push(x);
    return toExport;
  };

  const generateAccessor = AttrsGenerator();
  generateAccessor.attachTo(obj);
  generateAccessor.setterReturnValue(toExport);

  toExport.position = generateAccessor('position');
  toExport.viewType = generateAccessor('viewType');
  toExport.zoom = generateAccessor('zoom');
  toExport.scale = generateAccessor('scale');
  toExport.legend = generateAccessor('legend');
  toExport.showMargins = generateAccessor('showMargins');
  toExport.height = generateAccessor('height');
  toExport.width = generateAccessor('width');
  toExport.margin = generateAccessor('margins');
  toExport.xAxisLabel = generateAccessor('xAxisLabel');
  toExport.xAxisText = generateAccessor('xAxisText');
  toExport.yAxisLabel = generateAccessor('yAxisLabel');
  toExport.yAxisText = generateAccessor('yAxisText');
  toExport.yAxisPosition = generateAccessor('yAxisPosition');

  return toExport;
}

export { Container };
export type tContainers = typeof Container;
