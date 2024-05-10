/* eslint-disable max-classes-per-file */
import { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { PlotController } from './Controller';
import { PlotModel } from './Model';

const controller = new PlotController();

/**
 * Interface Provider Stock Context
 */
interface IChartDataContext {
  model: PlotModel;
  controller: PlotController;
}

/**
 * Context Provider Stock Context
 */
const ChartDataContext = createContext<IChartDataContext | undefined>(
  undefined
);

export const useChartData = () => {
  const context = useContext(ChartDataContext);
  if (context === undefined) {
    throw new Error('useChartData must be used within a StockProvider');
  }
  return context;
};

interface IChartDataProvider {
  children: ReactNode;
}

export function ChartDataProvider({ children }: IChartDataProvider) {
  const [model, setChartModel] = useState<PlotModel>(controller.model);

  const updateModel = () => {
    const updated = controller.model;
    setChartModel({ ...updated });
  };

  controller.notify = updateModel;

  const value: IChartDataContext = useMemo(
    () => ({
      model,
      controller,
    }),
    [model]
  );

  return (
    <ChartDataContext.Provider value={value}>
      {children}
    </ChartDataContext.Provider>
  );
}
