import { tProperty } from '../../Model/NewModel';
import { CurrencyInput } from '../Inputs/Currency';

type tRentalIncomeProps = {
  property: tProperty;
  updateProperty: (newProp: tProperty) => void;
};

function RentalIncome({ property, updateProperty }: tRentalIncomeProps) {
  const propertyCopy = { ...property };

  const setRentalIncome = (newValue: number) => {
    propertyCopy.rentalIncome = newValue;
    updateProperty(propertyCopy);
  };

  return (
    <div className="grid grid-cols-3 py-2">
      <div>Rental Income</div>
      <div>&nbsp;</div>
      <div>
        <CurrencyInput
          value={propertyCopy.rentalIncome}
          placeholder="Rental Income"
          onUpdate={(newValue) => setRentalIncome(newValue)}
        />
      </div>
    </div>
  );
}

export default RentalIncome;
