import { ChangeEvent } from 'react';
import { CurrencyInput } from '../Calculator/Inputs/Currency';
import { useROIModel } from './Model';

function Controls() {
  const {
    setTestRentalIncome,
    setTestRentalCost,
    setTestInvestment,
    testInvestment,
    testRentalCost,
    testRentalIncome,
  } = useROIModel();

  const adjustIncome = (e: ChangeEvent<HTMLInputElement>) => {
    const userVal = e.target.value;
    const numberVal = +userVal;
    setTestRentalIncome(numberVal);
  };

  const adjustCosts = (e: ChangeEvent<HTMLInputElement>) => {
    const userVal = e.target.value;
    const numberVal = +userVal;
    setTestRentalCost(numberVal);
  };

  const adjustInvest = (e: ChangeEvent<HTMLInputElement>) => {
    const userVal = e.target.value;
    const numberVal = +userVal;
    setTestInvestment(numberVal);
  };

  return (
    <div className="flex flex-col gap-4 pl-12">
      <div className="flex flex-row items-center gap-1">
        <span>Rental Income</span>
        <CurrencyInput
          value={testRentalIncome}
          placeholder="enter rental income"
          onUpdate={(newValue) => setTestRentalIncome(newValue)}
        />
      </div>
      <input
        type="range"
        min={0}
        max="2000"
        value={testRentalIncome}
        className="range range-xs"
        onChange={adjustIncome}
      />
      <div className="flex flex-row items-center gap-1">
        <span>Rental Cost</span>
        <CurrencyInput
          value={testRentalCost}
          placeholder="enter rental cost"
          onUpdate={(newValue) => setTestRentalCost(newValue)}
        />
      </div>
      <input
        type="range"
        min={0}
        max="2000"
        value={testRentalCost}
        className="range range-xs"
        onChange={adjustCosts}
      />
      <div className="flex flex-row items-center gap-1">
        <span>Investment</span>
        <CurrencyInput
          value={testInvestment}
          placeholder="enter investment"
          onUpdate={(newValue) => setTestInvestment(newValue)}
        />
      </div>
      <input
        type="range"
        min={0}
        max="500000"
        value={testInvestment}
        className="range range-xs"
        onChange={adjustInvest}
      />
    </div>
  );
}

export { Controls };
