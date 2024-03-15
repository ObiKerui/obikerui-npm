import { createContext, useContext, type ReactNode, useMemo } from 'react';
import Plan from './Scenes/Plan';
import * as types from './Lib/sharedTypes';
import Controller from './Controllers/Controller';
import { Model } from './Model/Model';
import Perspective from './Scenes/Perspective';
import Elevation from './Scenes/Elevation';
import UIEventControl from './Controllers/UIEventControl';
import ScaleControl from './Controllers/ScaleControl';
import PositionControl from './Controllers/PositionControl';
import RotateControl from './Controllers/RotateControl';
import RoofControl from './Controllers/RoofControl';
import ElevationControl from './Controllers/ElevationControl';

/**
 * Interface Provider Stock Context
 */
interface IAppContext {
  setHTMLElements: (args: types.tPageElements) => void;
  addBuilding: () => void;
  addDormer: () => void;
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
const uiController = new UIEventControl();
const plan = new Plan();
const perspective = new Perspective();
const elevation = new Elevation();
const scaleControl = new ScaleControl();
const rotateControl = new RotateControl();
const positionControl = new PositionControl();
const roofControl = new RoofControl();
// const handleControl = new HandleControl();
// const elevationHandles = new CamHandles();
const elevationControl = new ElevationControl();

controller.model = model;
uiController.model = model;

model.addListener(scaleControl);
model.addListener(rotateControl);
model.addListener(positionControl);
model.addListener(roofControl);
model.addListener(elevationControl);

plan.onMouseDown = uiController.onMouseDown;
plan.onMouseUp = uiController.onMouseUp;
plan.onMouseMove = uiController.onMouseMove;
elevation.onMouseDown = uiController.onMouseDown;
elevation.onMouseUp = uiController.onMouseUp;
elevation.onMouseMove = uiController.onMouseMove;
elevation.onCameraChange = uiController.onCameraChange;

model.planScene = plan;
model.perspectiveScene = perspective;
model.elevationScene = elevation;

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
    elevation.container = elements.elevation;
    elevation.load();
    elevation.render();
  };

  const addBuilding = () => {
    controller.addBuilding();
  };

  const addDormer = () => {
    controller.addDormer();
  };

  const value: IAppContext = useMemo(
    () => ({
      setHTMLElements,
      addBuilding,
      addDormer,
    }),
    []
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
