import * as d3 from 'd3';
import { tState } from './Model';

class Scan {
  update(state: tState) {
    const { container } = state;

    const div = d3.select(container);
    const svg = div.select<SVGElement>('svg.container');
    const origin = svg.select<SVGGElement>('g.origin');
    if (origin.empty()) {
      return;
    }

    let scanLine = origin.select<SVGLineElement>('line.scan-line');
    if (scanLine.empty()) {
      scanLine = origin.append('line').classed('scan-line', true);
    }

    // Add a line to the SVG

    scanLine
      .attr('x1', 0) // Starting x-coordinate
      .attr('y1', 0) // Starting y-coordinate
      .attr('x2', 100) // Ending x-coordinate
      .attr('y2', 0) // Ending y-coordinate
      .attr('stroke', 'red') // Line color
      .attr('stroke-width', 2); // Line thickness
  }

  onTick(container: HTMLDivElement, tick: number) {
    const div = d3.select(container);
    const svg = div.select<SVGElement>('svg.container');
    const origin = svg.select<SVGGElement>('g.origin');
    if (origin.empty()) {
      return;
    }

    const scanLine = origin.select<SVGLineElement>('line.scan-line');
    scanLine.attr(
      'transform',
      `rotate(${tick}, ${0}, ${0})` // Rotate around the center
    );
  }
}

export default Scan;
