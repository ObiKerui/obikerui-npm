import { tYAxisLabelProps } from './Attrs';
import { CContainer } from './Container';

class AxisLayout {
  container: CContainer;

  constructor(container: CContainer) {
    this.container = container;
  }

  // eslint-disable-next-line class-methods-use-this
  topYAxisLabel(text: string): tYAxisLabelProps {
    return {
      offset: [0, -10],
      textAnchor: 'start',
      rotation: 0,
      yValuesRotation: 0,
      text,
      visible: true,
      onRender: null,
    };
  }

  middleYAxisLabel(text: string): tYAxisLabelProps {
    const { container } = this;

    return {
      offset: [-container.attrs.chartHeight / 2, -50],
      textAnchor: 'middle',
      rotation: 270,
      yValuesRotation: 0,
      text,
      visible: true,
      onRender: null,
    };
  }

  bottomYAxisLabel(text: string): tYAxisLabelProps {
    const { container } = this;

    return {
      offset: [-container.attrs.chartHeight, 0],
      textAnchor: 'middle',
      rotation: 270,
      yValuesRotation: 0,
      text,
      visible: true,
      onRender: null,
    };
  }
}

export default AxisLayout;
