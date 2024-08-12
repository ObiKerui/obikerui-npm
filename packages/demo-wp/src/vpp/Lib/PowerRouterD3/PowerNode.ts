import * as d3 from 'd3';
import { tD3Model, tPowerNode, tPowerNodeID } from './Model';
import { importSVG } from '../SVG/Importer';

/* eslint-disable @typescript-eslint/no-explicit-any */

type tSelection = d3.Selection<d3.BaseType, tPowerNode, SVGGElement, unknown>;
type tTextSelect = d3.Selection<SVGGElement, tPowerNode, SVGGElement, unknown>;
type tSVGTextGroup = d3.BaseType[] | d3.ArrayLike<d3.BaseType>;

class PowerNode {
  id: tPowerNodeID;
  model: tD3Model;
  border: unknown;
  headerText: unknown;
  icon: unknown;
  bottomText: unknown;

  constructor(id: tPowerNodeID, model: tD3Model) {
    this.id = id;
    this.model = model;
    this.border = null;
    this.icon = null;
    this.bottomText = null;
  }

  async update(newModel: tD3Model) {
    const { svg, powerNodeMap } = newModel;
    const powerNode = powerNodeMap.get(this.id);

    if (!powerNode || !svg) {
      return;
    }

    const {
      coordinates,
      label,
      iconPath,
      icon,
      stroke,
      strokeWidth,
      width,
      height,
      fill,
      rx,
      ry,
    } = powerNode;

    const nodeId = `node-${this.id}`;
    const gAllPowerNodes = svg.select<SVGGElement>(`g.power-nodes`);

    const gPowerNode = gAllPowerNodes
      .selectAll<SVGGElement, number>(`g.${nodeId}`)
      .data([powerNode]);

    // Handle entering elements
    const nodeEnter = gPowerNode.enter().append('g').classed(`${nodeId}`, true);
    nodeEnter.append('rect').classed('border', true);

    const iconPathStr = await importSVG(`${iconPath}/${icon}` ?? '');
    const iconNodeEnter = nodeEnter.append('g').classed('icon', true).node();

    if (iconNodeEnter) {
      iconNodeEnter.appendChild(iconPathStr);
    }

    nodeEnter.merge(gPowerNode);

    gPowerNode.attr(
      'transform',
      `translate(${coordinates[0]},${coordinates[1]})`
    );

    gPowerNode
      .select('rect.border')
      .attr('stroke', stroke)
      .attr('stroke-width', strokeWidth)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', fill)
      .attr('rx', rx) // Set the x-axis radius of the rounded corners
      .attr('ry', ry); // Set the y-axis radius of the rounded corners

    const iconWidth = 50;
    const middleX = width * 0.5 - iconWidth * 0.5;

    const iconGroup = gPowerNode
      .select('g.icon')
      .attr('transform', `translate(${middleX},${20})`);

    const svgNode = iconGroup.select('svg').node() as SVGElement;
    const gNode = iconGroup.node() as SVGGElement;

    if (gNode && svgNode) {
      gNode.replaceChild(iconPathStr, svgNode);
    }

    gPowerNode.exit().style('opacity', 0).exit();
  }

  updateAlignment(
    _powerNode: tPowerNode,
    ith: number,
    htmlGroup: tSVGTextGroup
  ) {
    const textNode = htmlGroup[ith] as SVGTextElement;
    const horizAlign = 0;
    if (textNode) {
      // const bbox = textNode.getBBox();
      // horizAlign = bbox.width / 2;
    }
    return `translate(${horizAlign},0)`;
  }
}

export { PowerNode };
