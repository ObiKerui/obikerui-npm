import { tProperty } from '../../Model/NewModel';
import { CurrencyInput } from '../Inputs/Currency';

type tLegalFeesProps = {
  property: tProperty;
  updateProperty: (newProperty: tProperty) => void;
};

function LegalFees({ property, updateProperty }: tLegalFeesProps) {
  const propertyCopy = { ...property };

  const updateLegalFees = (newValue: number) => {
    propertyCopy.legalFees = newValue;
    updateProperty(propertyCopy);
  };

  return (
    <div className="grid grid-cols-3">
      <div>Legal Fees</div>
      <div>
        <CurrencyInput
          value={propertyCopy.legalFees}
          placeholder="Legal Fees"
          onUpdate={(newValue) => updateLegalFees(newValue)}
        />
      </div>
    </div>
  );
}

export default LegalFees;
