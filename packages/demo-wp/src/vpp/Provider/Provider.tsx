import { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { VPPModel } from '../Lib/Model';
import { Controller } from '../Lib/Controller';

/**
 * Interface Provider Stock Context
 */
interface IAppContext {
  model: VPPModel;
  controller: Controller;
}

/**
 * Context Provider Stock Context
 */
const AppContext = createContext<IAppContext | undefined>(undefined);

export const useAppProvider = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a VPPProvider');
  }
  return context;
};

interface IAppProvider {
  children: ReactNode;
}

const controller = new Controller();

export function AppProvider({ children }: IAppProvider) {
  const [model, setModel] = useState<VPPModel>(controller.model);

  const updateModel = () => {
    // controller.calculateInvestment();
    // controller.yields.calculateGrossYield();
    // controller.yields.calculatorNetYield();
    // controller.mortgage.calculateMonthlyPayments();
    controller.update();
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