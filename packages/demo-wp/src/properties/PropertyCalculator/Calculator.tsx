import { useAppProvider } from '../Provider/Provider';
import { BalanceSheet } from './Balance';
import { MortgageSection } from './MortgageSection';
import { PropertySection } from './PropertySection';
import { RentalSection } from './RentalSection';

function Calculator() {
  const { model } = useAppProvider();

  return (
    <div className="flex flex-col gap-1">
      <PropertySection />
      <MortgageSection />
      <RentalSection />
      <BalanceSheet />
    </div>
  );
}

export { Calculator };
