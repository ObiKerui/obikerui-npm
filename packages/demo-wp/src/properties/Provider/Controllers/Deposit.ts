import { type tROIModel, eInputType } from '../Model';

type tUpdateDepositArgs = {
  inputType: eInputType;
  percentage: number;
  currency: number;
};

class Deposit {
  model: tROIModel;
  notify: ((model: tROIModel) => void) | null;
  constructor(model: tROIModel) {
    this.model = model;
    this.notify = null;
  }

  updateDeposit({ inputType, currency, percentage }: tUpdateDepositArgs) {
    const { model } = this;
    const { investment } = model;
    console.log('updating deposit: ', inputType, currency, percentage);

    if (inputType === eInputType.CURRENCY) {
      investment.depositAmount = currency;
    } else {
      const propValue = investment.propertyValue ?? 0;
      const value = propValue * (percentage / 100.0);
      investment.depositAmount = value;
    }

    const { mortgageAmount } = investment;
    model.investment.mortgageAmount =
      (mortgageAmount ?? 0) - investment.depositAmount;

    if (this.notify) {
      console.log('model now is : : ', model);
      this.notify(model);
    }
  }
}

export { Deposit, tUpdateDepositArgs };
