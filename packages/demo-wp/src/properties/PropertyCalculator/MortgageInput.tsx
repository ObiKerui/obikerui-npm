import { useState } from 'react';
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
import { useBoundStore, useComputedState } from '../Model/Store';

function MortgageOptions() {
  // const { model, controller } = useAppProvider();
  const interestRate = useBoundStore((state) => state.interestRate);
  const setInterestRate = useBoundStore((state) => state.setInterestRate);
  const mortgageTerm = useBoundStore((state) => state.mortgageTerm);
  const setMortgageTerm = useBoundStore((state) => state.setMortgageTerm);

  const [interestOnly, setInterestOnly] = useState<boolean>(false);

  return (
    <div className="bg-base-200 flex flex-col gap-4 rounded-md p-2">
      <div className="flex flex-row items-center">
        <span className="pr-2">Interest Rate: </span>
        <PercentInput
          value={interestRate}
          placeholder="Interest Rate"
          onUpdate={(newValue) => setInterestRate(newValue)}
        />
      </div>
      <div className="flex flex-row items-center">
        <span className="pr-2">Term: </span>
        <YearsInput
          value={mortgageTerm}
          placeholder="Enter Term"
          onUpdate={(newValue) => setMortgageTerm(newValue)}
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
  const mortgageAmount = useComputedState((state) => state.mortgageAmount);
  const setMortgageAmount = useBoundStore((state) => state.setMortgagePayment);

  return (
    <FieldWrapper>
      {(hovering, isOpen, toggleCollapse) => (
        <>
          <FieldDesc>Mortgage Amount</FieldDesc>

          <FieldCosts>
            <span className="flex h-[24px] items-center">
              <CurrencyInput
                value={mortgageAmount}
                placeholder="Enter Mortgage Amount"
                onUpdate={(newAmount) => setMortgageAmount(newAmount)}
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
