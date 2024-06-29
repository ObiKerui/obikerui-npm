/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';

function pvPanelIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  // const svg = groupElem
  //   .append('svg')
  d3.select(svg)
    .attr('x', 15)
    .attr('y', 15)
    .attr('width', 50)
    .attr('height', 50)
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('viewBox', '0 0 194 125')
    // .attr('viewBox', '0 0 38 51')
    .attr('fill', 'none')
    .classed('h-1 w-1 opacity-100', true);

  d3.select(svg)
    .append('path')
    .attr(
      'd',
      'M97 3V108M97 3H64.5M97 3H129.5M97 108H50.5M97 108H143.5M64.5 3H32L4 108H50.5M64.5 3L50.5 108M129.5 3H162L190 108H143.5M129.5 3L143.5 108M23 36.5H171.5M14 70.5H179.5M4 105.5H189M68 121H126M31 5H162M71.6825 108L68 122H126L120.937 108H71.6825Z'
    )
    .attr('stroke', 'black')
    .attr('stroke-width', '5');

  return svg;
}

export { pvPanelIcon };
