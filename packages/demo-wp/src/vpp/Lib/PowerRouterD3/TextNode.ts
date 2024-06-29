import * as d3 from 'd3';
import { tD3Model, tPowerNode, tPowerNodeID } from './Model';

/* eslint-disable @typescript-eslint/no-explicit-any */

type tSelection = d3.Selection<d3.BaseType, tPowerNode, SVGGElement, unknown>;
type tTextSelect = d3.Selection<SVGGElement, tPowerNode, SVGGElement, unknown>;
type tSVGTextGroup = d3.BaseType[] | d3.ArrayLike<d3.BaseType>;

class TextNode {
  id: tPowerNodeID;
  model: tD3Model;
  border: unknown;
  headerText: unknown;

  constructor(id: tPowerNodeID, model: tD3Model) {
    this.id = id;
    this.model = model;
    this.border = null;
  }

  async update(newModel: tD3Model) {
    const { svg, powerNodeMap } = newModel;
    const powerNode = powerNodeMap.get(this.id);

    if (!powerNode || !svg) {
      return;
    }

    const { coordinates, label, stroke, width, height, strokeWidth, fill } =
      powerNode;

    const nodeId = `node-${this.id}`;
    const gAllPowerNodes = svg.select<SVGGElement>(`g.power-nodes`);

    const gTextNode = gAllPowerNodes
      .selectAll<SVGGElement, number>(`g.text-${nodeId}`)
      .data([powerNode]);

    // Handle entering elements
    const nodeEnter = gTextNode
      .enter()
      .append('g')
      .classed(`text-${nodeId}`, true);
    nodeEnter.append('rect').classed('text-border', true);
    nodeEnter.append('text').classed('label', true);

    nodeEnter.merge(gTextNode);

    gTextNode.attr(
      'transform',
      `translate(${coordinates[0]},${coordinates[1]})`
    );

    gTextNode
      .select('rect.text-border')
      .attr('stroke', 'none')
      .attr('stroke-width', strokeWidth)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none');

    gTextNode
      .select('text.label')
      .attr('transform', (d, i, n) => this.updateAlignment(d, i, n, width))
      //   .attr('x', 4)
      .attr('y', 15)
      .attr('font-family', 'sans-serif') // Font family
      .attr('font-size', '15px') // Font size
      .attr('fill', stroke) // Text color
      //   .attr('dx', '5')
      .attr('text-anchor', 'middle')
      .text(label);

    gTextNode.exit().style('opacity', 0).exit();
  }

  updateAlignment(
    _powerNode: tPowerNode,
    ith: number,
    htmlGroup: tSVGTextGroup,
    boxWidth: number
  ) {
    const textNode = htmlGroup[ith] as SVGTextElement;
    let horizAlign = 0;
    if (textNode) {
      const bbox = textNode.getBBox();
      horizAlign = bbox.width / 2;
    }

    // const leftOffset = width / 2;

    // return `translate(${horizAlign},0)`;
    return `translate(${boxWidth / 2},0)`;
  }
}

export { TextNode };
