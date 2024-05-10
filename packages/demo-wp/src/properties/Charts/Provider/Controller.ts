import { ROIPlot } from './ROIPlot';
import { PlotModel, tEntry, tPageElements } from './Model';
import { YieldRangeCalculator } from '../../Lib/Controllers/YieldCalculator';
import { STPlot } from './STPlot';

const calculator = new YieldRangeCalculator();

class PlotController {
  notify: (() => void) | null;
  model: PlotModel;
  roiPlot: ROIPlot;
  linePlot: STPlot;
  constructor() {
    this.notify = null;
    this.model = new PlotModel();
    this.roiPlot = new ROIPlot();
    this.linePlot = new STPlot();
  }

  calculateData() {
    const { model } = this;

    const yieldData = calculator.calculateRange({
      startBalance: 0,
      endBalance: 2000,
      balanceInc: 100,
      startInvest: 50000,
      endInvest: 200000,
      investInc: 10000,
    });

    const heatmapYieldData = yieldData.map(
      (elem) =>
        ({
          x: elem.balance,
          y: elem.investment,
          v: elem.yieldValue,
        } as tEntry)
    );

    model.yieldData.entries = heatmapYieldData;
  }

  calculateMarkers() {
    const { model } = this;
    const { rentalCost, rentalIncome, investment } = model;

    const staticProperty = {
      x: 1000,
      y: 90000,
      value: calculator.calculate(1000, 0, 90000),
    };

    const yieldValue = calculator.calculate(
      rentalIncome * 12,
      rentalCost * 12,
      investment
    );
    const moving = {
      x: rentalIncome - rentalCost,
      y: investment,
      value: yieldValue,
    };

    const markers = [staticProperty, moving];
    model.yieldData.markers = markers;
  }

  update() {
    this.calculateData();
    this.calculateMarkers();
    this.roiPlot.update(this.model);
    this.linePlot.update(this.model);
  }

  updatePageElement(args: tPageElements) {
    const { model, notify } = this;
    model.pageElements = args;

    this.update();

    if (notify) {
      notify();
    }
  }

  updateRentalIncome(newRentalIncome: number) {
    const { model, notify } = this;
    model.rentalIncome = newRentalIncome;

    this.update();

    if (notify) {
      notify();
    }
  }

  updateRentalCost(newRentalCost: number) {
    const { model, notify } = this;
    model.rentalCost = newRentalCost;

    this.update();

    if (notify) {
      notify();
    }
  }

  updateInvestment(newInvestAmount: number) {
    const { model, notify } = this;
    model.investment = newInvestAmount;

    this.update();

    if (notify) {
      notify();
    }
  }
}

export { PlotController };
