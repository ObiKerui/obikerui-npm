import { tProperty } from '../../Model/NewModel';
import { CurrencyInput } from '../Inputs/Currency';

type tBillsProps = {
  property: tProperty;
  updateProperty: (newValue: tProperty) => void;
};

function Bills({ property, updateProperty }: tBillsProps) {
  const propertyCopy = { ...property };

  const setBills = (newValue: number) => {
    propertyCopy.bills = newValue;
    updateProperty(propertyCopy);
  };

  return (
    <div className="grid grid-cols-3 py-2">
      <div>Bills</div>
      <div>
        <CurrencyInput
          value={propertyCopy.bills}
          placeholder="Enter Bills Amount"
          onUpdate={(newValue) => setBills(newValue)}
        />
      </div>
      <div>&nbsp;</div>
    </div>
  );
}

export default Bills;
