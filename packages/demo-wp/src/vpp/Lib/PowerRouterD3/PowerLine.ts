import * as d3 from 'd3';
import { tD3Model } from './Model';

/* eslint-disable @typescript-eslint/no-explicit-any */

class PowerLine {
  model: tD3Model;
  path: unknown;
  circle: unknown;
  index: number;

  constructor(model: tD3Model, ith: number) {
    this.model = model;
    this.path = null;
    this.circle = null;
    this.index = ith;
  }

  // const nodeId = `node-${this.id}`;
  // const nodeGroup = svg
  //   .selectAll<SVGGElement, number>(`g.${nodeId}`)
  //   .data([powerNode]);

  // // Handle entering elements
  // const nodeEnter = nodeGroup.enter().append('g').classed(`${nodeId}`, true);
  // nodeEnter.append('rect').classed('border', true);
  // nodeEnter.append('text').classed('label', true);
  // const iconNodeEnter = nodeEnter.append('g').classed('icon', true).node();

  // if (iconNodeEnter) {
  //   iconNodeEnter.appendChild(iconPath);
  // }

  // nodeEnter.merge(nodeGroup);

  // nodeGroup.attr(
  //   'transform',
  //   `translate(${coordinates[0]},${coordinates[1]})`
  // );

  // nodeGroup
  //   .select('rect.border')
  //   .attr('stroke', stroke)
  //   .attr('stroke-width', strokeWidth)
  //   .attr('width', width)
  //   .attr('height', height)
  //   .attr('fill', fill)
  //   .attr('rx', rx) // Set the x-axis radius of the rounded corners
  //   .attr('ry', ry); // Set the y-axis radius of the rounded corners

  // nodeGroup
  //   .select('text.label')
  //   .attr('x', 4)
  //   .attr('y', 15)
  //   .attr('font-family', 'sans-serif') // Font family
  //   .attr('font-size', '15px') // Font size
  //   .attr('fill', stroke) // Text color
  //   .text(label);

  // const iconGroup = nodeGroup
  //   .select('g.icon')
  //   .attr('transform', `translate(${15},${20})`);

  // const svgNode = iconGroup.select('svg').node() as SVGElement;
  // const gNode = iconGroup.node() as SVGGElement;

  // if (gNode && svgNode) {
  //   gNode.replaceChild(iconPath, svgNode);
  // }

  // nodeGroup.exit().style('opacity', 0).exit();

  update(newModel: tD3Model) {
    const { svg, height, xScale, yScale, powerLines } = newModel;
    const powerLine = powerLines[this.index];

    if (!powerLine) {
      return;
    }

    const { coordinates, duration, flow, fill, stroke, strokeWidth } =
      powerLine;

    const xScaleCast = xScale as any;
    const yScaleCast = yScale as any;

    if (!svg) {
      return;
    }

    const lineId = `lines-${this.index}`;
    const circleId = `circle-${this.index}`;

    const gPowerLines = svg.select<SVGGElement>('g.power-lines');

    let lines = gPowerLines.selectAll(`path.${lineId}`).data([coordinates]);
    const enterGroup = lines.enter().append('path').classed(lineId, true);

    // join the new data points with existing
    lines = lines.merge(enterGroup as any);

    // Exit - remove data points if current data.len/gth < data.length last time this ftn was called
    lines.exit().style('opacity', 0).remove();

    lines
      .attr('d', (dth: any) => {
        const line = d3
          .line()
          // .curve(d3.curveBasis)
          .x((d: any) => xScaleCast(d[0]) || 0)
          .y((d: any) => yScaleCast(d[1]) || 0);

        return line(dth);
      })
      // .attr('clip-path', `url(#${attrs.clipPathID})`)
      .attr('stroke', () => 'black')
      .attr('fill', 'none')
      .attr('stroke', stroke)
      .attr('stroke-width', strokeWidth);

    let circle = gPowerLines
      .selectAll<SVGCircleElement, number>(`circle.${circleId}`)
      .data([0]);

    // Enter - add the shapes to this data point
    const enterCircle = circle.enter().append('circle').classed(circleId, true);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    circle.exit().style('opacity', 0).remove();

    // join the new data points with existing
    circle = circle.merge(enterCircle);

    circle
      .attr('r', () => 6.5)
      .attr('transform', `translate(0,${-height / 3})`)
      .attr('fill', stroke)
      .attr('stroke', stroke)
      .attr('stroke-width', strokeWidth);

    // Returns an attrTween for translating along the specified path element.
    function translateAlong(pathElem: SVGPathElement) {
      const l = pathElem.getTotalLength();
      return function () {
        return function (t: number) {
          const point = flow === 'negative' ? 1 - t : t;
          const p = pathElem.getPointAtLength(point * l);
          return `translate(${p.x},${p.y})`;
        };
      };
    }

    this.circle = circle;
    this.path = lines;

    function transition() {
      circle
        .transition()
        .duration(duration)
        .attrTween('transform', translateAlong((lines as any).node()))
        .on('end', transition);
    }
    transition();
  }
}

// export type { tPowerConnection };

export { PowerLine };
