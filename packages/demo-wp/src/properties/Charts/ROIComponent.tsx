import { useEffect, useRef } from 'react';
import StackedPlotObj from './Plot';
import { useROIModel } from './Model';
import {
  NewYieldCalculator,
  YieldRangeCalculator,
} from '../Lib/Controllers/YieldCalculator';
import { useBoundStore } from '../Model/NewModel';

const stackedPlotInst = new StackedPlotObj();
const yieldRangeCalculator = new YieldRangeCalculator();
const yieldCalculator = new NewYieldCalculator();
// const grouper = new DataGrouper();
// const lineData = new LineData();

useROIModel.subscribe((newState) => {
  stackedPlotInst.update(newState);
});

function Component() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setROIContainer, setYieldValues, setProperties } = useROIModel();
  const properties = useBoundStore((state) => state.properties);

  useEffect(() => {
    const grouped = null;

    // switch (sorting) {
    //   case 'months':
    //     grouped = grouper.groupByMonths(dataSeries);
    //     break;
    //   case 'weeks':
    //     grouped = grouper.groupByWeeks(dataSeries);
    //     break;
    //   case 'days':
    //     grouped = grouper.groupByDays(dataSeries);
    //     break;
    //   case 'hours':
    //     grouped = grouper.groupByHours(dataSeries);
    //     break;
    //   default:
    //     grouped = grouper.groupByMonths(dataSeries);
    // }

    // const lineDataArr = lineData.averaged(grouped);

    // setGroupedData(grouped);
    // setAverageData(lineDataArr);
  }, []);

  useEffect(() => {
    const yields = yieldRangeCalculator.calculateRange({
      startBalance: 0,
      endBalance: 2000,
      balanceInc: 100,
      startInvest: 50000,
      endInvest: 200000,
      investInc: 10000,
    });

    const propertyYields = Array.from(properties.values()).map((property) => {
      const yieldValue = yieldCalculator.calculateGrossYield(property);
      const balance = yieldCalculator.calculateBalance(property);
      const investment = yieldCalculator.calculateInvestment(property);

      return {
        balance,
        investment,
        yieldValue,
      };
    });

    setProperties(propertyYields);
    setYieldValues(yields);
  }, [properties]);

  useEffect(() => {
    setROIContainer(ref.current);
  }, [ref.current]);

  return (
    <div>
      <div ref={ref} />
    </div>
  );
}

export default Component;
