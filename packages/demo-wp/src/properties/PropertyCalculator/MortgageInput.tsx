import { useState } from 'react';
import { useAppProvider } from '../Provider/Provider';
import { CurrencyInput } from './Inputs/Currency';
import {
  FieldCosts,
  FieldDesc,
  FieldOptions,
  FieldToggle,
  FieldWrapper,
} from './Field/FieldWrapper';
import { PercentInput } from './Inputs/Percentage';
import { YearsInput } from './Inputs/Years';

function MortgageOptions() {
  const { model, controller } = useAppProvider();
  const [interestOnly, setInterestOnly] = useState<boolean>(false);

  return (
    <div className="bg-base-200 flex flex-col gap-4 rounded-md p-2">
      <div className="flex flex-row items-center">
        <span className="pr-2">Interest Rate: </span>
        <PercentInput
          value={model.investment.interestRate}
          placeholder="Interest Rate"
          onUpdate={(newValue) => controller.updateInterestRate(newValue)}
        />
      </div>
      <div className="flex flex-row items-center">
        <span className="pr-2">Term: </span>
        <YearsInput
          value={model.investment.mortgageTerm}
          placeholder="Enter Term"
          onUpdate={(newValue) => controller.updateMortgageTerm(newValue)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="mortgage-type-control" className="label cursor-pointer">
          <span className="label-text">Interest Only</span>
          <input
            id="mortgage-type-control"
            type="checkbox"
            className="toggle"
            checked={interestOnly}
            onClick={() => setInterestOnly((prev) => !prev)}
          />
        </label>
      </div>
    </div>
  );
}

function MortgageField() {
  const { model, controller } = useAppProvider();

  return (
    <FieldWrapper>
      {(hovering, isOpen, toggleCollapse) => (
        <>
          <FieldDesc>Mortgage Amount</FieldDesc>

          <FieldCosts>
            <span className="flex h-[24px] items-center">
              <CurrencyInput
                value={model.investment.mortgageAmount}
                placeholder="Enter Mortgage Amount"
                onUpdate={(newAmount) => controller.updateMortgage(newAmount)}
              />
            </span>
            <FieldToggle hovering={hovering}>
              <button
                type="button"
                className="btn btn-xs m-0"
                onClick={toggleCollapse}
              >
                Options
              </button>
            </FieldToggle>
          </FieldCosts>

          <FieldOptions isVisible={isOpen}>
            <MortgageOptions />
          </FieldOptions>
        </>
      )}
    </FieldWrapper>
  );
}

export { MortgageField };
