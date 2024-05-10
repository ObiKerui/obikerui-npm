import { cn } from '../../Utils/CSS';
import { useAppProvider } from '../Provider/Provider';
import { CurrencyInput } from './Inputs/Currency';
import Property from './Icons/Property';
import {
  FieldCosts,
  FieldDesc,
  FieldOptions,
  FieldToggle,
  FieldWrapper,
} from './Field/FieldWrapper';

function PropertyChoice() {
  const { model, controller } = useAppProvider();

  const additional = model.investment.isAdditionalProperty;

  return (
    <ul className="menu bg-base-200 rounded-box w-56">
      <li>
        <button
          type="button"
          className={cn({ 'bg-base-300': additional === false })}
          onClick={() => controller.updateAdditionalProperty(false)}
        >
          <Property />
          First Home
        </button>
      </li>
      <li>
        <button
          type="button"
          className={cn({ 'bg-base-300': additional === true })}
          onClick={() => controller.updateAdditionalProperty(true)}
        >
          <Property />
          Additional Home
        </button>
      </li>
    </ul>
  );
}

function PropertyField() {
  const { model, controller } = useAppProvider();

  return (
    <FieldWrapper>
      {(hovering, isOpen, toggleCollapse) => (
        <>
          <FieldDesc>Property Value</FieldDesc>

          <FieldCosts>
            <span className="flex h-[24px] items-center">
              <CurrencyInput
                value={model.investment.propertyValue}
                placeholder="Enter Property Price"
                onUpdate={(newPrice) =>
                  controller.updatePropertyPrice(newPrice)
                }
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
