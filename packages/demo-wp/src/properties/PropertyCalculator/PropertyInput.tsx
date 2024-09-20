import { cn } from '../../Utils/CSS';
import { CurrencyInput } from './Inputs/Currency';
import Property from './Icons/Property';
import {
  FieldCosts,
  FieldDesc,
  FieldOptions,
  FieldToggle,
  FieldWrapper,
} from './Field/FieldWrapper';
import { useBoundStore } from '../Model/Store';

function PropertyChoice() {
  const setIsAdditionalProperty = useBoundStore(
    (state) => state.setIsAdditionalProperty
  );
  const isAdditionalProperty = useBoundStore(
    (state) => state.isAdditionalProperty
  );

  return (
    <ul className="menu bg-base-200 rounded-box w-56">
      <li>
        <button
          type="button"
          className={cn({ 'bg-base-300': isAdditionalProperty === false })}
          onClick={() => setIsAdditionalProperty(false)}
        >
          <Property />
          First Home
        </button>
      </li>
      <li>
        <button
          type="button"
          className={cn({ 'bg-base-300': isAdditionalProperty === true })}
          onClick={() => setIsAdditionalProperty(true)}
        >
          <Property />
          Additional Home
        </button>
      </li>
    </ul>
  );
}

function PropertyField() {
  const propertyValue = useBoundStore((state) => state.propertyValue);
  const setPropertyValue = useBoundStore((state) => state.setPropertyValue);

  return (
    <FieldWrapper>
      {(hovering, isOpen, toggleCollapse) => (
        <>
          <FieldDesc>Property Value</FieldDesc>

          <FieldCosts>
            <span className="flex h-[24px] items-center">
              <CurrencyInput
                value={propertyValue}
                placeholder="Enter Property Price"
                onUpdate={(newPrice) => setPropertyValue(newPrice)}
              />
            </span>
            <FieldToggle hovering={hovering}>
              <button
                type="button"
                className="btn btn-xs m-0"
                onClick={toggleCollapse}
              >
                Options
              </button>
            </FieldToggle>
          </FieldCosts>

          <FieldOptions isVisible={isOpen}>
            <PropertyChoice />
          </FieldOptions>
        </>
      )}
    </FieldWrapper>
  );
}

export { PropertyField };
