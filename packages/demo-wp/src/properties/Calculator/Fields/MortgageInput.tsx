import { useState } from 'react';
import { CurrencyInput } from '../Inputs/Currency';
import { PercentInput } from '../Inputs/Percentage';
import { YearsInput } from '../Inputs/Years';
import { useComputedState } from '../../Model/Store';
import { Collapsable } from '../../Lib/Components/Collapsable';
import { cn } from '../../../Utils/CSS';
import { tProperty } from '../../Model/NewModel';

type tMortgageOptionsProps = {
  property: tProperty;
  updateProperty: (newProperty: tProperty) => void;
};

function MortgageOptions({ property, updateProperty }: tMortgageOptionsProps) {
  const propertyCopy = { ...property };

  // const interestRate = useBoundStore((state) => state.interestRate);
  // const setInterestRate = useBoundStore((state) => state.setInterestRate);
  // const mortgageTerm = useBoundStore((state) => state.mortgageTerm);
  // const setMortgageTerm = useBoundStore((state) => state.setMortgageTerm);

  // const [interestOnly, setInterestOnly] = useState<boolean>(false);

  const setInterestRate = (newIR: number) => {
    propertyCopy.interestRate = newIR;
    updateProperty(propertyCopy);
  };

  const setInterestOnly = (isIROnly: boolean) => {
    propertyCopy.interestOnly = isIROnly;
    updateProperty(propertyCopy);
  };

  const setMortgageTerm = (mortgageTerm: number) => {
    propertyCopy.mortgageTerm = mortgageTerm;
    updateProperty(propertyCopy);
  };

  return (
    <div className="bg-base-200 flex flex-col gap-4 rounded-md p-2">
      <div className="flex flex-row items-center">
        <span className="pr-2">Interest Rate: </span>
        <PercentInput
          value={property.interestRate}
          placeholder="Interest Rate"
          onUpdate={(newValue) => setInterestRate(newValue)}
        />
      </div>
      <div className="flex flex-row items-center">
        <span className="pr-2">Term: </span>
        <YearsInput
          value={property.mortgageTerm}
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
            checked={property.interestOnly}
            onClick={() => setInterestOnly(!property.interestOnly)}
          />
        </label>
      </div>
    </div>
  );
}

type tMortgageFieldProps = {
  property: tProperty;
  updateProperty: (newProp: tProperty) => void;
};

function MortgageField({ property, updateProperty }: tMortgageFieldProps) {
  const propertyCopy = { ...property };

  const mortgageAmount = useComputedState((state) => state.mortgageAmount);
  // const setMortgageAmount = useBoundStore((state) => state.setMortgagePayment);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const setMortgageAmount = (newAmount: number) => {
    propertyCopy.mortgagePayment = newAmount;
    updateProperty(propertyCopy);
  };

  return (
    <div
      className="grid grid-cols-3"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div>Mortgage Amount</div>

      <div>
        <div className="flex h-[24px] items-center">
          <CurrencyInput
            value={mortgageAmount}
            placeholder="Enter Mortgage Amount"
            onUpdate={(newAmount) => setMortgageAmount(newAmount)}
          />
        </div>
      </div>
      <div
        className={cn('hidden', {
          block: isHovering,
        })}
      >
        <button
          type="button"
          className="btn btn-xs m-0"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Options
        </button>
      </div>

      <div className="col-span-3">
        <Collapsable isOpen={isOpen}>
          <MortgageOptions
            property={propertyCopy}
            updateProperty={updateProperty}
          />
        </Collapsable>
      </div>
    </div>
  );
}

export { MortgageField };
