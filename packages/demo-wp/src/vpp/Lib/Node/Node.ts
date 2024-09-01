import * as d3 from 'd3';
import { Labels, tLabel, tLabelsModel } from './Label';
import { Icon, tIconModel } from './Icon';
import { tProfile } from './Types';
import { Activity, tActivityModel } from './Activity';

type tNodeModel = {
  parent: SVGGElement | null;
  id: string;
  coords: [number, number];
  labels: tLabel[];
  icon: tIconModel;
  activity: tActivityModel;
  onClick: ((d: unknown, ith: number) => void) | null;
  profile?: tProfile;
  selected: boolean;
};

const defaultProfile = {
  stroke: 'black',
  fill: 'white',
  strokeWidth: '2',
};

class Node {
  labels: Labels;
  icon: Icon;
  activity: Activity;

  constructor() {
    this.labels = new Labels();
    this.icon = new Icon();
    this.activity = new Activity();
  }

  update(model: tNodeModel) {
    const {
      parent,
      coords,
      labels,
      icon,
      activity,
      id,
      onClick,
      profile = defaultProfile,
      selected,
    } = model;

    if (!parent) {
      return;
    }

    const parentOrigin = d3.select<SVGGElement, unknown>(parent);
    let nodeOrigin = parentOrigin.select<SVGGElement>(`g.node-${id}`);
    if (nodeOrigin.empty()) {
      nodeOrigin = parentOrigin.append('g').classed(`node-${id}`, true);
    }

    nodeOrigin.attr('transform', () => {
      const offsetX = coords[0];
      const offsetY = coords[1];
      return `translate(${offsetX},${offsetY})`;
    });

    let frame = nodeOrigin.select<SVGRectElement>('rect.frame');
    if (frame.empty()) {
      frame = nodeOrigin.append('rect').classed('frame', true);
    }
    frame.attr('width', 80).attr('height', 80);
    frame.attr('x', -(80 / 2)).attr('y', -(80 / 2));
    frame.attr('fill', profile.fill).attr('stroke', profile.stroke);
    frame.attr('rx', '10').attr('ry', '10');
    frame.attr('stroke-width', () => {
      const width = selected ? '4' : profile.strokeWidth;
      return width;
    });

    frame
      .on('mousedown', (_d, ith) => {
        if (onClick) onClick(id, ith);
      })
      .on('mouseenter', () => {
        frame.style('cursor', 'pointer');
        // frame.style('stroke-width', 4);
      })
      .on('mouseleave', () => {
        frame.style('cursor', 'default');
        // const width = selected ? '4' : profile.strokeWidth;
        // frame.style('stroke-width', width);
      });

    // then add the labels and icons
    this.labels.update({
      parent: nodeOrigin.node(),
      labels,
      profile,
    } as tLabelsModel);

    this.icon.update({
      ...icon,
      iconPath: icon.iconPath,
      parent: nodeOrigin.node(),
      profile,
    } as tIconModel);

    this.activity.update({
      ...activity,
      parent: nodeOrigin.node(),
      height: 33,
      width: 35,
      profile,
    } as tActivityModel);
  }
}

export type { tNodeModel };
export { Node };
