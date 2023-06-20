/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as L from 'leaflet';
import { tContainerAttrs } from '../attributes/container';
import plotAttributes from '../attributes/plot';
import plotSvgGenerator from '../generators/plotSvgGenerator';
import AttrsGenerator from '../generators/attributeGenerator';

export default function () {
  const obj: any = JSON.parse(JSON.stringify(plotAttributes));

  // Building Blocks
  function buildContainerGroups(container: tContainerAttrs) {
    const { svg } = container;
    if (!svg) {
      return;
    }

    const psvg = plotSvgGenerator() as any;
    psvg.plot(obj).container(container)();
  }

  function drawData(container: tContainerAttrs) {
    const { map, svg } = container;

    if (!map || !svg) {
      return;
    }

    const { json } = obj;
    const styling = `
      stroke: Orange,
      stroke-width: 1px,
      fill: blue
    `;

    const mapGroup = svg.select(`.${obj.plotID}`);

    // select all rect in svg.chart-group with the class bar
    let markers = mapGroup.selectAll('.boundary').data(json);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    markers.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = markers.enter().append('path').classed('boundary', true);

    // join the new data points with existing
    markers = markers.merge(enterGroup as any);

    markers
      .attr('d', (_d: any, _i: number, _n: any) => d3.symbol().type(d3.symbolSquare).size(45)())
      .attr('transform', (d: any, _i: number, _n: any) => {
        const latlng = d.latlong;
        const point: any = map.latLngToLayerPoint(new L.LatLng(latlng[0], latlng[1]));
        const { x } = point;
        const { y } = point;
        return `translate(${x},${y})`;
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
  toExport.json = generateAccessor('json');
  toExport.styles = generateAccessor('styles');

  return toExport;
}
