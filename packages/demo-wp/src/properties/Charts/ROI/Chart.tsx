import { useEffect, useRef } from 'react';
import { Controls } from './Controls';
import { useChartData } from '../Provider/Provider';

function LinePlot(): JSX.Element {
  const { model, controller } = useChartData();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      controller.updatePageElement({
        ...model.pageElements,
        linePlotDiv: ref.current,
      });
    }
  }, []);

  return (
    <div>
      <h3 id="line-plot">Line Plot</h3>
      <div ref={ref} />
    </div>
  );
}

function HeatPlot(): JSX.Element {
  const { model, controller } = useChartData();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      controller.updatePageElement({
        ...model.pageElements,
        roiPlotDiv: ref.current,
      });
    }
  }, []);

  return (
    <div>
      <h3 id="heat-plot">ROI Plot</h3>
      <div ref={ref} />
    </div>
  );
}

HeatPlot.defaultProps = {
  data: [],
};

function LinePlotContainer(): JSX.Element {
  return (
    <div className="flex gap-2">
      <div className="inline-flex flex-col">
        <HeatPlot />
        <Controls />
        <LinePlot />
      </div>
    </div>
  );
}

export { HeatPlot as LinePlot, LinePlotContainer };
