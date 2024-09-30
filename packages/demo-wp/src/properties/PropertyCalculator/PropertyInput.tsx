import { ReactNode, useState } from 'react';
import { cn } from '../../Utils/CSS';
import { CurrencyInput } from './Inputs/Currency';
import Property from './Icons/Property';
// import {
//   FieldCosts,
//   FieldDesc,
//   FieldOptions,
//   FieldToggle,
//   FieldWrapper,
// } from './Field/FieldWrapper';
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

// function PropertyField() {
//   const propertyValue = useBoundStore((state) => state.propertyValue);
//   const setPropertyValue = useBoundStore((state) => state.setPropertyValue);

//   return (
//     <FieldWrapper>
//       {(hovering, isOpen, toggleCollapse) => (
//         <>
//           <FieldDesc>Property Value</FieldDesc>

//           <FieldCosts>
//             <span className="flex h-[24px] items-center">
//               <CurrencyInput
//                 value={propertyValue}
//                 placeholder="Enter Property Price"
//                 onUpdate={(newPrice) => setPropertyValue(newPrice)}
//               />
//             </span>
//             <FieldToggle hovering={hovering}>
//               <button
//                 type="button"
//                 className="btn btn-xs m-0"
//                 onClick={toggleCollapse}
//               >
//                 Options
//               </button>
//             </FieldToggle>
//           </FieldCosts>

//           <FieldOptions isVisible={isOpen}>
//             <PropertyChoice />
//           </FieldOptions>
//         </>
//       )}
//     </FieldWrapper>
//   );
// }

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

function PropertyField() {
  const propertyValue = useBoundStore((state) => state.propertyValue);
  const setPropertyValue = useBoundStore((state) => state.setPropertyValue);
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
            value={propertyValue}
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
          <PropertyChoice />
        </Collapsable>
      </div>
    </div>
  );
}

export { PropertyField };
