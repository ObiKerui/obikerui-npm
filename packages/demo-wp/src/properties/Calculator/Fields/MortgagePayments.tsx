import { useComputedState } from '../../Model/Store';
import { CurrencyInput } from '../Inputs/Currency';

function MortgagePayments() {
  const monthlyMortgagePayment = useComputedState(
    (state) => state.monthlyMortgagePayment
  );

  console.log(
    'what is the mortgage payment in calculator? ',
    monthlyMortgagePayment
  );

  return (
    <div className="grid grid-cols-3 py-2">
      <div>Mortgage Payment</div>
      <div>
        <CurrencyInput
          value={monthlyMortgagePayment}
          placeholder="Mortgage Payment"
          readonly
          // onUpdate={(newValue) => controller.updateMortgage(newValue)}
        />
      </div>
      <div>&nbsp;</div>
    </div>
  );
}

export default MortgagePayments;
