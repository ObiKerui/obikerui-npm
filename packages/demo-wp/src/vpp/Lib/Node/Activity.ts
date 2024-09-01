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
  fill: 'white',
  svgStroke: 'black',
};

type tSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

class Activity {
  async createIcons(parentNode: tSelection, iconPaths: string[]) {
    iconPaths.forEach(async (path, ith) => {
      const iconPathStr = await importSVG(`${path}`);
      const className = `icon-${ith}`;
      const iconNodeEnter = parentNode
        .append('g')
        .classed(className, true)
        .node();

      if (iconNodeEnter) {
        iconNodeEnter.appendChild(iconPathStr);
      }
    });
  }

  updateIcons(parentNode: tSelection, iconPaths: string[], currentIdx: number) {
    iconPaths.forEach((_, ith) => {
      const elemClass = `g.icon-${ith}`;
      parentNode
        .select<SVGGElement>(elemClass)
        .attr('transform', `translate(${4},${4})`)
        .attr('display', currentIdx === ith ? 'current' : 'none');

      const path = parentNode
        .select<SVGGElement>(elemClass)
        .select('svg')
        .select('path');
      path.attr('fill', currentIdx > 0 ? 'green' : 'red').attr('opacity', 0.8);
    });
  }

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
      await this.createIcons(activityGroup, iconPaths);
    }

    activityGroup.attr('display', active ? 'default' : 'none');

    // update the frame
    activityGroup
      .select<SVGRectElement>('rect.frame')
      .attr('stroke', profile.svgStroke)
      .attr('stroke-width', 2)
      .attr('width', width)
      .attr('height', height)
      .attr('rx', '5')
      .attr('ry', '5')
      .attr('fill', profile.fill)
      // .attr('fill', 'hsl(0, 0%, 95%)')
      .attr('opacity', 1);

    // update the icon
    this.updateIcons(activityGroup, iconPaths, currIconIndex);

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
