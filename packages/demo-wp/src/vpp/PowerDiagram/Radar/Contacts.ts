import * as d3 from 'd3';
import { tState } from './Model';

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  const x = cx + radius * Math.cos(angleInRadians);
  const y = cy + radius * Math.sin(angleInRadians);
  return { x, y };
}

function getXPosition(bearing: number, distance: number) {
  console.log('get x position: ', bearing, distance);
  return polarToCartesian(0, 0, distance, bearing).x;
}

function getYPosition(bearing: number, distance: number) {
  console.log('get y position: ', bearing, distance);
  return polarToCartesian(0, 0, distance, bearing).y;
}

class Contacts {
  opacities: Map<number, number>;

  constructor() {
    this.opacities = new Map();
  }

  initOpacities(contacts: Map<number, number>) {
    this.opacities.clear();
    contacts.forEach((_value, key) => {
      this.opacities.set(key, 1);
    });
  }

  update(state: tState) {
    const { container, contacts } = state;

    this.initOpacities(contacts);

    const div = d3.select(container);
    const svg = div.select<SVGElement>('svg.container');
    const origin = svg.select<SVGGElement>('g.origin');
    if (origin.empty()) {
      return;
    }

    const contactData = Array.from(contacts.entries());

    console.log('contact data: ', contactData);

    let circles = origin
      .selectAll<SVGCircleElement, unknown>('circle.contact-circle')
      .data(contactData);

    const circlesEnter = circles
      .enter()
      .append('circle')
      .classed('contact-circle', true);

    circles.exit().remove();

    circles = circles
      .merge(circlesEnter)
      .attr('cx', (d) => getXPosition(d[0], d[1]))
      .attr('cy', (d) => getYPosition(d[0], d[1]))
      .attr('r', 5)
      .attr('fill', 'red')
      .attr('stroke', 'black') // border color
      .attr('stroke-width', 1); // border width
  }

  onTick(container: HTMLDivElement, tickValue: number) {
    const { opacities } = this;

    const div = d3.select(container);
    const svg = div.select<SVGElement>('svg.container');
    const origin = svg.select<SVGGElement>('g.origin');
    if (origin.empty()) {
      return;
    }

    const circles = origin.selectAll<SVGCircleElement, [number, number]>(
      'circle.contact-circle'
    );

    circles.each(function (d) {
      const currOpacity = opacities.get(d[0]) ?? 0;
      let newOpacity = currOpacity - 0.005;
      newOpacity = newOpacity < 0 ? 0 : newOpacity;
      const contactOnScan = tickValue === d[0];
      newOpacity = contactOnScan ? 1 : newOpacity;
      opacities.set(d[0], newOpacity);
      d3.select(this).attr('opacity', newOpacity);
    });
  }
}

export default Contacts;
