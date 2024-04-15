import { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { type tROIModel } from './Model';
import { Controller } from './Controller';

/**
 * Interface Provider Stock Context
 */
interface IAppContext {
  model: tROIModel;
  controller: Controller;
}

/**
 * Context Provider Stock Context
 */
const AppContext = createContext<IAppContext | undefined>(undefined);

export const useAppProvider = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a StockProvider');
  }
  return context;
};

interface IAppProvider {
  children: ReactNode;
}

const controller = new Controller();

export function AppProvider({ children }: IAppProvider) {
  const [model, setModel] = useState<tROIModel>(controller.model);

  console.log('provider controller model: ', controller.model);

  const updateModel = () => {
    controller.yields.calculateGrossYield();
    controller.yields.calculatorNetYield();
    const updated = controller.model;
    setModel({ ...updated });
  };

  controller.notify = updateModel;

  const value: IAppContext = useMemo(
    () => ({
      model,
      controller,
    }),
    [model]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
