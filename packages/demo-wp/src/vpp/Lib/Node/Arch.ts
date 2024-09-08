import * as d3 from 'd3';
import { tProfile } from './Types';

const flow = ['positive', 'negative', 'none'] as const;
type tFlow = (typeof flow)[number];

const current = ['none', 'low', 'med', 'high'] as const;
type tCurrent = (typeof current)[number];

type tArchModel = {
  id: string;
  parent: SVGGElement | null;
  coords: [number, number][];
  flow: tFlow;
  current: tCurrent;
  profile?: tProfile;
};

const defaultProfile = {
  stroke: 'black',
  fill: 'white',
  strokeWidth: '2',
  textFill: 'black',
  circleFill: 'black',
};

const currToSpeedMap = new Map<tCurrent, number>([
  ['none', 6000],
  ['low', 5000],
  ['med', 3000],
  ['high', 2000],
]);

class Arch {
  update(model: tArchModel) {
    const {
      parent,
      coords,
      id,
      flow,
      current,
      profile = defaultProfile,
    } = model;

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
      // .attr('stroke', flow === 'negative' ? 'red' : 'green')
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
      // .attr('fill', flow === 'negative' ? 'red' : 'green')
      .attr('stroke', profile.stroke)
      // .attr('stroke', flow === 'negative' ? 'red' : 'green')
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

    const duration = currToSpeedMap.get(current) ?? 0;

    function transition() {
      const lineNode = lines.node();
      if (!lineNode) {
        return;
      }

      // lines
      //   .transition()
      //   .duration(duration)
      //   .attrTween('stroke', () => d3.interpolate('black', 'red'))
      //   .on('end', transition);

      circle
        .transition()
        .duration(duration)
        .attrTween('transform', translateAlong(lineNode))
        .on('end', transition);
    }
    transition();
  }
}

export type { tArchModel };
export { Arch };
