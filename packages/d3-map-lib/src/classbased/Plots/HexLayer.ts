/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3Hexbin from 'd3-hexbin';
import { tContainerAttrs } from '../sharedTypes';
import { PlotBase } from './PlotBase';
import { tMapFeature } from './Attrs';

type tHexbinElem = {
  x: number;
  y: number;
  length: number;
};

class CHexLayer extends PlotBase {
  updatePointGrid(container: tContainerAttrs, nbrCols: number) {
    const width = container.chartWidth;
    const height = container.chartHeight;

    const hexDistance = width / (nbrCols ?? 1);
    const rows = Math.floor(height / hexDistance);

    const rangeOfValues = d3.range(rows * nbrCols);
    const mapped = rangeOfValues.map((_elem: number, i: number) => {
      const x = Math.floor((i % nbrCols) * hexDistance);
      const y = Math.floor(i / nbrCols) * hexDistance;
      return {
        x,
        y,
        datapoint: 0,
      };
    });
    return mapped;
  }

  getNewPathCreator() {
    const { zoom, position, centre, rotation, projectionType } = this.attrs;
    const projection = d3[`geo${projectionType}`]();
    const geoPath = d3.geoPath().projection(projection);

    projection.scale(zoom).translate(position).center(centre).rotate(rotation);

    return geoPath;
  }

  draw(container: tContainerAttrs) {
    const { attrs } = this;
    const { svg } = container;

    if (!svg) {
      return;
    }

    const { mapFeatures, radius, visible, onComputeColourScale } = attrs;

    const pathCreator = this.getNewPathCreator();

    const hexBin = d3Hexbin
      .hexbin<tMapFeature>()
      .radius(radius)
      .x((d: tMapFeature) => d.coords[0])
      .y((d: tMapFeature) => d.coords[1]);

    const proj = pathCreator.projection() as d3.GeoProjection;

    const converted = mapFeatures.map((elem) => {
      const newCoords = proj(elem.coords);
      return {
        ...elem,
        coords: newCoords as [number, number],
      };
    });

    const hexPoints = hexBin(converted);
    const rolledUp = hexPoints.map((elem) => ({
      x: elem.x,
      y: elem.y,
      value: elem.length,
    }));

    const dataExtent = d3.extent(rolledUp, (d) => d.value) as [number, number];

    let colourScale = d3
      .scaleSequential((t: any) => d3.interpolateViridis(t))
      .domain(dataExtent) as CallableFunction;

    if (onComputeColourScale) {
      colourScale = onComputeColourScale(dataExtent);
    }

    const mapGroup = svg.select<SVGGElement>(`.${attrs.plotID}`);

    let hexGroup = mapGroup
      .selectAll<SVGPathElement, number>('.hexes')
      .data(rolledUp);

    hexGroup.exit().style('opacity', 0).remove();

    const enterGroup = hexGroup.enter().append('path').classed('hexes', true);

    hexGroup = enterGroup.merge(hexGroup);

    hexGroup
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      .attr('d', () =>
        // return hexBin.hexagon(radiusScale(d.data.length))
        hexBin.hexagon()
      )
      .style('fill', (d) => {
        const result = colourScale(d.value);
        return result || 0;
      })
      .style('visibility', visible ? 'visible' : 'hidden');
  }
}

export { CHexLayer };
