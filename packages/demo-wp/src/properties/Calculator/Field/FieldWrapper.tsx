/* eslint-disable react/function-component-definition */
import React, {
  useState,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { cn } from '../../../Utils/CSS';

function FieldDesc({ children }: { children: ReactNode }) {
  return (
    <td className="align-top">
      <span>{children}</span>
    </td>
  );
}

// eslint-disable-next-line react/function-component-definition
const FieldCosts: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <td className="flex flex-row items-center">{children}</td>
);

function FieldOptions({
  children,
  isVisible = false,
}: {
  children: ReactNode;
  isVisible?: boolean;
}) {
  return (
    <p
      className={cn('max-h-0 overflow-hidden transition-all duration-700', {
        'h-auto max-h-screen': isVisible,
      })}
    >
      <p className="p-2">{children}</p>
    </p>
  );
}

function FieldToggle({
  children,
  hovering = false,
}: {
  children: ReactNode;
  hovering?: boolean;
}) {
  if (hovering) {
    return children as JSX.Element;
  }
  return null;
}

type tFieldWrapperProps = {
  children: (
    hovering: boolean,
    isOpen: boolean,
    toggleCollapse: () => void
  ) => JSX.Element;
};

const FieldWrapper: FunctionComponent<tFieldWrapperProps> = ({ children }) => {
  const [hovering, setHovering] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState(false);
  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <tr
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* {childrenWithProps} */}
      {children(hovering, isOpen, toggleCollapse)}
    </tr>
  );
};

export { FieldWrapper, FieldDesc, FieldCosts, FieldOptions, FieldToggle };
