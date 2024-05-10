/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';
import { Interpolator } from './Interpolator';

const defaultColours = ['red', 'green', 'blue', 'grey'];

type tD3Scale = {
  domain: any;
};

class CFillArea extends PlotBase {
  interpolator: Interpolator;

  constructor() {
    super();
    this.interpolator = new Interpolator();
  }

  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const d3XScale = yScale as unknown as tD3Scale;

    const { attrs } = this;
    const { alpha, labels } = attrs;
    const { svg } = container;
    const colours = attrs.colours ?? defaultColours;
    const colourScale = d3
      .scaleOrdinal<string, string>()
      .domain(labels)
      .range(colours);

    if (!svg) {
      return;
    }

    const interpolation = this.interpolator.update(this);

    if (!interpolation) {
      return;
    }

    const { newXs, newYs } = interpolation;

    const chartGroup = svg.select(`.${attrs.plotID}`);

    // begin stacked area
    const area = d3
      .area()
      .x((_d: any, i: number) => {
        const scaled = xScale(newXs[i]);
        return scaled;
      })
      .y0(() => {
        const minY = d3XScale.domain()[0];
        return yScale(minY);
      })
      .y1((d: any) => yScale(d));

    let selectionUpdate = chartGroup.selectAll('path').data([newYs]);

    selectionUpdate.exit().remove();

    const enterSelection = selectionUpdate
      .enter()
      .append('path')
      .attr('class', 'fill_between');

    selectionUpdate = selectionUpdate.merge(enterSelection as any);

    selectionUpdate
      .style('fill', (d: any) => colourScale(d.key))
      .style('opacity', alpha)
      // ! previously was this: .attr('d', (d: any, i: number) => area(d, i))
      .attr('d', (d: any) => area(d));
  }
}

export { CFillArea };
