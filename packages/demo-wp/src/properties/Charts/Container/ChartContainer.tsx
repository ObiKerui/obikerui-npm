/* eslint-disable react/function-component-definition */
import React, {
  useState,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useLayoutEffect,
  useRef,
} from 'react';
import { cn } from '../../../Utils/CSS';
import { FieldDesc } from '../../Calculator/Field/FieldWrapper';

function ChartDesc({ children }: { children: ReactNode }) {
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

type tContainerProps = {
  children: (ready: boolean) => JSX.Element;
};

const Container: FunctionComponent<tContainerProps> = ({ children }) => {
  //   const [hovering, setHovering] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const plotCreated = useRef(false);

  useLayoutEffect(() => {
    if (plotCreated.current === false && ref.current) {
      // eslint-disable-next-line no-console
      // const converted = data.map(
      //   (elem) =>
      //     ({
      //       x: elem.profit,
      //       y: elem.investment,
      //       v: elem.yieldValue,
      //     } as tEntry)
      // );
      // eslint-disable-next-line no-console
      // createPlot(ref.current, converted).catch(console.error);
    }
    return () => {
      plotCreated.current = true;
    };
  }, []);

  //   const [isOpen, setIsOpen] = useState(false);
  //   const toggleCollapse = () => {
  //     setIsOpen(!isOpen);
  //   };

  return <div>{children(ready)}</div>;
};

export { Container, FieldDesc };
