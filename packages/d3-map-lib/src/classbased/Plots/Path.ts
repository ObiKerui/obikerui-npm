/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import L from 'leaflet';
import { tContainerAttrs } from '../sharedTypes';
import { PlotBase } from './PlotBase';

class Path extends PlotBase {
  getPathCreator(map: L.Map) {
    // Use Leaflets projection API for drawing svg path (creates a stream of projected points)
    const projectPoint = function (this: any, x: number, y: number) {
      const point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    };

    const projection = d3.geoTransform({ point: projectPoint });
    const pathCreator = d3.geoPath().projection(projection);

    return pathCreator;
  }

  draw(container: tContainerAttrs) {
    const { attrs } = this;
    const { map, svg } = container;

    if (!map || !svg) {
      return;
    }

    const pathCreator = this.getPathCreator(map);
    const { geojson, style } = attrs;

    const styling =
      style ||
      'stroke: Orange; stroke-width: 1px; fill-opacity: .1; fill: green;';

    const mapGroup = svg.select(`.${attrs.plotID}`);

    // select all rect in svg.chart-group with the class bar
    let boundaries = mapGroup
      .selectAll('.boundary')
      .data((geojson as any).features);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    boundaries.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = boundaries
      .enter()
      .append('path')
      .classed('boundary', true);

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
}

export { Path };
