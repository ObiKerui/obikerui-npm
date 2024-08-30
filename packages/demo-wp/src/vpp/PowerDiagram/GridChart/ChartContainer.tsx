import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { DataGrouper } from '../../Solax/Grouper';
import { usePowerRouter } from '../../Solax/Store';
import { useGridChart, tTimeFrame } from './Model';
import { Chart as LineChart } from './Chart';
import { Chart as BarChart } from './PercentChart';

const grouper = new DataGrouper();
const lineChart = new LineChart();
const barChart = new BarChart();

useGridChart.subscribe((newState) => {
  lineChart.update(newState);
  barChart.update(newState);
});

function ChartContainer() {
  const data = usePowerRouter((state) => state.data);
  const setLineContainer = useGridChart((state) => state.setLineContainer);
  const setRangedData = useGridChart((state) => state.setRangedData);
  const setBarContainer = useGridChart((state) => state.setBarContainer);
  const setProfitLoss = useGridChart((state) => state.setProfitLoss);
  const [searchParams] = useSearchParams();

  const lineChartRef = useRef<HTMLDivElement | null>(null);
  const barChartRef = useRef<HTMLDivElement | null>(null);

  const timeFrame = searchParams.get('timeFrame');

  useEffect(() => {
    setLineContainer(lineChartRef.current);
    setBarContainer(barChartRef.current);
  }, []);

  useEffect(() => {
    let ranged = [];
    let percentages = null;
    const latest = grouper.getNewest(data);
    if (!latest) {
      return;
    }
    const range = [dayjs(latest.uploadTime), dayjs(latest.uploadTime)];
    switch (timeFrame as tTimeFrame) {
      case '48hours':
        range[0] = range[1].subtract(48, 'hour');
        break;
      case 'week':
        range[0] = range[1].subtract(1, 'week');
        break;
      case 'month':
        range[0] = range[1].subtract(1, 'month');
        break;
      case 'quarter':
        range[0] = range[1].subtract(3, 'month');
        break;
      default:
        break;
    }
    ranged = grouper.getRange(data, range as [Dayjs, Dayjs]);
    percentages = grouper.getProfitLoss(ranged);

    setRangedData(ranged);
    setProfitLoss(percentages);
  }, [timeFrame, data]);

  return (
    <div>
      <div ref={lineChartRef} />
      <div ref={barChartRef} />
    </div>
  );
}

export { ChartContainer };
