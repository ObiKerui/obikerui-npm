import { useRef, useEffect } from 'react';
import { usePowerRouter } from '../../Solax/Store';
import { Chart as SunPathChart } from './SunChart';

const sunChart = new SunPathChart();

usePowerRouter.subscribe((newState) => {
  sunChart.update(newState);
});

function ChartContainer() {
  const setSunPathContainer = usePowerRouter(
    (state) => state.setSunPathContainer
  );

  // const solaxData = usePowerRouter((state) => state.data);
  // const currDataIdx = usePowerRouter((state) => state.currentDataIdx);

  const sunChartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log('does this happen? ', sunChartRef);
    setSunPathContainer(sunChartRef.current);
  }, []);

  // useEffect(() => {
  //   const currSolaxData = solaxData[currDataIdx];
  // }, [currDataIdx]);

  return (
    <div>
      <div ref={sunChartRef} />
    </div>
  );
}

export { ChartContainer };
