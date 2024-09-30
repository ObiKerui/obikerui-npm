import { cn } from '../../../Utils/CSS';

type tCollapsableProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

function Collapsable({ children, isOpen }: tCollapsableProps) {
  return (
    <div
      className={cn('max-h-0 overflow-hidden transition-all duration-700', {
        'h-auto max-h-screen': isOpen,
      })}
    >
      {children}
    </div>
  );
}

export { Collapsable };
