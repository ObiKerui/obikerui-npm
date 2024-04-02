import { createContext, useContext, ReactNode, useMemo } from 'react';
// import Model from "../../solar/ThreeSolar/Buildings/Model";

/**
 * Interface Provider Stock Context
 */
interface IAppContext {
  //   setHTMLElements: (args: types.tPageElements) => void;
  calculate: () => void;
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

// const model = new Model();
// const controller = new Controller();

// controller.model = model;
// controller.model = model;

// model.addListener(scaleControl);
// model.addListener(rotateControl);
// model.addListener(positionControl);
// model.addListener(roofControl);
// model.addListener(elevationControl);

// plan.onMouseDown = uiController.onMouseDown;
// plan.onMouseUp = uiController.onMouseUp;
// plan.onMouseMove = uiController.onMouseMove;
// elevation.onMouseDown = uiController.onMouseDown;
// elevation.onMouseUp = uiController.onMouseUp;
// elevation.onMouseMove = uiController.onMouseMove;
// elevation.onCameraChange = uiController.onCameraChange;

// model.handleControl.planHudCamera = model.planScene.hudCamera;
// model.handleControl.planHudScene = model.planScene.hudScene;

// model.listeners.push(plan.onUpdateModel.bind(plan));
// model.listeners.push(perspective.onUpdateModel.bind(perspective));

export function AppProvider({ children }: IAppProvider) {
  // useEffect(() => {}, []);

  //   const setHTMLElements = (elements: types.tPageElements) => {
  //     plan.container = elements.plan;
  //     plan.load();
  //     plan.render();
  //     perspective.container = elements.perspective;
  //     perspective.load();
  //     perspective.render();
  //     elevation.container = elements.elevation;
  //     elevation.load();
  //     elevation.render();
  //   };

  //   const addBuilding = () => {
  //     controller.addBuilding();
  //   };

  //   const addDormer = () => {
  //     controller.addDormer();
  //   };

  const calculate = () => {
    console.log('calculate');
  };

  const value: IAppContext = useMemo(
    () => ({
      calculate,
      //   setHTMLElements,
      //   addBuilding,
      //   addDormer,
    }),
    []
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
