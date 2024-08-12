import * as d3 from 'd3';
import { tProfile } from './Types';

type tLabel = {
  text: string;
  coords: [number, number];
};

type tLabelsModel = {
  parent: SVGGElement | null;
  labels: tLabel[];
  profile?: tProfile;
};

const defaultProfile = {
  textFill: 'black',
};

class Labels {
  update(model: tLabelsModel) {
    const { parent, labels, profile = defaultProfile } = model;

    // const darkProfile = {
    //   stroke: 'white',
    //   fill: 'black',
    //   strokeWidth: '2',
    //   textFill: 'white',
    // };

    if (!parent) {
      return;
    }

    // create the selection
    const svgSelect = d3.select<SVGGElement, unknown>(parent);
    let groupLabelsSelect = svgSelect.select<SVGGElement>('g.labels');

    if (groupLabelsSelect.empty()) {
      groupLabelsSelect = svgSelect.append('g').classed('labels', true);
    }

    let labelElems = groupLabelsSelect
      .selectAll<SVGTextElement, number>('text.text-label')
      .data(labels);

    const enterLabelElems = labelElems
      .enter()
      .append('text')
      .classed('text-label', true);

    labelElems = labelElems.merge(enterLabelElems);

    // update the label elems
    labelElems
      .attr('transform', (d) => {
        const offsetX = d.coords[0];
        const offsetY = d.coords[1];
        return `translate(${offsetX},${offsetY})`;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', profile.textFill)
      .text((d) => d.text);

    labelElems.exit().remove();
  }
}

export type { tLabelsModel, tLabel };
export { Labels };
