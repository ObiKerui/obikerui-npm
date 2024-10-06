import { useState } from 'react';
import { tProperty } from '../../Model/NewModel';
import { useComputedState } from '../../Model/Store';
import { CurrencyInput } from '../Inputs/Currency';
import { SDTLInfo } from '../Inputs/SDTLInfo';
import { calculateSDLTPct } from '../../Utils';

type tStampDutyProps = {
  property: tProperty;
  updateProperty: (property: tProperty) => void;
};

function StampDuty({ property, updateProperty }: tStampDutyProps) {
  const propertyCopy = { ...property };
  // const propertyValue = useBoundStore((state) => state.propertyValue);
  // const setStampDuty = useBoundStore((state) => state.setStampDuty);
  // const isAdditionalProperty = useBoundStore(
  //   (state) => state.isAdditionalProperty
  // );

  const compStampDuty = useComputedState((state) => state.stampDuty);

  const [, setMouseOverRow] = useState<string | null>(null);

  const setStampDuty = (newStampDuty: number) => {
    propertyCopy.stampDuty = newStampDuty;
    updateProperty(propertyCopy);
  };

  return (
    <div
      className="grid grid-cols-3"
      onMouseEnter={() => setMouseOverRow('stampduty')}
      onMouseLeave={() => setMouseOverRow(null)}
    >
      <div>Stamp Duty</div>
      <div className="flex flex-row items-center">
        <CurrencyInput
          value={compStampDuty}
          placeholder="Value"
          onUpdate={(newStamp) => setStampDuty(newStamp)}
        />
        <span className="font-light">
          <SDTLInfo
            rate={
              calculateSDLTPct(
                propertyCopy.propertyValue ?? 0,
                propertyCopy.isAdditionalProperty
              ) * 100.0
            }
          />
        </span>
      </div>
      <div>&nbsp;</div>
    </div>
  );
}

export default StampDuty;
