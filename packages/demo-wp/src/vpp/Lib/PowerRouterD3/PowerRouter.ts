/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
import * as d3 from 'd3';
import { VPPModel } from '../Model';
import { PowerLine } from './PowerLine';
import { powerLineData, powerNodes, tD3Model } from './Model';
import { PowerNode } from './PowerNode';

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

class PowerRouterD3 {
  model: VPPModel;
  d3Model: tD3Model;
  powerLines: PowerLine[];
  powerNodes: PowerNode[];

  constructor(model: VPPModel) {
    this.model = model;
    this.d3Model = {
      container: null,
      svg: null,
      width: 500,
      height: 500,
      xScale: d3.scaleLinear().domain([0, 100]).range([0, 500]),
      yScale: d3.scaleLinear().domain([0, 100]).range([500, 0]),
      powerLines: powerLineData,
      powerNodes,
    };

    this.powerLines = [];
    powerLineData.forEach((_powerLine, ith) => {
      this.powerLines.push(new PowerLine(this.d3Model, ith));
    });

    this.powerNodes = [];
    powerNodes.forEach((_powerNode, ith) => {
      this.powerNodes.push(new PowerNode(this.d3Model, ith));
    });
  }

  update(newModel: tD3Model) {
    const { container } = newModel;

    this.powerLines.forEach((pl) => {
      pl.update(newModel);
    });

    this.powerNodes.forEach((pn) => {
      pn.update(newModel);
    });

    if (!container) {
      return;
    }

    this.d3Model = {
      ...this.d3Model,
      ...newModel,
    };

    const { width, height, svg } = this.d3Model;

    if (svg) {
      return;
    }

    this.d3Model.svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g');
    // .attr('transform', `translate(${width / 2},${height / 2})`);
  }
}

export { PowerRouterD3 };
