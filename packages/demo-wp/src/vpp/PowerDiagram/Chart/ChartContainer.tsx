import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataGrouper } from '../../Solax/Grouper';
import { usePowerRouter } from '../../Solax/Store';
import { useBatteryChart } from './Chart';

const grouper = new DataGrouper();

function ChartContainer() {
  const data = usePowerRouter((state) => state.data);
  const setContainer = useBatteryChart((state) => state.setContainer);
  const setGroupedData = useBatteryChart((state) => state.setGroupedData);
  const [searchParams] = useSearchParams();

  const chartRef = useRef<HTMLDivElement | null>(null);
  const timeFrame = searchParams.get('timeFrame');

  useEffect(() => {
    setContainer(chartRef.current);
  }, []);

  useEffect(() => {
    let groupedData = null;
    switch (timeFrame) {
      case 'days':
        groupedData = grouper.groupByDays(data);
        break;
      case 'hours':
        groupedData = grouper.groupByHours(data);
        break;
      case 'weeks':
        groupedData = grouper.groupByWeeks(data);
        break;
      case 'months':
        groupedData = grouper.groupByMonths(data);
        break;
      default:
        break;
    }
    if (!groupedData) return;

    setGroupedData(groupedData);
  }, [timeFrame, data]);

  return (
    <div>
      <div ref={chartRef} />
    </div>
  );
}

export { ChartContainer };
