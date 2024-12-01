import * as d3 from 'd3';
import { tState } from './Model';

class Circles {
  update(state: tState) {
    const { container, rangeCircles } = state;

    const div = d3.select(container);
    const svg = div.select<SVGElement>('svg.container');
    const origin = svg.select<SVGGElement>('g.origin');
    if (origin.empty()) {
      return;
    }

    const radii = Array.from(rangeCircles.values());
    let circles = origin
      .selectAll<SVGCircleElement, unknown>('circle.range-circle')
      .data(radii);

    const circlesEnter = circles
      .enter()
      .append('circle')
      .classed('range-circle', true);

    circles.exit().remove();

    circles = circles
      .merge(circlesEnter)
      .attr('r', (d) => d)
      .attr('fill', 'red')
      .attr('fill-opacity', 0.1)
      .attr('stroke', 'black') // border color
      .attr('stroke-width', 1); // border width
  }
}

export default Circles;
