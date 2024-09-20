import { useEffect, useState } from 'react';
import {
  FieldCosts,
  FieldDesc,
  FieldToggle,
  FieldWrapper,
} from './Field/FieldWrapper';
import Percent from './Icons/Percent';
import Pound from './Icons/Pound';
import { CurrencyInput } from './Inputs/Currency';
import { PercentInput } from './Inputs/Percentage';
import { useBoundStore } from '../Model/Store';

function DepositField() {
  const propertyValue = useBoundStore((state) => state.propertyValue);
  const deposit = useBoundStore((state) => state.deposit);
  const setDeposit = useBoundStore((state) => state.setDeposit);

  const [inputMode, setInputMode] = useState<string>('currency');
  const [currentPropVal, setCurrentPropVal] = useState<number>(propertyValue);
  const [currentPCent, setCurrentPercentage] = useState<number>(0);

  useEffect(() => {
    setCurrentPropVal(propertyValue);
    setCurrentPercentage(currentPCent * propertyValue);
  }, [propertyValue]);

  const onUpdate = (inputType: string, amount: number) => {
    let value = amount;
    if (inputType === 'percent') {
      setCurrentPercentage(value);
      value = (value / 100.0) * currentPropVal;
    }
    setDeposit(value);
  };

  return (
    <FieldWrapper>
      {(hovering) => (
        <>
          <FieldDesc>Deposit Amount</FieldDesc>

          <FieldCosts>
            <span className="flex h-[24px] items-center">
              {inputMode === 'currency' && (
                <CurrencyInput
                  value={deposit}
                  placeholder="Enter Amount"
                  onUpdate={(newAmount) => onUpdate('currency', newAmount)}
                />
              )}
              {inputMode === 'percent' && (
                <PercentInput
                  value={currentPCent}
                  placeholder="Enter Percentage"
                  onUpdate={(newAmount) => onUpdate('percent', newAmount)}
                />
              )}
            </span>
            <FieldToggle hovering={hovering}>
              <label className="swap" htmlFor="swap-deposit-input-type">
                <input
                  type="checkbox"
                  id="swap-deposit-input-type"
                  onChange={() =>
                    setInputMode((curr) =>
                      curr === 'percent' ? 'currency' : 'percent'
                    )
                  }
                />
                <span className="swap-on">
                  <Percent />
                </span>
                <span className="swap-off">
                  <Pound />
                </span>
              </label>
            </FieldToggle>
          </FieldCosts>
        </>
      )}
    </FieldWrapper>
  );
}

export { DepositField };
