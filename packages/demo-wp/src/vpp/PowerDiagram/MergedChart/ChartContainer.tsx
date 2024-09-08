import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { DataGrouper } from '../../Solax/Grouper';
import { usePowerRouter } from '../../Solax/Store';
import { useChart, tTimeFrame } from './Model';
import { Chart as PowerChart } from './PowerChart/Chart';
import { Chart as BatteryChart } from './BatChart';
import { Chart as PVChart } from './PVChart';

const grouper = new DataGrouper();
const lineChart = new PowerChart();
const batChart = new BatteryChart();
const pvChart = new PVChart();

useChart.subscribe((newState) => {
  lineChart.update(newState);
  batChart.update(newState);
  pvChart.update(newState);
});

function ChartContainer() {
  const data = usePowerRouter((state) => state.data);
  const setLineContainer = useChart((state) => state.setLineContainer);
  const setBatContainer = useChart((state) => state.setBatContainer);
  const setPVContainer = useChart((state) => state.setPVContainer);
  const setRangedData = useChart((state) => state.setRangedData);
  const setVisibility = useChart((state) => state.setVisibility);
  const [searchParams] = useSearchParams();

  const lineChartRef = useRef<HTMLDivElement | null>(null);
  const batChartRef = useRef<HTMLDivElement | null>(null);
  const pvChartRef = useRef<HTMLDivElement | null>(null);

  const timeFrame = searchParams.get('timeFrame');
  const visible = searchParams.get('visible') ?? '';
  const visibleArr = visible.split(',');

  useEffect(() => {
    setLineContainer(lineChartRef.current);
    setBatContainer(batChartRef.current);
    setPVContainer(pvChartRef.current);
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

  useEffect(() => {
    setVisibility(visibleArr);
  }, [visibleArr]);

  return (
    <div>
      <div ref={lineChartRef} />
      <div ref={batChartRef} />
      <div ref={pvChartRef} />
    </div>
  );
}

export { ChartContainer };
