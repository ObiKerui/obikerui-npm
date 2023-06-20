/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as L from 'leaflet';
import rfdc from 'rfdc';
import { tContainerAttrs } from '../attributes/container';
import plotSvgGenerator from '../generators/plotSvgGenerator';
import plotAttributes from '../attributes/plot';
import AttrsGenerator from '../generators/attributeGenerator';

export default function () {
  const obj = rfdc()(plotAttributes);

  // Building Blocks
  function buildContainerGroups(container: tContainerAttrs) {
    if (!obj || !container) {
      return;
    }
    const psvg = plotSvgGenerator() as any;
    psvg.plot(obj).container(container)();
  }

  function getPathCreator(map: L.Map) {
    // Use Leaflets projection API for drawing svg path (creates a stream of projected points)
    const projectPoint = function (this: any, x: number, y: number) {
      const point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    };

    const projection = d3.geoTransform({ point: projectPoint });
    const pathCreator = d3.geoPath().projection(projection);

    return pathCreator;
  }

  function drawData(container: tContainerAttrs) {
    const { map, svg } = container;

    if (!map || !svg) {
      return;
    }

    const pathCreator = getPathCreator(map);
    const { geojson } = obj;

    const styling = 'stroke: Orange; stroke-width: 1px; fill-opacity: .3; fill: green;';

    const mapGroup = svg.select(`.${obj.plotID}`);

    // select all rect in svg.chart-group with the class bar
    let boundaries = mapGroup.selectAll('.boundary').data((geojson as any).features);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    boundaries.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = boundaries.enter().append('path').classed('boundary', true);

    // join the new data points with existing
    boundaries = boundaries.merge(enterGroup as any);

    boundaries
      .attr('d', (features: any) => {
        const param = features;
        const result = pathCreator(param);
        return result;
      })
      .attr('style', () => styling);
  }

  function toExport(container: tContainerAttrs) {
    buildContainerGroups(container);
    drawData(container);
  }

  const generateAccessor = AttrsGenerator();
  generateAccessor.attachTo(obj);
  generateAccessor.setterReturnValue(toExport);

  toExport.plotID = generateAccessor('plotID');
  toExport.geojson = generateAccessor('geojson');
  toExport.styles = generateAccessor('styles');

  return toExport;
}
