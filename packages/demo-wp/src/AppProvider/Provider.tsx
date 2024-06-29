import { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { AppController } from './Controller';
import { tAppModel } from './Model';

const controller = new AppController({
  theme: 'light',
} as tAppModel);

/**
 * Interface Provider Stock Context
 */
interface IAppContext {
  model: tAppModel;
  controller: AppController;
}

/**
 * Context Provider Stock Context
 */
const AppContext = createContext<IAppContext | undefined>(undefined);

export const useAppProvider = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface IAppProvider {
  children: ReactNode;
}

export function AppProvider({ children }: IAppProvider) {
  const [model, setModel] = useState<tAppModel>(controller.model);

  const updateModel = () => {
    // controller.update();
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
