/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as d3Geo from 'd3-geo';
import * as d3Geo from 'd3';
import { tContainerAttrs } from '../sharedTypes';
import { PlotBase } from './PlotBase';

class CMapLayer extends PlotBase {
  getNewPathCreator() {
    const { zoom, position, centre, rotation, projectionType } = this.attrs;
    const projection = d3Geo[`geo${projectionType}`]();
    const geoPath = d3Geo.geoPath().projection(projection);

    projection
      .scale(zoom)
      // .translate([width / 2, height / 2])
      .translate(position)
      .center(centre)
      .rotate(rotation);

    return geoPath;
  }

  draw(container: tContainerAttrs) {
    const { attrs } = this;
    const { svg } = container;

    if (!svg) {
      return;
    }

    const { geojson, onGetSelections, visible } = attrs;

    if (!geojson || !geojson.features || geojson.features.length === 0) {
      return;
    }

    const pathCreator = this.getNewPathCreator();
    const graticule = d3Geo.geoGraticule();

    const mapGroup = svg.select<SVGGElement>(`.${attrs.plotID}`);

    let boundaries = mapGroup
      .selectAll<SVGPathElement, number>('.boundary')
      .data(geojson.features);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    boundaries.exit().remove();

    // Enter - add the shapes to this data point
    const enterGroup = boundaries
      .enter()
      .append('path')
      .classed('boundary', true);

    // join the new data points with existing
    boundaries = boundaries.merge(enterGroup);

    boundaries
      .attr('d', pathCreator as any)
      .style('fill', 'blue')
      .style('stroke', 'black')
      .style('visibility', visible ? 'visible' : 'hidden');

    if (onGetSelections) {
      onGetSelections(boundaries);
    }

    let graticulePath = mapGroup.select('.graticule path').datum(graticule());

    graticulePath.exit().remove();

    const enterGraticule = graticulePath
      .enter()
      .append('path')
      .classed('graticule', true);

    graticulePath = graticulePath.merge(enterGraticule as any);

    graticulePath
      .attr('d', pathCreator as any)
      .style('fill', 'none')
      .style('stroke', 'green');
  }
}

export { CMapLayer };
