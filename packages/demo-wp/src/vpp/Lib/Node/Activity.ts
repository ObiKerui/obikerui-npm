import * as d3 from 'd3';
import { importSVG } from '../SVG/Importer';
import { tProfile } from './Types';

type tActivityModel = {
  parent: SVGElement | null;
  active: boolean;
  iconPaths: string[];
  currIconIndex: number;
  width: number;
  height: number;
  profile?: tProfile;
};

const defaultProfile = {
  svgStroke: 'black',
};

class Activity {
  async update(model: tActivityModel) {
    const {
      parent,
      active,
      iconPaths,
      currIconIndex,
      width,
      height,
      profile = defaultProfile,
    } = model;

    if (!parent) {
      return;
    }

    const svgElem = d3.select<SVGElement, unknown>(parent);
    let activityGroup = svgElem.select<SVGGElement>('g.activity');
    if (activityGroup.empty()) {
      activityGroup = svgElem.append('g').classed('activity', true);
      activityGroup.append('rect').classed('frame', true);

      const idx = currIconIndex;
      const iconPathStr = await importSVG(`${iconPaths[idx]}` ?? '');
      const iconNodeEnter = activityGroup
        .append('g')
        .classed('icon', true)
        .node();
      if (iconNodeEnter) {
        iconNodeEnter.appendChild(iconPathStr);
      }
    }

    activityGroup.attr('display', active ? 'default' : 'none');

    // update the frame
    activityGroup
      .select<SVGRectElement>('rect.frame')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 2)
      .attr('width', width)
      .attr('height', height)
      .attr('rx', '5')
      .attr('ry', '5')
      .attr('fill', 'hsl(0, 0%, 95%)')
      .attr('opacity', 1);

    // update the icon
    activityGroup
      .select<SVGGElement>('g.icon')
      .attr('transform', `translate(${4},${4})`);

    // transform position to centre image
    const widthtemp = 35;
    const heighttemp = 60;
    activityGroup.attr(
      'transform',
      `translate(-${widthtemp / 2}, ${heighttemp / 2})`
    );
    activityGroup.attr('pointer-events', 'none');

    const paths = activityGroup.selectAll('path');
    paths.attr('stroke', profile.svgStroke);
  }
}

export type { tActivityModel };
export { Activity };
