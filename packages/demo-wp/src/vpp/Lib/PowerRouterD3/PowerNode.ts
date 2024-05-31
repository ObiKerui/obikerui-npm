import * as d3 from 'd3';
import { tD3Model } from './Model';

/* eslint-disable @typescript-eslint/no-explicit-any */

class PowerNode {
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

  update(newModel: tD3Model) {
    const { svg, height, xScale, yScale, powerLines } = newModel;
    const { coordinates, duration, flow } = powerLines[this.index];

    const xScaleCast = xScale as any;
    const yScaleCast = yScale as any;

    if (!svg) {
      return;
    }

    const lineId = `lines-${this.index}`;
    const circleId = `circle-${this.index}`;

    let lines = svg.selectAll(`.${lineId}`).data([coordinates]);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    lines.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = lines
      .enter()
      .append('path')
      .classed(lineId, true)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5);

    // join the new data points with existing
    lines = lines.merge(enterGroup as any);

    lines
      .attr('d', (dth: any) => {
        const line = d3
          .line()
          // .defined(definedFtn)
          // .curve(curveType)
          .x((d: any) => xScaleCast(d[0]) || 0)
          .y((d: any) => yScaleCast(d[1]) || 0);

        return line(dth);
      })
      // .attr('clip-path', `url(#${attrs.clipPathID})`)
      .attr('stroke', (_d: any, _i: number) => 'black');
    // .style(
    //   'opacity',
    //   (_d: any, i: number) =>
    //     // console.log('alpha / d / i ', alpha, d, i)
    //     alpha[i] ?? 1
    // );

    let circle = svg.selectAll(circleId).data([0]);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    circle.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterCircle = circle
      .enter()
      .append('circle')
      .classed(circleId, true)
      .attr('r', () => 6.5)
      .attr('transform', `translate(0,${-height / 3})`);
    // .attr('fill', 'none')
    // .attr('stroke', 'steelblue')
    // .attr('stroke-width', 1.5);

    // join the new data points with existing
    circle = circle.merge(enterCircle as any);

    // const circle = svg
    //   .append('circle')
    //   .attr('r', 6.5)
    //   .attr('transform', `translate(0,${-height / 3})`);

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

export { PowerNode };
