import { useEffect, useState } from 'react';
import Percent from '../Icons/Percent';
import Pound from '../Icons/Pound';
import { CurrencyInput } from '../Inputs/Currency';
import { PercentInput } from '../Inputs/Percentage';
import { cn } from '../../../Utils/CSS';
import { tProperty } from '../../Model/NewModel';

type tDepositFieldProps = {
  property: tProperty;
  updateProperty: (update: tProperty) => void;
};

function DepositField({ property, updateProperty }: tDepositFieldProps) {
  const propertyCopy = { ...property };

  const [inputMode, setInputMode] = useState<string>('currency');
  const [currentPropVal, setCurrentPropVal] = useState<number>(
    propertyCopy.propertyValue
  );
  const [currentPCent, setCurrentPercentage] = useState<number>(0);
  const [hovering, setHovering] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPropVal(propertyCopy.propertyValue);
    setCurrentPercentage(currentPCent * propertyCopy.propertyValue);
  }, [property.propertyValue]);

  const onUpdate = (inputType: string, amount: number) => {
    let value = amount;
    if (inputType === 'percent') {
      setCurrentPercentage(value);
      value = (value / 100.0) * currentPropVal;
    }
    // setDeposit(value);
    propertyCopy.deposit = value;
    updateProperty(propertyCopy);
  };

  return (
    <div
      className="grid grid-cols-3"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div>Deposit Amount</div>

      <div className="flex items-center">
        {inputMode === 'currency' && (
          <CurrencyInput
            value={propertyCopy.deposit}
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
      </div>
      <div
        className={cn('hidden', {
          block: hovering,
        })}
      >
        <button
          type="button"
          className="btn btn-xs m-0"
          onClick={() =>
            setInputMode((curr) =>
              curr === 'percent' ? 'currency' : 'percent'
            )
          }
        >
          {inputMode === 'percent' ? <Percent /> : <Pound />}
        </button>
      </div>
    </div>
  );
}
export { DepositField };
