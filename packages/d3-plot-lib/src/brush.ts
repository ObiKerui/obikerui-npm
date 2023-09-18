/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import rfdc from 'rfdc';
import { tContainerAttrs } from './attributes/container';
import metadataAttributes from './attributes/metadata';
import AttrsGenerator from './generators/attributeGenerator';
import metadataSvgGenerator from './generators/metadataSvgGenerator';

const brushAttributes = {
  ...metadataAttributes,
  onChange: null as ((_newXScale: any) => void) | null,
};

function Brush() {
  const obj = rfdc()(brushAttributes);

  function buildContainerGroups(container: tContainerAttrs) {
    if (!obj) {
      return;
    }
    const mdsvg = metadataSvgGenerator() as any;
    mdsvg.metadata(obj).container(container)();
    const legendAP = mdsvg.anchor();
    if (!legendAP) {
      return;
    }
    const legendIdAp = legendAP.append('g').classed('anchorpoint', true);
    legendIdAp.append('rect').classed('background', true);
    legendIdAp.append('g').classed('innermargin', true);
  }

  function drawData(container: tContainerAttrs) {
    const { svg, chartHeight, xScale } = container;
    if (!svg || !xScale) {
      return;
    }

    const metadataGroup = svg.select(`.${obj.metadataID}`);
    const anchorPoint = metadataGroup.select('g.anchorpoint');
    const rectBackground = anchorPoint.select('rect.background');
    const innerMargin = anchorPoint.select('g.innermargin');

    const cScale = xScale as d3.ScaleContinuousNumeric<number, number>;

    const { onChange } = obj;

    const margin = 0;

    let isInsideBrush = false;
    let isMouseDown = false;
    let xDragOffset = 0;

    innerMargin.attr('transform', `translate(${margin},${margin})`);

    // width and height need to be set better - should focus on an area of data
    rectBackground
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 100)
      .attr('height', chartHeight)
      .style('fill', 'white')
      .style('stroke', 'blue')
      .style('opacity', 0.45)
      .on('mousemove', (_d: any, i: number, node: any) => {
        const rect = d3.select(node[i]);
        rect.style('cursor', 'grab');

        if (isMouseDown && isInsideBrush) {
          const mousePosition = d3.mouse(node[i]);
          const posOnChartX = cScale.invert(mousePosition[0]);
          // const x = xScale.invert(+rect.attr('x'))
          const rectX = +rect.attr('x');
          const rectWidth = +rect.attr('width');

          let newXvalue = (cScale(posOnChartX) as number) - xDragOffset;

          // get min/max domain bounds
          let minX = cScale.domain()[0];
          minX = minX ?? 0;
          let maxX = cScale.domain()[1];
          maxX = maxX ?? 0;

          // check for values outside bounds of domain
          const lessThanXLimit = newXvalue < (cScale(minX) as number);
          const greaterThanXLimit = +(newXvalue + rectWidth) > (cScale(maxX) as number);

          // correct if necessary
          newXvalue = lessThanXLimit ? rectX : newXvalue;
          newXvalue = greaterThanXLimit ? rectX : newXvalue;

          // set the rect x attr
          rect.attr('x', newXvalue);

          if (!lessThanXLimit && !greaterThanXLimit) {
            const minDomain = cScale.invert(newXvalue);
            const innerRectWidth = +rect.attr('width');
            const maxDomain = cScale.invert(newXvalue + innerRectWidth);
            const newDomain = [minDomain, maxDomain];
            const newScaleX = cScale.copy();
            newScaleX.domain(newDomain);
            if (onChange) {
              onChange(newScaleX);
            }
          }
        }
      })
      .on('mouseenter', () => {
        isInsideBrush = true;
      })
      .on('mouseleave', () => {
        isInsideBrush = false;
        isMouseDown = false;
      })
      .on('mousedown', (_d: any, i: number, node: any) => {
        isMouseDown = true;
        const rect = d3.select(node[i]);
        const xPos = +rect.attr('x');
        const mousePosition = d3.mouse(node[i]);
        const xPosOnChart = cScale.invert(mousePosition[0]);

        xDragOffset = Math.abs(xPos - (cScale(xPosOnChart) as number));
      })
      .on('mouseup', () => {
        isMouseDown = false;
      });

    const minDomain = cScale.invert(0);
    const rectWidth = +rectBackground.attr('width');
    const maxDomain = cScale.invert(0 + rectWidth);
    const newDomain = [minDomain, maxDomain];
    const newScaleX = cScale.copy();
    newScaleX.domain(newDomain);
    if (onChange) {
      onChange(newScaleX);
    }
  }

  function toExport(container: any) {
    buildContainerGroups(container);
    // buildLegendData(plottables);
    drawData(container);
  }

  const generateAccessor = AttrsGenerator();
  generateAccessor.attachTo(obj);
  generateAccessor.setterReturnValue(toExport);

  //   callableObj.onChange = function (_x: any) {
  //     if (arguments.length) {
  //       obj.onChange = _x
  //       return callableObj
  //     }
  //     return obj.onChange
  //   }

  //   toExport.legendID = generateAccessor('legendID');
  //   toExport.index = generateAccessor('index');
  //   toExport.data = generateAccessor('data');
  //   toExport.position = generateAccessor('position');
  toExport.onChange = generateAccessor('onChange');

  return toExport;
}

export default Brush;
