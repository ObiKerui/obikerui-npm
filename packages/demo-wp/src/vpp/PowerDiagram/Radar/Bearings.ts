import * as d3 from 'd3';
import { tState } from './Model';

class Bearings {
  update(state: tState) {
    const { container, rangeCircles } = state;

    const div = d3.select(container);
    const svg = div.select<SVGElement>('svg.container');
    const origin = svg.select<SVGGElement>('g.origin');
    if (origin.empty()) {
      return;
    }

    const radii = Array.from(rangeCircles.values());
    const radius = radii.length > 0 ? radii[radii.length - 1] : 0;

    const angleScale = d3
      .scaleLinear()
      .domain([0, 360])
      .range([0, 2 * Math.PI]);

    // Generate tick data
    const ticks = d3.range(0, 361, 30); // Every 30 degrees

    // Add circular axis ticks
    let tickLines = origin
      .selectAll<SVGLineElement, unknown>('.tick')
      .data(ticks);

    const enterTickLines = tickLines
      .enter()
      .append('line')
      .attr('class', 'tick');

    tickLines.exit().remove();

    tickLines = enterTickLines
      .merge(tickLines)
      .attr('x1', (d) => radius * Math.cos(angleScale(d) ?? 0 - Math.PI / 2))
      .attr('y1', (d) => radius * Math.sin(angleScale(d) ?? 0 - Math.PI / 2))
      .attr(
        'x2',
        (d) => (radius + 10) * Math.cos(angleScale(d) ?? 0 - Math.PI / 2)
      )
      .attr(
        'y2',
        (d) => (radius + 10) * Math.sin(angleScale(d) ?? 0 - Math.PI / 2)
      )
      .attr('stroke', 'black');

    // Add labels to the ticks
    let labels = origin
      .selectAll<SVGTextElement, unknown>('.label')
      .data(ticks);

    const enterLabels = labels.enter().append('text').attr('class', 'label');

    labels.exit().remove();

    labels = labels
      .merge(enterLabels)
      .attr(
        'x',
        (d) => (radius + 20) * Math.cos(angleScale(d) ?? 0 - Math.PI / 2)
      )
      .attr(
        'y',
        (d) => (radius + 20) * Math.sin(angleScale(d) ?? 0 - Math.PI / 2)
      )
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => {
        const angle = angleScale(d) ?? 0 - Math.PI / 2;
        return Math.cos(angle) > 0
          ? 'start'
          : Math.cos(angle) < 0
          ? 'end'
          : 'middle';
      })
      .text((d) => d)
      .style('font-size', '10px');
  }
}

export default Bearings;
