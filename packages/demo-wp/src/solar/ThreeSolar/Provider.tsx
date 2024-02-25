import { createContext, useContext, type ReactNode, useMemo } from 'react';
import Plan from './Scenes/Plan';
import * as types from './Lib/sharedTypes';
import Controller from './Model/Controller';
import { Model } from './Model/Model';
import Perspective from './Scenes/Perspective';

/**
 * Interface Provider Stock Context
 */
interface IAppContext {
  setHTMLElements: (args: types.tPageElements) => void;
  addBuilding: () => void;
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

const model = new Model();
const controller = new Controller();
const plan = new Plan();
const perspective = new Perspective();

controller.model = model;
model.planScene = plan;
model.perspectiveScene = perspective;

// model.listeners.push(plan.onUpdateModel.bind(plan));
// model.listeners.push(perspective.onUpdateModel.bind(perspective));

export function AppProvider({ children }: IAppProvider) {
  // useEffect(() => {}, []);

  const setHTMLElements = (elements: types.tPageElements) => {
    plan.container = elements.plan;
    plan.load();
    plan.render();
    perspective.container = elements.perspective;
    perspective.load();
    perspective.render();
  };

  const addBuilding = () => {
    controller.addBuilding();
  };

  const value: IAppContext = useMemo(
    () => ({
      setHTMLElements,
      addBuilding,
    }),
    []
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
