function convertToCurrency(value: number) {
  // Convert number to currency string with GBP (British Pound) locale
  const currencyString = value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });

  // If the precision needs to be fixed to 2 decimal places
  const fixedPrecisionCurrency = currencyString.replace(/\.(\d)$/, '.$10');
  return fixedPrecisionCurrency;
}

function convertToPercentage(value: number) {
  const percentString = `${value.toFixed(2)}`;
  return `${percentString}%`;
}

function calculateSDLTPct(propertyValue: number, isAdditional: boolean) {
  if (propertyValue <= 250000 && isAdditional === false) {
    return 0;
  }
  if (propertyValue < 925000) {
    return 0.05;
  }
  if (propertyValue < 150000000) {
    return 0.1;
  }
  return 0.12;
}

function calculateSDLT(propertyValue: number, isAdditionalProperty: boolean) {
  return propertyValue * calculateSDLTPct(propertyValue, isAdditionalProperty);
}

export {
  convertToCurrency,
  convertToPercentage,
  calculateSDLTPct,
  calculateSDLT,
};
