import { useEffect, useRef } from 'react';
import { usePowerRouter } from '../../Solax/Store';
import { useBatteryChart } from './Chart';
import { DataGrouper } from '../../Solax/Grouper';

const grouper = new DataGrouper();

function BatteryPanel() {
  const { data } = usePowerRouter();
  const { setContainer, setGroupedData, setCategories, timeFrame } =
    useBatteryChart();
  const chartRef = useRef<HTMLDivElement | null>(null);

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
    setCategories(['soc']);
  }, [timeFrame, data]);

  return (
    <div>
      {/* <div>
        <Controls />
      </div> */}
      <div ref={chartRef} />
    </div>
  );
}

export { BatteryPanel };
