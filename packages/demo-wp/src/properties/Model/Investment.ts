import { calculateSDLT } from '../Utils';
import { tBoundStore, useComputedState } from './Store';
import { tProperty } from './NewModel';

class InvestmentCtrlOld {
  calculateInvestment(model: tBoundStore) {
    const {
      isAdditionalProperty,
      deposit,
      propertyValue,
      mortgagePayment,
      legalFees,
      renovationFees,
    } = model;

    const stampDuty = calculateSDLT(propertyValue, isAdditionalProperty);
    const mortgageAmount = propertyValue - deposit;

    const totalInv =
      (mortgagePayment ?? 0) +
      (deposit ?? 0) +
      (legalFees ?? 0) +
      (renovationFees ?? 0) +
      (stampDuty ?? 0);

    useComputedState.getState().setStampDuty(stampDuty);
    useComputedState.getState().setMortgageAmount(mortgageAmount);
    useComputedState.getState().setTotalInvestment(totalInv);
  }

  update(model: tBoundStore) {
    this.calculateInvestment(model);
  }
}

class InvestmentCtrl {
  calculateInvestment(model: tProperty) {
    const {
      isAdditionalProperty,
      deposit,
      propertyValue,
      mortgagePayment,
      legalFees,
      renovationFees,
    } = model;

    const stampDuty = calculateSDLT(propertyValue, isAdditionalProperty);
    const mortgageAmount = propertyValue - deposit;

    const totalInv =
      (mortgagePayment ?? 0) +
      (deposit ?? 0) +
      (legalFees ?? 0) +
      (renovationFees ?? 0) +
      (stampDuty ?? 0);

    useComputedState.getState().setStampDuty(stampDuty);
    useComputedState.getState().setMortgageAmount(mortgageAmount);
    useComputedState.getState().setTotalInvestment(totalInv);
  }

  update(model: tProperty) {
    this.calculateInvestment(model);
  }
}

export { InvestmentCtrl, InvestmentCtrlOld };
