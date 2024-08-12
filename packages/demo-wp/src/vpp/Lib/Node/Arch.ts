import * as d3 from 'd3';
import { tProfile } from './Types';

type tArchModel = {
  id: string;
  parent: SVGGElement | null;
  coords: [number, number][];
  flow: 'positive' | 'negative' | 'none';
  profile?: tProfile;
};

const defaultProfile = {
  stroke: 'black',
  fill: 'white',
  strokeWidth: '2',
  textFill: 'black',
  circleFill: 'black',
};

class Arch {
  update(model: tArchModel) {
    const { parent, coords, id, flow, profile = defaultProfile } = model;

    // const darkProfile = {
    //   stroke: 'white',
    //   fill: 'black',
    //   strokeWidth: '2',
    //   textFill: 'white',
    //   circleFill: 'white',
    // };

    const xScale = d3.scaleLinear().domain([-300, 300]).range([-300, 300]);
    const yScale = d3.scaleLinear().domain([200, -200]).range([200, -200]);
    const lineGen = d3
      .line()
      // .curve(d3.curveBasis)
      .x((d) => xScale(d[0]) || 0)
      .y((d) => yScale(d[1]) || 0);

    if (!parent) {
      return;
    }

    // create the selection
    const svgSelect = d3.select<SVGGElement, unknown>(parent);
    let groupArchSelect = svgSelect.select<SVGGElement>(`g.arch-${id}`);

    if (groupArchSelect.empty()) {
      groupArchSelect = svgSelect.append('g').classed(`arch-${id}`, true);
    }

    let lines = groupArchSelect
      .selectAll<SVGPathElement, number>('path')
      .data([coords]);
    const enterLines = lines.enter().append('path').classed('path', true);

    lines.exit().remove();

    lines = lines.merge(enterLines);

    lines
      .attr('d', (dth) => lineGen(dth))
      .attr('fill', 'none')
      .attr('stroke', profile.stroke)
      .attr('stroke-width', profile.strokeWidth);

    let circle = groupArchSelect
      .selectAll<SVGCircleElement, number>('circle')
      .data([0]);
    const enterCircle = circle.enter().append('circle').classed('circle', true);

    circle.exit().remove();

    circle = circle.merge(enterCircle);

    circle
      .attr('r', () => 6.5)
      .attr('transform', `translate(0,${0})`)
      .attr('fill', profile.circleFill)
      .attr('stroke', profile.stroke)
      .attr('stroke-width', profile.strokeWidth);

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

    function transition() {
      const lineNode = lines.node();
      if (!lineNode) {
        return;
      }
      circle
        .transition()
        .duration(5000)
        .attrTween('transform', translateAlong(lineNode))
        .on('end', transition);
    }
    transition();
  }
}

export type { tArchModel };
export { Arch };
