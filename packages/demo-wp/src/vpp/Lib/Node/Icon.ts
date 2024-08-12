import * as d3 from 'd3';
import { importSVG } from '../SVG/Importer';
import { tProfile } from './Types';

type tIconModel = {
  parent: SVGElement | null;
  iconPath: string;
  width: number;
  height: number;
  profile?: tProfile;
};

const defaultProfile = {
  svgStroke: 'black',
};

class Icon {
  async update(model: tIconModel) {
    const { parent, iconPath, width, height, profile = defaultProfile } = model;

    if (!parent) {
      return;
    }

    const svgElem = d3.select<SVGElement, unknown>(parent);
    let iconGroup = svgElem.select<SVGGElement>('g.icon');
    if (iconGroup.empty()) {
      iconGroup = svgElem.append('g').classed('icon', true);
      const iconPathStr = await importSVG(`${iconPath}` ?? '');
      const iconNodeEnter = iconGroup.append('g').classed('icon', true).node();
      if (iconNodeEnter) {
        iconNodeEnter.appendChild(iconPathStr);
      }
    }

    // transform position to centre image
    iconGroup.attr('transform', `translate(-${width / 2}, -${height / 2})`);
    iconGroup.attr('pointer-events', 'none');

    const paths = iconGroup.selectAll('path');
    paths.attr('stroke', profile.svgStroke);
  }
}

export type { tIconModel };
export { Icon };
