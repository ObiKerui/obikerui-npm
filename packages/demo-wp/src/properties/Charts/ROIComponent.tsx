import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import StackedPlotObj from './Plot';
import { useROIModel } from './Model';
import {
  NewYieldCalculator,
  YieldRangeCalculator,
} from '../Lib/Controllers/YieldCalculator';
import { useBoundStore } from '../Model/NewModel';
import { ExpenditureCtrl } from '../Model/Expenditure';

const stackedPlotInst = new StackedPlotObj();
const yieldRangeCalculator = new YieldRangeCalculator();
const yieldCalculator = new NewYieldCalculator();
const expenditureCtrl = new ExpenditureCtrl();

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
    const propertyYields = Array.from(properties.values()).map((property) => {
      const monthlyMortgagePayment =
        expenditureCtrl.calculateMortgageMonthly(property);
      const params = {
        bills: property.bills,
        maintenanceFees: property.maintenanceFees,
        managementFees: property.managementFees,
        rentalVoids: property.rentalVoids,
        mortgagePayment: monthlyMortgagePayment,
        rentalIncome: property.rentalIncome,
      };
      const balance = yieldCalculator.calculateBalance(params) / 12.0;

      const yieldValue = yieldCalculator.calculateGrossYield({
        ...params,
        propertyValue: property.propertyValue,
      });
      const investment = yieldCalculator.calculateInvestment({
        ...params,
        propertyValue: property.propertyValue,
      });

      console.log(
        'balance / params: ',
        balance,
        params,
        property,
        monthlyMortgagePayment
      );

      return {
        balance,
        investment,
        yieldValue,
      };
    });

    const minMaxBalance = d3.extent(
      propertyYields,
      (property) => property.balance
    );

    console.log('min / max balance: ', minMaxBalance);

    const yields = yieldRangeCalculator.calculateRange({
      startBalance: 0,
      endBalance: 2000,
      balanceInc: 100,
      startInvest: 50000,
      endInvest: 200000,
      investInc: 10000,
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
