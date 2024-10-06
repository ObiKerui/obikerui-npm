import { ReactNode, useState } from 'react';
import { cn } from '../../../Utils/CSS';
import { CurrencyInput } from '../Inputs/Currency';
import Property from '../Icons/Property';
// import { useBoundStore } from '../Model/Store';
import { tProperty } from '../../Model/NewModel';

type tPropertyChoiceProps = {
  isAdditionalProperty: boolean;
  setIsAdditionalProperty: (newValue: boolean) => void;
};

function PropertyChoice({
  isAdditionalProperty,
  setIsAdditionalProperty,
}: tPropertyChoiceProps) {
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
function Collapsable({
  children,
  isVisible = false,
}: {
  children: ReactNode;
  isVisible?: boolean;
}) {
  return (
    <div
      className={cn('max-h-0 overflow-hidden transition-all duration-700', {
        'h-auto max-h-screen': isVisible,
      })}
    >
      {children}
    </div>
  );
}
Collapsable.defaultProps = {
  isVisible: true,
};

type tPropertyFieldProps = {
  property: tProperty;
  updateProperty: (property: tProperty) => void;
};

function PropertyField({ property, updateProperty }: tPropertyFieldProps) {
  const propertyCopy = { ...property };

  const setIsAdditionalProperty = (isAdditional: boolean) => {
    propertyCopy.isAdditionalProperty = isAdditional;
    updateProperty(propertyCopy);
  };

  const setPropertyValue = (newValue: number) => {
    propertyCopy.propertyValue = newValue;
    updateProperty(propertyCopy);
  };

  const [hovering, setHovering] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className="grid grid-cols-3 hover:cursor-pointer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div>Property Value</div>

      <div>
        <span className="flex h-[24px] items-center">
          <CurrencyInput
            value={propertyCopy.propertyValue}
            placeholder="Enter Property Price"
            onUpdate={(newPrice) => setPropertyValue(newPrice)}
          />
        </span>
      </div>

      <div
        className={cn('hidden', {
          block: hovering,
        })}
      >
        <button
          type="button"
          className="btn btn-xs m-0"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Options
        </button>
      </div>

      <div className="col-span-3">
        <Collapsable isVisible={isOpen}>
          <PropertyChoice
            isAdditionalProperty={propertyCopy.isAdditionalProperty}
            setIsAdditionalProperty={setIsAdditionalProperty}
          />
        </Collapsable>
      </div>
    </div>
  );
}

export { PropertyField };
