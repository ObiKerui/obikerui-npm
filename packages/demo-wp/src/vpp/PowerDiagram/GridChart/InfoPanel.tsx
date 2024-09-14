import { useState } from 'react';
import { cn } from '../../../Utils/CSS';

type tInfoPanelHeader = {
  render: (message: string) => React.ReactNode;
};

function InfoPanelHeader({ render }: tInfoPanelHeader) {
  const arg = 'hello';

  return <div>{render(arg)}</div>;
}

type tInfoPanelBody = {
  render: (message: string) => React.ReactNode;
};

function InfoPanelBody({ render }: tInfoPanelBody) {
  const arg = 'body';

  return <div>{render(arg)}</div>;
}

type tCollapsable = {
  hidden: boolean;
  render: () => React.ReactNode;
};

function Collapsable({ hidden, render }: tCollapsable) {
  //   const [hiddenValue, setHidden] = useState<boolean>(true);

  return (
    <div
      className={cn('overflow-hidden transition-all duration-500 ease-in-out', {
        'max-h-0 opacity-0': hidden,
        'max-h-[500px] opacity-100': !hidden,
      })}
    >
      {render()}
    </div>
  );
}

export { InfoPanelHeader, InfoPanelBody, Collapsable };
