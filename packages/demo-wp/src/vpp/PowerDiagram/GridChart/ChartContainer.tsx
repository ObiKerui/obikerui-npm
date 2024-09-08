import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { DataGrouper } from '../../Solax/Grouper';
import { usePowerRouter } from '../../Solax/Store';
import { useGridChart, tTimeFrame } from './Model';
import { Chart as BarChart } from './PercentChart';
import { Chart as ProfitLossChart } from './ProfitLossChart';

const grouper = new DataGrouper();
const barChart = new BarChart();
const profitLoss = new ProfitLossChart();

useGridChart.subscribe((newState) => {
  barChart.update(newState);
  profitLoss.update(newState);
});

function ChartContainer() {
  const data = usePowerRouter((state) => state.data);
  const financialData = usePowerRouter((state) => state.financial);
  const setBarContainer = useGridChart((state) => state.setBarContainer);
  const setProfitLoss = useGridChart((state) => state.setProfitLoss);
  const setProdCons = useGridChart((state) => state.setProducedConsumed);
  const setProfitLossContainer = useGridChart(
    (state) => state.setProfitLossContainer
  );
  const [searchParams] = useSearchParams();

  const barChartRef = useRef<HTMLDivElement | null>(null);
  const profLossRef = useRef<HTMLDivElement | null>(null);

  const timeFrame = searchParams.get('timeFrame');

  useEffect(() => {
    setBarContainer(barChartRef.current);
    setProfitLossContainer(profLossRef.current);
  }, []);

  useEffect(() => {
    let ranged = [];
    let percentages = null;
    let profLossCurr = null;
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
    profLossCurr = grouper.getProfitLossCurrency(ranged, financialData);
    console.log('prof / loss currency: ', profLossCurr);

    setProfitLoss(percentages);
    setProdCons(profLossCurr);
  }, [timeFrame, data]);

  return (
    <div>
      <div ref={barChartRef} />
      <div ref={profLossRef} />
    </div>
  );
}

export { ChartContainer };
