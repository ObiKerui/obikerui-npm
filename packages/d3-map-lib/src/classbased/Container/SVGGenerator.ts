/* eslint-disable no-param-reassign */
import * as d3 from 'd3';
import L from 'leaflet';
import { tContainerAttrs } from '../sharedTypes';

class SVGGenerator {
  updateSVG(container: tContainerAttrs) {
    const { html, map, margins, svg, chartHeight, chartWidth } = container;
    if (map) {
      return;
    }

    console.log('what are margins: ', margins);

    // const mapContainerNode = d3
    //   .select(html)
    //   .append('div')
    //   .classed('custom-map-element', true)
    //   .style('height', '100%')
    //   .node();

    // if (!mapContainerNode) {
    //   throw new Error('Map container should not be null here!');
    // }

    if (svg) {
      // svg.attr('width', `${chartWidth}px`).attr('height', `${chartHeight}px`);
      svg.attr('width', `${chartWidth}`).attr('height', `${chartHeight}`);
      return;
    }

    // container.svg = d3.select(html).select('div').append('svg');
    container.svg = d3.select(html).append('svg');
    container.svg
      .attr('width', `${chartWidth}`)
      .attr('height', `${chartHeight}`);
    const mapContainer = container.svg
      .append('g')
      .classed('container-group', true)
      .attr('transform', `translate(${margins.left},${margins.top})`);

    mapContainer.append('g').classed('map-group', true);
    mapContainer.append('g').classed('metadata-group', true);
  }
}

export { SVGGenerator };
