/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import rfdc from 'rfdc';
import ContainerAttrs from './attributes/container';
import AxisGenerator from './generators/axisGenerator';
import LabelGenerator from './generators/labelGenerator';
import GridGenerator from './generators/gridGenerator';
import AttrsGenerator from './generators/attributeGenerator';

function Container() {
  const obj = rfdc()(ContainerAttrs);
  const plots: CallableFunction[] = [];
  const axisGenerator = AxisGenerator();
  const labelGenerator = LabelGenerator();
  const gridGenerator = GridGenerator();

  function buildScales() {
    const scaler = obj.scale === null ? null : obj.scale;
    if (scaler) {
      scaler(obj, plots);
    }
  }

  // Building Blocks
  function buildContainerGroups(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    const marginLeft = obj.margins.left;
    const marginTop = obj.margins.top;

    const container = svg
      .append('g')
      .classed('container-group', true)
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    container.append('g').classed('x-axis-group grid', true);
    container.append('g').classed('y-axis-group grid', true);

    container.append('g').classed('chart-group', true);

    container.append('g').classed('x-axis-group axis', true);
    container.append('g').classed('x-axis-label', true);

    container.append('g').classed('y-axis-group axis', true);
    container.append('g').classed('y-axis-label', true);

    container.append('g').classed('metadata-group', true);
  }

  function buildSVG(container: HTMLElement) {
    if (!obj.svg) {
      obj.svg = d3.select(container).append('svg').classed('jschart-container', true);
      buildContainerGroups(obj.svg);
    }
    obj.svg.attr('width', obj.width).attr('height', obj.height);
  }

  function toExport(htmlSelection: d3.Selection<HTMLElement, unknown, null, undefined>) {
    obj.chartWidth = +(obj.width - obj.margins.left - obj.margins.right);
    obj.chartHeight = +(obj.height - obj.margins.top - obj.margins.bottom);

    const node = htmlSelection.node();
    if (!node) {
      return;
    }

    buildSVG(node);
    buildScales();

    plots.forEach((plot: CallableFunction) => {
      plot(obj);
    });

    axisGenerator(obj);
    labelGenerator(obj);
    gridGenerator(obj);

    if (obj.legend) obj.legend(obj, plots);

    if (obj.showMargins && obj.svg) {
      obj.svg.style('background-color', 'rgba(255, 0, 0, .2)');
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  toExport.plot = function (x: any): any {
    if (Number.isInteger(x) && plots.length > 0) {
      return plots[x];
    }
    if (typeof x === 'string') {
      const labels = plots.filter((elem: any) => elem.tag() === x);
      if (labels.length > 0) {
        return labels[0];
      }
      return null;
    }
    plots.push(x);
    return toExport;
  };

  const generateAccessor = AttrsGenerator();
  generateAccessor.attachTo(obj);
  generateAccessor.setterReturnValue(toExport);

  toExport.scale = generateAccessor('scale');
  toExport.legend = generateAccessor('legend');
  toExport.showMargins = generateAccessor('showMargins');
  toExport.height = generateAccessor('height');
  toExport.width = generateAccessor('width');
  toExport.margin = generateAccessor('margins');
  toExport.xAxisLabel = generateAccessor('xAxisLabel');
  toExport.xAxisText = generateAccessor('xAxisText');
  toExport.yAxisLabel = generateAccessor('yAxisLabel');
  toExport.yAxisText = generateAccessor('yAxisText');
  toExport.yAxisPosition = generateAccessor('yAxisPosition');

  return toExport;
}

export { Container };
export type tContainers = typeof Container;
