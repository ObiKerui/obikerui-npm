/* eslint-disable import/no-extraneous-dependencies */
import { screen } from '@testing-library/dom';
import * as d3 from 'd3';
import { Container } from '../src/container';

describe('Test the container setup etc', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div data-testid="test-container"></div>';
  });

  it('should contain the correct svg elements', () => {
    const divContainer = screen.getByTestId('test-container');
    expect(divContainer).toBeEmptyDOMElement();

    const container = Container();
    container.margin({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    });
    d3.select(divContainer).call(container as any);

    expect(divContainer).not.toBeEmptyDOMElement();

    const svgEl = divContainer?.querySelector(
      "[class='jschart-container']"
    ) as SVGElement;
    expect(svgEl).toBeDefined();
    expect(svgEl).toHaveAttribute('width', '800');
    expect(svgEl).toHaveAttribute('height', '500');

    const svgContainerGroup = svgEl?.firstChild;
    expect(svgContainerGroup).toHaveAttribute('transform', 'translate(0,0)');

    const containerGroupChildren = svgContainerGroup?.childNodes;
    expect(containerGroupChildren).toBeDefined();
    expect(containerGroupChildren?.length).toBe(8);

    const actualClasses = Array.from(containerGroupChildren!).map((element) => {
      const elem = element as SVGElement;
      return elem.getAttribute('class');
    });

    const expectedClasses = [
      'x-axis-group grid',
      'y-axis-group grid',
      'chart-group',
      'x-axis-group axis',
      'x-axis-label',
      'y-axis-group axis',
      'y-axis-label',
      'metadata-group',
    ];

    expect(actualClasses).toEqual(expectedClasses);

    const xAxisLabel = svgEl?.querySelector('[class=x-axis-label]');
    expect(xAxisLabel).toBeDefined();
    expect(xAxisLabel).toHaveAttribute('transform', 'translate(0,500)');

    const textX = xAxisLabel?.firstChild;
    expect(textX).toHaveAttribute('text-anchor', 'middle');
    expect(textX).toHaveAttribute('x', '400');
    expect(textX).toHaveAttribute('y', '50');
    expect(textX?.textContent).toBe('x axis');

    const yAxisLabel = svgEl?.querySelector('[class=y-axis-label]');
    expect(yAxisLabel).toBeDefined();
    expect(yAxisLabel).toHaveAttribute('transform', 'translate(0, 0)');

    const textY = yAxisLabel?.firstChild;
    expect(textY).toHaveAttribute('text-anchor', 'middle');
    expect(textY).toHaveAttribute('x', '-250');
    expect(textY).toHaveAttribute('y', '-50');
    expect(textY?.textContent).toBe('y axis');
  });
});
