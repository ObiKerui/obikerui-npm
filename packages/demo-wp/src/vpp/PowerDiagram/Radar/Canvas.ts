import * as d3 from 'd3';
import { tState } from './Model';

class Canvas {
  container: HTMLDivElement | null;

  constructor() {
    this.container = null;
  }

  update(state: tState) {
    const { container, dimensions, margins } = state;

    const totalWidth = margins.left + margins.right + dimensions[0];
    const totalHeight = margins.top + margins.bottom + dimensions[1];

    const div = d3.select(container);
    const svg = div.select<SVGElement>('svg.container');
    if (svg.empty()) {
      div
        .append('svg')
        .classed('container', true)
        .append('g')
        .classed('origin', true)
        .attr('transform', `translate(${totalWidth / 2},${totalHeight / 2})`);
    }
    svg.attr('width', totalWidth).attr('height', totalHeight);
  }
}

export default Canvas;
