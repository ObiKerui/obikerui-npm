/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
import * as d3 from 'd3';
import { PowerLine } from './PowerLine';
import { tPowerNodeID, VPPModel } from './Model';
import { PowerNode } from './PowerNode';
import { TextNode } from './TextNode';

// const path = {
//     cursor: pointer;
//     fill: #eee;
//     stroke: #666;
//     stroke-width: 1.5px;
//   }

//   circle {
//     fill: steelblue;
//     stroke: white;
//     stroke-width: 1.5px;
//   }

type tSelection<T extends d3.BaseType> = d3.Selection<T, unknown, null, any>;

type tBaseSelection = tSelection<d3.BaseType>;
type tSVGSelection = tSelection<SVGElement>;

class PowerRouterD3 {
  d3Model: VPPModel;
  powerLines: PowerLine[];
  powerNodeObjMap: Map<tPowerNodeID, PowerNode>;
  textNodeObjMap: Map<tPowerNodeID, TextNode>;

  constructor(model: VPPModel) {
    this.d3Model = model;
    this.powerLines = [];

    const { powerLines, powerNodeMap } = model.modelData;

    powerLines.forEach((_powerLine, ith) => {
      this.powerLines.push(new PowerLine(model.modelData, ith));
    });

    this.powerNodeObjMap = new Map();
    this.textNodeObjMap = new Map();

    Array.from(powerNodeMap.keys()).forEach((key) => {
      this.powerNodeObjMap.set(key, new PowerNode(key, model.modelData));
      this.textNodeObjMap.set(key, new TextNode(key, model.modelData));
    });
  }

  // update(newModel: tD3Model) {
  update() {
    const { modelData } = this.d3Model;
    const { container, width, height } = modelData;

    if (!container) {
      return;
    }

    const svgElement = d3.select(container).select('svg.power-router');

    if (svgElement.empty()) {
      const svg = d3
        .select(container)
        .append('svg')
        .classed('power-router', true)
        .attr('width', 500)
        .attr('height', 500);

      svg.append('g').classed('power-lines', true);
      svg.append('g').classed('power-nodes', true);

      this.d3Model.modelData.svg = svg;
    }

    svgElement.attr('width', width).attr('height', height);

    this.powerLines.forEach((pl) => {
      pl.update(modelData);
    });

    Array.from(this.powerNodeObjMap.keys()).forEach(async (key) => {
      const pn = this.powerNodeObjMap.get(key);
      await pn?.update(modelData);

      const pl = this.textNodeObjMap.get(key);
      await pl?.update(modelData);
    });
  }
}

export { PowerRouterD3 };
