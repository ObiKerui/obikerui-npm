import * as d3 from 'd3';
import { tContainerAttrs } from '../sharedTypes';
import { PlotBase } from './PlotBase';

class CPosition extends PlotBase {
  draw(container: tContainerAttrs) {
    const { attrs } = this;
    const { active } = attrs;
    const { svg, chartHeight, chartWidth } = container;

    if (!svg) {
      return;
    }

    // const { geojson, zoom } = attrs;

    const mapGroup = svg.select<SVGGElement>(`.${attrs.plotID}`);

    let detector = mapGroup
      .selectAll<SVGRectElement, number>('.position-detect')
      .data([1]);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    detector.exit().remove();

    // Enter - add the shapes to this data point
    const enterGroup = detector
      .enter()
      .append('rect')
      .classed('position-detect', true);

    // join the new data points with existing
    detector = detector.merge(enterGroup);

    detector
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .style('fill', 'black')
      .style('opacity', 0)
      .style('stroke', 'black')
      .attr('pointer-events', active ? 'all' : 'none')
      .on('mouseenter', (_data, index, groups) => {
        attrs.mouseInside = true;
        const pos = d3.mouse(groups[index]);

        const element = d3.select(groups[index]);
        element.style('cursor', 'pointer');

        if (attrs.onMouseEnter) {
          attrs.onMouseEnter(pos);
        }
      })
      .on('mouseleave', (_data, index, groups) => {
        attrs.mouseInside = false;
        const pos = d3.mouse(groups[index]);

        const element = d3.select(groups[index]);
        element.style('cursor', 'pointer');

        if (attrs.onMouseLeave) {
          attrs.onMouseLeave(pos);
        }
      })
      .on('mousemove', (_data, index, groups) => {
        const pos = d3.mouse(groups[index]);
        if (attrs.onMouseMove) {
          attrs.onMouseMove(pos);
        }
        if (attrs.mouseDown && attrs.onDrag) {
          attrs.onDrag(pos);
        }
      })
      .on('mousedown', (_data, index, groups) => {
        const pos = d3.mouse(groups[index]);
        attrs.mouseDown = true;

        if (attrs.onMouseDown) {
          attrs.onMouseDown(pos);
        }
      })
      .on('mouseup', (_data, index, groups) => {
        attrs.mouseDown = false;
        if (attrs.onMouseUp) {
          const pos = d3.mouse(groups[index]);
          attrs.onMouseUp(pos);
        }
      })
      .on('wheel', (_data, index, groups) => {
        const wheelEvent = d3.event as WheelEvent;
        wheelEvent.preventDefault();
        const { deltaY } = wheelEvent;
        const pos = d3.mouse(groups[index]);

        if (attrs.onZoomIn && deltaY < 0) {
          attrs.onZoomIn(pos);
        }
        if (attrs.onZoomOut && deltaY > 0) {
          attrs.onZoomOut(pos);
        }
      });
  }
}

export { CPosition };
