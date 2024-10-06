import { tProperty } from '../../Model/NewModel';
import { CurrencyInput } from '../Inputs/Currency';

type tRenovationFeesProps = {
  property: tProperty;
  updateProperty: (newProp: tProperty) => void;
};

function RenovationFees({ property, updateProperty }: tRenovationFeesProps) {
  const propertyCopy = { ...property };

  const updateRenovationFees = (newValue: number) => {
    propertyCopy.renovationFees = newValue;
    updateProperty(propertyCopy);
  };

  return (
    <div className="grid grid-cols-3">
      <div>Renovation Fees</div>
      <div>
        <CurrencyInput
          value={propertyCopy.renovationFees}
          placeholder="Legal Fees"
          onUpdate={(newValue) => updateRenovationFees(newValue)}
        />
      </div>
    </div>
  );
}

export default RenovationFees;
