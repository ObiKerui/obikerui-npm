import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChart } from '../Model';
import { Chart as PowerChart } from './Chart';

const lineChart = new PowerChart();

useChart.subscribe((newState) => {
  lineChart.update(newState);
});

function ChartContainer() {
  const setLineContainer = useChart((state) => state.setLineContainer);
  const setVisibility = useChart((state) => state.setVisibility);
  const [searchParams] = useSearchParams();

  const lineChartRef = useRef<HTMLDivElement | null>(null);

  const visible = searchParams.get('visible') ?? '';
  const visibleArr = visible.split(',');

  useEffect(() => {
    setLineContainer(lineChartRef.current);
  }, []);

  useEffect(() => {
    setVisibility(visibleArr);
  }, [visibleArr]);

  return (
    <div>
      <div ref={lineChartRef} />
    </div>
  );
}

export { ChartContainer };
