import { tProperty } from '../../Model/NewModel';
import { CurrencyInput } from '../Inputs/Currency';

type tManagementFeesProps = {
  property: tProperty;
  updateProperty: (newValue: tProperty) => void;
};

function ManagementFees({ property, updateProperty }: tManagementFeesProps) {
  const propertyCopy = { ...property };

  const setManagementFees = (newValue: number) => {
    propertyCopy.managementFees = newValue;
    updateProperty(propertyCopy);
  };

  return (
    <div className="grid grid-cols-3 py-2">
      <div>Management Fees</div>
      <div>
        <CurrencyInput
          value={propertyCopy.managementFees}
          placeholder="Enter Management Fees"
          onUpdate={(newValue) => setManagementFees(newValue)}
        />
      </div>
      <div>&nbsp;</div>
    </div>
  );
}

export default ManagementFees;
