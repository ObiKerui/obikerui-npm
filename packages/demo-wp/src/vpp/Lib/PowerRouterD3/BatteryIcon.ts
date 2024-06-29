import * as d3 from 'd3';

/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
// function batteryIcon(groupElem: any) {
function batteryIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  // const svg = groupElem
  // .append('svg')
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
      'M5.16514 118.648H62M3 19.7606H59.8349M13.8257 3H50.633M13.8257 5.51408H50.633V19.7606H13.8257V5.51408ZM13.8257 3.83803H50.633V18.0845H13.8257V3.83803ZM3 17.6655V122H62V17.6655H3ZM46.3028 38.1972L10.578 63.757L31.1468 76.3275L15.4495 107.754L54.9633 74.2324L37.1009 63.757L46.3028 38.1972Z'
    )
    .attr('stroke', 'black')
    .attr('stroke-width', '5');

  return svg;
}

export { batteryIcon };
