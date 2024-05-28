/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import L from 'leaflet';
import { tContainerAttrs } from '../sharedTypes';
import { PlotBase } from './PlotBase';

class Markers extends PlotBase {
  draw(container: tContainerAttrs) {
    const { attrs } = this;
    const { map, svg } = container;

    if (!map || !svg) {
      return;
    }

    const { json, style, onDrawMarker } = attrs;
    const styling = style || `stroke: Orange; stroke-width: 1px; fill: blue;`;

    const mapGroup = svg.select(`.${attrs.plotID}`);

    // select all rect in svg.chart-group with the class bar
    let markers = mapGroup.selectAll('.boundary').data(json as any);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    markers.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = markers.enter().append('path').classed('boundary', true);

    // join the new data points with existing
    markers = markers.merge(enterGroup as any);

    markers
      .attr('d', (d: any, i: number) => {
        if (onDrawMarker) {
          return onDrawMarker(d, i);
        }
        return d3.symbol().type(d3.symbolSquare).size(45)() ?? '';
      })
      .attr('transform', (d: any, _i: number, _n: any) => {
        const latlng = d.latlong;
        const point: any = map.latLngToLayerPoint(
          new L.LatLng(latlng[0], latlng[1])
        );
        const { x } = point;
        const { y } = point;
        return `translate(${x},${y})`;
      })
      .attr('style', () => styling);
  }
}

export { Markers };
