import { tProperty } from '../../Model/NewModel';
import { CurrencyInput } from '../Inputs/Currency';

type tRentalVoidsProps = {
  property: tProperty;
  updateProperty: (newValue: tProperty) => void;
};

function RentalVoids({ property, updateProperty }: tRentalVoidsProps) {
  const propertyCopy = { ...property };

  const setRentalVoids = (newValue: number) => {
    propertyCopy.rentalVoids = newValue;
    updateProperty(propertyCopy);
  };

  return (
    <div className="grid grid-cols-3 py-2">
      <div>Rental Voids</div>
      <div>
        <CurrencyInput
          value={propertyCopy.rentalVoids}
          placeholder="Enter Rental Voids"
          onUpdate={(newValue) => setRentalVoids(newValue)}
        />
      </div>
      <div>&nbsp;</div>
    </div>
  );
}

export default RentalVoids;
