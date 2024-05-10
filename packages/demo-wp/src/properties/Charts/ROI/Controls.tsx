import { ChangeEvent } from 'react';
import { useChartData } from '../Provider/Provider';
import { CurrencyInput } from '../../PropertyCalculator/Inputs/Currency';

function Controls() {
  const { model, controller } = useChartData();

  const adjustIncome = (e: ChangeEvent<HTMLInputElement>) => {
    const userVal = e.target.value;
    const numberVal = +userVal;
    controller.updateRentalIncome(numberVal);
  };

  const adjustCosts = (e: ChangeEvent<HTMLInputElement>) => {
    const userVal = e.target.value;
    const numberVal = +userVal;
    controller.updateRentalCost(numberVal);
  };

  const adjustInvest = (e: ChangeEvent<HTMLInputElement>) => {
    const userVal = e.target.value;
    const numberVal = +userVal;
    controller.updateInvestment(numberVal);
  };

  return (
    <div className="flex flex-col gap-4 pl-12">
      <div className="flex flex-row items-center gap-1">
        <span>Rental Income</span>
        <CurrencyInput
          value={model.rentalIncome}
          placeholder="enter rental income"
          onUpdate={(newValue) => controller.updateRentalIncome(newValue)}
        />
      </div>
      <input
        type="range"
        min={0}
        max="2000"
        value={model.rentalIncome}
        className="range range-xs"
        onChange={adjustIncome}
      />
      <div className="flex flex-row items-center gap-1">
        <span>Rental Cost</span>
        <CurrencyInput
          value={model.rentalCost}
          placeholder="enter rental cost"
          onUpdate={(newValue) => controller.updateRentalCost(newValue)}
        />
      </div>
      <input
        type="range"
        min={0}
        max="2000"
        value={model.rentalCost}
        className="range range-xs"
        onChange={adjustCosts}
      />
      <div className="flex flex-row items-center gap-1">
        <span>Investment</span>
        <CurrencyInput
          value={model.investment}
          placeholder="enter investment"
          onUpdate={(newValue) => controller.updateInvestment(newValue)}
        />
      </div>
      <input
        type="range"
        min={0}
        max="500000"
        value={model.investment}
        className="range range-xs"
        onChange={adjustInvest}
      />
    </div>
  );
}

export { Controls };
