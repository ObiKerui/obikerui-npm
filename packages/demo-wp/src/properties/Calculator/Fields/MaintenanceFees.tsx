import { tProperty } from '../../Model/NewModel';
import { CurrencyInput } from '../Inputs/Currency';

type tMaintenanceFeesProps = {
  property: tProperty;
  updateProperty: (newValue: tProperty) => void;
};

function MaintenanceFees({ property, updateProperty }: tMaintenanceFeesProps) {
  const propertyCopy = { ...property };

  const setMaintenanceFees = (newValue: number) => {
    propertyCopy.maintenanceFees = newValue;
    updateProperty(propertyCopy);
  };

  return (
    <div className="grid grid-cols-3 py-2">
      <div>Maintenance Fees</div>
      <div>
        <CurrencyInput
          value={propertyCopy.maintenanceFees}
          placeholder="Enter Maintenance Fees"
          onUpdate={(newValue) => setMaintenanceFees(newValue)}
        />
      </div>
      <div>&nbsp;</div>
    </div>
  );
}

export default MaintenanceFees;
