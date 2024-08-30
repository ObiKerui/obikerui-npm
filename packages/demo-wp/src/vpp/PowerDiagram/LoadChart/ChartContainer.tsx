import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { DataGrouper } from '../../Solax/Grouper';
import { usePowerRouter } from '../../Solax/Store';
import { useChart, tTimeFrame } from './Model';
import { Chart as LineChart } from './Chart';

const grouper = new DataGrouper();
const lineChart = new LineChart();

useChart.subscribe((newState) => {
  lineChart.update(newState);
});

function ChartContainer() {
  const data = usePowerRouter((state) => state.data);
  const setLineContainer = useChart((state) => state.setLineContainer);
  const setRangedData = useChart((state) => state.setRangedData);
  const [searchParams] = useSearchParams();

  const lineChartRef = useRef<HTMLDivElement | null>(null);

  const timeFrame = searchParams.get('timeFrame');

  useEffect(() => {
    setLineContainer(lineChartRef.current);
  }, []);

  useEffect(() => {
    let ranged = [];
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

    setRangedData(ranged);
  }, [timeFrame, data]);

  return (
    <div>
      <div ref={lineChartRef} />
    </div>
  );
}

export { ChartContainer };
